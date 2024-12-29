import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ChildDealUrge } from '@fepkg/services/types/deal/child-deal-urge';
import { context } from '@opentelemetry/api';
import request from '@/common/request';

/**
 * @description 催单
 * @url /api/v1/bdm/bds/bds_api/deal/child_deal/urge
 */
export const urgeChildDeals = (params: ChildDealUrge.Request, config?: RequestConfig) => {
  return request.post<ChildDealUrge.Response>(APIs.deal.childDealUrge, params, {
    ...config,
    traceCtx: context.active()
  });
};
