import type { BaseResponse, Trader } from '../common';
import { ProductType } from '../enum';

/**
 * @description 查询机构下属于某台子的交易员列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/inst/trader/list
 */
export declare namespace InstTraderList {
  type Request = {
    inst_id: string;
    product_type?: ProductType;
    ignore_trader_whitelist?: boolean;
    offset?: number;
    count?: number;
  };

  type Response = {
    list?: Trader[];
    total?: number;
    base_response?: BaseResponse;
  };
}
