import cx from 'classnames';
import { UpdatesNum, UpdatesRender } from '@fepkg/business/components/DiffTable';
import {
  alignCenterCls,
  blockAlignCenterCls,
  blockAlignRightCls
} from '@fepkg/business/components/QuoteTableCell/constants';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRightSmall } from '@fepkg/icon-park-react';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { createColumnHelper } from '@tanstack/react-table';
import { DealOperationLogTableColumnKey, DealOperationLogTableRowData } from './types';
import { notUpdatesOperationTypes } from './utils';

type TypeConfig = {
  text: string;
  cls: string;
};

const typeConfigMap = {
  [DealOperationType.DealOperationTypeNone]: { text: '', cls: '' },
  [DealOperationType.DOTNewDeal]: { text: '新意向', cls: 'text-orange-100' },
  [DealOperationType.DOTBrokerAConfirm]: { text: '点价方确认', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerAReject]: { text: '点价方拒绝', cls: 'text-danger-100' },
  [DealOperationType.DOTBrokerBConfirm]: { text: '被点价方确认', cls: 'text-primary-100' },
  [DealOperationType.DOTBrokerBPartiallyFilled]: { text: '被点价方部分确认', cls: 'text-purple-100' },
  [DealOperationType.DOTBrokerBReject]: { text: '被点价方拒绝', cls: 'text-danger-100' },
  [DealOperationType.DOTSend]: { text: '发送', cls: 'text-gray-100' },
  [DealOperationType.DOTRemindOrder]: { text: '催单', cls: 'text-purple-100' },
  [DealOperationType.DOTHandOver]: { text: '移交', cls: 'text-yellow-100' },
  [DealOperationType.DOTCreateByClone]: { text: '克隆', cls: 'text-secondary-100' },
  [DealOperationType.DOTCloned]: { text: '被克隆', cls: 'text-secondary-100' },
  [DealOperationType.DOTBrokerAAsking]: { text: '点价方在问', cls: 'text-yellow-100' },
  [DealOperationType.DOTBrokerBAsking]: { text: '被点价方在问', cls: 'text-yellow-100' },
  [DealOperationType.DOTReceiptDealDelete]: { text: '删除', cls: 'text-danger-100' },
  [DealOperationType.DOTAddBridge]: { text: '加桥', cls: 'text-orange-100' },
  [DealOperationType.DOTDeleteBridge]: { text: '删桥', cls: 'text-danger-100' },
  [DealOperationType.DOTResetBridge]: { text: '重置桥', cls: 'text-orange-100' },
  [DealOperationType.DOTChangeBridge]: { text: '换桥', cls: 'text-secondary-100' },
  [DealOperationType.DOTAddDoubleBridge]: { text: '加双桥', cls: 'text-orange-100' }
};

const getTypeConfig = (type: DealOperationType) =>
  (typeConfigMap[type] ?? { text: '修改', cls: 'text-primary-100' }) as TypeConfig;

export const columnHelper = createColumnHelper<DealOperationLogTableRowData>();

const sourceMap = {
  [OperationSource.OperationSourceQuickChat]: 'iQuote',
  [OperationSource.OperationSourceQuoteDraft]: '报价审核',
  [OperationSource.OperationSourceReceiptDeal]: '成交单',
  [OperationSource.OperationSourceReceiptDealDetail]: '明细',
  [OperationSource.OperationSourceReceiptDealBridge]: '过桥'
};

const getSource = (source: OperationSource) => sourceMap[source] ?? '点价';

export const columns = [
  columnHelper.display({
    id: DealOperationLogTableColumnKey.Expander,
    size: 40,
    meta: {
      columnKey: DealOperationLogTableColumnKey.Expander,
      align: 'center',
      tdCls: alignCenterCls,
      expandable: true
    },
    cell: ({ row }) => {
      const { operation_type } = row.original.original;

      if (row.depth === 0 && row.getCanExpand() && !notUpdatesOperationTypes.has(operation_type)) {
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
    id: DealOperationLogTableColumnKey.Operator,
    header: '操作人',
    minSize: 88,
    meta: {
      columnKey: DealOperationLogTableColumnKey.Operator,
      align: 'center',
      thCls: 'w-[88px]',
      tdCls: `w-[88px] ${blockAlignCenterCls}`
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      const content = row.original.original.operator?.name_cn;

      return (
        <Tooltip
          content={content}
          truncate
        >
          <div className="truncate">{content}</div>
        </Tooltip>
      );
    }
  }),
  columnHelper.display({
    id: DealOperationLogTableColumnKey.Type,
    header: '操作类型',
    minSize: 160,
    meta: {
      columnKey: DealOperationLogTableColumnKey.Type,
      align: 'center',
      tdCls: cx(alignCenterCls, '!px-0')
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      const typeConfig = getTypeConfig(row.original.original.operation_type);
      return (
        <div className={`flex-center min-w-[72px] px-2 h-5 font-medium bg-white/4 rounded-lg ${typeConfig.cls}`}>
          {typeConfig.text}
        </div>
      );
    }
  }),
  columnHelper.display({
    id: DealOperationLogTableColumnKey.Source,
    header: '操作源',
    minSize: 140,
    meta: {
      columnKey: DealOperationLogTableColumnKey.Source,
      align: 'center',
      tdCls: blockAlignCenterCls
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      return getSource(row.original.original.operation_source ?? OperationSource.OperationSourceNone);
    }
  }),
  columnHelper.display({
    id: DealOperationLogTableColumnKey.Time,
    header: '操作时间',
    minSize: 224,
    meta: {
      columnKey: DealOperationLogTableColumnKey.Time,
      align: 'right',
      tdCls: blockAlignRightCls
    },
    cell: ({ row }) => {
      if (row.depth === 1) return null;
      return formatDate(row.original.original.create_time, 'YYYY-MM-DD HH:mm:ss:SSS');
    }
  }),
  columnHelper.display({
    id: DealOperationLogTableColumnKey.Updates,
    header: '变更内容',
    minSize: 552,
    meta: {
      columnKey: DealOperationLogTableColumnKey.Updates,
      thCls: 'flex-[1_1_552px] min-w-[552px]',
      tdCls: 'flex-[1_1_552px] min-w-[552px] !h-auto flex justify-start pl-4 gap-x-3 py-[3px]'
    },
    cell: ({ row }) => {
      const { operation_type, updated } = row.original.original;

      if (row.depth === 0) {
        if (notUpdatesOperationTypes.has(operation_type) || !updated) {
          return updated?.messageRender?.() ?? '-';
        }

        if (row.subRows.length > 0) {
          return <UpdatesNum length={row.subRows.length} />;
        }
      }

      return (
        updated.label && (
          <UpdatesRender
            updated={{ ...updated, beforeRender: updated.renderBefore?.(), afterRender: updated.renderAfter?.() }}
          />
        )
      );
    }
  })
];

export const columnVisibleKeys = [
  DealOperationLogTableColumnKey.Expander,
  DealOperationLogTableColumnKey.Operator,
  DealOperationLogTableColumnKey.Type,
  DealOperationLogTableColumnKey.Source,
  DealOperationLogTableColumnKey.Time,
  DealOperationLogTableColumnKey.Updates
];
