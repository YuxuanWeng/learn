import { FC } from 'react';
import cx from 'classnames';
import { CPCell } from '@fepkg/business/components/QuoteTableCell';
import { alignCenterCls, basicCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Side } from '@fepkg/services/types/enum';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { renderSideCell } from '@/pages/ProductPanel/components/BasicTable/columns';
import { getCpSpanColor } from '@/pages/ProductPanel/utils';
import { DeepQuoteTableColumn } from './types';

const opacityCls = 'text-gray-300 font-medium';

const emptyCell = (side?: Side, isOther?: boolean) => {
  return (
    <span
      className={cx(
        'flex h-full items-center justify-end pr-10 text-lg leading-6',
        !isOther && side === Side.SideBid && 'text-orange-100',
        !isOther && side === Side.SideOfr && 'text-secondary-100'
      )}
    >
      --
    </span>
  );
};

const OpacityCell: FC<{ children?: React.ReactNode; row: DeepQuoteTableColumn; side?: Side }> = ({
  children,
  row,
  side
}) => {
  return (
    <div className={cx('w-full h-full', row.isOther && opacityCls)}>{children || emptyCell(side, row.isOther)}</div>
  );
};

export const columnHelper = createColumnHelper<DeepQuoteTableColumn>();

/** Broker 列 */
const brokerCol = columnHelper.display({
  id: BondQuoteTableColumnKey.Broker,
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Broker,
    align: 'center'
  },
  cell: ({ row }) => {
    if (!row.original.original.quote_id) return <OpacityCell row={row.original} />;
    const { brokerName, comment, original, isOther } = row.original;
    return (
      <OpacityCell row={row.original}>
        <Tooltip
          content={comment}
          floatingProps={{ className: '!z-hightest' }}
        >
          <div className={alignCenterCls}>
            <span
              className={cx(
                'truncate-clip',
                original.flag_internal && 'text-primary-100',
                !original.flag_internal && isOther && opacityCls
              )}
            >
              {brokerName}
            </span>
          </div>
        </Tooltip>
      </OpacityCell>
    );
  }
});

/** CP 列 */
const cpCol = columnHelper.display({
  id: BondQuoteTableColumnKey.Cp,
  minSize: 64,
  meta: { columnKey: BondQuoteTableColumnKey.Cp },
  cell: ({ row }) => {
    if (!row.original.original.quote_id) return <OpacityCell row={row.original} />;
    const { recommendCls, cp, comment, original, isOther } = row.original;
    const { flag_urgent, trader_info, flag_internal } = original;

    const contentCls = getCpSpanColor(flag_internal, !!trader_info?.is_vip, isOther);

    return (
      <OpacityCell row={row.original}>
        <Tooltip
          content={comment}
          floatingProps={{ className: '!z-hightest' }}
        >
          <div className={`${basicCls} justify-start flex-row pl-0 ${recommendCls}`}>
            <CPCell
              content={cp}
              urgent={flag_urgent}
              contentCls={contentCls}
            />
          </div>
        </Tooltip>
      </OpacityCell>
    );
  }
});

/** Vol 列 */
const volCol = columnHelper.display({
  id: BondQuoteTableColumnKey.Volume,
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Volume,
    align: 'center'
  },
  cell: ({ row }) => {
    if (!row.original.original.quote_id) return <OpacityCell row={row.original} />;

    const { volume, comment, original, isOther } = row.original;
    return (
      <OpacityCell row={row.original}>
        <Tooltip
          content={comment}
          floatingProps={{ className: '!z-hightest' }}
        >
          <div className={cx(alignCenterCls, ' w-full h-full')}>
            <span className={cx(isOther && opacityCls, original.flag_internal && 'text-primary-100', 'truncate-clip')}>
              {volume}
            </span>
          </div>
        </Tooltip>
      </OpacityCell>
    );
  }
});

/** 备注列 */
const commentCol = columnHelper.display({
  id: BondQuoteTableColumnKey.Comment,
  minSize: 64,
  meta: {
    columnKey: BondQuoteTableColumnKey.Comment,
    align: 'right'
  },
  cell: ({ row }) => {
    const { isOther, comment } = row.original;
    const { quote_id } = row.original.original;

    if (!quote_id) return <OpacityCell row={row.original} />;
    return (
      <Tooltip
        content={comment}
        floatingProps={{ className: '!z-hightest' }}
      >
        <div className={cx(isOther && opacityCls, 'h-full flex items-center px-3 truncate-clip')}>
          {comment || '--'}
        </div>
      </Tooltip>
    );
  }
});

export const bidColumns: ColumnDef<DeepQuoteTableColumn>[] = [
  brokerCol,
  cpCol,
  volCol,
  columnHelper.display({
    id: BondQuoteTableColumnKey.Bid,
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.Bid,
      align: 'right'
    },
    cell: ({ row }) => {
      if (!row.original.original.quote_id)
        return (
          <OpacityCell
            row={row.original}
            side={Side.SideBid}
          />
        );
      return (
        <OpacityCell
          row={row.original}
          side={Side.SideBid}
        >
          {renderSideCell(Side.SideBid, row.original.original, row.original.comment, row.original.isOther)}
        </OpacityCell>
      );
    }
  }),
  commentCol
];

export const ofrColumns: ColumnDef<DeepQuoteTableColumn>[] = [
  commentCol,
  columnHelper.display({
    id: BondQuoteTableColumnKey.Ofr,
    minSize: 64,
    meta: {
      columnKey: BondQuoteTableColumnKey.Ofr,
      align: 'right'
    },
    cell: ({ row }) => {
      if (!row.original.original.quote_id)
        return (
          <OpacityCell
            row={row.original}
            side={Side.SideOfr}
          />
        );
      return (
        <OpacityCell
          row={row.original}
          side={Side.SideOfr}
        >
          {renderSideCell(Side.SideOfr, row.original.original, row.original.comment, row.original.isOther)}
        </OpacityCell>
      );
    }
  }),
  volCol,
  cpCol,
  brokerCol
];
