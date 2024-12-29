import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 设置对价提醒已读状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/mark_read
 */
export declare namespace OppositePriceNotificationMarkRead {
  type Request = {
    read_end_time: string; // 已读的截止时间（前端传参取当前最后一条消息的创建时间），在此时间之前生成的本经纪人所有未读对价提醒都会被标已读
    product_type?: ProductType; // 台子限制
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
