import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import { DEFAULT_QUOTE_FILTER_VALUE, DEFAULT_REFERRED_QUOTE_FILTER_VALUE } from '@/common/constants/filter';
import {
  basicTableQuoteFilterValueAtom,
  bondTableQuoteFilterValueAtom,
  dealTableQuoteFilterValueAtom,
  optimalTableQuoteFilterValueAtom,
  referredTableQuoteFilterValueAtom
} from '../atoms/table';
import { getTableCache } from '../providers/MainGroupProvider/storage';
import { useProductPanel } from '../providers/PanelProvider';
import { ProductPanelTableKey } from '../types';

export const useResetTableQuoteFilter = () => {
  const { groupStoreKey } = useProductPanel();

  const setBasicTableQuoteFilter = useSetAtom(basicTableQuoteFilterValueAtom);
  const setBondTableQuoteFilter = useSetAtom(bondTableQuoteFilterValueAtom);
  const setOptimalTableQuoteFilter = useSetAtom(optimalTableQuoteFilterValueAtom);
  const setDealTableQuoteFilter = useSetAtom(dealTableQuoteFilterValueAtom);
  const setReferredTableQuoteFilter = useSetAtom(referredTableQuoteFilterValueAtom);

  const reset = useMemoizedFn(async (groupId?: string) => {
    const { tableCache } = await getTableCache(groupStoreKey, groupId);

    let filter = tableCache?.tableParamsCache?.get(ProductPanelTableKey.Basic)?.quoteFilterValue;
    setBasicTableQuoteFilter(filter ?? DEFAULT_QUOTE_FILTER_VALUE);

    filter = tableCache?.tableParamsCache?.get(ProductPanelTableKey.Optimal)?.quoteFilterValue;
    setOptimalTableQuoteFilter(filter ?? DEFAULT_QUOTE_FILTER_VALUE);

    filter = tableCache?.tableParamsCache?.get(ProductPanelTableKey.Bond)?.quoteFilterValue;
    setBondTableQuoteFilter(filter ?? DEFAULT_QUOTE_FILTER_VALUE);

    filter = tableCache?.tableParamsCache?.get(ProductPanelTableKey.Deal)?.quoteFilterValue;
    setDealTableQuoteFilter(filter ?? DEFAULT_QUOTE_FILTER_VALUE);

    filter = tableCache?.tableParamsCache?.get(ProductPanelTableKey.Referred)?.quoteFilterValue;
    setReferredTableQuoteFilter(filter ?? DEFAULT_REFERRED_QUOTE_FILTER_VALUE);
  });

  return reset;
};
