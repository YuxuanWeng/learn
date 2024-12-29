import type { BaseResponse, BondBenchmarkRate, FiccBondBasic, FiccBondDetail, InstInfo, InstRating } from '../common';
import { FiccBondInfoLevelV2 } from '../enum';

/**
 * @description 根据债券唯一标识查询债券
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/get_by_key_market
 */
export declare namespace BaseDataBondGetByKeyMarket {
  type Request = {
    key_market_list?: string[]; // 债券唯一标识
    info_level: FiccBondInfoLevelV2;
    with_related_info?: boolean;
  };

  type Response = {
    base_response?: BaseResponse;
    bond_basic_list?: FiccBondBasic[];
    bond_detail_list?: FiccBondDetail[];
    related_info_list?: BondRelatedInfo[]; // 供基本报价接口使用
    inst_info_list?: InstInfo[]; // 一些机构信息，包括发行人，债券评级机构，担保人，主承销商，承销团
  };

  export type BondRelatedInfo = {
    key_market: string;
    benchmark_rate?: BondBenchmarkRate; // 债券基准利率，使用key_market查询
    issuer_rating_list?: InstRating[]; // 主体评级，使用issuer_code查询，返回前十条
  };
}
