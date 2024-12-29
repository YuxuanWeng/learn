import { LiveRequest } from 'app/types/DataLocalization';
import { SpotDate } from '@/components/IDCSpot/types';
import { BaseResponse, DealQuote } from '../../common';

/**
 * @description 根据用户输入搜索quoteOptimalList
 */
export declare namespace LocalQuoteSearchOptimalByKeyMarket {
  type Request = LiveRequest & {
    key_market: string;
    broker_id?: string;
    spot_date?: SpotDate;
    ignore_retail?: boolean; // 是否忽略散量
  };

  type Response = {
    key_market?: string;
    broker_id?: string;
    spot_date?: SpotDate | undefined;
    /** idc 最优报价单个面板列表集合 */
    bid_optimal_quote_list?: DealQuote[];
    bid_suboptimal_quote_list?: DealQuote[];
    ofr_optimal_quote_list?: DealQuote[];
    ofr_suboptimal_quote_list?: DealQuote[];
    base_response?: BaseResponse;
  };
}
