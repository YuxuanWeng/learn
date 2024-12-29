import type { BaseResponse, FiccBondBasic, InstitutionTiny, Trader, User } from '../common';
import { FuzzySearchType, ProductType } from '../enum';

/**
 * @description 根据用户输入模糊查询债券,机构,交易员,经纪人列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/search
 */
export declare namespace LocalFuzzySearch {
  type Request = {
    keyword: string;
    product_type?: ProductType;
    search_type: FuzzySearchType;
    need_invalid?: boolean;
  };

  type Response = {
    inst_list?: InstitutionTiny[];
    trader_list?: Trader[];
    user_list?: User[];
    bond_info_list?: FiccBondBasic[];
    base_response?: BaseResponse;
  };
}
