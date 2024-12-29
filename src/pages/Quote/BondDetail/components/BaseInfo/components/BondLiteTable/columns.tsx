import { alignCenterCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { ListedMarketStringMap } from '@fepkg/business/constants/map';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { isEmpty } from '@/pages/Quote/BondDetail/utils';

const columnHelper = createColumnHelper<FiccBondBasic>();

export const circulationMarketColumns: ColumnDef<FiccBondBasic>[] = [
  columnHelper.display({
    id: 'listed_market',
    header: '发行市场',
    minSize: 120,
    meta: {
      columnKey: 'listed_market',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    // cell: ({ row }) => <span className="truncate">{listedMarketMap.get(row.original.listed_market) ?? '--'}</span>
    cell: ({ row }) => <span className="truncate">{ListedMarketStringMap[row.original.listed_market] ?? '--'}</span>
  }),
  columnHelper.display({
    id: 'display_code',
    header: '代码',
    minSize: 120,
    meta: {
      columnKey: 'display_code',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.display_code}</span>
  }),
  columnHelper.display({
    id: 'short_name',
    header: '简称',
    minSize: 120,
    meta: {
      columnKey: 'short_name',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.short_name}</span>
  }),
  columnHelper.display({
    id: 'conversion_rate',
    header: '质押率',
    minSize: 120,
    meta: {
      columnKey: 'conversion_rate',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => (
      <span className="truncate">
        {(row.original?.conversion_rate ?? 0) <= 0 ? '--' : row.original.conversion_rate}
      </span>
    )
  })
];

export const publisherAllBondColumns: ColumnDef<FiccBondBasic>[] = [
  columnHelper.display({
    id: 'time_to_maturity',
    header: '剩余期限',
    minSize: 120,
    meta: {
      columnKey: 'time_to_maturity',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => (
      <span className="truncate">
        {row.original.time_to_maturity === '0D' || row.original.time_to_maturity === ''
          ? '已到期'
          : row.original.time_to_maturity}
      </span>
    )
  }),
  columnHelper.display({
    id: 'display_code',
    header: '债券代码',
    minSize: 120,
    meta: {
      columnKey: 'display_code',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.display_code}</span>
  }),
  columnHelper.display({
    id: 'short_name',
    header: '简称',
    minSize: 120,
    meta: {
      columnKey: 'short_name',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{row.original.short_name}</span>
  }),
  columnHelper.display({
    id: 'rating',
    header: '债项评级',
    minSize: 120,
    meta: {
      columnKey: 'rating',
      align: 'center',
      thCls: 'flex-1 min-w-[120px]',
      tdCls: `${alignCenterCls} flex-1 min-w-[120px]`
    },
    cell: ({ row }) => <span className="truncate">{isEmpty(row.original.rating)}</span>
  })
];
