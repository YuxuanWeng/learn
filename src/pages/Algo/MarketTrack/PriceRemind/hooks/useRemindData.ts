import { useEffect, useMemo } from 'react';
import { DATA_PREFETCH_STALE_TIME } from '@fepkg/business/components/QuoteTableCell/constants';
import { APIs } from '@fepkg/services/apis';
import { OppositePriceNotification } from '@fepkg/services/types/common';
import type { BondQuoteDealHandicap, HandicapGetByBond } from '@fepkg/services/types/handicap/get-by-bond';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { batchFetchHandicapGetByBond } from '@/common/services/api/handicap/get';
import { refetchInterval, staleTime } from '@/pages/Quote/BondDetail/utils';
import { TypeCardItem } from '../../type';
import { convertToCardItemList } from '../../util';

type Props = {
  keyMarketList?: string[];
  /** 对价提醒数据 */
  notificationMap?: Map<string, OppositePriceNotification[]>;
};
/** 通过这个hook将对价提醒的数据导出去，使用useQuery的keepPreviousData属性来避免分页切换时白屏的效果 */
export const useRemindData = ({ keyMarketList = [], notificationMap = new Map() }: Props) => {
  const queryClient = useQueryClient();
  const queryParams: HandicapGetByBond.Request = useMemo(() => {
    return {
      key_market_list: keyMarketList,
      ignore_nd_deal: true
    };
  }, [keyMarketList]);

  const queryKey = [APIs.handicap.getByBond, keyMarketList, notificationMap] as [
    string,
    string[],
    Map<string, OppositePriceNotification[]>
  ];

  const queryFn: QueryFunction<TypeCardItem[]> = async () => {
    const { bond_handicap_list = [] } = await batchFetchHandicapGetByBond(queryParams);
    const bondHandicapMap = new Map<string, BondQuoteDealHandicap>();
    for (const item of bond_handicap_list) {
      bondHandicapMap.set(item.key_market, item);
    }
    return convertToCardItemList(keyMarketList, notificationMap, bondHandicapMap);
  };

  const prefetch = (params: string[]) => {
    const key = [APIs.handicap.getByBond, params, notificationMap] as [
      string,
      string[],
      Map<string, OppositePriceNotification[]>
    ];
    const prefetchQueryFn: QueryFunction<TypeCardItem[]> = async () => {
      const { bond_handicap_list = [] } = await batchFetchHandicapGetByBond({
        key_market_list: params,
        ignore_nd_deal: true
      });
      const bondHandicapMap = new Map<string, BondQuoteDealHandicap>();
      for (const item of bond_handicap_list) {
        bondHandicapMap.set(item.key_market, item);
      }
      return convertToCardItemList(keyMarketList, notificationMap, bondHandicapMap);
    };
    queryClient.prefetchQuery(key, prefetchQueryFn, { staleTime: DATA_PREFETCH_STALE_TIME });
  };

  const enable = useMemo(() => keyMarketList.length > 0, [keyMarketList]);
  useEffect(() => {
    if (!enable) {
      queryClient.clear();
    }
  }, [enable, queryClient]);

  const query = useQuery<TypeCardItem[], unknown>({
    queryKey,
    queryFn,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    keepPreviousData: enable,
    enabled: enable
  });

  return { ...query, prefetch };
};
