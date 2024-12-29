import { alignCenterCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { BondRating } from '@fepkg/services/types/common';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<BondRating>();

export const historyLevelColumns: ColumnDef<BondRating>[] = [
  columnHelper.display({
    id: 'bond_rating',
    header: '债券评级',
    minSize: 120,
    meta: {
      columnKey: 'bond_rating',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.bond_rating}</span>
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
    cell: ({ row }) => <span className="truncate">{row.original.rating_date}</span>
  }),
  columnHelper.display({
    id: 'rating_institution_name',
    header: '评级机构 ',
    minSize: 120,
    meta: {
      columnKey: 'rating_institution_name',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.rating_institution_name ?? ''}</span>
  })
];
