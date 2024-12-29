import { BaseResponse, FiccBondBasic } from '../../common';
import { BondSearchType, FiccBondInfoLevel, ProductType } from '../../enum';

/**
 * @description 债券筛选查询-本地数据
 * @deprecated 改用LocalServerBaseDataBondSearch，待本地化下线后修改
 */
export declare namespace LocalBondSearch {
  type Request = {
    keyword: string;
    offset?: string | undefined;
    count?: string | undefined;
    search_type: BondSearchType;
    listed_date?: string | undefined;
    bond_type_list?: string[] | undefined;
    info_level: FiccBondInfoLevel;
    product_type?: ProductType | undefined;
    key_market_list?: string[];
    product_type_list?: ProductType[]; // 支持多台子查询
  };
  type Response = {
    total?: string;
    bond_basic_list?: FiccBondBasic[];
    base_response?: BaseResponse;
  };
}
