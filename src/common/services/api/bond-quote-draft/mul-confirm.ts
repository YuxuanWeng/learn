import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteDraftMulConfirm } from '@fepkg/services/types/bond-quote-draft/mul-confirm';
import request from '@/common/request';

/**
 * @description 修改忽略草稿
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/mul_confirm
 */
export const mulConfirmBondQuoteDraft = (params: BondQuoteDraftMulConfirm.Request, config?: RequestConfig) => {
  return request.post<BondQuoteDraftMulConfirm.Response>(APIs.bondQuoteDraft.mulConfirm, params, config);
};
