import type { BaseResponse } from '../common';

export type QuoteDraftMessageUpdate = {
  message_id: string;
  inst_id?: string;
  trader_id?: string;
  broker_id?: string;
  trader_tag?: string;
};

/**
 * @description 修改报价审核消息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/message/update
 */
export declare namespace BondQuoteDraftMessageUpdate {
  type Request = {
    message: QuoteDraftMessageUpdate;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
