import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteMulUpdate } from '@fepkg/services/types/bond-quote/mul-update';
import request from '@/common/request';

/**
 * @description 批量新增报价
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_update
 */
export const mulUpdateBondQuote = (params: BondQuoteMulUpdate.Request, config?: RequestConfig) => {
  return request.post<BondQuoteMulUpdate.Response>(APIs.bondQuote.mulUpdate, params, config);
};
