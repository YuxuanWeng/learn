import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealUpdateDefaultBridgeConfig } from '@fepkg/services/types/receipt-deal/update-default-bridge-config';
import request from '@/common/request';

/**
 * @description 修改成交单加桥默认配置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update_default_bridge_config
 */
export const updateDefaultBridgeConfig = (
  params: ReceiptDealUpdateDefaultBridgeConfig.Request,
  config?: RequestConfig
) => {
  return request.post<ReceiptDealUpdateDefaultBridgeConfig.Response>(
    APIs.receiptDeal.updateDefaultBridgeConfig,
    params,
    config
  );
};
