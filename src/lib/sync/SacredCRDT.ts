// Sacred Shifter CRDT (Conflict-free Replicated Data Type) System
// Implements vector clocks, operational transformation, and merge strategies

export interface VectorClock {
  [nodeId: string]: number;
}

export interface CRDTOperation {
  id: string;
  nodeId: string;
  type: 'insert' | 'update' | 'delete' | 'move';
  path: string[];
  value?: any;
  timestamp: number;
  vectorClock: VectorClock;
  dependencies: string[]; // Operation IDs this depends on
}

export interface CRDTDocument {
  id: string;
  operations: Map<string, CRDTOperation>;
  vectorClock: VectorClock;
  lastModified: number;
  version: number;
}

export interface MergeResult {
  success: boolean;
  conflicts: CRDTOperation[];
  mergedDocument: CRDTDocument;
  appliedOperations: string[];
}

export class SacredCRDT {
  private documents: Map<string, CRDTDocument> = new Map();
  private nodeId: string;
  private vectorClock: VectorClock = {};

  constructor(nodeId: string) {
    this.nodeId = nodeId;
    this.vectorClock[nodeId] = 0;
  }

  // Create a new CRDT document
  createDocument(id: string): CRDTDocument {
    const document: CRDTDocument = {
      id,
      operations: new Map(),
      vectorClock: { [this.nodeId]: 0 },
      lastModified: Date.now(),
      version: 1
    };
    
    this.documents.set(id, document);
    return document;
  }

  // Apply an operation to a document
  applyOperation(documentId: string, operation: CRDTOperation): MergeResult {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    // Check if operation is already applied
    if (document.operations.has(operation.id)) {
      return {
        success: true,
        conflicts: [],
        mergedDocument: document,
        appliedOperations: []
      };
    }

    // Check dependencies
    const missingDeps = operation.dependencies.filter(depId => 
      !document.operations.has(depId)
    );

    if (missingDeps.length > 0) {
      return {
        success: false,
        conflicts: [],
        mergedDocument: document,
        appliedOperations: []
      };
    }

    // Apply the operation
    document.operations.set(operation.id, operation);
    this.updateVectorClock(document, operation.vectorClock);
    document.lastModified = Math.max(document.lastModified, operation.timestamp);
    document.version++;

    return {
      success: true,
      conflicts: [],
      mergedDocument: document,
      appliedOperations: [operation.id]
    };
  }

  // Merge two documents (from different nodes)
  mergeDocuments(localId: string, remoteDocument: CRDTDocument): MergeResult {
    const localDocument = this.documents.get(localId);
    if (!localDocument) {
      throw new Error(`Local document ${localId} not found`);
    }

    const conflicts: CRDTOperation[] = [];
    const appliedOperations: string[] = [];
    const mergedOperations = new Map(localDocument.operations);

    // Apply all remote operations
    for (const [opId, operation] of remoteDocument.operations) {
      if (!mergedOperations.has(opId)) {
        // Check for conflicts
        const conflict = this.detectConflict(operation, mergedOperations);
        if (conflict) {
          conflicts.push(operation);
        } else {
          mergedOperations.set(opId, operation);
          appliedOperations.push(opId);
        }
      }
    }

    // Resolve conflicts using operational transformation
    const resolvedOperations = this.resolveConflicts(conflicts, mergedOperations);

    // Create merged document
    const mergedDocument: CRDTDocument = {
      id: localId,
      operations: resolvedOperations,
      vectorClock: this.mergeVectorClocks(localDocument.vectorClock, remoteDocument.vectorClock),
      lastModified: Math.max(localDocument.lastModified, remoteDocument.lastModified),
      version: Math.max(localDocument.version, remoteDocument.version) + 1
    };

    this.documents.set(localId, mergedDocument);

    return {
      success: conflicts.length === 0,
      conflicts,
      mergedDocument,
      appliedOperations
    };
  }

  // Detect conflicts between operations
  private detectConflict(operation: CRDTOperation, existingOperations: Map<string, CRDTOperation>): CRDTOperation | null {
    for (const [_, existingOp] of existingOperations) {
      // Check if operations affect the same path
      if (this.pathsOverlap(operation.path, existingOp.path)) {
        // Check if operations are concurrent (neither happened before the other)
        if (!this.happenedBefore(operation.vectorClock, existingOp.vectorClock) &&
            !this.happenedBefore(existingOp.vectorClock, operation.vectorClock)) {
          return existingOp;
        }
      }
    }
    return null;
  }

  // Check if two paths overlap
  private pathsOverlap(path1: string[], path2: string[]): boolean {
    const minLength = Math.min(path1.length, path2.length);
    for (let i = 0; i < minLength; i++) {
      if (path1[i] !== path2[i]) {
        return false;
      }
    }
    return true;
  }

  // Check if operation A happened before operation B
  private happenedBefore(vectorClockA: VectorClock, vectorClockB: VectorClock): boolean {
    let aBeforeB = false;
    
    for (const nodeId in vectorClockA) {
      if (vectorClockA[nodeId] > (vectorClockB[nodeId] || 0)) {
        return false;
      }
      if (vectorClockA[nodeId] < (vectorClockB[nodeId] || 0)) {
        aBeforeB = true;
      }
    }
    
    return aBeforeB;
  }

  // Resolve conflicts using operational transformation
  private resolveConflicts(conflicts: CRDTOperation[], operations: Map<string, CRDTOperation>): Map<string, CRDTOperation> {
    const resolved = new Map(operations);
    
    for (const conflict of conflicts) {
      // Apply conflict resolution strategy
      const resolvedOp = this.resolveConflict(conflict, resolved);
      if (resolvedOp) {
        resolved.set(resolvedOp.id, resolvedOp);
      }
    }
    
    return resolved;
  }

  // Resolve a single conflict
  private resolveConflict(operation: CRDTOperation, operations: Map<string, CRDTOperation>): CRDTOperation | null {
    // Find conflicting operations
    const conflictingOps: CRDTOperation[] = [];
    for (const [_, op] of operations) {
      if (this.pathsOverlap(operation.path, op.path) && 
          !this.happenedBefore(operation.vectorClock, op.vectorClock) &&
          !this.happenedBefore(op.vectorClock, operation.vectorClock)) {
        conflictingOps.push(op);
      }
    }

    if (conflictingOps.length === 0) {
      return operation;
    }

    // Apply operational transformation
    let transformedOp = operation;
    for (const conflictingOp of conflictingOps) {
      transformedOp = this.transformOperation(transformedOp, conflictingOp);
    }

    return transformedOp;
  }

  // Transform operation A against operation B
  private transformOperation(opA: CRDTOperation, opB: CRDTOperation): CRDTOperation {
    // Simple transformation rules
    if (opA.type === 'insert' && opB.type === 'insert') {
      // Both insertions - keep both but adjust paths
      if (this.pathsOverlap(opA.path, opB.path)) {
        return {
          ...opA,
          path: [...opA.path, 'conflict', Date.now().toString()]
        };
      }
    } else if (opA.type === 'delete' && opB.type === 'delete') {
      // Both deletions - keep the later one
      return opA.timestamp > opB.timestamp ? opA : opB;
    } else if (opA.type === 'update' && opB.type === 'update') {
      // Both updates - merge values
      return {
        ...opA,
        value: this.mergeValues(opA.value, opB.value)
      };
    }

    return opA;
  }

  // Merge two values (simple strategy)
  private mergeValues(valueA: any, valueB: any): any {
    if (typeof valueA === 'object' && typeof valueB === 'object') {
      return { ...valueA, ...valueB };
    }
    return valueA; // Prefer first value
  }

  // Update vector clock
  private updateVectorClock(document: CRDTDocument, incomingClock: VectorClock): void {
    for (const nodeId in incomingClock) {
      document.vectorClock[nodeId] = Math.max(
        document.vectorClock[nodeId] || 0,
        incomingClock[nodeId]
      );
    }
  }

  // Merge two vector clocks
  private mergeVectorClocks(clock1: VectorClock, clock2: VectorClock): VectorClock {
    const merged: VectorClock = { ...clock1 };
    
    for (const nodeId in clock2) {
      merged[nodeId] = Math.max(merged[nodeId] || 0, clock2[nodeId]);
    }
    
    return merged;
  }

  // Get document state
  getDocumentState(documentId: string): any {
    const document = this.documents.get(documentId);
    if (!document) {
      return null;
    }

    // Reconstruct document state from operations
    const state: any = {};
    
    for (const [_, operation] of document.operations) {
      this.applyOperationToState(state, operation);
    }
    
    return state;
  }

  // Apply operation to state
  private applyOperationToState(state: any, operation: CRDTOperation): void {
    let current = state;
    
    // Navigate to the target path
    for (let i = 0; i < operation.path.length - 1; i++) {
      const key = operation.path[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const finalKey = operation.path[operation.path.length - 1];
    
    switch (operation.type) {
      case 'insert':
      case 'update':
        current[finalKey] = operation.value;
        break;
      case 'delete':
        delete current[finalKey];
        break;
      case 'move':
        // Move operation - would need more complex implementation
        break;
    }
  }

  // Get all documents
  getDocuments(): Map<string, CRDTDocument> {
    return this.documents;
  }

  // Get document by ID
  getDocument(id: string): CRDTDocument | undefined {
    return this.documents.get(id);
  }

  // Create operation
  createOperation(
    type: CRDTOperation['type'],
    path: string[],
    value?: any,
    dependencies: string[] = []
  ): CRDTOperation {
    this.vectorClock[this.nodeId]++;
    
    return {
      id: `${this.nodeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nodeId: this.nodeId,
      type,
      path,
      value,
      timestamp: Date.now(),
      vectorClock: { ...this.vectorClock },
      dependencies
    };
  }

  // Export document for sync
  exportDocument(documentId: string): CRDTDocument | null {
    return this.documents.get(documentId) || null;
  }

  // Import document from sync
  importDocument(document: CRDTDocument): void {
    this.documents.set(document.id, document);
  }
}

// Sacred Shifter specific CRDT implementations
export class SacredJournalCRDT extends SacredCRDT {
  constructor(nodeId: string) {
    super(nodeId);
  }

  // Add journal entry
  addJournalEntry(entry: any): string {
    const operation = this.createOperation(
      'insert',
      ['entries', Date.now().toString()],
      entry
    );
    
    const document = this.getDocument('journal') || this.createDocument('journal');
    this.applyOperation('journal', operation);
    
    return operation.id;
  }

  // Update journal entry
  updateJournalEntry(entryId: string, updates: any): string {
    const operation = this.createOperation(
      'update',
      ['entries', entryId],
      updates
    );
    
    this.applyOperation('journal', operation);
    return operation.id;
  }

  // Delete journal entry
  deleteJournalEntry(entryId: string): string {
    const operation = this.createOperation(
      'delete',
      ['entries', entryId]
    );
    
    this.applyOperation('journal', operation);
    return operation.id;
  }

  // Get journal entries
  getJournalEntries(): any[] {
    const state = this.getDocumentState('journal');
    return state?.entries ? Object.values(state.entries) : [];
  }
}

export class SacredSettingsCRDT extends SacredCRDT {
  constructor(nodeId: string) {
    super(nodeId);
  }

  // Update setting
  updateSetting(key: string, value: any): string {
    const operation = this.createOperation(
      'update',
      ['settings', key],
      value
    );
    
    const document = this.getDocument('settings') || this.createDocument('settings');
    this.applyOperation('settings', operation);
    
    return operation.id;
  }

  // Get setting
  getSetting(key: string): any {
    const state = this.getDocumentState('settings');
    return state?.settings?.[key];
  }

  // Get all settings
  getAllSettings(): any {
    const state = this.getDocumentState('settings');
    return state?.settings || {};
  }
}

export class SacredMeshCRDT extends SacredCRDT {
  constructor(nodeId: string) {
    super(nodeId);
  }

  // Add peer to mesh
  addPeer(peer: any): string {
    const operation = this.createOperation(
      'insert',
      ['peers', peer.id],
      peer
    );
    
    const document = this.getDocument('mesh') || this.createDocument('mesh');
    this.applyOperation('mesh', operation);
    
    return operation.id;
  }

  // Update peer status
  updatePeerStatus(peerId: string, status: any): string {
    const operation = this.createOperation(
      'update',
      ['peers', peerId, 'status'],
      status
    );
    
    this.applyOperation('mesh', operation);
    return operation.id;
  }

  // Remove peer from mesh
  removePeer(peerId: string): string {
    const operation = this.createOperation(
      'delete',
      ['peers', peerId]
    );
    
    this.applyOperation('mesh', operation);
    return operation.id;
  }

  // Get all peers
  getPeers(): any[] {
    const state = this.getDocumentState('mesh');
    return state?.peers ? Object.values(state.peers) : [];
  }
}
