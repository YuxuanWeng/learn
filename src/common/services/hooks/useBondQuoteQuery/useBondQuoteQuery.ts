import { useMemo, useRef, useState } from 'react';
import { transformProductType } from '@fepkg/business/constants/map';
import { usePrevious } from '@fepkg/common/hooks';
import { isStringArray } from '@fepkg/common/utils';
import { QuoteUpdate } from '@fepkg/services/types/common';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryFunction } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash-es';
import { isOptimisticUpdateEnabled } from '@/common/ab-rules';
import { useIsOnline } from '@/common/atoms';
import { fetchBondQuote, transform2BasicTableColumn } from '@/common/services/api/bond-quote/search';
import { isQuoteUpdateArray } from '@/common/utils/quote';
import { logUndo } from '@/common/utils/undo';
import { LogFlowPhase } from '@/types/log';
import { BondQuoteFetchData, OptimisticUpdateAction, OptimisticUpdateParams, UseBondQuoteQuery } from './types';
import { useQuoteSubmitTimeConsumingLog } from './useQuoteSubmitTimeConsumingLog';
import { useShortcutTimeConsumingLog } from './useShortcutTimeConsumingLog';
import { useTimeConsumingLog } from './useTimeConsumingLog';
import { getBondQuoteQueryKey } from './utils';

const defaultConfig = { interval: 500 };

/** 获取基本报价信息 */
export const useBondQuoteQuery: UseBondQuoteQuery = ({
  productType,
  referred,
  filterParams,
  requestConfig,
  loggerEnabled,
  onOptimisticDeleteAll,
  enabled = true
}) => {
  const config = { ...defaultConfig, ...requestConfig };

  const queryClient = useQueryClient();
  const queryKey = getBondQuoteQueryKey(productType, referred, filterParams);
  /** query 是否暂停 */
  const [querySuspension, setQuerySuspension] = useState(false);

  const prevFilterParams = usePrevious(filterParams);
  const isFilterParamsChanged = useMemo(
    () => !isEqual(filterParams, prevFilterParams),
    [filterParams, prevFilterParams]
  );

  const fetchParams = useMemo(
    () => cloneDeep({ product_type: productType, is_referred: referred, ...filterParams }),
    [referred, filterParams, productType]
  );
  const fetchStartTime = useRef(-1);
  const fetchEndTime = useRef(-1);
  const stringifyFetchParams = JSON.stringify(fetchParams);
  const isOnline = useIsOnline();

  const queryFn: QueryFunction<BondQuoteFetchData> = async ({ signal }) => {
    fetchStartTime.current = Date.now();
    const res = await fetchBondQuote({
      params: fetchParams,
      paramsChanged: isFilterParamsChanged,
      requestConfig: { ...config, signal }
    });
    fetchEndTime.current = Date.now();
    return res;
  };

  /** 是否允许 query 执行 */
  let queryEnabled = enabled;
  if (querySuspension) queryEnabled = false;

  const query = useQuery<BondQuoteFetchData, unknown, BondQuoteFetchData>({
    queryKey,
    queryFn,
    enabled: queryEnabled,
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

  const logReMark = `${transformProductType(productType).en}-${referred ? 'referred' : 'basic'}-table-search`;
  useTimeConsumingLog({
    loggerEnabled,
    query,
    remark: logReMark,
    stringifyFetchParams,
    fetchStartTime: fetchStartTime.current,
    fetchEndTime: fetchEndTime.current
  });
  useQuoteSubmitTimeConsumingLog({
    query,
    offset: fetchParams.offset,
    fetchStartTime: fetchStartTime.current,
    fetchEndTime: fetchEndTime.current
  });
  useShortcutTimeConsumingLog({
    query,
    offset: fetchParams.offset,
    fetchStartTime: fetchStartTime.current,
    fetchEndTime: fetchEndTime.current
  });

  /** 操作 query data */
  const mutateQueryData = async (data: BondQuoteFetchData) => {
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
  const optimisticUpdate = ({ action, targets }: OptimisticUpdateParams) => {
    if (!isOptimisticUpdateEnabled() || !isOnline) return;
    if (!targets) return;

    setQuerySuspension(true);

    switch (action) {
      case OptimisticUpdateAction.Delete:
        if (isStringArray(targets)) {
          const list = query.data?.list?.filter(item => !targets.includes(item.original.quote_id)) ?? [];
          const total = (query.data?.total ?? 0) - targets.length;

          if (list.length === 0) {
            onOptimisticDeleteAll?.({ action, targets, data: query.data });
          }
          mutateQueryData({ list, total });
        }
        break;
      case OptimisticUpdateAction.Modify:
        if (isQuoteUpdateArray(targets)) {
          const modifyingTargetsMap = new Map<string, QuoteUpdate>(targets.map(item => [item.quote_id, item]));

          const total = query.data?.total;
          const list =
            query.data?.list?.map(item => {
              if (modifyingTargetsMap.has(item.original.quote_id)) {
                const target = { ...item.original, ...modifyingTargetsMap.get(item.original.quote_id) };
                return transform2BasicTableColumn(target);
              }
              return item;
            }) ?? [];
          mutateQueryData({ list, total });
        }
        break;
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
