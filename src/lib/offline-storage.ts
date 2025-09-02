// Sacred Shifter - Local-First Encrypted Storage
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema for local-first storage
export interface SacredShifterDB extends DBSchema {
  profiles: {
    key: string;
    value: any;
  };
  privacy_preferences: {
    key: string;
    value: any;
  };
  journal_entries: {
    key: string;
    value: any;
    indexes: { 'by-date': string; 'by-user': string };
  };
  routines: {
    key: string;
    value: any;
    indexes: { 'by-user': string; 'by-date': string };
  };
  sync_queue: {
    key: string;
    value: {
      id: string;
      table: string;
      action: 'create' | 'update' | 'delete';
      data: any;
      timestamp: number;
      retries: number;
    };
    indexes: { 'by-timestamp': number };
  };
  audit_logs: {
    key: string;
    value: any;
    indexes: { 'by-user': string; 'by-timestamp': number };
  };
  consent_logs: {
    key: string;
    value: any;
    indexes: { 'by-user': string; 'by-timestamp': number };
  };
  presets: {
    key: string;
    value: any;
  };
}

class SacredShifterStorage {
  private db: IDBPDatabase<SacredShifterDB> | null = null;
  private encryptionKey: CryptoKey | null = null;
  private userId: string | null = null;

  async initialize(userId: string) {
    this.userId = userId;
    
    // Initialize IndexedDB
    this.db = await openDB<SacredShifterDB>('sacred-shifter-db', 1, {
      upgrade(db) {
        // Profiles store
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' });
        }

        // Privacy preferences store
        if (!db.objectStoreNames.contains('privacy_preferences')) {
          db.createObjectStore('privacy_preferences', { keyPath: 'user_id' });
        }

        // Journal entries store
        if (!db.objectStoreNames.contains('journal_entries')) {
          const journalStore = db.createObjectStore('journal_entries', { keyPath: 'id' });
          journalStore.createIndex('by-date', 'created_at');
          journalStore.createIndex('by-user', 'user_id');
        }

        // Routines store
        if (!db.objectStoreNames.contains('routines')) {
          const routineStore = db.createObjectStore('routines', { keyPath: 'id' });
          routineStore.createIndex('by-user', 'user_id');
          routineStore.createIndex('by-date', 'completion_date');
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('by-timestamp', 'timestamp');
        }

        // Audit logs store
        if (!db.objectStoreNames.contains('audit_logs')) {
          const auditStore = db.createObjectStore('audit_logs', { keyPath: 'id' });
          auditStore.createIndex('by-user', 'user_id');
          auditStore.createIndex('by-timestamp', 'timestamp');
        }

        // Consent logs store
        if (!db.objectStoreNames.contains('consent_logs')) {
          const consentStore = db.createObjectStore('consent_logs', { keyPath: 'id' });
          consentStore.createIndex('by-user', 'user_id');
          consentStore.createIndex('by-timestamp', 'created_at');
        }

        // Presets store for offline archetypes
        if (!db.objectStoreNames.contains('presets')) {
            db.createObjectStore('presets', { keyPath: 'id' });
        }

        console.log('[Storage] Sacred Shifter IndexedDB initialized');
      },
    });

    // Initialize encryption key
    await this.initializeEncryption();
    
    console.log('[Storage] Local-first storage initialized for user:', userId);
  }

  private async initializeEncryption() {
    try {
      // Try to get existing key from localStorage
      const storedKey = localStorage.getItem(`encryption_key_${this.userId}`);
      
      if (storedKey) {
        // Import existing key
        const keyData = new Uint8Array(JSON.parse(storedKey));
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        // Generate new key
        this.encryptionKey = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );

        // Store key (in production, consider more secure storage)
        const exportedKey = await crypto.subtle.exportKey('raw', this.encryptionKey);
        localStorage.setItem(
          `encryption_key_${this.userId}`,
          JSON.stringify(Array.from(new Uint8Array(exportedKey)))
        );
      }

      console.log('[Storage] AES-256-GCM encryption initialized');
    } catch (error) {
      console.error('[Storage] Encryption initialization failed:', error);
      throw new Error('Failed to initialize local encryption');
    }
  }

  private async encrypt(data: any): Promise<{ encryptedData: ArrayBuffer; iv: ArrayBuffer }> {
    if (!this.encryptionKey) throw new Error('Encryption not initialized');

    const encoder = new TextEncoder();
    const dataToEncrypt = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      dataToEncrypt
    );

    return { encryptedData, iv: iv.buffer };
  }

  private async decrypt(encryptedData: ArrayBuffer, iv: ArrayBuffer): Promise<any> {
    if (!this.encryptionKey) throw new Error('Encryption not initialized');

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encryptedData
    );

    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    return JSON.parse(jsonString);
  }

  // Store encrypted data
  async store(table: keyof SacredShifterDB, data: any, skipEncryption = false): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized');

    try {
      let dataToStore = data;

      // Encrypt sensitive data
      if (!skipEncryption && this.shouldEncrypt(table)) {
        const { encryptedData, iv } = await this.encrypt(data);
        dataToStore = {
          id: data.id,
          encrypted: true,
          data: Array.from(new Uint8Array(encryptedData)),
          iv: Array.from(new Uint8Array(iv)),
          created_at: data.created_at || new Date().toISOString()
        };
      }

      await this.db.put(table as any, dataToStore);
      
      // Log for audit trail
      await this.logAction('local_store', table as string, data.id, { table, encrypted: !skipEncryption });
      
      console.log(`[Storage] Stored in ${table}:`, data.id);
    } catch (error) {
      console.error(`[Storage] Failed to store in ${table}:`, error);
      throw error;
    }
  }

  // Retrieve and decrypt data
  async get(table: keyof SacredShifterDB, key: string): Promise<any | null> {
    if (!this.db) throw new Error('Storage not initialized');

    try {
      const stored = await this.db.get(table as any, key);
      if (!stored) return null;

      // Decrypt if encrypted
      if (stored.encrypted) {
        const encryptedData = new Uint8Array(stored.data).buffer;
        const iv = new Uint8Array(stored.iv).buffer;
        return await this.decrypt(encryptedData, iv);
      }

      return stored;
    } catch (error) {
      console.error(`[Storage] Failed to get from ${table}:`, error);
      return null;
    }
  }

  // Get all items from a table
  async getAll(table: keyof SacredShifterDB): Promise<any[]> {
    if (!this.db) throw new Error('Storage not initialized');

    try {
      const items = await this.db.getAll(table as any);
      const decryptedItems = [];

      for (const item of items) {
        if (item.encrypted) {
          const encryptedData = new Uint8Array(item.data).buffer;
          const iv = new Uint8Array(item.iv).buffer;
          const decrypted = await this.decrypt(encryptedData, iv);
          decryptedItems.push(decrypted);
        } else {
          decryptedItems.push(item);
        }
      }

      return decryptedItems;
    } catch (error) {
      console.error(`[Storage] Failed to get all from ${table}:`, error);
      return [];
    }
  }

  // Add to sync queue
  async queueForSync(table: string, action: 'create' | 'update' | 'delete', data: any): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized');

    const syncItem = {
      id: crypto.randomUUID(),
      table,
      action,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    await this.db.put('sync_queue', syncItem);
    console.log('[Storage] Queued for sync:', syncItem.id);

    // Request background sync if supported
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Background sync would be used here if supported
        console.log('[Storage] Background sync would trigger here');
      } catch (error) {
        console.log('[Storage] Background sync not available, will sync on next connection');
      }
    }
  }

  // Get pending sync items
  async getPendingSync(): Promise<any[]> {
    if (!this.db) throw new Error('Storage not initialized');
    return await this.db.getAll('sync_queue');
  }

  // Clear sync queue item
  async clearSyncItem(id: string): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized');
    await this.db.delete('sync_queue', id);
  }

  // Privacy compliance - export all user data
  async exportAllData(): Promise<any> {
    if (!this.db || !this.userId) throw new Error('Storage not initialized');

    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        user_id: this.userId,
        format_version: '1.0',
        encryption_note: 'Data was stored encrypted locally and decrypted for export'
      },
      data: {}
    };

    // Export all tables
    const tables = ['profiles', 'privacy_preferences', 'journal_entries', 'routines', 'audit_logs', 'consent_logs'] as const;
    
    for (const table of tables) {
      try {
        const tableData = await this.getAll(table);
        const userSpecificData = tableData.filter(item => 
          item.user_id === this.userId || item.id === this.userId
        );
        exportData.data[table] = userSpecificData;
      } catch (error) {
        console.error(`[Storage] Failed to export ${table}:`, error);
        exportData.data[table] = [];
      }
    }

    return exportData;
  }

  // Privacy compliance - delete all user data
  async deleteAllUserData(): Promise<void> {
    if (!this.db || !this.userId) throw new Error('Storage not initialized');

    const tables = ['profiles', 'privacy_preferences', 'journal_entries', 'routines', 'sync_queue'] as const;
    
    for (const table of tables) {
      try {
        const items = await this.db.getAll(table);
        const userItems = items.filter(item => 
          item.user_id === this.userId || item.id === this.userId
        );

        for (const item of userItems) {
          await this.db.delete(table, item.id || item.user_id);
        }
      } catch (error) {
        console.error(`[Storage] Failed to delete from ${table}:`, error);
      }
    }

    // Log deletion (keep audit trail)
    await this.logAction('data_deletion', 'all_tables', this.userId, {
      deleted_at: new Date().toISOString(),
      legal_basis: 'User request - Right to erasure'
    });

    // Clear encryption key
    localStorage.removeItem(`encryption_key_${this.userId}`);
    
    console.log('[Storage] All user data deleted locally');
  }

  private shouldEncrypt(table: keyof SacredShifterDB): boolean {
    // Tables that should be encrypted
    const encryptedTables = ['journal_entries', 'privacy_preferences', 'profiles'];
    return encryptedTables.includes(table as string);
  }

  private async logAction(action: string, entity: string, entityId: string, details: any): Promise<void> {
    if (!this.db) return;

    const logEntry = {
      id: crypto.randomUUID(),
      user_id: this.userId,
      action,
      entity,
      entity_id: entityId,
      details,
      timestamp: Date.now(),
      created_at: new Date().toISOString(),
      ip_address: 'local-device',
      user_agent: navigator.userAgent
    };

    try {
      await this.db.put('audit_logs', logEntry);
    } catch (error) {
      console.error('[Storage] Failed to log action:', error);
    }
  }
}

// Singleton instance
export const sacredStorage = new SacredShifterStorage();

// Sync management
export class SyncManager {
  private storage: SacredShifterStorage;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor(storage: SacredShifterStorage) {
    this.storage = storage;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[Sync] Back online, starting sync...');
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[Sync] Gone offline, queueing changes...');
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_REQUESTED') {
          this.syncPendingData();
        }
      });
    }
  }

  async syncPendingData(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    console.log('[Sync] Starting data synchronization...');

    try {
      const pendingItems = await this.storage.getPendingSync();
      console.log(`[Sync] Found ${pendingItems.length} items to sync`);

      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          await this.storage.clearSyncItem(item.id);
          console.log('[Sync] Synced item:', item.id);
        } catch (error) {
          console.error('[Sync] Failed to sync item:', item.id, error);
          // Could implement retry logic here
        }
      }

      console.log('[Sync] Synchronization complete');
    } catch (error) {
      console.error('[Sync] Sync process failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: any): Promise<void> {
    // This would sync with Supabase in a real implementation
    // For now, just simulate the sync
    console.log(`[Sync] Syncing ${item.action} on ${item.table}:`, item.data);
    
    // In a real implementation:
    // - POST/PUT/DELETE to Supabase API
    // - Handle conflicts (local wins by default)
    // - Update local data with server response if needed
  }

  get online(): boolean {
    return this.isOnline;
  }
}

export const syncManager = new SyncManager(sacredStorage);
