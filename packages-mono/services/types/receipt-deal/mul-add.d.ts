import type {
  BaseResponse,
  DealOperationInfo,
  LiquidationSpeed,
  ReceiptDealBridgeOp,
  ReceiptDealDeliveryAndTradedDate,
  ReceiptDealTradeOp
} from '../common';
import { BondQuoteType, DealMarketType, Direction, ExerciseType, ProductType, SettlementMode } from '../enum';

/**
 * @description 成交单批量录入
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_add
 */
export declare namespace ReceiptDealMulAdd {
  type Request = {
    create_receipt_deal_list?: CreateReceiptDeal[];
    operation_info?: DealOperationInfo; // 操作类型
    flag_need_calculate?: boolean; // 是否需要计算
    product_type?: ProductType; // 产品类型
  };

  type Response = {
    base_response?: BaseResponse;
    illegal_inst_list?: string[]; // 非法的机构列表
    illegal_broker_list?: string[]; // 非法的经纪人列表
    illegal_trader_list?: string[]; // 非法的交易员列表
    illegal_line_id_list?: number[]; // 计算不出结果的line_id列表
  };

  export type CreateReceiptDeal = {
    bond_key_market: string;
    direction: Direction;
    deal_market_type?: DealMarketType; // 成交市场类型
    flag_internal?: boolean;
    flag_send_market?: boolean;
    flag_urgent?: boolean;
    price_type: BondQuoteType;
    yield?: number; // 收益率
    clean_price?: number; // 净价
    full_price?: number; // 全价
    volume?: number; // 交易量
    spread?: number; // 利差
    return_point?: number; // 返点数值
    settlement_amount?: number; // 结算金额
    settlement_mode?: SettlementMode; // 结算模式
    flag_rebate?: boolean;
    is_exercise?: ExerciseType; // 行权/到期
    /** @deprecated */
    liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
    /** @deprecated */
    traded_date?: string; // 交易日，毫秒时间戳
    settlement_date?: string; // 结算日，毫秒时间戳
    /** @deprecated */
    delivery_date?: string; // 交割日，毫秒时间戳 这俩字段不用了
    bid_trade_info?: ReceiptDealTradeOp; // bid 交易方
    ofr_trade_info?: ReceiptDealTradeOp; // ofr 交易方
    bridge_info?: ReceiptDealBridgeOp[]; // 桥信息，按顺序，可以超过2个桥
    other_detail?: string; // 其他细节
    backend_msg?: string; // 后台信息
    backend_feed_back?: string; // 后台反馈
    price?: number; // 价格
    deal_time?: string; // 成交时间
    line_id?: number;
    diff_settlement_type?: number; // 错期 1:bid 2:ofr
    flag_bid_pay_for_inst?: boolean; // 加的桥给bid方代付标识
    flag_ofr_pay_for_inst?: boolean; // 加的桥给ofr方代付标识
    yield_to_execution?: number; // 行权收益率
    delivery_and_traded_date_list?: ReceiptDealDeliveryAndTradedDate[];
  };
}
