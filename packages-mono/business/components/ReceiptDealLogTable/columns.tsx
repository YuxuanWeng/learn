import { DirectionTag } from '@fepkg/business/components/QuoteTableCell';
import {
  alignCenterCls,
  alignLeftCls,
  blockAlignCenterCls,
  blockAlignRightCls,
  blockBasicCls
} from '@fepkg/business/components/QuoteTableCell/constants';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRightSmall } from '@fepkg/icon-park-react';
import { Direction, ReceiptDealOperationType, ReceiptDealUpdateType } from '@fepkg/services/types/enum';
import { createColumnHelper } from '@tanstack/react-table';
import { OperationSourceMap } from '../../constants/map';
import { UpdatesBadge, UpdatesNone, UpdatesNum, UpdatesRender } from '../DiffTable';
import { ReceiptDealLogTableColumnKey, ReceiptDealLogTableRowData } from './types';
import { ReceiptDealOperationTypeMap } from './utils';

export const columnHelper = createColumnHelper<ReceiptDealLogTableRowData>();

const notUpdatesOperationTypes = new Set([
  ReceiptDealOperationType.ReceiptDealAdd,
  ReceiptDealOperationType.ReceiptDealBidConfirm,
  ReceiptDealOperationType.ReceiptDealOfrConfirm,
  ReceiptDealOperationType.ReceiptDealPrint,
  ReceiptDealOperationType.ReceiptDealRuleReset
]);

export const columns = [
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Expander,
    minSize: 40,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Expander,
      align: 'center',
      tdCls: alignCenterCls,
      expandable: true
    },
    cell: ({ row }) => {
      if (row.getCanExpand() && row.depth === 0) {
        return (
          <Button.Icon
            className="!bg-transparent !border-transparent"
            icon={<IconRightSmall className={row.getIsExpanded() ? 'rotate-90' : ''} />}
          />
        );
      }

      return null;
    }
  }),
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Operator,
    header: '操作人',
    minSize: 88,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Operator,
      align: 'center',
      thCls: 'flex-[1_1_88px] min-w-[88px]',
      tdCls: `flex-[1_1_88px] min-w-[88px] ${blockAlignCenterCls}`
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      return (
        <Tooltip
          content={row.original.original.operator?.name_cn}
          truncate
        >
          <div className="truncate">{row.original.original.operator?.name_cn}</div>
        </Tooltip>
      );
    }
  }),
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Type,
    header: '操作类型',
    minSize: 104,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Type,
      align: 'center',
      tdCls: `${blockAlignCenterCls} pt-1.5`
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      const type = ReceiptDealOperationTypeMap[row.original.original.operation_type];
      return <div className={`flex-center w-18 h-5 font-medium bg-white/4 rounded-lg ${type.cls}`}>{type.text}</div>;
    }
  }),
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Source,
    header: '操作源',
    minSize: 140,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Source,
      align: 'center',
      tdCls: blockAlignCenterCls
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      const source = OperationSourceMap[row.original.original?.operation_source];
      return source;
    }
  }),
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Time,
    header: '操作时间',
    minSize: 224,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Time,
      align: 'right',
      tdCls: blockAlignRightCls
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      return formatDate(row.original.original.create_time, 'YYYY-MM-DD HH:mm:ss:SSS');
    }
  }),
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Updates,
    header: '变更内容',
    minSize: 552,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Updates,
      thCls: 'flex-[1_1_552px] min-w-[552px]',
      tdCls: `flex-[1_1_552px] min-w-[552px] ${alignLeftCls} gap-x-3 !h-auto py-[5px]`
    },
    cell: ({ row }) => {
      const { operation_type, updated } = row.original.original;

      if (row.depth === 0) {
        if (notUpdatesOperationTypes.has(operation_type) || !updated) {
          return updated?.message ?? '-';
        }

        if (row.subRows.length) {
          return <UpdatesNum length={row.subRows.length} />;
        }
      }

      if (updated?.type === ReceiptDealUpdateType.RDUpdateDealDirection) {
        return (
          <UpdatesRender
            updated={{
              label: updated?.label,
              beforeRender: updated?.before?.value ? (
                <DirectionTag direction={updated.before.value as unknown as Direction} />
              ) : (
                <UpdatesNone />
              ),
              afterRender: updated?.after?.value ? (
                <DirectionTag direction={updated.after.value as unknown as Direction} />
              ) : (
                <UpdatesNone />
              )
            }}
          />
        );
      }

      return (
        <UpdatesRender
          updated={{
            label: updated?.label,
            beforeRender: (
              <>
                {updated?.before?.badgeType && <UpdatesBadge type={updated.before.badgeType} />}
                {updated?.before?.value ? <span className="break-all">{updated.before.value}</span> : <UpdatesNone />}
              </>
            ),
            afterRender: (
              <>
                {updated?.after?.badgeType && <UpdatesBadge type={updated.after.badgeType} />}
                {updated?.after?.value ? <span className="break-all">{updated.after.value}</span> : <UpdatesNone />}
              </>
            )
          }}
        />
      );
    }
  }),
  columnHelper.display({
    id: ReceiptDealLogTableColumnKey.Comment,
    header: '备注',
    minSize: 220,
    meta: {
      columnKey: ReceiptDealLogTableColumnKey.Comment,
      thCls: 'flex-[1_1_220px] min-w-[220px]',
      tdCls: 'flex-[1_1_220px] min-w-[220px]'
    },
    cell: ({ row }) => {
      const { updated } = row.original.original;
      const content = updated?.comment;

      if (row.depth === 0 && (row.subRows.length || !content)) return <div className={blockBasicCls}>-</div>;
      return (
        <Tooltip
          content={content}
          truncate
        >
          <div className={blockBasicCls}>{content}</div>
        </Tooltip>
      );
    }
  })
];

export const columnVisibleKeys = [
  ReceiptDealLogTableColumnKey.Expander,
  ReceiptDealLogTableColumnKey.Operator,
  ReceiptDealLogTableColumnKey.Type,
  ReceiptDealLogTableColumnKey.Source,
  ReceiptDealLogTableColumnKey.Time,
  ReceiptDealLogTableColumnKey.Updates,
  ReceiptDealLogTableColumnKey.Comment
];
