import { ReceiptDeal } from '@fepkg/services/types/common';
import {
  ApprovalTableChildRowData,
  ApprovalTableParentRowData,
  ApprovalTableRowData
} from '@/pages/ApprovalList/types';

export const isBridgeParentData = (
  rowData: ApprovalTableParentRowData | ApprovalTableChildRowData
): rowData is ApprovalTableParentRowData => {
  return rowData.type === 'parent';
};

export const transform2ReceiptDealCache = (list: ApprovalTableRowData[] = []) => {
  const ids: string[] = [];
  const items: ReceiptDeal[] = [];

  for (const item of list ?? []) {
    if (isBridgeParentData(item)) {
      for (const child of item?.children ?? []) {
        const rowData = child as ApprovalTableChildRowData;
        ids.push(rowData.original.receipt_deal_id);
        items.push(rowData.original);
      }
    } else {
      ids.push(item.original.receipt_deal_id);
      items.push(item.original);
    }
  }

  return { ids, items };
};
