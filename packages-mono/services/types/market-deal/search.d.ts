import type {
  BaseResponse,
  GeneralFilter,
  GroupFilter,
  InputFilter,
  MarketDeal,
  QuickFilter,
  SortingMethod,
  TableRelatedFilter
} from '../common';
import { ProductType } from '../enum';

/**
 * @description 通过筛选条件获取市场成交
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/search
 */
export declare namespace MarketDealSearch {
  type Request = {
    product_type: ProductType;
    quick_filter: QuickFilter;
    general_filter: GeneralFilter;
    table_related_filter: TableRelatedFilter;
    input_filter: InputFilter;
    extra_key_market_list?: string[]; // 额外需要关注的债券keyMarketList
    sorting_method?: SortingMethod;
    followed_broker_id_list?: string[]; // 关注人list
    offset: number;
    count: number;
    sorting_method_list?: SortingMethod[];
    group_filter_list?: GroupFilter[];
  };

  type Response = {
    base_response?: BaseResponse;
    deal_list?: MarketDeal[];
    total: number;
  };
}
