import { useImperativeHandle } from 'react';
import { Table } from '@tanstack/react-table';
import { SCROLL_DELAY } from '../constants';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData, ScrollToIndexHandler, ScrollToOffsetHandler } from '../types';

export const useGroupTableImperativeHandle = <T extends RowData>(
  table: Table<T>,
  scrollToIndex: ScrollToIndexHandler,
  scrollToOffset?: ScrollToOffsetHandler
) => {
  const { meta: tableMeta } = table.options;
  const { tableRef } = useTableProps<T>();
  const { lastSelectedRow } = useTableState<T>();

  useImperativeHandle(tableRef, () => {
    return {
      scrollRowIntoView(rowKey) {
        const { rows } = table.getRowModel();
        const rowIdx = tableMeta?.rowKeysCache.indexCache.get(rowKey) ?? -1;
        const row = rows[rowIdx];

        if (rowIdx > -1) {
          requestIdleCallback(() => {
            tableMeta?.selectRows?.(new Set([rowKey]), undefined, row.id);
            lastSelectedRow.current = row;

            setTimeout(() => {
              scrollToIndex?.(rowIdx, { align: 'start' });
            }, SCROLL_DELAY);
          });
        }
      },
      scrollToOffset
    };
  });
};
