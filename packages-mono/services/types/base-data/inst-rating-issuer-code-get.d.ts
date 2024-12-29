import type { BaseResponse, InstRating } from '../common';

/**
 * @description 根据发行商代码查询历史评级
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/inst_rating/issuer_code/get
 */
export declare namespace BaseDataInstRatingIssuerCodeGet {
  type Request = {
    issuer_code: string; // 发行商代码
    offset: number;
    count: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    inst_rating_list?: InstRating[];
    base_response?: BaseResponse;
    total: number;
  };
}
