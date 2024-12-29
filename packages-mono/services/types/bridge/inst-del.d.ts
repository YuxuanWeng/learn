import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 删除桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/del
 */
export declare namespace BridgeInstDel {
  type Request = {
    bridge_inst_id: string;
    product_type?: ProductType; // 暂时只有利率
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
