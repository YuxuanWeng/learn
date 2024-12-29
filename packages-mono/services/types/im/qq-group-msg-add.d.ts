import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 新增qq群消息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/im/qq_group_msg_add
 */
export declare namespace ImQqGroupMsgAdd {
  type Request = {
    product_type: ProductType;
    msg_event: string;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
