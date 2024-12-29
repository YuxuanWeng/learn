import type { BaseResponse } from '../common';
import { BNCSendBond } from '../enum';

/**
 * @description 地方债单个债券批量用户发送消息
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/send_bond_traders
 */
export declare namespace BncSendBondTraders {
  type Request = {
    broker_id: string;
    code_market: string;
    send_broker_flag?: BNCSendBond; // 地方债发送债券给broker/trader
    trader_broker_list?: BNCSendBond[];
    key_market?: string;
  };

  type Response = {
    base_response: BaseResponse;
    business_msg?: string;
  };

  export type BNCSendBond = {
    trader_id: string; // trader id
    broker_qm_id_list?: string[]; // broker qm id
  };
}
