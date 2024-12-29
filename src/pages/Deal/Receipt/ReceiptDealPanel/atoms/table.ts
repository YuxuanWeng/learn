import { PopoverPosition } from '@fepkg/common/types';
import { TableSorter } from '@fepkg/components/Table/types';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { ProductType, ReceiptDealSortedField } from '@fepkg/services/types/enum';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import {
  DEFAULT_RECEIPT_DEAL_INPUT_FILTER_VALUE,
  DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE
} from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import { getDefaultReceiptDealTableColumnSettings } from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/table';

export const BNCReceiptDealTableSettingsAtom = atomWithReset(getDefaultReceiptDealTableColumnSettings(ProductType.BNC));

export const BCOReceiptDealTableSettingsAtom = atomWithReset(getDefaultReceiptDealTableColumnSettings(ProductType.BCO));

export const NCDReceiptDealTableSettingsAtom = atomWithReset(getDefaultReceiptDealTableColumnSettings(ProductType.NCD));

export const getTableSettingsAtom = (productType: ProductType) => {
  switch (productType) {
    case ProductType.BCO:
      return BCOReceiptDealTableSettingsAtom;
    case ProductType.BNC:
      return BNCReceiptDealTableSettingsAtom;
    case ProductType.NCD:
      return NCDReceiptDealTableSettingsAtom;
    default:
      return BNCReceiptDealTableSettingsAtom;
  }
};

// 表格 relatedFilterValue 相关状态
export const receiptDealTableDealRelatedFilterValueAtom = atomWithReset(DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE);

// 表格 inputFilterValue 相关状态
export const receiptDealTableDealInputFilterValueAtom = atomWithReset(DEFAULT_RECEIPT_DEAL_INPUT_FILTER_VALUE);

// 表格 page 相关状态
export const receiptDealTablePageAtom = atomWithReset(1);

// 表格 sorter 相关状态
// TODO QuoteSortedField错误
export const receiptDealTableSorterAtom = atomWithReset<TableSorter<ReceiptDealSortedField> | undefined>(undefined);

// 表格 selectedRowKeys 相关状态
export const receiptDealTableSelectedRowKeysAtom = atomWithReset(new Set<string>());

// 表格 columnSettingsMdlOpen 相关状态
export const receiptDealTableColumnSettingsMdlOpenAtom = atom(false);

// 成交单全局搜索缓存正在搜索的债券
export const receiptDealTableSearchingBondAtom = atomWithReset<FiccBondBasic | undefined>(void 0);

// 表格右键菜单相关状态
export const receiptDealTableCtxMenuOpenAtom = atom(false);
export const receiptDealTableCtxMenuPositionAtom = atom<PopoverPosition>({ x: 0, y: 0 });
