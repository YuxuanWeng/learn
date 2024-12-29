import { useEffect } from 'react';
import { MetricsType } from '@fepkg/metrics';
import { UseQueryResult } from '@tanstack/react-query';
import { metrics } from '@/common/utils/metrics';
import { BondQuoteFetchData } from './types';

export type UseShortcutTimeConsumingLogParams = {
  loggerEnabled?: boolean;
  query: UseQueryResult<BondQuoteFetchData>;
  fetchStartTime: number;
  fetchEndTime: number;
  offset: number;
};

// 右侧快捷栏快捷操作日志中存放到localStorage中的几个参数的key
export const shortcutLogClickTime = 'shortcut-log-click-time';
export const shortcutLogKey = 'shortcut-log-key';
export const shortcutLogType = 'shortcut-log-type';

/**
 * 清除右侧快捷栏快捷操作日志时暂存在localStorage中的数据
 */
export const clearTmpData = () => {
  localStorage.removeItem(shortcutLogClickTime);
  localStorage.removeItem(shortcutLogKey);
  localStorage.removeItem(shortcutLogType);
};

export const useShortcutTimeConsumingLog = ({
  query,
  fetchStartTime,
  fetchEndTime,
  offset
}: UseShortcutTimeConsumingLogParams) => {
  useEffect(() => {
    const quoteLogKey = localStorage.getItem(shortcutLogKey);
    const shortcutClickTime = Number(localStorage.getItem(shortcutLogClickTime));
    const quoteId = localStorage.getItem(shortcutLogKey);

    if (quoteLogKey && fetchStartTime > shortcutClickTime && offset === 0 && query.data && !query.isPreviousData) {
      const quote = query.data.list?.find(item => item.original.quote_id === quoteId);
      if (Number(quote?.original.update_time) > shortcutClickTime) {
        const remark = localStorage.getItem(shortcutLogType) ?? 'useShortcutTimeConsumingLog';
        const duration = Math.abs(fetchEndTime - fetchStartTime);
        metrics.timer(remark, duration, {
          type: MetricsType.ShortcutTimeConsuming,
          fetchStartTime,
          fetchEndTime,
          logTime: Date.now(),
          total: query.data?.total,
          time: shortcutClickTime,
          remark
        });

        clearTmpData();
      }
    }
    if (offset > 0) {
      clearTmpData();
    }
  }, [query.data, query.isPreviousData, fetchStartTime, fetchEndTime, offset]);
};
