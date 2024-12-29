import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataIssuerInstMulGet } from '@fepkg/services/types/base-data/issuer-inst-mul-get';
import request from '@/common/request';

/**
 * @description 根据发行商代码查询发行人信息
 * @url /api/v1/bdm/bds/bds_api/base_data/issuer_inst/mul_get
 */
export const fetchBondByIssuerInst = (params: BaseDataIssuerInstMulGet.Request, config?: RequestConfig) => {
  return request.post<BaseDataIssuerInstMulGet.Response>(APIs.baseData.issuerInstMulGet, params, config);
};
