import { ColumnOptions } from '@fepkg/components/Table';
import { QuoteSortedField } from '@fepkg/services/types/enum';
import { alignLeftCls, alignRightCls } from '../QuoteTableCell';
import { BondQuoteTableColumnKey } from '../QuoteTableCell/types';

/** 发行机构列设置 */
export const issuerInstOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.IssuerInst,
  header: '发行机构',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.IssuerInst,
    sortedField: sort && QuoteSortedField.FieldIssuerInst,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});

/** 发行日期列设置 */
export const issuerDateOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.IssuerDate,
  header: '发行日期',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.IssuerDate,
    sortedField: sort && QuoteSortedField.FieldIssuerDate,
    tdCls: `${alignLeftCls} truncate-clip`
  }
});

/** 价格列设置 */
export const priceOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.Price,
  header: '价格',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Price,
    sortedField: sort && QuoteSortedField.FieldPrice,
    align: 'right',
    tdCls: `${alignRightCls} !pr-0`
  }
});

/** 变动列设置 */
export const priceChangeOpts = <T>(sort = true): ColumnOptions<T> => ({
  id: BondQuoteTableColumnKey.PriceChange,
  header: '变动',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.PriceChange,
    sortedField: sort && QuoteSortedField.FieldPriceChange,
    align: 'right',
    tdCls: `${alignRightCls} truncate-clip`
  }
});
