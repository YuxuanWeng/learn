import type { BaseResponse, OppositePriceBondFilter, OppositePriceNotifyLogic } from '../common';
import { OppositePriceNotifyMsgFillType, ProductType } from '../enum';

/**
 * @description 修改当前经纪人对价提醒设置，只传入需要修改的值;如果当前用户无配置，则转为新增，无值字段取默认值
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/setting/upsert
 */
export declare namespace OppositePriceNotificationSettingUpsert {
  type Request = {
    notify_logic?: OppositePriceNotifyLogic[]; // 提醒逻辑，如果不修改则不传
    msg_fill_type?: OppositePriceNotifyMsgFillType; // 发送话术填充设置
    bond_filter_logic?: OppositePriceBondFilter; // 债券组逻辑
    flag_valuation_for_cp_handicap?: boolean; // 复制最优盘口_含估值
    flag_issue_amount_for_cp_handicap?: boolean; // 复制最优盘口_含发行量
    flag_maturity_date_for_cp_handicap?: boolean; // 复制最优盘口_含到期日
    merge_msg_for_batch?: boolean; // 批量发送合并话术
    display_limit?: number; // 展示上限
    product_type?: ProductType; // 台子限制
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
