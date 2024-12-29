import type { BaseResponse, BridgeInstInfo } from '../common';
import { ProductType } from '../enum';

/**
 * @description 模糊查询桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/search
 */
export declare namespace BridgeInstSearch {
  type Request = {
    product_type: ProductType; // 现在只有利率
    keyword?: string;
    need_receipt_deal_count?: boolean; // 是否需要成交单数量
    offset?: number;
    count?: number;
  };

  type Response = {
    base_response?: BaseResponse;
    bridge_inst_list?: BridgeInstInfo[];
  };
}
