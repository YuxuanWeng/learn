import type { BaseResponse, LiquidationSpeed, ReceiptDealTrade } from '../common';
import { BondQuoteType, Direction, ExerciseType, HistDealStatus } from '../enum';

/**
 * @description 历史成交单查询
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/real_parent_deal/search
 */
export declare namespace ReceiptDealSearchRealParentDeal {
  type Request = {
    inst_id?: string;
    key_market?: string;
    trader_id?: string;
    create_start_time?: string;
    hist_deal_status_list?: HistDealStatus[];
    only_mine?: boolean;
    create_end_time?: string;
    offset: number; // 分页游标
    count: number; // 分页计数
  };

  type Response = {
    base_response?: BaseResponse;
    real_receipt_deal_info_list?: RealReceiptDealInfo[];
    total?: number;
  };

  export type RealReceiptDealInfo = {
    create_time: string;
    internal_code: string;
    hist_deal_status: HistDealStatus; // 成交单状态
    time_to_maturity: string;
    bond_short_name: string;
    price_type: BondQuoteType;
    price?: number; // 用户手填价格，价格可能为空，所以optional
    yield?: number; // 收益率
    clean_price?: number; // 净价
    full_price?: number; // 全价
    spread?: number; // 利差
    volume?: number;
    return_point?: number;
    bid_liquidation_speed_list?: LiquidationSpeed[];
    ofr_liquidation_speed_list?: LiquidationSpeed[];
    traded_date: string;
    is_exercise: ExerciseType;
    bid_trade_info: ReceiptDealTrade; // bid 交易方
    ofr_trade_info: ReceiptDealTrade; // ofr 交易方
    direction: Direction;
    display_code: string;
    update_time: string;
    parent_id: string;
    flag_stock_exchange?: boolean;
    bid_traded_date?: string;
    ofr_traded_date?: string;
    bid_delivery_date?: string;
    ofr_delivery_date?: string;
    flag_rebate?: boolean;
    flag_internal?: boolean;
  };
}
