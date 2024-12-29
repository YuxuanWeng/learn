import type {
  BaseResponse,
  BondLite,
  Broker,
  FiccBondBasic,
  InstitutionTiny,
  LiquidationSpeed,
  TraderLite
} from '../common';
import { BondQuoteType, ProductType } from '../enum';

export type DealParsing = {
  /** @deprecated */
  bond_info?: BondLite; // 债券信息 using bond_basic instead
  ofr_trader?: TraderLite; // ofr交易员信息
  ofr_inst?: InstitutionTiny; // ofr交易员信息
  bid_trader?: TraderLite; // bid交易员信息
  bid_inst?: InstitutionTiny; // bid交易员信息
  bid_broker?: Broker;
  price?: number; // 金额
  return_point?: number; // 返点
  price_type?: BondQuoteType; // 价格类型
  volume?: number; // 交易量
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  bond_basic?: FiccBondBasic; // 债券信息
  line_id?: number;
};

/**
 * @description 线下成交信息识别
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/deal_info
 */
export declare namespace ParsingDealInfo {
  type Request = {
    user_input: string;
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    deal_list?: DealParsing[];
  };
}
