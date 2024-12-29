import type { BaseResponse } from '../common';
import { BridgeChannel, ProductType } from '../enum';

/**
 * @description 修改桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/update
 */
export declare namespace BridgeInstUpdate {
  type Request = {
    bridge_inst_id: string;
    contact_id?: string; // 联系人
    biller_id?: string; // 计费人
    send_msg?: string;
    channel?: BridgeChannel;
    comment?: string;
    contact?: string; // 联系方式
    contact_inst_id?: string;
    biller_inst_id?: string;
    contact_tag?: string; // 联系人tag
    biller_tag?: string; // 计费人tag
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
