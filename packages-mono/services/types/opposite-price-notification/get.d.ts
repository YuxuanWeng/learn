import type { BaseResponse, OppositePriceNotification } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据当前经纪人批量获取对价提醒
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/get
 */
export declare namespace OppositePriceNotificationGet {
  type Request = {
    start_time?: string; // 查询起始时间-时间戳，不传则默认为今天开始
    offset: number;
    count: number;
    product_type?: ProductType; // 台子限制
  };

  type Response = {
    base_response?: BaseResponse;
    notifications?: OppositePriceNotification[]; // 对价提醒
    has_more?: boolean;
  };
}
