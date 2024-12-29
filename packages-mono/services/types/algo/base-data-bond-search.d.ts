import type { BaseResponse, FiccBond } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 债券查询模糊搜索
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/base_data/bond_search
 */
export declare namespace BaseDataBondSearch {
  type Request = {
    keyword: string; // 搜索文本
    offset?: string;
    count?: string;
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    bond_info_list?: FiccBond[];
    total: number;
  };
}
