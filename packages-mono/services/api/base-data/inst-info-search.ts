import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataInstInfoSearch } from '@fepkg/services/types/base-data/inst-info-search';

/**
 * @description 搜索发行人/担保人
 * @url /api/v1/bdm/bds/bds_api/base_data/inst_info/search
 */
export const fetchInstInfo = (params: BaseDataInstInfoSearch.Request, config?: RequestConfig) => {
  return getRequest().post<BaseDataInstInfoSearch.Response>(APIs.baseData.instInfoSearch, params, config);
};
