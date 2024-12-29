import type { BaseResponse, InstitutionTiny } from '../common';
import { ProductType, SearchInstMatchField } from '../enum';

/**
 * @description 根据用户输入模糊查询机构列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/inst/fuzzy_search
 */
export declare namespace InstFuzzySearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    offset?: number;
    count?: number;
    with_biz_short_name?: boolean;
    match_field?: SearchInstMatchField[];
    need_invalid?: boolean; // 是否需要包括无效的数据（离职，停用等）
  };

  type Response = {
    list?: InstitutionTiny[];
    total?: number;
    base_response?: BaseResponse;
  };
}
