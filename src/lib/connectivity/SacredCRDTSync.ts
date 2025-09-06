// Sacred Shifter CRDT Sync System
// Conflict-free replicated data types for offline-first consciousness synchronization
// Vector clocks and Lamport timestamps ensure perfect sync across all channels

export interface VectorClock {
  [peerId: string]: number;
}

export interface LamportTimestamp {
  counter: number;
  peerId: string;
}

export interface CRDTOperation {
  id: string;
  type: 'insert' | 'update' | 'delete' | 'move';
  path: string[];
  value?: any;
  timestamp: LamportTimestamp;
  vectorClock: VectorClock;
  tombstone?: boolean;
  parentId?: string;
  childIds: string[];
}

export interface CRDTDocument {
  id: string;
  operations: Map<string, CRDTOperation>;
  vectorClock: VectorClock;
  lastModified: LamportTimestamp;
  version: number;
}

export interface SyncState {
  localVectorClock: VectorClock;
  remoteVectorClock: VectorClock;
  pendingOperations: CRDTOperation[];
  lastSyncTimestamp: number;
  conflictCount: number;
  mergeCount: number;
}

export class SacredCRDTSync {
  private documents: Map<string, CRDTDocument> = new Map();
  private syncStates: Map<string, SyncState> = new Map();
  private localPeerId: string;
  private lamportCounter = 0;
  private vectorClock: VectorClock = {};
  private operationHandlers: Set<(operation: CRDTOperation) => void> = new Set();

  constructor(localPeerId: string) {
    this.localPeerId = localPeerId;
    this.vectorClock[localPeerId] = 0;
  }

  // Create a new CRDT document
  createDocument(id: string): CRDTDocument {
    const document: CRDTDocument = {
      id,
      operations: new Map(),
      vectorClock: { [this.localPeerId]: 0 },
      lastModified: this.getCurrentLamportTimestamp(),
      version: 1
    };

    this.documents.set(id, document);
    console.log('📄 Created CRDT document:', id);
    return document;
  }

  // Insert operation into document
  insert(documentId: string, path: string[], value: any, parentId?: string): CRDTOperation {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const operation: CRDTOperation = {
      id: this.generateOperationId(),
      type: 'insert',
      path,
      value,
      timestamp: this.getCurrentLamportTimestamp(),
      vectorClock: { ...this.vectorClock },
      parentId,
      childIds: []
    };

    // Add to document
    document.operations.set(operation.id, operation);
    document.lastModified = operation.timestamp;
    document.version++;

    // Update vector clock
    this.vectorClock[this.localPeerId]++;

    // Notify handlers
    this.notifyOperationHandlers(operation);

    console.log('➕ Insert operation:', operation.id, 'at path:', path);
    return operation;
  }

  // Update operation in document
  update(documentId: string, path: string[], value: any): CRDTOperation {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const operation: CRDTOperation = {
      id: this.generateOperationId(),
      type: 'update',
      path,
      value,
      timestamp: this.getCurrentLamportTimestamp(),
      vectorClock: { ...this.vectorClock },
      childIds: []
    };

    // Add to document
    document.operations.set(operation.id, operation);
    document.lastModified = operation.timestamp;
    document.version++;

    // Update vector clock
    this.vectorClock[this.localPeerId]++;

    // Notify handlers
    this.notifyOperationHandlers(operation);

    console.log('✏️ Update operation:', operation.id, 'at path:', path);
    return operation;
  }

  // Delete operation from document
  delete(documentId: string, path: string[]): CRDTOperation {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const operation: CRDTOperation = {
      id: this.generateOperationId(),
      type: 'delete',
      path,
      timestamp: this.getCurrentLamportTimestamp(),
      vectorClock: { ...this.vectorClock },
      tombstone: true,
      childIds: []
    };

    // Add to document
    document.operations.set(operation.id, operation);
    document.lastModified = operation.timestamp;
    document.version++;

    // Update vector clock
    this.vectorClock[this.localPeerId]++;

    // Notify handlers
    this.notifyOperationHandlers(operation);

    console.log('🗑️ Delete operation:', operation.id, 'at path:', path);
    return operation;
  }

  // Move operation in document
  move(documentId: string, fromPath: string[], toPath: string[]): CRDTOperation {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const operation: CRDTOperation = {
      id: this.generateOperationId(),
      type: 'move',
      path: toPath,
      timestamp: this.getCurrentLamportTimestamp(),
      vectorClock: { ...this.vectorClock },
      childIds: []
    };

    // Add to document
    document.operations.set(operation.id, operation);
    document.lastModified = operation.timestamp;
    document.version++;

    // Update vector clock
    this.vectorClock[this.localPeerId]++;

    // Notify handlers
    this.notifyOperationHandlers(operation);

    console.log('🔄 Move operation:', operation.id, 'from', fromPath, 'to', toPath);
    return operation;
  }

  // Sync with remote peer
  async syncWithPeer(peerId: string, remoteOperations: CRDTOperation[]): Promise<{
    localOperations: CRDTOperation[];
    conflicts: CRDTOperation[];
    merged: boolean;
  }> {
    console.log('🔄 Syncing with peer:', peerId);

    const syncState = this.getOrCreateSyncState(peerId);
    const localOperations: CRDTOperation[] = [];
    const conflicts: CRDTOperation[] = [];

    // Process remote operations
    for (const remoteOp of remoteOperations) {
      const result = await this.mergeOperation(remoteOp);
      if (result.conflict) {
        conflicts.push(remoteOp);
        syncState.conflictCount++;
      } else {
        syncState.mergeCount++;
      }
    }

    // Get local operations that peer doesn't have
    for (const [docId, document] of this.documents) {
      for (const [opId, operation] of document.operations) {
        if (this.isOperationNewer(operation, syncState.remoteVectorClock)) {
          localOperations.push(operation);
        }
      }
    }

    // Update sync state
    syncState.lastSyncTimestamp = Date.now();
    syncState.remoteVectorClock = this.mergeVectorClocks(syncState.remoteVectorClock, this.vectorClock);

    console.log(`🔄 Sync complete: ${localOperations.length} local ops, ${conflicts.length} conflicts`);
    
    return {
      localOperations,
      conflicts,
      merged: conflicts.length === 0
    };
  }

  // Merge operation into local state
  private async mergeOperation(operation: CRDTOperation): Promise<{ conflict: boolean; merged: boolean }> {
    const documentId = this.extractDocumentId(operation);
    const document = this.documents.get(documentId);
    
    if (!document) {
      // Create document if it doesn't exist
      this.createDocument(documentId);
    }

    // Check for conflicts
    const conflict = this.detectConflict(operation, document);
    
    if (conflict) {
      console.log('⚠️ Conflict detected for operation:', operation.id);
      return { conflict: true, merged: false };
    }

    // Merge operation
    document.operations.set(operation.id, operation);
    document.lastModified = this.maxTimestamp(document.lastModified, operation.timestamp);
    document.version++;

    // Update vector clock
    this.vectorClock = this.mergeVectorClocks(this.vectorClock, operation.vectorClock);

    // Notify handlers
    this.notifyOperationHandlers(operation);

    return { conflict: false, merged: true };
  }

  // Detect conflicts between operations
  private detectConflict(operation: CRDTOperation, document: CRDTDocument): boolean {
    // Check for concurrent operations on same path
    for (const [opId, existingOp] of document.operations) {
      if (this.areOperationsConcurrent(operation, existingOp) && 
          this.arePathsConflicting(operation.path, existingOp.path)) {
        return true;
      }
    }

    return false;
  }

  // Check if operations are concurrent (happened at same time)
  private areOperationsConcurrent(op1: CRDTOperation, op2: CRDTOperation): boolean {
    return !this.isOperationNewer(op1, op2.vectorClock) && 
           !this.isOperationNewer(op2, op1.vectorClock);
  }

  // Check if paths conflict
  private arePathsConflicting(path1: string[], path2: string[]): boolean {
    // Check if one path is a prefix of the other
    const minLength = Math.min(path1.length, path2.length);
    for (let i = 0; i < minLength; i++) {
      if (path1[i] !== path2[i]) {
        return false;
      }
    }
    return true;
  }

  // Check if operation is newer than vector clock
  private isOperationNewer(operation: CRDTOperation, vectorClock: VectorClock): boolean {
    for (const [peerId, counter] of Object.entries(operation.vectorClock)) {
      if ((vectorClock[peerId] || 0) >= counter) {
        return false;
      }
    }
    return true;
  }

  // Merge vector clocks
  private mergeVectorClocks(vc1: VectorClock, vc2: VectorClock): VectorClock {
    const merged: VectorClock = { ...vc1 };
    
    for (const [peerId, counter] of Object.entries(vc2)) {
      merged[peerId] = Math.max(merged[peerId] || 0, counter);
    }
    
    return merged;
  }

  // Get maximum timestamp
  private maxTimestamp(t1: LamportTimestamp, t2: LamportTimestamp): LamportTimestamp {
    if (t1.counter > t2.counter) return t1;
    if (t2.counter > t1.counter) return t2;
    return t1.peerId < t2.peerId ? t1 : t2; // Tie-breaker by peer ID
  }

  // Extract document ID from operation path
  private extractDocumentId(operation: CRDTOperation): string {
    return operation.path[0] || 'default';
  }

  // Get or create sync state for peer
  private getOrCreateSyncState(peerId: string): SyncState {
    if (!this.syncStates.has(peerId)) {
      this.syncStates.set(peerId, {
        localVectorClock: { ...this.vectorClock },
        remoteVectorClock: {},
        pendingOperations: [],
        lastSyncTimestamp: 0,
        conflictCount: 0,
        mergeCount: 0
      });
    }
    return this.syncStates.get(peerId)!;
  }

  // Get current Lamport timestamp
  private getCurrentLamportTimestamp(): LamportTimestamp {
    this.lamportCounter++;
    return {
      counter: this.lamportCounter,
      peerId: this.localPeerId
    };
  }

  // Generate unique operation ID
  private generateOperationId(): string {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Notify operation handlers
  private notifyOperationHandlers(operation: CRDTOperation): void {
    for (const handler of this.operationHandlers) {
      try {
        handler(operation);
      } catch (error) {
        console.error('❌ Operation handler error:', error);
      }
    }
  }

  // Add operation handler
  onOperation(handler: (operation: CRDTOperation) => void): void {
    this.operationHandlers.add(handler);
  }

  // Remove operation handler
  removeOperationHandler(handler: (operation: CRDTOperation) => void): void {
    this.operationHandlers.delete(handler);
  }

  // Get document by ID
  getDocument(id: string): CRDTDocument | undefined {
    return this.documents.get(id);
  }

  // Get all documents
  getAllDocuments(): CRDTDocument[] {
    return Array.from(this.documents.values());
  }

  // Get sync state for peer
  getSyncState(peerId: string): SyncState | undefined {
    return this.syncStates.get(peerId);
  }

  // Get all sync states
  getAllSyncStates(): Map<string, SyncState> {
    return new Map(this.syncStates);
  }

  // Get local vector clock
  getLocalVectorClock(): VectorClock {
    return { ...this.vectorClock };
  }

  // Get pending operations for peer
  getPendingOperations(peerId: string): CRDTOperation[] {
    const syncState = this.syncStates.get(peerId);
    if (!syncState) return [];

    const pending: CRDTOperation[] = [];
    
    for (const [docId, document] of this.documents) {
      for (const [opId, operation] of document.operations) {
        if (this.isOperationNewer(operation, syncState.remoteVectorClock)) {
          pending.push(operation);
        }
      }
    }

    return pending;
  }

  // Resolve conflicts using last-write-wins with tie-breaker
  resolveConflicts(conflicts: CRDTOperation[]): CRDTOperation[] {
    const resolved: CRDTOperation[] = [];
    
    // Group conflicts by path
    const conflictsByPath = new Map<string, CRDTOperation[]>();
    for (const conflict of conflicts) {
      const pathKey = conflict.path.join('.');
      if (!conflictsByPath.has(pathKey)) {
        conflictsByPath.set(pathKey, []);
      }
      conflictsByPath.get(pathKey)!.push(conflict);
    }

    // Resolve each group
    for (const [pathKey, pathConflicts] of conflictsByPath) {
      // Sort by timestamp (last-write-wins)
      pathConflicts.sort((a, b) => {
        if (a.timestamp.counter !== b.timestamp.counter) {
          return b.timestamp.counter - a.timestamp.counter;
        }
        return b.timestamp.peerId.localeCompare(a.timestamp.peerId);
      });

      // Take the latest operation
      resolved.push(pathConflicts[0]);
    }

    console.log(`🔧 Resolved ${conflicts.length} conflicts to ${resolved.length} operations`);
    return resolved;
  }

  // Get sync statistics
  getSyncStats(): {
    documentCount: number;
    totalOperations: number;
    conflictCount: number;
    mergeCount: number;
    syncPeerCount: number;
  } {
    let totalOperations = 0;
    let totalConflicts = 0;
    let totalMerges = 0;

    for (const document of this.documents.values()) {
      totalOperations += document.operations.size;
    }

    for (const syncState of this.syncStates.values()) {
      totalConflicts += syncState.conflictCount;
      totalMerges += syncState.mergeCount;
    }

    return {
      documentCount: this.documents.size,
      totalOperations,
      conflictCount: totalConflicts,
      mergeCount: totalMerges,
      syncPeerCount: this.syncStates.size
    };
  }

  // Clear all data
  clear(): void {
    this.documents.clear();
    this.syncStates.clear();
    this.vectorClock = { [this.localPeerId]: 0 };
    this.lamportCounter = 0;
    console.log('🧹 CRDT sync cleared');
  }
}
