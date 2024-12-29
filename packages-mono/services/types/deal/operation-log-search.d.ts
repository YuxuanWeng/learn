import type { BaseResponse, DealOperationLogV2 } from '../common';

/**
 * @description 搜索成交日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/operation_log/search
 */
export declare namespace DealOperationLogSearch {
  type Request = {
    deal_id?: string; // 成交ID
    offset: number; // 分页游标
    count: number; // 分页计数
  };

  type Response = {
    base_response?: BaseResponse;
    log_list?: DealOperationLogV2[]; // 日志列表
    total?: number; // 总数
  };
}
