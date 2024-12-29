import type { BaseResponse, ReceiptDealOperationLog } from '../common';
import { OperationSource } from '../enum';

/**
 * @description 根据成交ID获取成交日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/get_operation_log
 */
export declare namespace ReceiptDealGetOperationLog {
  type Request = {
    receipt_deal_id: string; // 成交单ID
    offset: number; // 分页游标
    count: number; // 分页计数
    source?: OperationSource; // 根据来源展示不同日志
  };

  type Response = {
    base_response?: BaseResponse;
    log_list?: ReceiptDealOperationLog[]; // 日志列表
    total: number; // 总数
  };
}
