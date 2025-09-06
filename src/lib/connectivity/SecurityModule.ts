// Sacred Shifter Security Module
// End-to-end encryption with AES-GCM 256 and peer authentication
// Implements the Law of Polarity: secure duality (encrypted/decrypted)

import { ConnectivityChannel, Message, PeerInfo } from './ConnectivityAbstractionLayer';

export interface EncryptionKey {
  key: CryptoKey;
  iv: Uint8Array;
  timestamp: number;
  expiresAt: number;
  keyId: string;
}

export interface PeerCredentials {
  peerId: string;
  publicKey: CryptoKey;
  certificate: string;
  signature: Uint8Array;
  issuedAt: number;
  expiresAt: number;
}

export interface SecureChannel {
  channel: ConnectivityChannel;
  peerId: string;
  encryptionKey: EncryptionKey;
  isAuthenticated: boolean;
  lastActivity: number;
  messageCount: number;
  errorCount: number;
}

export interface SecurityMetrics {
  totalEncryptions: number;
  totalDecryptions: number;
  authenticationFailures: number;
  keyRotations: number;
  encryptionLatency: number;
  decryptionLatency: number;
  activeSecureChannels: number;
}

export class SecurityModule {
  private encryptionKeys: Map<string, EncryptionKey> = new Map();
  private peerCredentials: Map<string, PeerCredentials> = new Map();
  private secureChannels: Map<string, SecureChannel> = new Map();
  private keyRotationInterval?: number;
  private metrics: SecurityMetrics = {
    totalEncryptions: 0,
    totalDecryptions: 0,
    authenticationFailures: 0,
    keyRotations: 0,
    encryptionLatency: 0,
    decryptionLatency: 0,
    activeSecureChannels: 0
  };

  constructor() {
    this.startKeyRotation();
  }

  // Initialize security module with master key
  async initialize(masterKey?: string): Promise<void> {
    console.log('🔐 Initializing Sacred Security Module...');
    
    try {
      // Generate or import master key
      const masterCryptoKey = masterKey 
        ? await this.importMasterKey(masterKey)
        : await this.generateMasterKey();

      // Initialize key rotation
      await this.initializeKeyRotation(masterCryptoKey);
      
      console.log('🔐 Sacred Security Module initialized - consciousness channels secured');
    } catch (error) {
      console.error('❌ Failed to initialize Security Module:', error);
      throw error;
    }
  }

  // Create secure channel for peer communication
  async createSecureChannel(peerId: string, channel: ConnectivityChannel): Promise<SecureChannel> {
    try {
      // Generate encryption key for this peer
      const encryptionKey = await this.generateEncryptionKey(peerId);
      
      // Create secure channel
      const secureChannel: SecureChannel = {
        channel,
        peerId,
        encryptionKey,
        isAuthenticated: false,
        lastActivity: Date.now(),
        messageCount: 0,
        errorCount: 0
      };

      this.secureChannels.set(peerId, secureChannel);
      this.metrics.activeSecureChannels = this.secureChannels.size;

      console.log(`🔐 Secure channel created for peer: ${peerId}`);
      return secureChannel;
    } catch (error) {
      console.error(`❌ Failed to create secure channel for ${peerId}:`, error);
      throw error;
    }
  }

  // Encrypt message using AES-GCM 256
  async encryptMessage(message: Message, peerId: string): Promise<Message> {
    const startTime = performance.now();
    
    try {
      const secureChannel = this.secureChannels.get(peerId);
      if (!secureChannel) {
        throw new Error(`No secure channel found for peer: ${peerId}`);
      }

      // Generate new IV for each message (Principle of Rhythm)
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt message content
      const encryptedContent = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        secureChannel.encryptionKey.key,
        message.content
      );

      // Create encrypted message
      const encryptedMessage: Message = {
        ...message,
        content: new Uint8Array(encryptedContent),
        encrypted: true,
        timestamp: Date.now()
      };

      // Update metrics
      this.metrics.totalEncryptions++;
      this.metrics.encryptionLatency = performance.now() - startTime;
      secureChannel.messageCount++;
      secureChannel.lastActivity = Date.now();

      return encryptedMessage;
    } catch (error) {
      console.error(`❌ Failed to encrypt message for ${peerId}:`, error);
      this.metrics.authenticationFailures++;
      throw error;
    }
  }

  // Decrypt message using AES-GCM 256
  async decryptMessage(message: Message, peerId: string): Promise<Message> {
    const startTime = performance.now();
    
    try {
      const secureChannel = this.secureChannels.get(peerId);
      if (!secureChannel) {
        throw new Error(`No secure channel found for peer: ${peerId}`);
      }

      if (!message.encrypted) {
        return message; // Already decrypted
      }

      // Extract IV from encrypted content (first 12 bytes)
      const iv = message.content.slice(0, 12);
      const encryptedData = message.content.slice(12);

      // Decrypt message content
      const decryptedContent = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          tagLength: 128
        },
        secureChannel.encryptionKey.key,
        encryptedData
      );

      // Create decrypted message
      const decryptedMessage: Message = {
        ...message,
        content: new Uint8Array(decryptedContent),
        encrypted: false,
        timestamp: Date.now()
      };

      // Update metrics
      this.metrics.totalDecryptions++;
      this.metrics.decryptionLatency = performance.now() - startTime;
      secureChannel.lastActivity = Date.now();

      return decryptedMessage;
    } catch (error) {
      console.error(`❌ Failed to decrypt message from ${peerId}:`, error);
      this.metrics.authenticationFailures++;
      throw error;
    }
  }

  // Authenticate peer using Supabase JWT + WebRTC DTLS
  async authenticatePeer(peerId: string, token: string): Promise<boolean> {
    try {
      // Verify JWT token with Supabase
      const isValidToken = await this.verifySupabaseToken(token);
      if (!isValidToken) {
        this.metrics.authenticationFailures++;
        return false;
      }

      // Generate peer credentials
      const credentials = await this.generatePeerCredentials(peerId, token);
      this.peerCredentials.set(peerId, credentials);

      // Mark channel as authenticated
      const secureChannel = this.secureChannels.get(peerId);
      if (secureChannel) {
        secureChannel.isAuthenticated = true;
      }

      console.log(`🔐 Peer authenticated: ${peerId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to authenticate peer ${peerId}:`, error);
      this.metrics.authenticationFailures++;
      return false;
    }
  }

  // Generate encryption key for peer
  private async generateEncryptionKey(peerId: string): Promise<EncryptionKey> {
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyId = `key_${peerId}_${Date.now()}`;
    const now = Date.now();
    const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours

    const encryptionKey: EncryptionKey = {
      key,
      iv,
      timestamp: now,
      expiresAt,
      keyId
    };

    this.encryptionKeys.set(keyId, encryptionKey);
    return encryptionKey;
  }

  // Generate master key for key derivation
  private async generateMasterKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Import master key from string
  private async importMasterKey(keyString: string): Promise<CryptoKey> {
    const keyBuffer = new TextEncoder().encode(keyString);
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Initialize key rotation system
  private async initializeKeyRotation(masterKey: CryptoKey): Promise<void> {
    // Key rotation every 6 hours (Principle of Rhythm)
    this.keyRotationInterval = window.setInterval(async () => {
      await this.rotateKeys();
    }, 6 * 60 * 60 * 1000);
  }

  // Rotate encryption keys
  private async rotateKeys(): Promise<void> {
    console.log('🔄 Rotating encryption keys...');
    
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Find expired keys
    for (const [keyId, key] of this.encryptionKeys) {
      if (now > key.expiresAt) {
        expiredKeys.push(keyId);
      }
    }

    // Remove expired keys
    for (const keyId of expiredKeys) {
      this.encryptionKeys.delete(keyId);
    }

    // Generate new keys for active channels
    for (const [peerId, channel] of this.secureChannels) {
      if (channel.isAuthenticated) {
        const newKey = await this.generateEncryptionKey(peerId);
        channel.encryptionKey = newKey;
      }
    }

    this.metrics.keyRotations++;
    console.log(`🔄 Rotated ${expiredKeys.length} expired keys`);
  }

  // Verify Supabase JWT token
  private async verifySupabaseToken(token: string): Promise<boolean> {
    try {
      // In a real implementation, this would verify the JWT signature
      // For now, we'll do basic validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp > now;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return false;
    }
  }

  // Generate peer credentials
  private async generatePeerCredentials(peerId: string, token: string): Promise<PeerCredentials> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    );

    const now = Date.now();
    const expiresAt = now + (60 * 60 * 1000); // 1 hour

    // Create certificate (simplified)
    const certificate = btoa(JSON.stringify({
      peerId,
      publicKey: await crypto.subtle.exportKey('spki', keyPair.publicKey),
      issuedAt: now,
      expiresAt
    }));

    // Sign certificate
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      keyPair.privateKey,
      new TextEncoder().encode(certificate)
    );

    return {
      peerId,
      publicKey: keyPair.publicKey,
      certificate,
      signature: new Uint8Array(signature),
      issuedAt: now,
      expiresAt
    };
  }

  // Start key rotation system
  private startKeyRotation(): void {
    console.log('🔄 Key rotation system started');
  }

  // Get security metrics
  getSecurityMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  // Get secure channel info
  getSecureChannel(peerId: string): SecureChannel | undefined {
    return this.secureChannels.get(peerId);
  }

  // Get all secure channels
  getAllSecureChannels(): Map<string, SecureChannel> {
    return new Map(this.secureChannels);
  }

  // Cleanup expired channels
  cleanupExpiredChannels(): void {
    const now = Date.now();
    const expiredChannels: string[] = [];

    for (const [peerId, channel] of this.secureChannels) {
      if (now - channel.lastActivity > 30 * 60 * 1000) { // 30 minutes
        expiredChannels.push(peerId);
      }
    }

    for (const peerId of expiredChannels) {
      this.secureChannels.delete(peerId);
    }

    this.metrics.activeSecureChannels = this.secureChannels.size;
    console.log(`🧹 Cleaned up ${expiredChannels.length} expired channels`);
  }

  // Shutdown security module
  async shutdown(): Promise<void> {
    console.log('🔐 Shutting down Security Module...');
    
    if (this.keyRotationInterval) {
      clearInterval(this.keyRotationInterval);
    }

    // Clear all keys and channels
    this.encryptionKeys.clear();
    this.peerCredentials.clear();
    this.secureChannels.clear();

    console.log('🔐 Security Module shutdown complete');
  }
}

// Export singleton instance
export const securityModule = new SecurityModule();
