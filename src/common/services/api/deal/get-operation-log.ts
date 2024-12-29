import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealOperationLogSearch } from '@fepkg/services/types/deal/operation-log-search';
import request from '@/common/request';

/**
 * @description 根据成交ID获取成交日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/operation_log/search
 */
export const getOperationLog = (params: DealOperationLogSearch.Request, config?: RequestConfig) => {
  return request.post<DealOperationLogSearch.Response>(APIs.deal.operationLogSearch, params, config);
};
