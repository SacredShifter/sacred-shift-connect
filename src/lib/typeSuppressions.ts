/**
 * Type suppressions for experimental/future features
 * These suppress TypeScript errors for crypto/mesh functionality
 * that aren't critical for core GAA engine operation
 */

// Extend Navigator interface for experimental APIs
declare global {
  interface Navigator {
    bluetooth?: {
      getAvailability(): Promise<boolean>;
      requestDevice(options?: any): Promise<any>;
    };
    serial?: {
      requestPort(): Promise<any>;
      getPorts(): Promise<any[]>;
    };
  }
}

// Extend crypto subtle for key material types
declare global {
  namespace Crypto {
    interface SubtleCrypto {
      importKey(
        format: string,
        keyData: BufferSource | any,
        algorithm: any,
        extractable: boolean,
        keyUsages: string[]
      ): Promise<CryptoKey>;
    }
  }
}

export {};