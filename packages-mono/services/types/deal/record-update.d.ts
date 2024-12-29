import type { BaseResponse, DealOperationInfo, LiquidationSpeed, ReceiptDealOperateIllegal } from '../common';
import { BondDealStatus, BondQuoteType, ExerciseType, ReceiptDealTradeInstBrokerageComment } from '../enum';

export type BondDealUpdate = {
  deal_id: string; // 成交单Id
  flag_bridge?: boolean; // 过桥标识
  send_order_msg?: string; // 发单信息
  bid_send_order_msg?: string; // bid发单信息
  ofr_send_order_msg?: string; // ofr发单信息
  bond_key_market?: string; // 债券key_market
  confirm_volume?: number; // 成交量
  price_type?: BondQuoteType; // 成交价格种类
  spot_pricinger_inst?: TradeInfoUpdate; // 点价方
  spot_pricingee_inst?: TradeInfoUpdate; // 被点价方
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  return_point?: number; // 返点数值; 比如返0.12
  bid_settlement_type?: LiquidationSpeed[]; // bid结算方式
  bid_traded_date?: string; // bid交易日，毫秒时间戳
  bid_delivery_date?: string; // bid交割日，毫秒时间戳
  ofr_settlement_type?: LiquidationSpeed[]; // ofr结算方式
  ofr_traded_date?: string; // ofr交易日，毫秒时间戳
  ofr_delivery_date?: string; // ofr交割日，毫秒时间戳
  flag_stock_exchange?: boolean; // 交易所
  exercise_type?: ExerciseType; // 0：默认，1.行权；2.到期
  deal_status?: BondDealStatus; // 成交状态
  exercise_manual?: boolean; // 是否手动操作行权到期: true为手动
};

export type TradeInfoUpdate = {
  inst_id?: string; // 机构id
  trader_id?: string; // 交易员id
  trader_tag?: string; // 交易员标签
  flag_modify_brokerage?: boolean; // 调整佣金标识 1:调佣 0:不调
  modify_brokerage_reason?: string; // 调整佣金标识
  broker_id?: string; // broker
  brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 调整佣金标识枚举
};

/**
 * @description 单条修改
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/update
 */
export declare namespace DealRecordUpdate {
  type Request = {
    bond_deal: BondDealUpdate; // 成交结构
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
