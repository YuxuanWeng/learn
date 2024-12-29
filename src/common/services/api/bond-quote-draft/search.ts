import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BondQuoteDraftSearch } from '@fepkg/services/types/bond-quote-draft/search';
import request from '@/common/request';

/**
 * @description 协同报价轮询接口
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/search
 */
export const fetchBondQuoteDraft = async (params: BondQuoteDraftSearch.Request, config?: RequestConfig) => {
  return request.post<BondQuoteDraftSearch.Response>(APIs.bondQuoteDraft.search, params, config);
};
