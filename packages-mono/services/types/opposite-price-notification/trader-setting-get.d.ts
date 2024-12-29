import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据经纪人id获取对价提醒-交易员渠道信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/trader_setting/get
 */
export declare namespace OppositePriceNotificationTraderSettingGet {
  type Request = {
    keyword?: string; // 根据交易员姓名/机构名称 查询的关键字
    product_type?: ProductType; // 台子限制
  };

  type Response = {
    base_response?: BaseResponse;
    trader_list?: TraderForOppositePriceNotification[]; // 交易员信息列表
  };

  export type TraderForOppositePriceNotification = {
    trader_id: string;
    trader_name: string;
    inst_name: string;
    trader_qq: string;
    turn_on: boolean;
  };
}
