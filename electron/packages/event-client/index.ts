import EventEmitter from 'events';
import { EventClientChannel } from './types';

/**
 * 事件客户端，类似于事件总线，但要注意其只能触发在同一条线程/进程上注册，监听的事件
 */

export class EventClient {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  once<P = unknown>(eventName: EventClientChannel, listener: (...args: P[]) => void) {
    return this.emitter.once(eventName as unknown as string, listener);
  }

  on<P = unknown>(eventName: EventClientChannel, listener: (...args: P[]) => void) {
    return this.emitter.on(eventName as unknown as string, listener);
  }

  emit<P = unknown>(eventName: EventClientChannel, ...args: P[]) {
    return this.emitter.emit(eventName as unknown as string, ...args);
  }

  off<P = unknown>(eventName: EventClientChannel, listener: (...args: P[]) => void) {
    return this.emitter.off(eventName as unknown as string, listener);
  }
}
