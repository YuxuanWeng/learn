import type { BaseResponse } from '../common';
import { BridgeChannel, ProductType } from '../enum';

/**
 * @description 添加桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/add
 */
export declare namespace BridgeInstAdd {
  type Request = {
    contact_id: string;
    contact_inst_id: string;
    biller_id: string;
    biller_inst_id: string;
    contact?: string;
    comment?: string;
    send_msg?: string;
    channel?: BridgeChannel;
    contact_tag?: string;
    biller_tag?: string;
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
