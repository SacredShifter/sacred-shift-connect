// Browser polyfills for Node.js compatibility

// Fix for simple-peer global reference - this must be done before any imports
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Fix for Buffer if not available
if (typeof Buffer === 'undefined') {
  // Browser-compatible Buffer polyfill
  (window as any).Buffer = {
    from: (data: any) => {
      if (data instanceof ArrayBuffer) return new Uint8Array(data);
      if (Array.isArray(data)) return new Uint8Array(data);
      if (typeof data === 'string') {
        const encoder = new TextEncoder();
        return encoder.encode(data);
      }
      return new Uint8Array(0);
    },
    alloc: (size: number) => new Uint8Array(size),
    allocUnsafe: (size: number) => new Uint8Array(size),
    isBuffer: (obj: any) => obj instanceof Uint8Array,
    concat: (buffers: Uint8Array[]) => {
      const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of buffers) {
        result.set(buf, offset);
        offset += buf.length;
      }
      return result;
    }
  };
}

// Fix for process if not available
if (typeof process === 'undefined') {
  (window as any).process = { 
    env: {},
    nextTick: (fn: Function) => setTimeout(fn, 0),
    browser: true,
    version: '',
    versions: {},
    platform: 'browser',
    arch: 'x64',
    cwd: () => '/',
    chdir: () => {},
  };
}

// Fix for crypto if not available
if (typeof crypto === 'undefined') {
  (window as any).crypto = (window as any).msCrypto || {
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {
      generateKey: () => Promise.resolve({}),
      exportKey: () => Promise.resolve(new ArrayBuffer(0)),
      importKey: () => Promise.resolve({}),
      sign: () => Promise.resolve(new ArrayBuffer(0)),
      verify: () => Promise.resolve(true),
    }
  };
}

// Fix for stream if not available
if (typeof (window as any).stream === 'undefined') {
  (window as any).stream = {
    Readable: class Readable {
      constructor() {}
      pipe() { return this; }
      on() { return this; }
      once() { return this; }
      emit() { return false; }
      push() { return true; }
      read() { return null; }
    },
    Writable: class Writable {
      constructor() {}
      write() { return true; }
      end() {}
      on() { return this; }
      once() { return this; }
      emit() { return false; }
    },
    Transform: class Transform {
      constructor() {}
      pipe() { return this; }
      on() { return this; }
      once() { return this; }
      emit() { return false; }
      write() { return true; }
      end() {}
    }
  };
}

// Fix for util if not available
if (typeof (window as any).util === 'undefined') {
  (window as any).util = {
    inherits: (ctor: any, superCtor: any) => {
      ctor.super_ = superCtor;
      Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    },
    isArray: Array.isArray,
    isBoolean: (val: any) => typeof val === 'boolean',
    isNull: (val: any) => val === null,
    isNullOrUndefined: (val: any) => val === null || val === undefined,
    isNumber: (val: any) => typeof val === 'number',
    isString: (val: any) => typeof val === 'string',
    isSymbol: (val: any) => typeof val === 'symbol',
    isUndefined: (val: any) => val === undefined,
    isRegExp: (val: any) => val instanceof RegExp,
    isObject: (val: any) => typeof val === 'object' && val !== null,
    isDate: (val: any) => val instanceof Date,
    isError: (val: any) => val instanceof Error,
    isFunction: (val: any) => typeof val === 'function',
    isPrimitive: (val: any) => {
      return val === null ||
             typeof val === 'boolean' ||
             typeof val === 'number' ||
             typeof val === 'string' ||
             typeof val === 'symbol' ||
             typeof val === 'undefined';
    }
  };
}

export {};
