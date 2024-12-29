import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { CentrifugeClient, Status, SyncState } from '@fepkg/centrifuge-client';
import { Logger } from '@fepkg/logger';
import { Metrics } from '@fepkg/metrics';
import { QueryKey } from '@tanstack/react-query';

export type CentrifugeInitialState = {
  /** 鉴权 Token */
  token: string;
  /** 鉴权 Token */
  env?: string;
  /** 根据js环境传入对应websocket构造函数，node环境需引入，浏览器则默认使用原生WebSocket */
  websocket?: any;
  /** ws服务器地址 */
  websocketHost?: string;
  /** logger实例 */
  logger?: Logger;
  /** metrics实例 */
  metrics?: Metrics;
};

export type SyncInfo = Pick<SyncState, 'offset' | 'epoch'>;

export type CentrifugeQueryParam = {
  queryKey: QueryKey;
  handleWSMessage?: (data?: unknown, prevData?) => unknown;
};

export type CentrifugeSubscribe = {
  /** Centrifuge 实例 */
  centrifugeInstance: MutableRefObject<CentrifugeClient | null>;
  /** 处理ws接收到的消息 */
  handleWsMessage?: (channel: string, wsData: string) => Promise<void>;
  /** Centrifuge连接状态 */
  centrifugeState: Status;
  setCentrifugeState: Dispatch<SetStateAction<Status>>;
  /** 连接centrifuge伴随重试 */
  centrifugeConnect: () => Promise<void>;
  /** logger实例 */
  logger?: Logger;
};

export type CentrifugeConnect = {
  /** Centrifuge 实例 */
  centrifugeInstance: MutableRefObject<CentrifugeClient | null>;
  /** Centrifuge连接状态 */
  setCentrifugeState: Dispatch<SetStateAction<Status>>;
  /** logger实例 */
  logger?: Logger;
};
