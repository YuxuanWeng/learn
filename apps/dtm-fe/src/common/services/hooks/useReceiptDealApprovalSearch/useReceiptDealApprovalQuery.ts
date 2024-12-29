import { useMemo, useRef, useState } from 'react';
import { fetchCurrentTimestamp } from '@fepkg/services/api/base/current-timestamp';
import { useAuth } from '@/providers/AuthProvider';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import { cloneDeep, omit } from 'lodash-es';
import {
  ReceiptDealApprovalFetchData,
  fetchReceiptDealApproval,
  fetchReceiptDealApprovalHistory
} from '@/common/services/api/approval/search';
import { approvalListTableNeedUpdate } from '@/pages/ApprovalList/atoms';
import { ApprovalListType } from '@/pages/ApprovalList/types';
import { UseReceiptDealApprovalQuery } from './types';
import { getReceiptDealApprovalQueryKey } from './utils';

const defaultConfig = { interval: 500 };

/** 获取市场成交信息 */
export const useReceiptDealApprovalQuery: UseReceiptDealApprovalQuery = ({
  filterParams,
  isFilterParamsChanged,
  requestConfig,
  loggerEnabled,
  type
}) => {
  const { user } = useAuth();

  const config = { ...defaultConfig, ...requestConfig };

  const queryClient = useQueryClient();
  const queryKey = getReceiptDealApprovalQueryKey(filterParams, type);
  /** query 是否暂停 */
  const [querySuspension, setQuerySuspension] = useState(false);
  const setNeedUpdate = useSetAtom(approvalListTableNeedUpdate);

  const fetchParams = useMemo(() => cloneDeep(filterParams), [filterParams]);
  const fetchStartTime = useRef(-1);
  const fetchEndTime = useRef(-1);

  const queryFn: QueryFunction<ReceiptDealApprovalFetchData> = async ({ signal }) => {
    fetchStartTime.current = Date.now();
    let res: ReceiptDealApprovalFetchData;
    if (type === ApprovalListType.Approval) {
      res = await fetchReceiptDealApproval({
        params: fetchParams,
        paramsChanged: isFilterParamsChanged,
        requestConfig: { ...omit(config, 'interval'), signal },
        userId: user?.user_id
      });
    } else {
      const { current_timestamp } = await fetchCurrentTimestamp();
      res = await fetchReceiptDealApprovalHistory({
        params: fetchParams,
        paramsChanged: isFilterParamsChanged,
        requestConfig: { ...omit(config, 'interval'), signal }
      });
      res.current_version = current_timestamp;
    }
    fetchEndTime.current = Date.now();
    return res;
  };

  const query = useQuery<ReceiptDealApprovalFetchData, unknown, ReceiptDealApprovalFetchData>({
    queryKey,
    queryFn,
    enabled: !querySuspension && !!user?.user_id,
    cacheTime: config?.interval,
    staleTime: config?.interval,
    refetchInterval: type === ApprovalListType.Approval ? config?.interval : Infinity,
    refetchIntervalInBackground: true,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    // isFetching 仅在 历史记录页才需要持续关注最新状态
    notifyOnChangeProps: type === ApprovalListType.Approval ? ['data', 'refetch'] : ['data', 'refetch', 'isFetching'],
    onSuccess: () => {
      setNeedUpdate(false);
    }
  });

  const handleRefetch = useMemoizedFn(async () => {
    setQuerySuspension(true);
    await queryClient.cancelQueries({ queryKey });
    const data = await query.refetch();
    setQuerySuspension(false);
    return data;
  });

  return { ...query, handleRefetch };
};
