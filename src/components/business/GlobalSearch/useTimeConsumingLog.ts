import { useEffect, useRef } from 'react';
import { transformProductType } from '@fepkg/business/constants/map';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { MetricsType } from '@fepkg/metrics';
import { metrics } from '@/common/utils/metrics';
import { useSearchProps } from '@/components/business/GlobalSearch/SearchPropsProvider';
import { useFuzzySearchQuery } from '@/components/business/GlobalSearch/useFuzzySearchQuery';
import { useInput } from './InputProvider';

export const useTimeConsumingLog = () => {
  const { open } = useFloat();
  const { productType } = useSearchProps();
  const { searchValue } = useInput();
  const { data, isFetching } = useFuzzySearchQuery(searchValue);
  const keywordUpdatedTime = useRef(-1);

  const remark = `${transformProductType(productType).en}-global-search`;

  useEffect(() => {
    if (searchValue && open) keywordUpdatedTime.current = Date.now();
  }, [searchValue, open, remark]);
  useEffect(() => {
    if (!isFetching && data && open && keywordUpdatedTime.current > 0) {
      metrics.timer(remark, keywordUpdatedTime.current, {
        remark,
        type: MetricsType.FuzzyQueryTimeConsuming,
        keyword: searchValue,
        keywordUpdatedTime: keywordUpdatedTime.current,
        logTime: Date.now(),
        total: data.options.length
      });

      keywordUpdatedTime.current = -1;
    }
  }, [isFetching, data, open, remark, searchValue]);
};
