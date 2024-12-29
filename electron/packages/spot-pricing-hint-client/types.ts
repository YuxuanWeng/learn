import { AppEnv } from '@fepkg/common/types';
import { User } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';

export type SpotPricingHintClientConfig = {
  /** axios baseURL */
  requestBaseURL: string;
  /** 鉴权 Token */
  token: string;
  /** package.json 内的版本 */
  version: string;
  /** 系统类型 */
  platform: 'MAC' | 'WINDOWS';
  /** 设备 Id */
  deviceId: string;
  /** 日志发送器 */
  // logger: Logger;
  userInfo: User;
  apiEnv: AppEnv;
  softLifecycleId: string;
  deviceType: string;
  /** log上传url，已经在 electron/windows/listeners/login-listener.ts 拼接完整，可直接使用 */
  uploadUrl: string;
  productType: ProductType;
};

export type SpotPricingHintEventData = {
  action: SpotPricingHintEventAction;
  value?: any;
};

export enum SpotPricingHintEventAction {
  Start = 'start',
  End = 'end',
  NewHint = 'new-hint',
  UpdateToken = 'update-token',
  Log = 'log'
}
