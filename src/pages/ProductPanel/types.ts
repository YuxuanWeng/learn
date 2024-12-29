import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { ColumnSettingDef } from '@fepkg/components/Table';

/** 行情面版本地数据key - 来自布局缓存 */
export const PRODUCT_LAYOUT_CACHE_NAME = 'product_panel_layout_cache';

export type ProductWindowItems = {
  name: string;
  productType: string;
  uuid: string;
  groupId: string;
};

export enum ProductPanelTableKey {
  /** 实时报价（NCDP 时为投标中） */
  Basic = 'basic',
  /** 实时盘口 */
  Optimal = 'optimal',
  /** 债券列表 */
  Bond = 'bond',
  /** 市场成交 */
  Deal = 'deal',
  /** 作废报价（NCDP 时为已删除） */
  Referred = 'referred'
}

export const ProductPanelTableKeys = [
  ProductPanelTableKey.Basic,
  ProductPanelTableKey.Optimal,
  ProductPanelTableKey.Bond,
  ProductPanelTableKey.Deal,
  ProductPanelTableKey.Referred
];

export type BondQuoteTableColumnSettingItem = ColumnSettingDef<BondQuoteTableColumnKey>;
export type BondQuoteTableColumnSetting = Record<ProductPanelTableKey, BondQuoteTableColumnSettingItem[]>;
