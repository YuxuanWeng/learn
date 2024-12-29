import Centrifuge, {
  DisconnectedContext,
  ErrorContext,
  SubscribedContext,
  SubscribingContext,
  SubscriptionErrorContext,
  UnsubscribedContext
} from 'centrifuge';

export type CentrifugeClientConfig = {
  /** 鉴权 Token */
  token: string;
  /** 鉴权 Token */
  env?: string;
  /** 根据js环境传入对应websocket构造函数，node环境需引入，浏览器则默认使用原生WebSocket */
  websocket?: any;
  /** ws服务器地址 */
  websocketHost?: string;
  /**  重新连接尝试之间的最小延迟（ms），默认值为500毫秒 */
  minReconnectDelay?: number;
  /**  重新连接尝试之间的最大延迟（ms），默认值为20000毫秒 */
  maxReconnectDelay?: number;
  /**  服务器ping检测断开连接的最大延迟（ms），默认值为10000毫秒 */
  maxServerPingDelay?: number;
  /** 操作超时（ms） */
  timeout?: number;
};

export type Status = 'success' | 'loading' | 'error' | 'warning' | 'idle' | 'recover';

export type SyncState = {
  /** 同步状态 */
  status: Status;
  /** 最后一次接收ws消息位置 */
  offset: number | undefined;
  /** channel epoch */
  epoch: string | undefined;
  /** 兜底检查timer */
  timer?: NodeJS.Timeout;
  /** 定时数据抽样timer */
  checkTimer?: NodeJS.Timeout;
};
export interface PublicationContext<T = unknown> extends Centrifuge.PublicationContext {
  data: T;
}

export type ConnectionHandlers = {
  onDisconnect?: (ctx: DisconnectedContext) => void;
  onError?: (ctx: ErrorContext) => void;
};

export type SubscriptionHandlers<T> = {
  onPublish?: (ctx: PublicationContext<T>) => void;
  onResubscribe?: (ctx: SubscribedContext) => void;
  onUnsubscribe?: (ctx: UnsubscribedContext) => void;
  onTempConnectionLoss?: (ctx: SubscribingContext) => void;
  onError?: (ctx: SubscriptionErrorContext) => void;
};
