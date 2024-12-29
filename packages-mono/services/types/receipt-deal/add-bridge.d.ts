import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal } from '../common';
import { ProductType, Side } from '../enum';

/**
 * @description 加桥（单桥双桥用direction区分）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/add
 */
export declare namespace ReceiptDealAddBridge {
  type Request = {
    /** @deprecated */
    parent_deal_id_list?: string[]; // 成交单id列表
    internal_code_list?: string[]; // 内码列表
    bridge_inst_id: string; // 桥机构id
    /** @deprecated */
    side?: Side; // 双桥才用得到，加为bid桥或者ofr桥
    is_skip_check: boolean; // 是否跳过反向校验
    /** @deprecated */
    pending_side?: Side; // 待定方向
    operation_info: DealOperationInfo; // 操作类型
    product_type: ProductType; // 产品类型
    receipt_deal_id_list?: string[]; // 通过 receipt_deal_id_list 来定位需要加桥的成交单
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
