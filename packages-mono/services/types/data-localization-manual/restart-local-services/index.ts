import { ServiceType } from 'app/packages/services/common';
import { SyncDataType } from '../../bdm-enum';
import type { BaseResponse } from '../../common';

/**
 * @description 根据service list或syncDataTypeList重启服务
 */
export declare namespace LocalRestartLocalServices {
  type Request = {
    service_list?: ServiceType[];
    syncDataTypeList?: SyncDataType[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
