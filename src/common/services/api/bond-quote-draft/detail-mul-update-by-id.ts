import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteDraftDetailMulUpdateById } from '@fepkg/services/types/bond-quote-draft/detail-mul-update-by-id';
import request from '@/common/request';

/**
 * @description 根据id批量修改草稿
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/detail/mul_update_by_id
 */
export const mulUpdateBondQuoteDraftDetailById = (
  params: BondQuoteDraftDetailMulUpdateById.Request,
  config?: RequestConfig
) => {
  return request.post<BondQuoteDraftDetailMulUpdateById.Response>(
    APIs.bondQuoteDraft.detailMulUpdateById,
    params,
    config
  );
};
