import { AppEnv } from '@fepkg/common/types';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { User } from '@fepkg/services/types/common';

export type UserInitConfig = {
  /** 数据环境来源 */
  env: AppEnv;
  /** 鉴权 Token */
  token: string;
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
  /** 数据库路径 */
  dbFilePath?: string;
  /** 是否需要刷新数据库 */
  refreshData: boolean;
  baseURL: string;
  algoBaseURL: string;
  authBaseURL: string;
  userInfo: User;
  websocketHost?: string;
  logUrl: string;
  metricsUrl: string;
  productType: ProductType;
};
