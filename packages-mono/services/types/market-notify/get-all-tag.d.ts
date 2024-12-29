import type { BaseResponse } from '../common';

export type MarketNotifyTag = {
  tag_id: number; // tag id
  tag_desc_en: string; // tag 的英文描述
  tag_desc_cn: string; // tag 的中文描述
};

/**
 * @description 获取所有外发配置,已deprecate
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_notify/tag/get_all
 */
export declare namespace MarketNotifyGetAllTag {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response?: BaseResponse;
    market_notify_basic_list?: MarketNotifyTag[];
    market_notify_bond_list?: MarketNotifyTag[];
    market_notify_quote_list?: MarketNotifyTag[];
    market_notify_deal_list?: MarketNotifyTag[];
  };
}
