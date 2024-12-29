import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal } from '../common';
import { BridgeChannel, TradeDirection } from '../enum';

/**
 * @description 批量编辑桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/mul_update
 */
export declare namespace ReceiptDealMulUpdateBridge {
  type Request = {
    current_bridge_inst_id: string; // 当前桥机构id
    bid_bridge_channel?: BridgeChannel; // bid桥渠道
    ofr_bridge_channel?: BridgeChannel; // ofr桥渠道
    bid_send_msg?: string; // bid发给
    ofr_send_msg?: string; // ofr发给
    bid_bridge_pay?: number; // bid费用
    ofr_bridge_pay?: number; // ofr费用
    bid_send_msg_comment?: string; // bid发单备注
    ofr_send_msg_comment?: string; // ofr发单备注
    parent_deal_ids?: string[]; // 父id列表
    bid_bridge_direction?: TradeDirection; // bid桥指向
    ofr_bridge_direction?: TradeDirection; // ofr桥指向
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
