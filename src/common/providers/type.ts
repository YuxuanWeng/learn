import { LocalServerWsClientMessage, LocalServerWsServerMessage } from '@fepkg/services/types/bds-common';
import { Context } from '@opentelemetry/api';
import { QueryKey } from '@tanstack/react-query';

export type WsRequestParam<T> = Omit<LocalServerWsClientMessage, 'request_params' | 'msg_type' | 'trace_parent'> & {
  request_id: string;
  request_params?: T;
};

export type WsResponseParam<P> = Omit<LocalServerWsServerMessage, 'response_data'> & {
  response_data: P;
};

export type ResponseConfig = {
  interval?: number;
  queryKey?: QueryKey;
  traceCtx?: Context;
};

export type ResponseParam<P> = WsResponseParam<P>;
