import type { BaseResponse, BondDeal, RangeTime } from '../common';
import { ProductType } from '../enum';

/**
 * @description 历史/删除成交单列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/search
 */
export declare namespace DealRecordSearch {
  type Request = {
    product_type: ProductType;
    date_range: RangeTime;
    deleted: boolean;
    offset: number;
    count: number;
    only_mine?: boolean;
    key_market?: string;
    inst_id?: string;
    trader_id?: string;
  };

  type Response = {
    base_response?: BaseResponse;
    deal_list?: BondDeal[];
    total?: number;
  };
}
