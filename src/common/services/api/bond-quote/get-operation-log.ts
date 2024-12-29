import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteGetOperationLog } from '@fepkg/services/types/bond-quote/get-operation-log';
import request from '@/common/request';

/**
 * @description 根据报价 ID 获取报价日志
 * @url /api/v1/bdm/bds/bds_api/bond_quote/get_operation_log
 */
export const fetchBondQuoteOperationLog = (params: BondQuoteGetOperationLog.Request, config?: RequestConfig) => {
  return request.post<BondQuoteGetOperationLog.Response>(APIs.bondQuote.getOperationLog, params, config);
};
