import { useMemo } from 'react';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealDetail } from '@fepkg/services/types/bds-common';
import { BondCategory, BondShortName, ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealDetailSearch } from '@fepkg/services/types/receipt-deal/detail-search';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { getReceiptDealDetail } from '@/common/services/api/receipt-deal/detail-search';
import { staleTime } from '@/pages/Quote/BondDetail/utils';
import { bncIncludes } from '../SearchFilter/constant';
import { TypeSearchFilter } from '../type';

/**
 * 成交明细主界面的数据获取
 */

export type DetailReturnType = {
  details?: ReceiptDealDetail[];
  inputParams?: TypeSearchFilter;
};

export const useFetchData = (params: TypeSearchFilter, productType: ProductType) => {
  const filterParams = useMemo<ReceiptDealDetailSearch.Request>(() => {
    const bond_short_name_list = params.bond_category_total_list?.filter(
      i => !bncIncludes.includes(i)
    ) as BondShortName[];
    const bond_category_list = params.bond_category_total_list?.filter(i => bncIncludes.includes(i)) as BondCategory[];
    const price = params.filterPrice && params.price ? Number(params.price) : undefined;
    return {
      intelligence_sorting: params.intelligence_sorting,
      only_display_today: params.only_display_today,
      include_history: params.include_history,
      is_lack_of_bridge: params.is_lack_of_bridge,
      mkt_type: params.mkt_type ? params.mkt_type[0] : undefined,
      listed_market: params.listed_market,
      internal_code: params.internal_code, // 内码
      bond_key_market: params.bond?.key_market,
      price,
      inst_id: params.inst?.inst_id,
      trader_id: params.trader?.trader_id,
      bond_short_name_list,
      bond_category: bond_category_list,
      traded_date: params.traded_date ? moment(params.traded_date).valueOf().toString() : '',
      product_type: productType
    };
  }, [params, productType]);

  const queryKey = [APIs.receiptDeal.dealDetailSearch, filterParams] as [string, ReceiptDealDetailSearch.Request];
  const queryFn: QueryFunction<DetailReturnType> = async () => {
    const allDealTraderDetailList: ReceiptDealDetail[] = [];
    let search_after = '';
    // 做一个额外的熔断机制，认为不可能连续拉取30次
    let count = 0;
    while (count < 30) {
      count += 1;
      // eslint-disable-next-line no-await-in-loop
      const returnValue = await getReceiptDealDetail({
        ...filterParams,
        search_after,
        count: 500
      });

      const { receipt_deal_details, next_search_after } = returnValue as unknown as ReceiptDealDetailSearch.Response;
      if (!receipt_deal_details) break;
      allDealTraderDetailList.push(...receipt_deal_details);
      if (next_search_after) {
        search_after = next_search_after;
      } else {
        break;
      }
    }
    return { details: allDealTraderDetailList, inputParams: params };
  };
  return useQuery<DetailReturnType, unknown>({
    queryKey,
    queryFn,
    staleTime,
    refetchOnWindowFocus: false,
    // 由于数据量可能较大，目前轮询间隔拉长到2500ms
    refetchInterval: 2500,
    refetchOnReconnect: 'always',
    keepPreviousData: true
  });
};
