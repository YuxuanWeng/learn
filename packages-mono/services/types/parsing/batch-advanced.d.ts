import type { BaseResponse, QuoteParsing, Trader } from '../common';
import { ProductType } from '../enum';

/**
 * @description 批量高级识别: 将用户输入识别为报价信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/batch_advanced
 */
export declare namespace ParsingBatchAdvanced {
  type Request = {
    user_input: string;
    product_type?: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    quote_list?: QuoteParsing[];
    trader_list?: Trader[]; // 交易员信息
  };
}
