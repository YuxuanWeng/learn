import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteDraftAdd } from '@fepkg/services/types/bond-quote-draft/add';
import { getOCRTimeout } from '@/common/ab-rules';
import request from '@/common/request';

/**
 * @description 新增报价草稿
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/add
 */
export const addBondQuoteDraft = (params: BondQuoteDraftAdd.Request, config?: RequestConfig) => {
  return request.post<BondQuoteDraftAdd.Response>(APIs.bondQuoteDraft.add, params, {
    timeout: getOCRTimeout(),
    ...config
  });
};
