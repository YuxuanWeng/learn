import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataSearch } from '@fepkg/services/types/base-data/search';
import request from '@/common/request';

/**
 * @description 根据用户输入模糊查询债券,机构,交易员,经纪人列表
 * @url /api/v1/bdm/bds/bds_api/base_data/search
 */
export const fuzzyFetch = (params: BaseDataSearch.Request, config?: RequestConfig) => {
  return request.post<BaseDataSearch.Response, BaseDataSearch.Request>(APIs.baseData.search, params, {
    fromProductType: params.product_type,
    ...config
  });
};
