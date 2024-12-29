import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal, SendOrderInstInfo } from '../common';
import { BridgeChannel, TradeDirection } from '../enum';

/**
 * @description 编辑桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/update
 */
export declare namespace ReceiptDealUpdateBridge {
  type Request = {
    parent_deal_id: string; // 成交单父id
    bid_bridge_channel?: BridgeChannel; // bid渠道
    ofr_bridge_channel?: BridgeChannel; // ofr渠道
    bid_send_msg?: string; // bid发给
    ofr_send_msg?: string; // ofr发给
    bid_bridge_pay?: number; // bid费用
    ofr_bridge_pay?: number; // ofr费用
    bid_send_msg_comment?: string; // bid发单备注
    ofr_send_msg_comment?: string; // ofr发单备注
    bid_hide_comment?: boolean; // bid隐藏备注
    ofr_hide_comment?: boolean; // ofr隐藏备注
    bid_send_order_inst_info_list?: SendOrderInstInfo[]; // bid发单机构 & 量
    bid_bridge_comment?: string; // bid桥备注
    ofr_bridge_comment?: string; // ofr桥备注
    double_bridge_send_msg?: string; // 双桥发给
    double_bridge_channel?: BridgeChannel; // 双桥渠道
    double_bridge_pay?: number; // 双桥费用
    double_bridge_send_comment?: string; // 双桥发给备注
    stagger_date?: number; // 错期 1:bid 2:ofr
    double_bridge_direction?: TradeDirection; // 双桥指向
    bid_bridge_direction?: TradeDirection; // bid桥指向
    ofr_bridge_direction?: TradeDirection; // bid桥指向
    ofr_send_order_inst_info_list?: SendOrderInstInfo[]; // ofr发单机构 & 量
    bid_send_order_info?: string; // bid发单信息
    ofr_send_order_info?: string; // ofr发单信息
    flag_bid_bridge_info_changed?: boolean; // Bid桥消息是否变更
    flag_ofr_bridge_info_changed?: boolean; // Ofr桥消息是否变更
    operation_info: DealOperationInfo; // 操作类型
    flag_bid_pay_for_inst?: boolean; // bid方向是否被代付
    flag_ofr_pay_for_inst?: boolean; // bid方向是否被代付
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
