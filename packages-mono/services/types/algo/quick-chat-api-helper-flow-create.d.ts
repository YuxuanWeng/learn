import type { BaseResponse } from '../common';

/**
 * @description helper分流数据插入
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/helper_flow_create
 */
export declare namespace HelperFlowCreate {
  type Request = {
    data_type?: string;
    data?: string;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
