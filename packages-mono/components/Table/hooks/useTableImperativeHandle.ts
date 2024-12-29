import { useImperativeHandle } from 'react';
import { Table } from '@tanstack/react-table';
import { SCROLL_DELAY } from '../constants';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData } from '../types';

export const useTableImperativeHandle = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { tableRef } = useTableProps<T>();
  const { tHeadRef, tBodyRef, tRowRefs, lastSelectedRow } = useTableState<T>();

  useImperativeHandle(tableRef, () => {
    return {
      scrollRowIntoView(rowKey) {
        const { rows } = table.getRowModel();
        const rowIdx = tableMeta?.rowKeysCache.indexCache.get(rowKey) ?? -1;
        const row = rows[rowIdx];

        if (row && rowIdx > -1) {
          requestAnimationFrame(() => {
            tableMeta?.selectRows?.(new Set([rowKey]), undefined, row.id);
            lastSelectedRow.current = row;

            setTimeout(() => {
              tRowRefs?.current?.[rowIdx]?.scrollIntoView({ block: 'nearest' });
            }, SCROLL_DELAY);
          });
        }
      },
      scrollTo(options: ScrollToOptions) {
        tHeadRef.current?.scrollTo(options);
        tBodyRef.current?.scrollTo(options);
      }
    };
  });
};
