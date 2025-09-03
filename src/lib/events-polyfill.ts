// Events polyfill for browser compatibility
// This replaces the Node.js 'events' module

export class EventEmitter {
  private _listeners: Record<string, Function[]> = {};
  private maxListeners: number = 10;
  
  constructor() {}
  
  on(event: string, listener: Function) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    
    // Check max listeners
    if (this._listeners[event].length >= this.maxListeners) {
      console.warn(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this._listeners[event].length} listeners added. Use emitter.setMaxListeners() to increase limit`);
    }
    
    this._listeners[event].push(listener);
    return this;
  }
  
  addListener(event: string, listener: Function) {
    return this.on(event, listener);
  }
  
  once(event: string, listener: Function) {
    const onceWrapper = (...args: any[]) => {
      this.removeListener(event, onceWrapper);
      listener.apply(this, args);
    };
    return this.on(event, onceWrapper);
  }
  
  emit(event: string, ...args: any[]) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(listener => {
        try {
          listener.apply(this, args);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
    return this._listeners[event] && this._listeners[event].length > 0;
  }
  
  removeListener(event: string, listener: Function) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(l => l !== listener);
    }
    return this;
  }
  
  off(event: string, listener: Function) {
    return this.removeListener(event, listener);
  }
  
  removeAllListeners(event?: string) {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }
    return this;
  }
  
  setMaxListeners(n: number) {
    this.maxListeners = n;
    return this;
  }
  
  getMaxListeners() {
    return this.maxListeners;
  }
  
  listenerCount(event: string) {
    return this._listeners[event] ? this._listeners[event].length : 0;
  }
  
  eventNames() {
    return Object.keys(this._listeners);
  }
  
  listeners(event: string) {
    return this._listeners[event] ? [...this._listeners[event]] : [];
  }
  
  rawListeners(event: string) {
    return this.listeners(event);
  }
  
  prependListener(event: string, listener: Function) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].unshift(listener);
    return this;
  }
  
  prependOnceListener(event: string, listener: Function) {
    const onceWrapper = (...args: any[]) => {
      this.removeListener(event, onceWrapper);
      listener.apply(this, args);
    };
    return this.prependListener(event, onceWrapper);
  }
}

// Export default for CommonJS compatibility
export default EventEmitter;

// Export individual functions for CommonJS compatibility
export const once = (emitter: EventEmitter, event: string): Promise<any[]> => {
  return new Promise((resolve) => {
    emitter.once(event, (...args) => resolve(args));
  });
};

export const on = (emitter: EventEmitter, event: string): AsyncIterableIterator<any[]> => {
  const queue: any[][] = [];
  let resolve: ((value: IteratorResult<any[]>) => void) | null = null;
  
  emitter.on(event, (...args) => {
    if (resolve) {
      resolve({ value: args, done: false });
      resolve = null;
    } else {
      queue.push(args);
    }
  });
  
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(): Promise<IteratorResult<any[]>> {
      if (queue.length > 0) {
        return { value: queue.shift()!, done: false };
      }
      
      return new Promise((res) => {
        resolve = res;
      });
    },
    async return(): Promise<IteratorResult<any[]>> {
      emitter.removeAllListeners(event);
      return { value: undefined, done: true };
    },
    async throw(error: any): Promise<IteratorResult<any[]>> {
      emitter.removeAllListeners(event);
      throw error;
    }
  };
};
