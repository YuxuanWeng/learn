import type { BaseResponse, BidOfrStructList } from '../common';

/**
 * @description 获取推荐债券
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_handicap_log
 */
export declare namespace GetHandicapLog {
  type Request = {
    bond_code: string;
    time: string;
  };

  type Response = {
    code: number;
    msg: string;
    result?: Handicap;
    base_response: BaseResponse;
  };

  export type Handicap = {
    bid_clean_price: string;
    bid_handicap: string;
    bid_list?: BidOfrStructList[];
    last_deal: string;
    ofr_clean_price: string;
    offer_handicap: string;
    ofr_list?: BidOfrStructList[];
  };
}
