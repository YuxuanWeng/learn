import type { BaseResponse } from '../common';
import { BNCSendBond } from '../enum';

/**
 * @description 地方债批量债券发送消息
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/send_bond
 */
export declare namespace BncSendBond {
  type Request = {
    broker_id: string;
    code_market_list?: string[];
    send_broker_flag?: BNCSendBond;
    key_market_list?: string[];
  };

  type Response = {
    base_response: BaseResponse;
    success_num?: number; // 发送成功数
    fail_num?: number; // 发送失败数
  };
}
