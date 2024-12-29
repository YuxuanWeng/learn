import type { BaseResponse, BondQuoteSyncCheck } from '../common';
import { SyncDataType } from '../enum';

/**
 * @description 获取台子+数据类型+开始时间+结束时间（可选）对应的数据ID+版本
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/sync_data_info/get
 */
export declare namespace BaseDataSyncDataInfoGet {
  type Request = {
    data_type: SyncDataType; // 数据类型
    start_time: string; // 开始时间，毫秒时间戳
    end_time: string; // 结束时间，毫秒时间戳
  };

  type Response = {
    base_response?: BaseResponse;
    data_info_list?: BondQuoteSyncCheck[];
  };
}
