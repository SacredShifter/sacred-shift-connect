// Sacred Mesh Cryptography
import { SacredMeshMessage } from './types';

export class SacredMeshCrypto {
  private static instance: SacredMeshCrypto;

  static getInstance(): SacredMeshCrypto {
    if (!SacredMeshCrypto.instance) {
      SacredMeshCrypto.instance = new SacredMeshCrypto();
    }
    return SacredMeshCrypto.instance;
  }

  async encryptMessage(message: SacredMeshMessage, recipientId?: string): Promise<SacredMeshMessage> {
    // Basic implementation - would use actual crypto in production
    const encrypted = {
      ...message,
      ciphertext: new TextEncoder().encode(JSON.stringify(message))
    };
    
    return encrypted;
  }

  async decryptMessage(message: SacredMeshMessage, senderId?: string): Promise<SacredMeshMessage> {
    // Basic implementation - would use actual crypto in production
    if (message.ciphertext) {
      const decrypted = JSON.parse(new TextDecoder().decode(message.ciphertext));
      return decrypted;
    }
    
    return message;
  }

  generateKeyPair(): Promise<{ publicKey: Uint8Array; privateKey: Uint8Array }> {
    // Basic implementation - would generate real crypto keys in production
    const mockKey = new Uint8Array(32);
    crypto.getRandomValues(mockKey);
    
    return Promise.resolve({
      publicKey: mockKey,
      privateKey: mockKey
    });
  }

  // Hash sender ID for privacy
  async hashSenderId(senderId: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(senderId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Generate identity key pair (Ed25519 for signing)
  async generateIdentityKeyPair(): Promise<CryptoKeyPair> {
    console.log('🔑 Generating identity key pair...');
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256'
        },
        true,
        ['sign', 'verify']
      );
      console.log('🔑 Identity key pair generated successfully');
      return keyPair;
    } catch (error) {
      console.error('🔑 Failed to generate identity key pair:', error);
      throw error;
    }
  }

  // Generate ephemeral key pair (X25519 for ECDH)
  async generateEphemeralKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey']
    );
  }

  // Sign data with private key
  async sign(data: Uint8Array, privateKey: CryptoKey): Promise<Uint8Array> {
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      privateKey,
      data
    );
    return new Uint8Array(signature);
  }

  // Verify signature with public key
  async verify(signature: Uint8Array, data: Uint8Array, publicKey: CryptoKey): Promise<boolean> {
    return await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      publicKey,
      signature,
      data
    );
  }

  // Create fingerprint from public key
  async createFingerprint(publicKey: CryptoKey): Promise<string> {
    const keyData = await crypto.subtle.exportKey('raw', publicKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
    const hashArray = new Uint8Array(hashBuffer);
    // Return first 8 bytes as hex
    return Array.from(hashArray.slice(0, 8))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }

  // Derive shared secret using ECDH
  async deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
    return await crypto.subtle.deriveKey(
      {
        name: 'ECDH',
        public: publicKey
      },
      privateKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Generate cryptographically secure nonce
  generateNonce(length: number): Uint8Array {
    const nonce = new Uint8Array(length);
    crypto.getRandomValues(nonce);
    return nonce;
  }

  // Encrypt data with AES-GCM
  async encrypt(data: Uint8Array, key: CryptoKey, nonce: Uint8Array): Promise<{
    ciphertext: Uint8Array;
    authTag: Uint8Array;
  }> {
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: nonce
      },
      key,
      data
    );

    // AES-GCM returns ciphertext + auth tag combined
    const encryptedArray = new Uint8Array(encrypted);
    const ciphertext = encryptedArray.slice(0, -16); // All but last 16 bytes
    const authTag = encryptedArray.slice(-16); // Last 16 bytes

    return { ciphertext, authTag };
  }

  // Decrypt data with AES-GCM
  async decrypt(ciphertext: Uint8Array, authTag: Uint8Array, key: CryptoKey, nonce: Uint8Array): Promise<Uint8Array> {
    // Combine ciphertext and auth tag for Web Crypto API
    const encrypted = new Uint8Array(ciphertext.length + authTag.length);
    encrypted.set(ciphertext);
    encrypted.set(authTag, ciphertext.length);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce
      },
      key,
      encrypted
    );

    return new Uint8Array(decrypted);
  }
}