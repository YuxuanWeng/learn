import type { BaseResponse, Trader } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据用户输入模糊搜索交易员列表
 * @method POST
 * @url /trader/search
 */
export declare namespace LocalServerTraderSearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    is_precise?: boolean; // 是否精确搜索，不传默认为模糊搜索
    offset?: number;
    count?: number;
    need_invalid?: boolean; // 是否需要包括无效的数据（离职，停用等）
    trader_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    list?: Trader[];
    total?: number;
  };
}
