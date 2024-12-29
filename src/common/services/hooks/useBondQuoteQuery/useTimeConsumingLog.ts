import { useEffect, useRef } from 'react';
import { MetricsType } from '@fepkg/metrics';
import { UseQueryResult } from '@tanstack/react-query';
import { metrics } from '@/common/utils/metrics';
import type { BondOptimalQuoteFetchData } from '../useBondOptimalQuoteQuery';
import { BondQuoteFetchData } from './types';

export type UseTimeConsumingLogParams = {
  loggerEnabled?: boolean;
  query: UseQueryResult<BondQuoteFetchData | BondOptimalQuoteFetchData>;
  remark: string;
  stringifyFetchParams: string;
  fetchStartTime: number;
  fetchEndTime: number;
};

export const useTimeConsumingLog = ({
  loggerEnabled,
  query,
  remark,
  stringifyFetchParams,
  fetchStartTime,
  fetchEndTime
}: UseTimeConsumingLogParams) => {
  const stringifyFetchParamsCache = useRef(new Map<string, string>());

  useEffect(() => {
    /** 当前 fetch 参数是否有对应的 query 缓存 */
    const hasFetchParamsCache = stringifyFetchParams && !stringifyFetchParamsCache.current.has(stringifyFetchParams);

    if (loggerEnabled && query.data && !query.isPreviousData && hasFetchParamsCache) {
      setTimeout(() => {
        const duration = Math.abs(fetchEndTime - fetchStartTime);
        metrics.timer(remark, duration, {
          remark,
          type: MetricsType.TableQueryTimeConsuming,
          keyword: stringifyFetchParams,
          fetchStartTime,
          fetchEndTime,
          logTime: Date.now(),
          total: query.data?.total
        });

        stringifyFetchParamsCache.current.set(stringifyFetchParams, stringifyFetchParams);
      });
    }
  }, [loggerEnabled, query.data, query.isPreviousData, remark, stringifyFetchParams, fetchStartTime, fetchEndTime]);
};
