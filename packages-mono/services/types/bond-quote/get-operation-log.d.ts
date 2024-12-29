import type { BaseResponse, BondQuoteOperationLog } from '../common';

/**
 * @description 根据报价ID获取报价日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/get_operation_log
 */
export declare namespace BondQuoteGetOperationLog {
  type Request = {
    quote_id?: string; // 报价ID
    offset: number; // 分页游标
    count: number; // 分页计数
    code_market?: string; // 债券标识
    key_market?: string; // 债券唯一标识
  };

  type Response = {
    status_code: number;
    status_msg: string;
    log_list?: BondQuoteOperationLog[]; // 日志列表
    total: number; // 总数
    base_response?: BaseResponse;
  };
}
