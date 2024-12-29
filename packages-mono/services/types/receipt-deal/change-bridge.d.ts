import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal } from '../common';
import { Side } from '../enum';

/**
 * @description 换桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/change
 */
export declare namespace ReceiptDealChangeBridge {
  type Request = {
    parent_deal_ids?: string[]; // 成交单父id
    bridge_inst_id: string; // 桥机构id
    /** @deprecated */
    side?: Side; // 双桥换桥才用得到，换bid桥或者ofr桥
    is_skip_check: boolean; // 是否跳过校验
    /** @deprecated */
    current_bridge_inst_id?: string; // 当前桥机构id，双桥换桥才用得到
    operation_info: DealOperationInfo; // 操作类型
    current_inst_id: string; // 被换的桥的 机构id
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
