import type { BaseResponse, FiccBondBasic } from '../common';
import { BondSearchType, ProductType } from '../enum';

/**
 * @description 债券搜索
 * @method POST
 * @url /base_data/bond/search
 */
export declare namespace LocalServerBaseDataBondSearch {
  type Request = {
    keyword: string; // 搜索文本
    offset?: string;
    count?: string;
    search_type: BondSearchType;
    listed_date?: string;
    product_type?: ProductType;
    key_market_list?: string[];
    unlimited?: boolean;
  };

  type Response = {
    base_response?: BaseResponse;
    bond_basic_list?: FiccBondBasic[];
    total?: number;
  };
}
