import { ProductType } from '@fepkg/services/types/bdm-enum';

export type RequestClientConfig = {
  productType?: ProductType;
  /** axios baseURL */
  baseURL: string;
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
};
