import type { BaseResponse, DealDetailOperationLog } from '../common';

/**
 * @description 搜索成交明细/过桥日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/detail_operation_log/search
 */
export declare namespace DealDetailOperationLogSearch {
  type Request = {
    deal_id?: string; // 成交ID
    offset: number; // 分页游标
    count: number; // 分页计数
  };

  type Response = {
    base_response?: BaseResponse;
    log_list?: DealDetailOperationLog[]; // 日志列表
    total: number; // 总数
  };
}
