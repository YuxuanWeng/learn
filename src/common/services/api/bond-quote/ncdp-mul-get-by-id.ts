import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import type { BondQuoteNcdpMulGetById } from '@fepkg/services/types/bond-quote/ncdp-mul-get-by-id';
import request from '@/common/request';

/**
 * @description 通过id批量获取ncd一级
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/mul_get_by_id
 */
export const mulFetchNCDP = (params: BondQuoteNcdpMulGetById.Request, config?: RequestConfig) => {
  return request.post<BondQuoteNcdpMulGetById.Response>(APIs.bondQuote.ncdp.mulGetById, params, {
    fromProductType: ProductType.NCDP,
    ...config
  });
};
