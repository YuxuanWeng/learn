import type { BaseResponse, NCDPOperationLog } from '../common';

/**
 * @description 根据存单ID获取存单日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/get_operation_log
 */
export declare namespace BondQuoteNcdpGetOperationLog {
  type Request = {
    ncdp_id: string; // 成交单ID
    offset?: number; // 分页游标
    count?: number; // 分页计数
  };

  type Response = {
    base_response?: BaseResponse;
    log_list?: NCDPOperationLog[]; // 日志列表
    total: number; // 总数
  };
}
