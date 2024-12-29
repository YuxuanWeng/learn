import type { BaseResponse, Trader } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据用户输入模糊查询机构交易员列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/inst_trader/search
 */
export declare namespace InstTraderSearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    with_broker?: boolean;
    need_invalid?: boolean;
  };

  type Response = {
    base_response?: BaseResponse;
    trader_list?: Trader[];
  };
}
