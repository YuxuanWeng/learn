import { SyncDataType } from '../../bdm-enum';
import { BaseResponse } from '../../common';

/**
 * @description 查询当前可用的本地服务
 */
export declare namespace LocalServicesStatus {
  type Request = {
    //
  };

  type Response = {
    available_service_list?: string[];
    available_sync_data_type?: SyncDataType[];
    error_service_list?: string[];
    error_sync_data_type?: SyncDataType[];
    base_response?: BaseResponse;
  };
}
