import { alignCenterCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { InstRating } from '@fepkg/services/types/common';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';

const columnHelper = createColumnHelper<InstRating>();

export const instRatingColumns: ColumnDef<InstRating>[] = [
  columnHelper.display({
    id: 'rate_val',
    header: '主体评级',
    minSize: 120,
    meta: {
      columnKey: 'rate_val',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.rate_val ?? ''}</span>
  }),
  columnHelper.display({
    id: 'rating_date',
    header: '评级日期',
    minSize: 120,
    meta: {
      columnKey: 'rating_date',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{moment(Number(row.original.rating_date)).format('YYYY-MM-DD')}</span>
  }),
  columnHelper.display({
    id: 'inst_name',
    header: '评级机构 ',
    minSize: 120,
    meta: {
      columnKey: 'inst_name',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.inst_name ?? ''}</span>
  })
];
