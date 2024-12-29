import { EventEmitter } from 'events';

/**
 * 专门用于electron层的事件总线；
 * 用于防止一些循环依赖、引用路径过深的情况；
 * 如果不了解机制，不建议使用，还使用正常的es模块化模式即可；
 * 情况特殊必须使用，建议只使用 once 进行单次注册，减少频繁使用 on；
 * 否则容易导致electron层逻辑理解上的心智负担、溢出等情况；
 */
export default new EventEmitter();
