import type { BaseResponse, OppositePriceNotificationSetting } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据当前经纪人获取对价提醒设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/setting/get
 */
export declare namespace OppositePriceNotificationSettingGet {
  type Request = {
    product_type?: ProductType; // 台子限制
  };

  type Response = {
    base_response?: BaseResponse;
    setting?: OppositePriceNotificationSetting; // 对价提醒设置
  };
}
