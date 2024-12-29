import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import {
  basicTableSorterAtom,
  bondTableSorterAtom,
  dealTableSorterAtom,
  optimalTableSorterAtom,
  referredTableSorterAtom
} from '@/pages/ProductPanel/atoms/table';
import { getTableCache, updateTableParamsCache } from '../providers/MainGroupProvider/storage';
import { useProductPanel } from '../providers/PanelProvider';
import { ProductPanelTableKey, ProductPanelTableKeys } from '../types';

export const useResetTableSorter = () => {
  const { groupStoreKey } = useProductPanel();

  const setBasicTableSorter = useSetAtom(basicTableSorterAtom);
  const setOptimalTableSorter = useSetAtom(optimalTableSorterAtom);
  const setBondTableSorter = useSetAtom(bondTableSorterAtom);
  const setDealTableSorter = useSetAtom(dealTableSorterAtom);
  const setReferredTableSorter = useSetAtom(referredTableSorterAtom);

  const reset = useMemoizedFn(async (groupId?: string, fromCache?: boolean) => {
    if (fromCache) {
      const { tableCache } = await getTableCache(groupStoreKey, groupId);

      if (tableCache?.tableParamsCache) {
        let sorter = tableCache.tableParamsCache.get(ProductPanelTableKey.Basic)?.tableSorter;
        setBasicTableSorter(sorter);

        sorter = tableCache.tableParamsCache.get(ProductPanelTableKey.Optimal)?.tableSorter;
        setOptimalTableSorter(sorter);

        sorter = tableCache.tableParamsCache.get(ProductPanelTableKey.Bond)?.tableSorter;
        setBondTableSorter(sorter);

        sorter = tableCache.tableParamsCache.get(ProductPanelTableKey.Deal)?.tableSorter;
        setDealTableSorter(sorter);

        sorter = tableCache.tableParamsCache.get(ProductPanelTableKey.Referred)?.tableSorter;
        setReferredTableSorter(sorter);

        return;
      }
    }

    setBasicTableSorter(undefined);
    setOptimalTableSorter(undefined);
    setBondTableSorter(undefined);
    setDealTableSorter(undefined);
    setReferredTableSorter(undefined);

    if (groupId) {
      updateTableParamsCache({
        storeKey: groupStoreKey,
        groupId,
        tableKeys: ProductPanelTableKeys,
        type: 'tableSorter',
        value: undefined
      });
    }
  });

  return reset;
};
