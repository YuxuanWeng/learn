import type { BaseResponse, InstitutionTiny } from '../../common';
import { ProductType, SearchInstMatchField } from '../../enum';

/**
 * @description 根据用户输入模糊查询机构列表
 */
export declare namespace LocalInstSearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    offset?: number;
    count?: number;
    with_biz_short_name?: boolean;
    match_field?: SearchInstMatchField[];
    need_invalid?: boolean;
  };

  type Response = {
    list?: InstitutionTiny[];
    total?: number;
    base_response?: BaseResponse;
  };
}
