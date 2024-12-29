import type { BaseResponse, Trader } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据用户输入模糊搜索交易员列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/trader/search
 */
export declare namespace TraderSearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    is_precise?: boolean; // 是否精确搜索，不传默认为模糊搜索
    offset?: number;
    count?: number;
    need_invalid?: boolean; // 是否需要包括无效的数据（离职，停用等）
    need_area?: boolean; // 是否需要机构的地区信息
  };

  type Response = {
    list?: Trader[];
    total?: number;
    base_response?: BaseResponse;
  };
}
