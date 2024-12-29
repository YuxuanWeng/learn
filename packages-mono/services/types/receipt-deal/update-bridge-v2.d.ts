import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal, SendOrderInstInfo } from '../common';
import { BridgeChannel, TradeDirection } from '../enum';

/**
 * @description 编辑桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/update_v2
 */
export declare namespace ReceiptDealUpdateBridgeV2 {
  type Request = {
    parent_deal_id: string; // 成交单父id
    flag_bid_pay_for_inst?: boolean; // bid方向是否被代付
    flag_ofr_pay_for_inst?: boolean; // bid方向是否被代付
    update_bridge_info_list?: UpdateBridgeInfo[]; // 需要更新的桥信息
    operation_info: DealOperationInfo; // 操作类型
  };

  export type UpdateBridgeInfo = {
    receipt_deal_id: string;
    bridge_direction?: TradeDirection; // 方向
    send_msg?: string; // 发给
    bridge_channel?: BridgeChannel; // 渠道
    fee?: number; // 费用
    send_order_comment?: string; // 发单备注
    flag_hide_comment?: boolean; // 是否隐藏备注
    send_order_inst_list?: SendOrderInstInfo[]; // 发单机构 & 量
    bridge_comment?: string; // 桥备注
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
