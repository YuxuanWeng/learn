import cx from 'classnames';
import {
  alignCenterCls,
  alignLeftCls,
  blockAlignCenterCls,
  blockAlignRightCls
} from '@fepkg/business/components/QuoteTableCell/constants';
import { OperationSourceMap } from '@fepkg/business/constants/map';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRightArrow, IconRightSmall } from '@fepkg/icon-park-react';
import { DealDetailUpdateType, DealOperationType, ProductType } from '@fepkg/services/types/enum';
import { createColumnHelper } from '@tanstack/react-table';
import { first, last } from 'lodash-es';
import { CP_NONE, getCP } from '../../utils/get-name';
import { UpdatesNone, UpdatesNum, UpdatesRender } from '../DiffTable';
import { CpCell } from './CpCell';
import { DealDetailLogTableColumnKey, DealDetailLogTableRowData } from './types';
import { DealDetailOperationTypeMap } from './utils';

export const columnHelper = createColumnHelper<DealDetailLogTableRowData>();

export const getColumns = (productType: ProductType) => {
  return [
    columnHelper.display({
      id: DealDetailLogTableColumnKey.Expander,
      minSize: 40,
      meta: {
        columnKey: DealDetailLogTableColumnKey.Expander,
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
      id: DealDetailLogTableColumnKey.Operator,
      header: '操作人',
      minSize: 88,
      meta: {
        columnKey: DealDetailLogTableColumnKey.Operator,
        align: 'center',
        tdCls: blockAlignCenterCls
      },
      cell: ({ row }) => {
        if (row.depth >= 1) return null;
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
      id: DealDetailLogTableColumnKey.Type,
      header: '操作类型',
      minSize: 120,
      meta: {
        columnKey: DealDetailLogTableColumnKey.Type,
        align: 'center',
        tdCls: `${blockAlignCenterCls} flex-center`
      },
      cell: ({ row }) => {
        if (row.depth >= 1) return null;
        const type = DealDetailOperationTypeMap[row.original.original.operation_type];
        return (
          <div className={`flex-center w-18 h-5 font-medium bg-white/4 rounded-lg ${type?.cls}`}>{type?.text}</div>
        );
      }
    }),
    columnHelper.display({
      id: DealDetailLogTableColumnKey.Source,
      header: '操作源',
      minSize: 140,
      meta: {
        columnKey: DealDetailLogTableColumnKey.Source,
        align: 'center',
        tdCls: blockAlignCenterCls
      },
      cell: ({ row }) => {
        if (row.depth >= 1) return null;
        const source = OperationSourceMap[row.original.original?.operation_source];
        return source;
      }
    }),
    columnHelper.display({
      id: DealDetailLogTableColumnKey.Time,
      header: '操作时间',
      minSize: 224,
      meta: {
        columnKey: DealDetailLogTableColumnKey.Time,
        align: 'right',
        tdCls: blockAlignRightCls,
        expandable: true
      },
      cell: ({ row }) => {
        if (row.depth === 2) return null;
        if (row.depth === 1)
          return (
            row.getCanExpand() && (
              <div className="h-full inline-flex items-center ml-auto">
                <Button.Icon
                  className="!bg-transparent !border-transparent"
                  icon={<IconRightSmall className={row.getIsExpanded() ? 'rotate-90' : ''} />}
                />
              </div>
            )
          );
        return formatDate(row.original.original.create_time, 'YYYY-MM-DD HH:mm:ss:SSS');
      }
    }),
    columnHelper.display({
      id: DealDetailLogTableColumnKey.Updates,
      header: '变更内容',
      minSize: 672,
      meta: {
        columnKey: DealDetailLogTableColumnKey.Updates,
        thCls: 'flex-[1_1_672px] min-w-[672px]',
        tdCls: `flex-[1_1_672px] min-w-[672px] ${alignLeftCls} !gap-x-2 !h-auto py-[3px]`
      },
      cell: ({ row }) => {
        const { updated, subAmount, subRowDeal, original, bridgeCommentTag } = row.original;

        if ([DealOperationType.DOTSend, DealOperationType.DOTRemindOrder].includes(original.operation_type))
          return <div />;

        if (subAmount) {
          if (subRowDeal == null) {
            return <UpdatesNum length={subAmount} />;
          }

          const isBidTrueOpponent =
            subRowDeal.child_deal_id === first(original.before_deal_snapshot?.details ?? [])?.child_deal_id;

          const isOfrTrueOpponent =
            subRowDeal.child_deal_id === last(original.before_deal_snapshot?.details ?? [])?.child_deal_id;

          return (
            <>
              <div className="w-[92px] flex gap-x-2 items-center">
                <UpdatesNum length={subAmount} />
              </div>
              <div className="flex items-center gap-x-2 flex-wrap max-w-[800px]">
                <div className="flex items-center gap-x-2 h-6 px-2 border border-solid border-gray-600 bg-gray-700 rounded-lg">
                  <div className={cx('text-sm', isOfrTrueOpponent ? 'text-secondary-100' : 'text-gray-100')}>
                    {getCP({
                      productType,
                      inst: subRowDeal.ofr_inst_snapshot,
                      trader: subRowDeal.ofr_trader_snapshot,
                      placeholder: CP_NONE
                    })}
                  </div>
                  <IconRightArrow className="text-gray-100" />
                  <div className={cx('text-sm', isBidTrueOpponent ? 'text-orange-100' : 'text-gray-100')}>
                    {getCP({
                      productType,
                      inst: subRowDeal.bid_inst_snapshot,
                      trader: subRowDeal.bid_trader_snapshot,
                      placeholder: CP_NONE
                    })}
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (updated?.type === DealDetailUpdateType.DealDetailUpdateCP) {
          return (
            <CpCell
              data={row.original.original}
              productType={productType}
            />
          );
        }

        const updateRender = (
          <UpdatesRender
            rowCls="!gap-x-2"
            updated={{
              label: updated?.label,
              labelSuffix: bridgeCommentTag && (
                <div className="flex items-center px-2 border border-solid border-gray-600 bg-gray-700 rounded-lg text-gray-100">
                  {bridgeCommentTag}
                </div>
              ),
              beforeRender: updated?.before ? <span className="break-all">{updated.before}</span> : <UpdatesNone />,
              afterRender: updated?.after ? <span className="break-all">{updated.after}</span> : <UpdatesNone />
            }}
          />
        );

        return row.depth <= 1 && !(row.original.subRowDeal && (row.original.children ?? []).length === 0) ? (
          updateRender
        ) : (
          <div className={cx(row.depth > 1 && 'mx-[100px]', 'flex gap-x-2')}>{updateRender}</div>
        );
      }
    })
  ];
};

export const columnVisibleKeys = [
  DealDetailLogTableColumnKey.Expander,
  DealDetailLogTableColumnKey.Operator,
  DealDetailLogTableColumnKey.Type,
  DealDetailLogTableColumnKey.Source,
  DealDetailLogTableColumnKey.Time,
  DealDetailLogTableColumnKey.Updates
];
