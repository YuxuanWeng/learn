import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondQuoteDraftMessageUpdate } from '@fepkg/services/types/bond-quote-draft/message-update';
import request from '@/common/request';

/**
 * @description 修改报价审核消息
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/message/update
 */
export const updateBondQuoteDraftMessage = (params: BondQuoteDraftMessageUpdate.Request, config?: RequestConfig) => {
  return request.post<BondQuoteDraftMessageUpdate.Response>(APIs.bondQuoteDraft.messageUpdate, params, config);
};
