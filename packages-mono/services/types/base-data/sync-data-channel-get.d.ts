import type { BaseResponse } from '../common';
import { SyncDataType } from '../enum';

/**
 * @description 获取台子+数据类型对应的同步数据channel，用于同步报价/成交数据
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/sync_data_channel/get
 */
export declare namespace BaseDataSyncDataChannelGet {
  type Request = {
    data_type: SyncDataType; // 数据类型
    local_version: string; // 本地版本，毫秒时间戳
  };

  type Response = {
    base_response?: BaseResponse;
    init_channel?: string;
    total?: number;
  };
}
