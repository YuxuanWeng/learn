import { ProductType } from '@fepkg/services/types/bdm-enum';
import { DefaultResponse } from '@fepkg/services/types/common';
import { Context, Span } from '@opentelemetry/api';
import { AxiosError, AxiosRequestConfig, Method } from 'axios';

export type RequestMethod = Extract<Method, 'get' | 'post'>;

export type RequestParams = Record<string, unknown> | FormData | undefined;

export type RequestConfig = AxiosRequestConfig & {
  /** 接口版本，默认为 v1 */
  version?: string;
  /** 是否为 mock 请求 */
  isMock?: boolean;
  /** 是否为 local server 请求, 只能在OMS中使用 */
  isLocalServerRequest?: boolean;
  /** 是否为算法相关 api 的请求，若是，则请求域名不同 */
  isAlgo?: boolean;
  /** 是否隐藏错误信息 */
  hideErrorMessage?: boolean;

  /** 遇到failed_type_list时，是否阻止继续执行 */
  preventExecWithFailed?: boolean;

  /* 日志标记 */
  logFlag?: string;
  logStartTime?: number;

  /** opentelemtry trace context */
  traceCtx?: Context;
  span?: Span;
  skipTrace?: boolean;
  onCanceled?: () => void;
  /** header中是否传入的FROM-PRODUCT-TYPE */
  ignoreFromProductType?: boolean;
  /** 修改header中的FROM-PRODUCT-TYPE */
  fromProductType?: ProductType;
};

export enum StatusCode {
  Success = 0,
  InternalError = 1,
  InvalidParam = 2,
  RPCFailed = 3,
  DataMarshalErr = 4,
  DataUnmarshalErr = 5,
  UrlNotMatch = 6,
  NotLogin = 1001,
  LoginCheckFailed = 1002,
  /** 没有数据权限 */
  NoAccess = 1003,
  /** 当前账户在对应的系统中没有权限 */
  NoSystemAccess = 1010,
  UserTokenInvalid = 1301,
  UserLoginInvalidParam = 1302,
  /** 多次登录导致的账号锁定 */
  UserAccountLocked = 1303,
  UserLogoutFailed = 1304,
  /** CRM 操作停用 */
  UserAccountDisabled = 1311,
  UserTokenIsReplaced = 1312,
  /** CRM 操作离职 */
  UserAccountQuit = 1314,
  AdminDepartmentExists = 16007,
  AdminUserJobNumExists = 16025,
  AdminUserRemainedTrader = 16027,
  AdminDepartmentRemained = 16032,
  AdminUserNotFound = 16041,
  AdminUserPasswordIncorrect = 16042,
  /** 并发校验错误码 */
  ConcurrentCheckError = 24072
}

export type RequestResponse<Data extends Record<string, unknown> = DefaultResponse> = Data & DefaultResponse;

export type ResponseError = AxiosError<RequestResponse> & {
  config: RequestConfig;
  data: RequestResponse;
};

export type RequestInstance = Record<
  RequestMethod,
  <R extends RequestResponse, P extends RequestParams = Record<string, unknown>>(
    url: string,
    params?: P,
    config?: RequestConfig
  ) => Promise<R>
>;

export type Request<R extends DefaultResponse, P extends RequestParams> = (
  url: string,
  method: RequestMethod,
  params: P,
  config?: RequestConfig
) => Promise<RequestResponse<R>>;

export type UseDataQueryRequestConfig = {
  /** http 轮询间隔时间，单位为毫秒，仅在 source 为 http 时生效，默认为 500 */
  interval?: number;
} & RequestConfig; /** http 请求配置项，仅在 source 为 http 时生效 */

export enum FromSystem {
  OMS = 1,
  DTM = 2,
  CRM = 3,
  ODM = 4
}
