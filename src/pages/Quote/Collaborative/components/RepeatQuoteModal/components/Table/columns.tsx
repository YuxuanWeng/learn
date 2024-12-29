import cx from 'classnames';
import { alignRightCls, blockAlignRightCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { Button } from '@fepkg/components/Button';
import { QuoteDraftDetailStatus } from '@fepkg/services/types/enum';
import { createColumnHelper } from '@tanstack/react-table';
import { SideCellPrice, getSideFontCls } from '@/components/QuoteTableCell';
import { useDraftAction } from '@/pages/Quote/Collaborative/hooks/useDraftAction';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { DraftGroupTableColumnKey, RepeatQuoteTableRowData } from '@/pages/Quote/Collaborative/types/table';
import {
  CommentCell,
  FlagCell,
  LiqSpeedCell,
  SideCell,
  getFlagCellTdCls
} from '../../../Panel/components/DraftGroupTable/columns';

export const columnHelper = createColumnHelper<RepeatQuoteTableRowData>();

export const columns = [
  columnHelper.display({
    id: DraftGroupTableColumnKey.Side,
    minSize: 80,
    header: '方向',
    meta: {
      columnKey: DraftGroupTableColumnKey.Side,
      align: 'center',
      tdCls: 'flex-center'
    },
    cell: ({ row }) => {
      if (!row.original.original) return null;

      const { side, status } = row.original.original;
      const ignored = status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored;

      return (
        <SideCell
          side={side}
          disabled={ignored}
        />
      );
    }
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.Price,
    minSize: 120,
    header: '价格',
    meta: {
      columnKey: DraftGroupTableColumnKey.Price,
      align: 'right',
      tdCls: ({ original }) => `${alignRightCls} ${original.original?.flag_inverted ? 'bg-orange-600' : ''}`
    },
    cell: ({ row }) => {
      if (!row.original.original) return null;

      const { side, price, return_point, flag_rebate, flag_intention, flag_internal, status } = row.original.original;

      return (
        <div
          className={cx(
            getSideFontCls(
              side,
              status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored,
              flag_internal,
              'text-gray-400'
            )
          )}
        >
          <SideCellPrice
            side={side}
            price={price}
            returnPoint={return_point}
            rebate={flag_rebate}
            intention={flag_intention}
          />
        </div>
      );
    }
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.Volume,
    minSize: 92,
    header: '量',
    meta: {
      columnKey: DraftGroupTableColumnKey.Volume,
      align: 'right',
      tdCls: blockAlignRightCls
    },
    cell: ({ row }) => {
      const { original } = row.original;
      if (!original?.bond_info) return '';
      if (original?.volume !== void 0 && original.volume > 0) return original?.volume;

      return '--';
    }
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.Flag,
    minSize: 48,
    header: '标签',
    meta: {
      columnKey: DraftGroupTableColumnKey.Flag,
      align: 'center',
      tdCls: val => `${getFlagCellTdCls(val)} py-0.5 px-2.5`
    },
    cell: ({ row }) => {
      if (!row.original?.original) return null;
      return <FlagCell detail={row.original.original} />;
    }
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.LiqSpeed,
    minSize: 120,
    header: '结算方式',
    meta: {
      columnKey: DraftGroupTableColumnKey.LiqSpeed
    },
    cell: ({ row }) => {
      if (!row.original?.original) return null;
      return <LiqSpeedCell detail={row.original.original} />;
    }
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.Comment,
    minSize: 100,
    header: '备注',
    meta: {
      columnKey: DraftGroupTableColumnKey.Comment
    },
    cell: ({ row }) => {
      if (!row.original?.original) return null;
      return <CommentCell detail={row.original.original} />;
    }
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.Status,
    minSize: 88,
    header: '操作',
    meta: {
      columnKey: DraftGroupTableColumnKey.Status,
      align: 'center',
      tdCls: 'flex-center font-medium'
    },
    cell: function StatusCell({ row }) {
      const { renderMessages } = useTableState();
      const { ignore } = useDraftAction();

      switch (row.original?.original?.status) {
        case QuoteDraftDetailStatus.QuoteDraftDetailStatusPending: {
          const message = renderMessages.find(m => m.message_id === row.original.original?.message_id);

          return (
            <Button
              className="!h-6"
              type="gray"
              ghost
              disabled={!(message?.message_id && row.original.original?.detail_id)}
              onClick={() => ignore(message, new Set([row.original.original?.detail_id].filter(Boolean)))}
            >
              忽略
            </Button>
          );
        }
        case QuoteDraftDetailStatus.QuoteDraftDetailStatusConfirmed:
          return <span className="text-green-100">已挂价</span>;
        case QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored:
          return <span className="text-gray-200">已忽略</span>;
        default:
          return null;
      }
    }
  })
];

export const columnVisibleKeys = [
  DraftGroupTableColumnKey.Side,
  DraftGroupTableColumnKey.Price,
  DraftGroupTableColumnKey.Volume,
  DraftGroupTableColumnKey.Flag,
  DraftGroupTableColumnKey.LiqSpeed,
  DraftGroupTableColumnKey.Comment,
  DraftGroupTableColumnKey.Status
];
