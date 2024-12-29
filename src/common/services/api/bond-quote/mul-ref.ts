import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteMulRef } from '@fepkg/services/types/bond-quote/mul-ref';
import request from '@/common/request';

/**
 * @description 批量手动撤单
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_ref
 */
export const mulRefBondQuote = (params: BondQuoteMulRef.Request, config?: RequestConfig) => {
  return request.post<BondQuoteMulRef.Response>(APIs.bondQuote.mulRef, params, config);
};
