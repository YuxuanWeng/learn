import type { BaseResponse } from '../common';
import { RecommendBondStatus } from '../enum';

/**
 * @description 更新推荐债券状态
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/update_recommend_bond
 */
export declare namespace UpdateRecommendBond {
  type Request = {
    recommend_bond_id_list?: string[];
    status: RecommendBondStatus;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response: BaseResponse;
  };
}
