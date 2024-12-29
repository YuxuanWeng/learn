import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交克隆
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/clone
 */
export declare namespace DealRecordClone {
  type Request = {
    count: number; // 克隆条数
    deal_id: string; // 成交单Id
    granter_id?: string; // 授权人ID
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
