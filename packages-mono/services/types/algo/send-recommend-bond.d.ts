import type { BaseResponse } from '../common';

/**
 * @description 发送推荐债券
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/send_recommend_bond
 */
export declare namespace SendRecommendBond {
  type Request = {
    recommend_bond_id_list?: string[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response: BaseResponse;
  };
}
