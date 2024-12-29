import { useMemo } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { cloneDeep, omit } from 'lodash-es';
import { fetchApprovalHistoryCheckUpdate } from '@/common/services/api/approval/history-check-update';
import { ApprovalListType } from '@/pages/ApprovalList/types';
import { CheckUpdateResult, UseReceiptDealApprovalQueryParams } from './types';
import { getReceiptDealApprovalHistoryCheckUpdateQueryKey } from './utils';

const defaultConfig = { interval: 500 };

export const useHistoryCheckUpdate = ({
  filterParams,
  requestConfig,
  type,
  startTimestamp,
  pause,
  onSuccess
}: UseReceiptDealApprovalQueryParams & {
  startTimestamp: string;
  pause?: boolean;
  onSuccess?: (data: CheckUpdateResult) => void;
}) => {
  const { user } = useAuth();
  const config = { ...defaultConfig, ...requestConfig };

  const queryKey = getReceiptDealApprovalHistoryCheckUpdateQueryKey(
    {
      ...omit(filterParams, ['count', 'offset']),
      start_timestamp: startTimestamp
    },
    type
  );

  const fetchParams = useMemo(
    () =>
      cloneDeep({
        ...omit(filterParams, ['count', 'offset']),
        start_timestamp: startTimestamp
      }),
    [startTimestamp, filterParams]
  );

  const queryFn: QueryFunction<CheckUpdateResult> = async ({ signal }) => {
    const result = await fetchApprovalHistoryCheckUpdate({
      params: fetchParams,
      requestConfig: { ...config, signal }
    });
    return result;
  };

  const query = useQuery<CheckUpdateResult>({
    queryKey,
    queryFn,
    enabled: !!user?.user_id && type !== ApprovalListType.Approval && !!startTimestamp && !pause,
    staleTime: config?.interval,
    refetchInterval: type === ApprovalListType.Approval ? Infinity : config?.interval,
    refetchIntervalInBackground: true,
    refetchOnReconnect: 'always',
    keepPreviousData: true,
    notifyOnChangeProps: ['data', 'refetch'],
    onSuccess
  });

  return query;
};
