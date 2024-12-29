import type { BaseResponse, QuoteFilterGroup, UpdatedQuoteFilterGroup } from '../common';

/**
 * @description 更新筛选分组
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/filter_group/update
 */
export declare namespace FilterGroupUpdate {
  type Request = {
    quote_filter_group_item: UpdatedQuoteFilterGroup;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    quote_filter_group_item?: QuoteFilterGroup;
    base_response?: BaseResponse;
  };
}
