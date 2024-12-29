import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BaseResponse, User } from '@fepkg/services/types/common';

export type IMHelperClientConfig = {
  /** axios baseURL */
  requestBaseURL: string;
  /** axios baseURL */
  authBaseURL: string;
  /** axios baseURL */
  algoBaseURL: string;
  /** 鉴权 Token */
  token: string;
  /** package.json 内的版本 */
  version: string;
  /** 系统类型 */
  platform: 'MAC' | 'WINDOWS';
  /** 设备 Id */
  deviceId: string;
  userInfo: User;
  env: string;
  websocketHost?: string;
  productType: ProductType;
};

export type IMHelperQQMsgForSend = {
  send_qq?: string;
  recv_qq?: string;
  msg: string;
  local_id?: string;
};

export type WSIMHelperSendMsg = {
  msg_id?: string;
  send_qq: string;
  recv_qq?: string;
  msg: string;
  create_time?: string;
};

export type WSIMHelperSendMsgRequest = {
  msg_list: WSIMHelperSendMsg[];
};

export enum IMHelperMsgSendErrCode {
  notFriends = 1,
  otherError = 2,
  bindError = 3
}

export type IMHelperMsgSendSingleResult = {
  success: boolean;
  errorCode?: IMHelperMsgSendErrCode;
  msg?: string;
};

export type IMHelperMsgSendResponse = {
  base_response: BaseResponse;
  result?: IMHelperMsgSendSingleResult[];
  error?: any;
};

export enum IMConnection {
  Lost = 'lost',
  Connected = 'connected',
  BindWrong = 'bind-wrong',
  NoUsers = 'no-users'
}

export type ConnectionInfo = { imConnection: IMConnection; allowedUserIDs: string[] };
