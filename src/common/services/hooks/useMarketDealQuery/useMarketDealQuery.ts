import { useMemo, useRef, useState } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import type { QueryFunction } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash-es';
import { fetchMarketDeal } from '@/common/services/api/market-deal/search';
import { logUndo } from '@/common/utils/undo';
import { LogFlowPhase } from '@/types/log';
import { MarketDealFetchData, UseMarketDealQuery } from './types';
import { getMarketDealQueryKey } from './utils';

const defaultConfig = { interval: 500 };

/** 获取市场成交信息 */
export const useMarketDealQuery: UseMarketDealQuery = ({ productType, filterParams, requestConfig, loggerEnabled }) => {
  const config = { ...defaultConfig, ...requestConfig };

  const queryClient = useQueryClient();
  const queryKey = getMarketDealQueryKey(productType, filterParams);
  /** query 是否暂停 */
  const [querySuspension, setQuerySuspension] = useState(false);

  const prevFilterParams = usePrevious(filterParams);
  const isFilterParamsChanged = useMemo(
    () => !isEqual(filterParams, prevFilterParams),
    [filterParams, prevFilterParams]
  );

  const fetchParams = useMemo(
    () => cloneDeep({ product_type: productType, ...filterParams }),
    [filterParams, productType]
  );
  const fetchStartTime = useRef(-1);
  const fetchEndTime = useRef(-1);

  const queryFn: QueryFunction<MarketDealFetchData> = async ({ signal }) => {
    fetchStartTime.current = Date.now();
    const res = await fetchMarketDeal({
      params: fetchParams,
      paramsChanged: isFilterParamsChanged,
      requestConfig: { ...config, signal }
    });
    fetchEndTime.current = Date.now();
    return res;
  };

  const query = useQuery<MarketDealFetchData, unknown, MarketDealFetchData>({
    queryKey,
    queryFn,
    enabled: !querySuspension,
    staleTime: config?.interval,
    cacheTime: config?.interval,
    refetchInterval: config?.interval,
    refetchIntervalInBackground: true,
    refetchOnReconnect: 'always',
    keepPreviousData: true,
    notifyOnChangeProps: ['data', 'refetch'],
    onSuccess() {
      logUndo({ phase: LogFlowPhase.Success });
    }
  });

  const handleRefetch = useMemoizedFn(async () => {
    setQuerySuspension(true);
    await queryClient.cancelQueries({ queryKey });
    await query.refetch();
    setQuerySuspension(false);
  });

  return { ...query, handleRefetch };
};
