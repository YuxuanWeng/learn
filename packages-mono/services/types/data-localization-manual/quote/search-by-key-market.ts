import { LiveRequest } from 'app/types/DataLocalization';
import { SpotDate } from '@/components/IDCSpot/types';
import { BaseResponse, DealQuote } from '../../common';

/**
 * @description 根据用户输入搜索quoteList
 */
export declare namespace LocalQuoteSearchByKeyMarket {
  type Request = LiveRequest & {
    key_market: string;
    broker_id?: string;
    spot_date?: SpotDate;
  };

  type Response = {
    key_market?: string;
    broker_id?: string;
    spot_date?: SpotDate | undefined;
    quote_list?: DealQuote[];
    base_response?: BaseResponse;
  };
}
