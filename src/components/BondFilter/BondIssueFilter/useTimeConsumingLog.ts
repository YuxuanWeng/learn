import { useEffect, useRef } from 'react';
import { MetricsType } from '@fepkg/metrics';
import { metrics } from '@/common/utils/metrics';

export type UseTimeConsumingLogParams = {
  loggerEnabled?: boolean;
  remark: string;
  keyword: string;
  fetching: boolean;
  total?: number;
};

export const useTimeConsumingLog = ({ loggerEnabled, remark, keyword, fetching, total }: UseTimeConsumingLogParams) => {
  const keywordUpdatedTime = useRef(-1);

  useEffect(() => {
    if (keyword) keywordUpdatedTime.current = Date.now();
  }, [keyword]);

  useEffect(() => {
    if (loggerEnabled && !fetching && keyword && total != undefined) {
      setTimeout(() => {
        metrics.timer(remark, keywordUpdatedTime.current, {
          keyword,
          remark,
          keywordUpdatedTime: keywordUpdatedTime.current,
          logTime: Date.now(),
          type: MetricsType.FuzzyQueryTimeConsuming,
          total
        });
      });
    }
  }, [loggerEnabled, fetching, keyword, remark, total]);
};
