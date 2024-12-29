import type { BaseResponse, BondRating } from '../common';

/**
 * @description 债券基准利率查询
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/bond_rating/get
 */
export declare namespace BaseDataBondRatingGet {
  type Request = {
    bond_key: string; // 债券BondKey
    offset?: number;
    count?: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    bond_rating?: BondRating[]; // 债券基准利率
    total?: number;
    base_response?: BaseResponse;
  };
}
