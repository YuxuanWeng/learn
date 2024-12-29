import { useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue } from 'jotai';
import { createContainer } from 'unstated-next';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { receiptDealTableSelectedRowKeysAtom } from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import { useReceiptDealTableData } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/useTableData';
import { getReceiptDealPanelStoreKey } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/storage';
import { ReceiptDealChildRowData, ReceiptDealRowData } from '../../components/ReceiptDealTable/types';
import { isBridgeParentData } from '../../components/ReceiptDealTable/utils';

export const ReceiptDealPanelContainer = createContainer(() => {
  const { productType } = useProductParams();
  const selectedRowKeys = useAtomValue(receiptDealTableSelectedRowKeysAtom);
  const panelStoreKey = getReceiptDealPanelStoreKey(productType, miscStorage.userInfo?.user_id);

  const { data, prefetch, handleRefetch } = useReceiptDealTableData(true);

  const selectedList = useMemo(() => {
    const result: ReceiptDealRowData[] = [];
    for (const item of data?.list ?? []) {
      if (isBridgeParentData(item)) {
        for (const x of item.children ?? []) {
          if (selectedRowKeys.has(x.id)) {
            result.push(x);
          }
        }
      } else if (selectedRowKeys.has(item.original.receipt_deal_id)) {
        result.push(item);
      }
    }
    return result as unknown as ReceiptDealChildRowData[];
  }, [data?.list, selectedRowKeys]);

  /** 仅作查询selectedList中的桥相关成交单使用 */
  const getReceiptDealByParent = useMemoizedFn((parentDealIdList?: string[]) => {
    if (!parentDealIdList?.length) return [];
    return data?.flatList?.filter(item => item.parent_deal_id && parentDealIdList.includes(item.parent_deal_id)) ?? [];
  });

  return {
    panelStoreKey,
    selectedList,
    data,
    prefetch,
    handleRefetch,
    getReceiptDealByParent
  };
});

export const ReceiptDealPanelProvider = ReceiptDealPanelContainer.Provider;
export const useReceiptDealPanel = ReceiptDealPanelContainer.useContainer;
