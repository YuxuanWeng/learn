import type { BaseResponse, QuoteParsing, Trader } from '../common';
import { ProductType } from '../enum';

/**
 * @description 单条报价信息识别: 将用户输入识别为报价信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/quote_info
 */
export declare namespace ParsingQuoteInfo {
  type Request = {
    user_input: string;
    product_type?: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    quote_list?: QuoteParsing[];
    trader_list?: Trader[];
  };
}
