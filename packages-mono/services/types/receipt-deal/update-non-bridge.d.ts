import type { BaseResponse, DealOperationInfo, SendOrderInstInfo } from '../common';
import { BridgeChannel, TradeDirection } from '../enum';

/**
 * @description 无桥成交单编辑
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/non_bridge/update
 */
export declare namespace ReceiptDealUpdateNonBridge {
  type Request = {
    parent_deal_id: string; // 成交单父id
    send_msg?: string; // 发给
    channel?: BridgeChannel; // 渠道
    fee?: number; // 费用
    send_msg_comment?: string; // 发单备注
    hide_comment?: boolean; // 隐藏备注
    send_order_inst_info_list?: SendOrderInstInfo[]; // 发单机构 & 量
    flag_bid_pay_for_inst?: boolean; // bid方向是否被代付
    flag_ofr_pay_for_inst?: boolean; // ofr方向是否被代付
    direction?: TradeDirection; // 无桥指向
    operation_info: DealOperationInfo; // 操作类型
    flag_bridge_info_changed?: boolean; // 无桥发给是否变更
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
