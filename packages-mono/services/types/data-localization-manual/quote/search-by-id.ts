import { LiveRequest } from 'app/types/DataLocalization';
import { BaseResponse, DealQuote } from '../../common';

/**
 * @description 根据用户输入搜索quoteList
 */
export declare namespace LocalQuoteSearchById {
  type Request = LiveRequest & {
    quote_id: string;
  };

  type Response = {
    quote?: DealQuote;
    base_response?: BaseResponse;
  };
}
