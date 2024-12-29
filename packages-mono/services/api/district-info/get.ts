import { getRequest } from '@fepkg/request';
import type { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DistrictInfoGet } from '@fepkg/services/types/district-info/get';

/**
 * @description 获取地区信息
 * @url /api/v1/bdm/bds/bds_api/district_info/get
 */
export const fetchDistrictInfo = (config?: RequestConfig) => {
  return getRequest().post<DistrictInfoGet.Response>(APIs.districtInfo.get, {}, config);
};
