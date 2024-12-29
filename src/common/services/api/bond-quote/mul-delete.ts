import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteMulDelete } from '@fepkg/services/types/bond-quote/mul-delete';
import request from '@/common/request';

/**
 * @description 批量撤销操作
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_delete
 */
export const mulDeleteBondQuote = (params: BondQuoteMulDelete.Request, config?: RequestConfig) => {
  return request.post<BondQuoteMulDelete.Response>(APIs.bondQuote.mulDelete, params, config);
};
