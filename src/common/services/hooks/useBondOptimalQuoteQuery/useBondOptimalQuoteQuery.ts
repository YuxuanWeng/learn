import { useMemo, useRef, useState } from 'react';
import { transformProductType } from '@fepkg/business/constants/map';
import { usePrevious } from '@fepkg/common/hooks';
import { isStringArray } from '@fepkg/common/utils';
import { Side } from '@fepkg/services/types/enum';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryFunction } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash-es';
import { isOptimisticUpdateEnabled } from '@/common/ab-rules';
import { useIsOnline } from '@/common/atoms';
import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import { fetchBondOptimalQuote } from '../../api/bond-optimal-quote/search';
import { OptimisticUpdateAction, OptimisticUpdateParams, useTimeConsumingLog } from '../useBondQuoteQuery';
import { BondOptimalQuoteFetchData, UseBondOptimalQuoteQuery } from './types';
import { getBondOptimalQuoteQueryKey } from './utils';

const defaultConfig = { interval: 500 };

/** 获取最优报价信息 */
export const useBondOptimalQuoteQuery: UseBondOptimalQuoteQuery = ({
  productType,
  filterParams,
  requestConfig,
  loggerEnabled,
  onOptimisticDeleteAll,
  enabled = true
}) => {
  const config = { ...defaultConfig, ...requestConfig };

  const queryClient = useQueryClient();
  const queryKey = getBondOptimalQuoteQueryKey(productType, filterParams);
  /** query 是否暂停 */
  const [querySuspension, setQuerySuspension] = useState(false);

  const { currProductTypeTeamBrokerIdList } = useTeamCollaboration();

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
  const stringifyFetchParams = JSON.stringify(fetchParams);
  const isOnline = useIsOnline();

  const queryFn: QueryFunction<BondOptimalQuoteFetchData> = async ({ signal }) => {
    fetchStartTime.current = Date.now();
    const res = await fetchBondOptimalQuote({
      params: fetchParams,
      brokerIdList: currProductTypeTeamBrokerIdList,
      paramsChanged: isFilterParamsChanged,
      requestConfig: { ...config, signal }
    });
    fetchEndTime.current = Date.now();

    return res;
  };

  /** 是否允许 query 执行 */
  let queryEnabled = enabled;
  if (querySuspension) queryEnabled = false;

  const query = useQuery<BondOptimalQuoteFetchData>({
    queryKey,
    queryFn,
    enabled: queryEnabled,
    staleTime: config?.interval,
    cacheTime: config?.interval,
    refetchInterval: config?.interval,
    refetchIntervalInBackground: true,
    refetchOnReconnect: 'always',
    keepPreviousData: true,
    notifyOnChangeProps: ['data', 'refetch']
  });

  const logReMark = `${transformProductType(productType).en}-optimal-table-search`;
  useTimeConsumingLog({
    loggerEnabled,
    query,
    remark: logReMark,
    stringifyFetchParams,
    fetchStartTime: fetchStartTime.current,
    fetchEndTime: fetchEndTime.current
  });

  /** 操作 query data */
  const mutateQueryData = async (data: BondOptimalQuoteFetchData) => {
    await queryClient.cancelQueries(queryKey, { exact: true });
    const cache = queryClient.getQueryData(queryKey, { exact: true });

    try {
      // 乐观更新
      queryClient.setQueryData(queryKey, data);
    } catch {
      // 失败时回滚缓存内的内容
      queryClient.setQueryData(queryKey, cache);
      queryClient.invalidateQueries(queryKey);
    }
  };

  /** 乐观更新 */
  const optimisticUpdate = ({ action, targets, selectedSide }: OptimisticUpdateParams) => {
    if (!isOptimisticUpdateEnabled() || !isOnline) return;
    if (!targets) return;

    // 当存在对价，或者最优报价数量大于1条时不进行乐观更新
    if (isStringArray(targets)) {
      targets =
        query.data?.list
          ?.filter(item => {
            if (
              targets?.includes(
                selectedSide === Side.SideBid ? item.original.optimal_quote_id_bid : item.original.optimal_quote_id_ofr
              )
            ) {
              if (item.bidInfo.optimalQuote && item.ofrInfo.optimalQuote) {
                return false;
              }
              if (selectedSide === Side.SideBid) {
                return !item.bidInfo.otherQuoteList?.length && (item.bidInfo.optimalQuoteList?.length ?? 0) <= 1;
              }
              return !item.ofrInfo.otherQuoteList?.length && (item.ofrInfo.optimalQuoteList?.length ?? 0) <= 1;
            }
            return false;
          })
          .map(item =>
            selectedSide === Side.SideBid
              ? item.bidInfo.optimalQuote?.quote_id ?? ''
              : item.ofrInfo.optimalQuote?.quote_id ?? ''
          ) ?? [];
    }
    if (!targets.length) return;

    setQuerySuspension(true);

    switch (action) {
      case OptimisticUpdateAction.Delete: {
        const list =
          query.data?.list?.filter(
            item =>
              !targets?.includes(
                selectedSide === Side.SideBid ? item.original.optimal_quote_id_bid : item.original.optimal_quote_id_ofr
              )
          ) ?? [];
        const total = (query.data?.total ?? 0) - targets.length;

        if (list.length === 0) {
          onOptimisticDeleteAll?.({ action, targets, data: query.data });
        }
        mutateQueryData({ list, total });
        break;
      }
      default:
        break;
    }
  };

  const handleRefetch = useMemoizedFn(() => {
    setQuerySuspension(prev => {
      if (!prev) return prev;
      return false;
    });
    query.refetch();
  });

  return { ...query, handleRefetch, optimisticUpdate };
};
