import { alignLeftCls, alignRightCls } from '@fepkg/business/components/QuoteTableCell';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { NCDPOperationTypeMap } from '@fepkg/business/constants/map';
import { NCDPOperationType } from '@fepkg/services/types/bds-enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  commentCol,
  issuerDateCol,
  issuerInstCol,
  issuerRatingCol,
  maturityDateCol,
  operatorCol,
  priceChangeCol,
  priceCol,
  volumeCol
} from '@/pages/ProductPanel/components/NCDPTable/columns';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';

const columnHelper = createColumnHelper<NCDPTableColumn>();

const operationTypeCol = columnHelper.display({
  id: BondQuoteTableColumnKey.OperationType,
  header: '操作类型',
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.OperationType,
    tdCls: `${alignLeftCls} truncate-clip`
  },
  cell: ({ row }) => NCDPOperationTypeMap[row.original.operationType ?? NCDPOperationType.NcdPOperationTypeNone]
});

const createTimeCol = columnHelper.display({
  id: BondQuoteTableColumnKey.CreateTime,
  header: '操作时间',
  minSize: 224,
  meta: {
    columnKey: BondQuoteTableColumnKey.CreateTime,
    tdCls: `${alignRightCls} truncate-clip`,
    align: 'right'
  },
  cell: ({ row }) => row.original.createTime
});

export const columns: ColumnDef<NCDPTableColumn>[] = [
  createTimeCol,
  operatorCol,
  operationTypeCol,
  issuerInstCol,
  issuerRatingCol,
  issuerDateCol,
  maturityDateCol,
  priceCol,
  priceChangeCol,
  volumeCol,
  commentCol
];

/** 表格列顺序 */
export const columnVisibleKeys = [
  BondQuoteTableColumnKey.CreateTime,
  BondQuoteTableColumnKey.Operator,
  BondQuoteTableColumnKey.OperationType,
  BondQuoteTableColumnKey.IssuerInst,
  BondQuoteTableColumnKey.IssuerRatingVal,
  BondQuoteTableColumnKey.IssuerDate,
  BondQuoteTableColumnKey.MaturityDate,
  BondQuoteTableColumnKey.Price,
  BondQuoteTableColumnKey.PriceChange,
  BondQuoteTableColumnKey.Volume,
  BondQuoteTableColumnKey.Comment
];
