import type { BaseResponse, DealOperationInfo } from '../common';
import { BondDealStatus, ReceiverSide } from '../enum';

/**
 * @description 成交确认
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/confirm
 */
export declare namespace DealRecordConfirm {
  type Request = {
    deal_id: string; // 成交单ID
    confirm_status: BondDealStatus; // 成交确认
    volume?: number; // 交易量
    operator?: string; // 操作人
    confirm_side: ReceiverSide; // 确认方向（区分点价方和被点价方同名的情况）
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
