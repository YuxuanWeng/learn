import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteDraftDetailMulUpdate } from '@fepkg/services/types/bond-quote-draft/detail-mul-update';
import request from '@/common/request';

/**
 * @description 批量修改草稿
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/detail/mul_update
 */
export const mulUpdateBondQuoteDraftDetail = (
  params: BondQuoteDraftDetailMulUpdate.Request,
  config?: RequestConfig
) => {
  return request.post<BondQuoteDraftDetailMulUpdate.Response>(APIs.bondQuoteDraft.detailMulUpdate, params, config);
};
