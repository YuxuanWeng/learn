import type { BaseResponse } from '../common';

/**
 * @description websocket连接鉴权代理
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/ws/proxy_connect
 */
export declare namespace WsProxyConnect {
  type Request = {
    client: string;
    transport: string;
    protocol: string;
    encoding: string;
    data: ConnectData;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    result?: WSConnectResult;
    base_response?: BaseResponse;
  };

  export type ConnectData = {
    token: string;
  };

  export type WSConnectResult = {
    user: string;
    expire_at?: number;
  };
}
