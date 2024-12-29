import type { BaseResponse, BondDetail, BondQuote } from '../common';
import { DealType, RecommendBondStatus } from '../enum';

/**
 * @description 获取推荐债券
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_recommend_bond
 */
export declare namespace GetRecommendBond {
  type Request = {
    broker_id?: string;
    status?: RecommendBondStatus[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    list?: TraderRecommendBond[];
    base_response: BaseResponse;
  };

  export type TraderRecommendBond = {
    trader_id: string;
    trader_name: string;
    list?: RecommendedBond[];
    inst_name: string;
    message_schema: string;
    trader_qq: string;
  };

  export type RecommendedBond = {
    recommend_bond_id: string; // 推荐场景唯一ID
    bond: OFRBond; // 债券报价的详细信息，TODO: update
    pass_rule_group?: string[]; // 通过的规则组，H/I/S/L
    send_count: number; // 成功发送的次数
    last_send_ts: number; // 上次发送时间,10位时间戳
    recommend_ts: number; // 债券推荐时间,10位时间戳
    status: RecommendBondStatus; // 推荐反馈状态
    quote_copy?: string; // 报价复制
  };

  export type OFRBond = {
    bond_info: BondDetail;
    latest_quote?: BondQuote;
    deal?: BondDeal;
  };

  export type BondDeal = {
    side: DealType; // 成交类型
    price: number; // 成交价
    is_internal: boolean; // 是否是暗盘
  };
}
