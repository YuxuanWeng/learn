import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteDraftMulIgnore } from '@fepkg/services/types/bond-quote-draft/mul-ignore';
import request from '@/common/request';

/**
 * @description 修改忽略草稿
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/mul_ignore
 */
export const mulIgnoreBondQuoteDraft = (params: BondQuoteDraftMulIgnore.Request, config?: RequestConfig) => {
  return request.post<BondQuoteDraftMulIgnore.Response>(APIs.bondQuoteDraft.mulIgnore, params, config);
};
