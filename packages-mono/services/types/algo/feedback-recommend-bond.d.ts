import type { BaseResponse } from '../common';
import { FeedbackType } from '../enum';

/**
 * @description 反馈推荐债券
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/feedback_recommend_bond
 */
export declare namespace FeedbackRecommendBond {
  type Request = {
    list?: RecommendBondFeedbackSturct[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response: BaseResponse;
  };

  export type RecommendBondFeedbackSturct = {
    recommend_bond_id: string;
    feedback_type?: FeedbackType[];
  };
}
