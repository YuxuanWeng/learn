import { CPCell } from '@fepkg/business/components/QuoteTableCell';
import {
  basicCls,
  bidOpts,
  brokerOpts,
  commentOpts,
  cpOpts,
  ofrOpts,
  updateTimeOpts,
  volOpts
} from '@fepkg/business/components/QuoteTableCell/constants';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { renderSideCell } from '@/pages/ProductPanel/components/BasicTable/columns';
import { QuoteTableColumn } from './types';

const columnHelper = createColumnHelper<QuoteTableColumn>();

/** Update Time 列 */
const updateTimeCol = columnHelper.display({
  ...updateTimeOpts(),
  cell: ({ row }) => row.original.updateTime
});

/** CP 列 */
const cpCol = columnHelper.display({
  ...cpOpts(),
  meta: {
    columnKey: BondQuoteTableColumnKey.Cp,
    sortedField: QuoteSortedField.FieldTrader,
    tdCls: row => `${basicCls} justify-start flex-row ${row.original?.recommendCls}`
  },
  cell: ({ row }) => {
    const { flag_urgent, flag_stc, trader_info } = row.original.original;
    const { cp } = row.original;

    const contentCls = trader_info?.is_vip ? 'text-yellow-100' : '';

    return (
      <CPCell
        content={cp}
        urgent={flag_urgent}
        // stc={flag_stc}
        contentCls={contentCls}
      />
    );
  }
});

/** Broker 列 */
const brokerCol = columnHelper.display({
  ...brokerOpts(),
  cell: ({ row }) => row.original.brokerName
});

/** 备注列 */
const commentCol = columnHelper.display({
  ...commentOpts(),
  cell: ({ row }) => row.original.comment
});

/** Vol 列 */
const volCol = columnHelper.display({
  ...volOpts(),
  cell: ({ row }) => row.original.volume
});

export const bidColumns: ColumnDef<QuoteTableColumn>[] = [
  updateTimeCol,
  cpCol,
  brokerCol,
  commentCol,
  volCol,
  /** Bid 列 */
  columnHelper.display({
    ...bidOpts(),
    cell: ({ row }) => renderSideCell(Side.SideBid, row.original.original, row.original.comment)
  })
];

export const ofrColumns: ColumnDef<QuoteTableColumn>[] = [
  /** Ofr 列 */
  columnHelper.display({
    ...ofrOpts(),
    cell: ({ row }) => renderSideCell(Side.SideOfr, row.original.original, row.original.comment)
  }),
  volCol,
  commentCol,
  brokerCol,
  cpCol,
  updateTimeCol
];
