import type { BaseResponse, FiccBondBasic } from '../common';
import { BondSearchType, ProductType } from '../enum';

/**
 * @description 债券搜索
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/search
 */
export declare namespace BaseDataBondSearch {
  type Request = {
    keyword: string; // 搜索文本
    offset?: string;
    count?: string;
    search_type: BondSearchType;
    listed_date?: string;
    /** @deprecated */
    bond_type_list?: string[]; // deprecated
    product_type?: ProductType;
    product_type_list?: ProductType[]; // 支持多台子查询，上面的product_type废弃
    unlimited?: boolean; // 是否搜索已下市债券
    key_market_list?: string[]; // keymarket 列表
  };

  type Response = {
    base_response?: BaseResponse;
    bond_basic_list?: FiccBondBasic[];
    total?: number;
  };
}
