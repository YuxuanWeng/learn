import type {
  BaseResponse,
  DealInfoSync,
  QuoteDetail,
  QuoteDraftDetailSync,
  QuoteDraftMessageSync,
  QuoteSync
} from '../common';
import { ProductType, SyncDataType } from '../enum';

/**
 * @description 初始化拉取业务信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/sync_data/scan
 */
export declare namespace BaseDataSyncDataScan {
  type Request = {
    sync_data_type: SyncDataType;
    search_after?: string;
    count: number;
    product_type_list?: ProductType[];
    local_version?: string; // 本地最新版本
    start_time?: string; // 起始时间
    end_time?: string;
    is_refered?: boolean;
    unlimited?: boolean; // 是否需要过滤无效数据，默认为false
  };

  type Response = {
    base_response?: BaseResponse;
    search_after?: string; // 请求下一页使用
    quote_list?: QuoteSync[];
    quote_draft_message_list?: QuoteDraftMessageSync[];
    quote_draft_detail_list?: QuoteDraftDetailSync[];
    deal_info_list?: DealInfoSync[];
    quote_detail_list?: QuoteDetail[];
    data?: string;
  };
}
