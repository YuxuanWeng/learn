import { useMemo, useRef, useState } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryFunction } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isEqual } from 'lodash-es';
import { fetchNCDPInfo } from '../../api/bond-quote/ncdp-search';
import { NCDPInfoFetchData, UseNCDPInfoQuery } from './types';
import { getNCDPInfoQueryKey } from './utils';

const defaultConfig = { interval: 500 };

/** 获取存单一级列表信息 */
export const useNCDPInfoQuery: UseNCDPInfoQuery = ({
  productType,
  referred,
  filterParams,
  requestConfig,
  loggerEnabled,
  enabled = true
}) => {
  const config = { ...defaultConfig, ...requestConfig };

  const queryClient = useQueryClient();
  const queryKey = getNCDPInfoQueryKey(productType, referred, filterParams);
  /** query 是否暂停 */
  const [querySuspension, setQuerySuspension] = useState(false);

  const prevFilterParams = usePrevious(filterParams);
  const isFilterParamsChanged = useMemo(
    () => !isEqual(filterParams, prevFilterParams),
    [filterParams, prevFilterParams]
  );

  const fetchParams = useMemo(
    () => cloneDeep({ product_type: productType, is_deleted: referred, ...filterParams }),
    [referred, filterParams, productType]
  );
  const fetchStartTime = useRef(-1);
  const fetchEndTime = useRef(-1);

  const queryFn: QueryFunction<NCDPInfoFetchData> = async ({ signal }) => {
    fetchStartTime.current = Date.now();
    const res = await fetchNCDPInfo({
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

  const query = useQuery<NCDPInfoFetchData, unknown, NCDPInfoFetchData>({
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

  const handleRefetch = useMemoizedFn(async () => {
    setQuerySuspension(true);
    await queryClient.cancelQueries({ queryKey });
    await query.refetch();
    setQuerySuspension(false);
  });

  return { ...query, handleRefetch };
};
