import { useMemo, useRef, useState } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import type { QueryFunction } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash-es';
import { fetchReceiptDeal } from '@/common/services/api/receipt-deal/search';
import { logUndo } from '@/common/utils/undo';
import { useReceiptDealPanelLoader } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/preload';
import { LogFlowPhase } from '@/types/log';
import { ReceiptDealFetchData, UseReceiptDealQueryParams, UseReceiptDealQueryResult } from './types';
import { getReceiptDealQueryKey } from './utils';

const defaultConfig = { interval: 500 };

/** 获取市场成交信息 */
export const useReceiptDealQuery = ({
  productType,
  filterParams,
  requestConfig,
  loggerEnabled,
  grantUserIdList
}: UseReceiptDealQueryParams): UseReceiptDealQueryResult => {
  const { isOnOrBeforeFirstWorkdayOfMonth } = useReceiptDealPanelLoader();

  const config = { ...defaultConfig, ...requestConfig };

  const queryClient = useQueryClient();
  const queryKey = getReceiptDealQueryKey(productType, filterParams);
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

  const queryFn: QueryFunction<ReceiptDealFetchData> = async ({ signal }) => {
    fetchStartTime.current = Date.now();
    const res = await fetchReceiptDeal({
      params: fetchParams,
      paramsChanged: isFilterParamsChanged,
      requestConfig: { ...config, signal },
      grantUserIdList,
      isOnOrBeforeFirstWorkdayOfMonth
    });
    fetchEndTime.current = Date.now();
    return res;
  };

  const query = useQuery<ReceiptDealFetchData, unknown, ReceiptDealFetchData>({
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
