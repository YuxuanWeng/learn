import { useCallback } from 'react';
import { useVirtual } from 'react-virtual';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { useProductParams } from '@/layouts/Home/hooks';
import { transformReceiptDeal2DiffType } from '@/pages/Deal/Detail/utils';
import { useFilter } from '../SearchFilter/providers/FilterStateProvider';
import { DealContainerData } from '../type';

const VirtualListContainer = createContainer(() => {
  const { productType } = useProductParams();
  const { virtualList, parentRef, getPreferenceValue } = useFilter();

  // 虚拟列表行高度计算逻辑
  const estimateSize = useCallback(
    (index: number) => {
      const data = virtualList[index];
      if (data.isClosed) return 0;

      if (data.category === 'brokerHead') {
        // 第一组的高度需要小些，方便设置顶部间距
        if (index === 0) return 48;
        return 56;
      }

      if (data.category === 'groupHead') {
        return 48;
      }

      if (data.category === 'otherTitle') {
        // return 32;
        return 40;
      }

      if (data.category === 'deals') {
        return data.isLast ? 40 : 32;
      }

      const showConfig = getPreferenceValue(data.groupId);

      // 汇总区高度
      if (
        data.category === 'groupFooter' &&
        showConfig.showSum &&
        ((!data.isHistory && data.deals.length) || (data.isHistory && data.historyDeals.length))
      ) {
        let targetDeals = data.deals ?? [];
        if (data.isHistory) {
          targetDeals = data.historyDeals ?? [];
        }
        const keyMarkets: string[] = [];
        for (const item of targetDeals) {
          if (!keyMarkets.includes(item.parent_deal.bond_basic_info?.key_market ?? '')) {
            keyMarkets.push(item.parent_deal.bond_basic_info?.key_market ?? '');
          }
        }
        let sumLength = keyMarkets.length * 28 + 13;
        if (data.isLast) sumLength += 7;
        if (data.isLastGroup) sumLength += 2;
        return sumLength;
      }

      return 0;
    },
    [getPreferenceValue, virtualList]
  );

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: virtualList?.length ?? 0,
    parentRef,
    estimateSize,
    scrollToFn: (index, defaultScrollToFn) => {
      defaultScrollToFn?.(index);
    },
    overscan: 20
  });

  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start ?? 0 : 0;
  const paddingBottom = virtualItems.length > 0 ? totalSize - (virtualItems.at(-1)?.end ?? 0) : 0;

  const memoizedFnTransform = useMemoizedFn((data: DealContainerData[]): DealContainerData[] => {
    return data.map(v => {
      if (v.category !== 'deals') return v;
      return {
        ...v,
        ...transformReceiptDeal2DiffType(productType, v)
      } as DealContainerData;
    });
  });

  return {
    virtualItems,
    scrollToIndex,
    virtualList: memoizedFnTransform(virtualList),
    paddingTop,
    paddingBottom
  };
});

export const VirtualListProvider = VirtualListContainer.Provider;
export const useVirtualData = VirtualListContainer.useContainer;
