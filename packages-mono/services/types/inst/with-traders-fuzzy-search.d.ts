import type { BaseResponse, InstWithTradersMinimal } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据用户输入模糊查询机构列表（包括所属所有交易员）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/inst/with_traders/fuzzy_search
 */
export declare namespace InstWithTradersFuzzySearch {
  type Request = {
    keyword: string;
    product_type: ProductType;
    offset: number;
    count: number;
  };

  type Response = {
    base_response?: BaseResponse;
    list?: InstWithTradersMinimal[];
    total?: number;
  };
}
