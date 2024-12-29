import type { BaseResponse, DefaultBridgeConfig } from '../common';

/**
 * @description 修改成交单加桥默认配置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update_default_bridge_config
 */
export declare namespace ReceiptDealUpdateDefaultBridgeConfig {
  type Request = {
    parent_deal_id: string;
    default_bridge_config: DefaultBridgeConfig;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
