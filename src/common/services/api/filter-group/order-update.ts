import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { FilterGroupOrderUpdate } from '@fepkg/services/types/filter-group/order-update';
import request from '@/common/request';

/**
 * @description 根据 broker_id 获取筛选分组
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/filter_group/get
 */
export const orderUpdateGroup = (params: FilterGroupOrderUpdate.Request, config?: RequestConfig) => {
  return request.post<FilterGroupOrderUpdate.Response>(APIs.filterGroup.orderUpdate, params, config);
};
