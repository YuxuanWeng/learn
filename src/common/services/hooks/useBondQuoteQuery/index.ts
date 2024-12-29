export * from './useBondQuoteQuery';
export * from './useTimeConsumingLog';
export * from './utils';
export * from './types';

// 0. 入参 -> 不需要 API，需要查询条件，需要确定数据源

// 1. QueryKey -> 由入参确定

// 2. QueryFunction -> db / http
// 一个方法，返回一个 Promise<结果>，后续访问 db 的操作可以包装成一个 Promise

// 3. QueryParams
// 如果是访问 http，直接设置轮询间隔

// 如果是访问 db，有两种思路
// - 轮询 db，设置轮询间隔
// - 关闭轮询间隔，转为监听 db 事件（insert，update，delete），在这些事件触发完成时，
//   发送自定义信号，在这个 hooks 中监听信号，收到信号后设置 enabled 为 true，执行 QueryFunction
//   onSuccess 后将 enabled 设置为 false
// 两种思路都需要访问 db 的方法提供一个 signal 进行 abort 行为，避免异步查询导致的竟态问题

// 4. Return
