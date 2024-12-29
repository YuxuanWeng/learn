import type { BaseResponse, QuoteFilterGroup } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据 broker_id 获取筛选分组
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/filter_group/get
 */
export declare namespace FilterGroupGet {
  type Request = {
    product_type?: ProductType;
    product_type_list?: ProductType[]; // 兼容性改动
  };

  type Response = {
    status_code: number;
    status_msg: string;
    quote_filter_group_list?: QuoteFilterGroup[];
    base_response?: BaseResponse;
  };
}
