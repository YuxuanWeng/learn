import { useEffect } from 'react';
import { MetricsType } from '@fepkg/metrics';
import { UseQueryResult } from '@tanstack/react-query';
import sha1 from 'crypto-js/sha1';
import { metrics } from '@/common/utils/metrics';
import type { BondOptimalQuoteFetchData } from '../useBondOptimalQuoteQuery';
import { BondQuoteFetchData } from './types';

export type UseQuoteSubmitTimeConsumingLogParams = {
  query: UseQueryResult<BondQuoteFetchData | BondOptimalQuoteFetchData>;
  fetchStartTime: number;
  fetchEndTime: number;
  offset: number;
};

// 报价提交日志中存放到localStorage中的几个参数的key
export const quoteSubmitLogCheckTime = 'quote-submit-log-check-time';
export const quoteSubmitLogSubmitTime = 'quote-submit-log-submit-time';
export const quoteSubmitLogCloseTime = 'quote-submit-log-close-time';
export const quoteSubmitLogKey = 'quote-submit-log-key';
export const quoteSubmitLogType = 'quote-submit-log-type';

/**
 * 清除报价提交日志时暂存在localStorage中的数据
 */
export const clearTmpData = () => {
  localStorage.removeItem(quoteSubmitLogCheckTime);
  localStorage.removeItem(quoteSubmitLogSubmitTime);
  localStorage.removeItem(quoteSubmitLogCloseTime);
  localStorage.removeItem(quoteSubmitLogKey);
  localStorage.removeItem(quoteSubmitLogType);
};

export const useQuoteSubmitTimeConsumingLog = ({
  query,
  fetchStartTime,
  fetchEndTime,
  offset
}: UseQuoteSubmitTimeConsumingLogParams) => {
  useEffect(() => {
    const quoteLogKey = localStorage.getItem(quoteSubmitLogKey);
    const quoteDialogCloseTime = Number(localStorage.getItem(quoteSubmitLogCloseTime));
    if (quoteLogKey && fetchStartTime > quoteDialogCloseTime && offset === 0 && query.data && !query.isPreviousData) {
      const flag = query.data.list?.some(item => {
        const { original } = item;
        return (
          sha1(
            `${original.bond_id}${original.side}${original.flag_internal}${original.broker_id}${original.trader_id}`
          ).toString() === quoteLogKey
        );
      });
      if (flag) {
        const duration = Math.abs(fetchEndTime - fetchStartTime);
        metrics.timer('useQuoteSubmitTimeConsumingLog', duration, {
          type: MetricsType.QuoteSubmitTimeConsuming,
          fetchStartTime,
          fetchEndTime,
          logTime: Date.now(),
          total: query.data?.total,
          time: localStorage.getItem(quoteSubmitLogCheckTime),
          time1: localStorage.getItem(quoteSubmitLogSubmitTime),
          time2: quoteDialogCloseTime,
          remark: localStorage.getItem(quoteSubmitLogType)
        });

        clearTmpData();
      }
    }
    if (offset > 0) {
      clearTmpData();
    }
  }, [query.data, query.isPreviousData, fetchStartTime, fetchEndTime, offset]);
};
