import { getRequest } from '@fepkg/request';
import type { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { SwSectorInfoGet } from '@fepkg/services/types/sw-sector-info/get';

/**
 * @description 获取行业信息
 * @url /api/v1/bdm/bds/bds_api/sw_sector_info/get
 */
export const fetchSwSectorInfo = (config?: RequestConfig) => {
  return getRequest().post<SwSectorInfoGet.Response>(APIs.swSectorInfo.get, {}, config);
};
