import type { BaseResponse, DealConfirmSnapshot } from '../common';

/**
 * @description 查询当前用户对于成交单的上次确认数据
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/get_confirm_data
 */
export declare namespace ReceiptDealGetConfirmData {
  type Request = {
    receipt_deal_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    deal_confirm_snapshot_list?: BrokerDealConfirmData[];
  };

  export type BrokerDealConfirmData = {
    broker_id: string;
    deal_id: string;
    deal_confirm_snapshot: DealConfirmSnapshot;
  };
}
