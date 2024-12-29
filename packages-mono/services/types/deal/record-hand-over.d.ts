import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交单点移交
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/hand_over
 */
export declare namespace DealRecordHandOver {
  type Request = {
    deal_id: string; // 成交记录ID
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
