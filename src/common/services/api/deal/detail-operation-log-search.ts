import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealDetailOperationLogSearch } from '@fepkg/services/types/deal/detail-operation-log-search';
import request from '@/common/request';

/**
 * @description 搜索成交明细/过桥日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/detail_operation_log/search
 */
export const detailOperationLogSearch = (params: DealDetailOperationLogSearch.Request, config?: RequestConfig) => {
  return request.post<DealDetailOperationLogSearch.Response>(APIs.deal.detailOperationLogSearch, params, config);
};
