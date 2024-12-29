import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondRatingGet } from '@fepkg/services/types/base-data/bond-rating-get';
import request from '@/common/request';

/**
 * @description 债券基准利率查询
 * @url /api/v1/bdm/bds/bds_api/base_data/bond_rating/get
 */
export const fetchBondRating = (params: BaseDataBondRatingGet.Request, config?: RequestConfig) => {
  return request.post<BaseDataBondRatingGet.Response>(APIs.baseData.bondRatingGet, params, config);
};
