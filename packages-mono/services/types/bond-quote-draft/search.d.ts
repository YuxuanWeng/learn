import type { BaseResponse, QuoteDraftMessage } from '../common';
import { ProductType, QuoteDraftMessageStatus } from '../enum';

/**
 * @description 协同报价轮询接口
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/search
 */
export declare namespace BondQuoteDraftSearch {
  type Request = {
    product_type: ProductType;
    broker_id_list?: string[];
    message_status: QuoteDraftMessageStatus;
    offset: number;
    count: number;
    end_time?: string;
  };

  type Response = {
    base_response?: BaseResponse;
    list?: QuoteDraftMessage[];
    total?: number;
    last_create_time?: string;
  };
}
