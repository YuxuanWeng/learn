import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 修改经纪人对价提醒-交易员渠道信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/trader_setting/update
 */
export declare namespace OppositePriceNotificationTraderSettingUpdate {
  type Request = {
    open_trader_id_list?: string[];
    close_trader_id_list?: string[];
    product_type?: ProductType; // 台子限制
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
