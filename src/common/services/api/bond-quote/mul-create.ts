import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteMulCreate } from '@fepkg/services/types/bond-quote/mul-create';
import request from '@/common/request';

/**
 * @description 批量新增报价
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_create
 */
export const mulCreateBondQuote = (params: BondQuoteMulCreate.Request, config?: RequestConfig) => {
  return request.post<BondQuoteMulCreate.Response>(APIs.bondQuote.mulCreate, params, config);
};
