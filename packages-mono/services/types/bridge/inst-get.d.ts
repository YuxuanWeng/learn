import type { BaseResponse, BridgeInstInfo } from '../common';
import { ProductType } from '../enum';

/**
 * @description 查询桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/get
 */
export declare namespace BridgeInstGet {
  type Request = {
    bridge_inst_id_list?: string[];
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    bridge_inst_list?: BridgeInstInfo[];
  };
}
