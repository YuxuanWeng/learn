import type { BaseResponse, DealOperationInfo, LiquidationSpeed } from '../common';
import { BondQuoteType, DealType } from '../enum';

/**
 * @description 创建成交单
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/create
 */
export declare namespace DealRecordCreate {
  type Request = {
    bond_key_market: string;
    price_type: BondQuoteType;
    clean_price: number;
    volume: number;
    deal_type: DealType;
    broker_id: string;
    trader_id?: string;
    inst_id?: string;
    return_point?: number;
    side: number;
    liquidation_speed_list?: LiquidationSpeed[];
    price: number;
    operation_info: DealOperationInfo; // 操作类型
    /** @deprecated */
    not_sync_market?: boolean; // 是否不报市场
    flag_internal_deal?: boolean; // 是否暗盘成交
    quote_id?: string;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
