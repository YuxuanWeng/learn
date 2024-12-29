import { AppEnv } from '@fepkg/common/types';
import { Post, ProductType } from '@fepkg/services/types/enum';
import { DataLocalizationAction } from './Action';

/** 数据处理流程初始化配置 */
export type DataLocalizationInitConfig = {
  /** 数据环境来源 */
  envSource: AppEnv;
  /** axios baseURL */
  requestBaseURL: string;
  /** 鉴权 Token */
  token: string;
  /** 用户 Id */
  userId: string;
  /** 用户岗位 */
  userPost?: Post;
  /** 用户账号 */
  account: string;
  /** package.json 内的版本 */
  version: string;
  /** 一次应用生命周期 */
  softLifecycleId: string;
  /** 系统类型 */
  platform: 'MAC' | 'WINDOWS';
  /** 设备 Id */
  deviceId: string;
  /** 设备型号 */
  deviceType: string;
  /** 用户台子 */
  userProductType: ProductType[];
  /** 数据库路径 */
  dbFilePath?: string;
  /** 是否需要刷新数据库 */
  refreshData: boolean;
  /** ws前缀 */
  websocketHost?: string;
};

export type DataLocalizationRequestCommon<T = Record<string, unknown>> = {
  action: DataLocalizationAction;
  value?: T;
};

export type DataLocalizationRequest<T = Record<string, unknown>> = DataLocalizationRequestCommon<T> & {
  local_request_trace_id: string;
};

export type LiveRequest = {
  observer_id?: string;
  type?: 'remove' | 'create' | 'sync';
  observer_id_list?: string[];
};
