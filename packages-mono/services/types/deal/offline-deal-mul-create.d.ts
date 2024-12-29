import type { BaseResponse, LiquidationSpeed } from '../common';
import { BondQuoteType, DealOperationType, ProductType } from '../enum';

export type OfflineDealAdd = {
  key_market: string; // 债券key market
  ofr_trader_id?: string; // ofr交易员id
  ofr_broker_id?: string; // ofr经纪人id
  ofr_inst_id?: string; // ofr机构id
  bid_trader_id?: string; // bid交易员id
  bid_broker_id?: string; // bid经纪人id
  bid_inst_id?: string; // bid机构id
  price: number; // 金额
  return_point?: number; // 返点
  price_type: BondQuoteType; // 价格类型
  volume: number; // 交易量
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  product_type: ProductType; // 台子
  ofr_trader_tag?: string; // ofr交易员标签
  bid_trader_tag?: string; // bid交易员标签
};

/**
 * @description 线下成交录入
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/offline_deal/mul_create
 */
export declare namespace DealOfflineDealMulCreate {
  type Request = {
    deal_list?: OfflineDealAdd[];
    operation_type?: DealOperationType; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
