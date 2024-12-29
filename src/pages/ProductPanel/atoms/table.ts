import { PopoverPosition } from '@fepkg/common/types';
import { TableSorter } from '@fepkg/components/Table/types';
import { ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import {
  DEFAULT_MARKET_DEAL_FILTER_VALUE,
  DEFAULT_QUOTE_FILTER_VALUE,
  DEFAULT_REFERRED_QUOTE_FILTER_VALUE
} from '@/common/constants/filter';
import {
  BCO_DEFAULT_BASIC_TABLE_COLUMN,
  BCO_DEFAULT_DEAL_TABLE_COLUMN,
  BCO_DEFAULT_OPTIMAL_TABLE_COLUMN,
  BCO_DEFAULT_REFERRED_TABLE_COLUMN,
  BNC_DEFAULT_BASIC_TABLE_COLUMN,
  BNC_DEFAULT_DEAL_TABLE_COLUMN,
  BNC_DEFAULT_OPTIMAL_TABLE_COLUMN,
  BNC_DEFAULT_REFERRED_TABLE_COLUMN,
  NCDP_DEFAULT_TABLE_COLUMN,
  NCD_DEFAULT_BASIC_TABLE_COLUMN,
  NCD_DEFAULT_DEAL_TABLE_COLUMN,
  NCD_DEFAULT_OPTIMAL_TABLE_COLUMN,
  NCD_DEFAULT_REFERRED_TABLE_COLUMN
} from '@/common/constants/table';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '../types';

// 表格设置项相关状态
export const defaultTableSettingsAtom = atomWithReset<BondQuoteTableColumnSettingItem[]>([]);

export const bcoBasicTableSettingsAtom = atomWithReset(BCO_DEFAULT_BASIC_TABLE_COLUMN);
export const bcoOptimalTableSettingsAtom = atomWithReset(BCO_DEFAULT_OPTIMAL_TABLE_COLUMN);
export const bcoBondTableSettingsAtom = atomWithReset(BCO_DEFAULT_OPTIMAL_TABLE_COLUMN);
export const bcoDealTableSettingsAtom = atomWithReset(BCO_DEFAULT_DEAL_TABLE_COLUMN);
export const bcoReferredTableSettingsAtom = atomWithReset(BCO_DEFAULT_REFERRED_TABLE_COLUMN);

export const bncBasicTableSettingsAtom = atomWithReset(BNC_DEFAULT_BASIC_TABLE_COLUMN);
export const bncOptimalTableSettingsAtom = atomWithReset(BNC_DEFAULT_OPTIMAL_TABLE_COLUMN);
export const bncBondTableSettingsAtom = atomWithReset(BNC_DEFAULT_OPTIMAL_TABLE_COLUMN);
export const bncDealTableSettingsAtom = atomWithReset(BNC_DEFAULT_DEAL_TABLE_COLUMN);
export const bncReferredTableSettingsAtom = atomWithReset(BNC_DEFAULT_REFERRED_TABLE_COLUMN);

export const ncdpBasicTableSettingsAtom = atomWithReset(NCDP_DEFAULT_TABLE_COLUMN);
export const ncdpReferredTableSettingsAtom = atomWithReset(NCDP_DEFAULT_TABLE_COLUMN);

export const ncdBasicTableSettingsAtom = atomWithReset(NCD_DEFAULT_BASIC_TABLE_COLUMN);
export const ncdOptimalTableSettingsAtom = atomWithReset(NCD_DEFAULT_OPTIMAL_TABLE_COLUMN);
export const ncdBondTableSettingsAtom = atomWithReset(NCD_DEFAULT_OPTIMAL_TABLE_COLUMN);
export const ncdDealTableSettingsAtom = atomWithReset(NCD_DEFAULT_DEAL_TABLE_COLUMN);
export const ncdReferredTableSettingsAtom = atomWithReset(NCD_DEFAULT_REFERRED_TABLE_COLUMN);

export const getTableSettingsAtom = (productType: ProductType, tableKey: ProductPanelTableKey) => {
  switch (productType) {
    case ProductType.BCO:
      if (tableKey === ProductPanelTableKey.Basic) return bcoBasicTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Optimal) return bcoOptimalTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Bond) return bcoBondTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Deal) return bcoDealTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Referred) return bcoReferredTableSettingsAtom;
      return defaultTableSettingsAtom;
    case ProductType.BNC:
      if (tableKey === ProductPanelTableKey.Basic) return bncBasicTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Optimal) return bncOptimalTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Bond) return bncBondTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Deal) return bncDealTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Referred) return bncReferredTableSettingsAtom;
      return defaultTableSettingsAtom;
    case ProductType.NCDP:
      if (tableKey === ProductPanelTableKey.Basic) return ncdpBasicTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Referred) return ncdpReferredTableSettingsAtom;

      return defaultTableSettingsAtom;
    case ProductType.NCD:
      if (tableKey === ProductPanelTableKey.Basic) return ncdBasicTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Optimal) return ncdOptimalTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Bond) return ncdBondTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Deal) return ncdDealTableSettingsAtom;
      if (tableKey === ProductPanelTableKey.Referred) return ncdReferredTableSettingsAtom;
      return defaultTableSettingsAtom;
    default:
      return defaultTableSettingsAtom;
  }
};

// 表格 quoteFilterValue 相关状态
export const basicTableQuoteFilterValueAtom = atomWithReset(DEFAULT_QUOTE_FILTER_VALUE);
export const optimalTableQuoteFilterValueAtom = atomWithReset(DEFAULT_QUOTE_FILTER_VALUE);
export const bondTableQuoteFilterValueAtom = atomWithReset(DEFAULT_QUOTE_FILTER_VALUE);
export const dealTableQuoteFilterValueAtom = atomWithReset(DEFAULT_MARKET_DEAL_FILTER_VALUE);
export const referredTableQuoteFilterValueAtom = atomWithReset(DEFAULT_REFERRED_QUOTE_FILTER_VALUE);

// 表格 page 相关状态
export const basicTablePageAtom = atomWithReset(1);
export const optimalTablePageAtom = atomWithReset(1);
export const bondTablePageAtom = atomWithReset(1);
export const dealTablePageAtom = atomWithReset(1);
export const referredTablePageAtom = atomWithReset(1);

export const tablePageAtomMap = {
  [ProductPanelTableKey.Basic]: basicTablePageAtom,
  [ProductPanelTableKey.Optimal]: optimalTablePageAtom,
  [ProductPanelTableKey.Bond]: bondTablePageAtom,
  [ProductPanelTableKey.Deal]: dealTablePageAtom,
  [ProductPanelTableKey.Referred]: referredTablePageAtom
};

// 表格 sorter 相关状态
export const basicTableSorterAtom = atomWithReset<TableSorter<QuoteSortedField> | undefined>(undefined);
export const optimalTableSorterAtom = atomWithReset<TableSorter<QuoteSortedField> | undefined>(undefined);
export const bondTableSorterAtom = atomWithReset<TableSorter<QuoteSortedField> | undefined>(undefined);
export const dealTableSorterAtom = atomWithReset<TableSorter<QuoteSortedField> | undefined>(undefined);
export const referredTableSorterAtom = atomWithReset<TableSorter<QuoteSortedField> | undefined>(undefined);

export const tableSorterAtomMap = {
  [ProductPanelTableKey.Basic]: basicTableSorterAtom,
  [ProductPanelTableKey.Optimal]: optimalTableSorterAtom,
  [ProductPanelTableKey.Bond]: bondTableSorterAtom,
  [ProductPanelTableKey.Deal]: dealTableSorterAtom,
  [ProductPanelTableKey.Referred]: referredTableSorterAtom
};

// 表格 selectedRowKeys 相关状态
export const basicTableSelectedRowKeysAtom = atomWithReset(new Set<string>());
export const optimalTableSelectedRowKeysAtom = atomWithReset(new Set<string>());
export const bondTableSelectedRowKeysAtom = atomWithReset(new Set<string>());
export const dealTableSelectedRowKeysAtom = atomWithReset(new Set<string>());
export const referredTableSelectedRowKeysAtom = atomWithReset(new Set<string>());

export const tableSelectedRowKeysAtomMap = {
  [ProductPanelTableKey.Basic]: basicTableSelectedRowKeysAtom,
  [ProductPanelTableKey.Optimal]: optimalTableSelectedRowKeysAtom,
  [ProductPanelTableKey.Bond]: bondTableSelectedRowKeysAtom,
  [ProductPanelTableKey.Deal]: dealTableSelectedRowKeysAtom,
  [ProductPanelTableKey.Referred]: referredTableSelectedRowKeysAtom
};

// 表格 columnSettingsMdlOpen 相关状态
export const tableColumnSettingsMdlOpenAtom = atom(false);
// 表格 context menu 相关状态
export const tableCtxMenuOpenAtom = atom(false);
export const tableCtxMenuPositionAtom = atom<PopoverPosition>({ x: 0, y: 0 });
