import {
  IssuerInstCell,
  PriceCell,
  PriceChangeCell,
  VolumeCell,
  issuerDateOpts,
  issuerInstOpts,
  priceChangeOpts,
  priceOpts
} from '@fepkg/business/components/NCDPTableCell';
import {
  commentOpts,
  issuerRatingOpts,
  maturityDateOpts,
  operatorOpts,
  updateTimeOpts,
  volOpts
} from '@fepkg/business/components/QuoteTableCell';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { NCDPTableColumn } from './types';

const columnHelper = createColumnHelper<NCDPTableColumn>();

/** 发行机构列 */
export const issuerInstCol = columnHelper.display({
  ...issuerInstOpts(),
  cell: ({ row }) => <IssuerInstCell original={row.original} />
});

/** 评级列 */
export const issuerRatingCol = columnHelper.display({
  ...issuerRatingOpts(),
  header: '评级',
  cell: ({ row }) => row.original.rating
});

/** 发行日期列 */
export const issuerDateCol = columnHelper.display({
  ...issuerDateOpts(),
  cell: ({ row }) => row.original.issuerDate
});

/** 期限列 */
export const maturityDateCol = columnHelper.display({
  ...maturityDateOpts(),
  header: '期限',
  cell: ({ row }) => row.original.maturityDate
});

/** 价格列 */
export const priceCol = columnHelper.display({
  ...priceOpts(),
  cell: ({ row }) => <PriceCell original={row.original} />
});

/** 变动列 */
export const priceChangeCol = columnHelper.display({
  ...priceChangeOpts(),
  cell: ({ row }) => <PriceChangeCell original={row.original} />
});

/** 数量(亿)列 */
export const volumeCol = columnHelper.display({
  ...volOpts(),
  header: '数量(亿)',
  cell: ({ row }) => <VolumeCell original={row.original} />
});

/** 操作人列 */
export const operatorCol = columnHelper.display({
  ...operatorOpts(),
  cell: ({ row }) => row.original.original?.operator_name
});

/** 备注列 */
export const commentCol = columnHelper.display({
  ...commentOpts(),
  cell: ({ row }) => row.original.original?.comment
});

/** 最后更新列 */
export const updateTimeCol = columnHelper.display({
  ...updateTimeOpts(),
  header: '最后更新',
  cell: ({ row }) => row.original.updateTime
});

export const columns: ColumnDef<NCDPTableColumn>[] = [
  issuerInstCol,
  issuerRatingCol,
  issuerDateCol,
  maturityDateCol,
  priceCol,
  priceChangeCol,
  volumeCol,
  operatorCol,
  commentCol,
  updateTimeCol
];
