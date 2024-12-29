import { MouseEvent } from 'react';
import { Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData } from '../types';

export const useTRowMultiSelect = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { active } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey } = useTableState<T>();

  const handleMultiSelect = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, selectedRowIndex: number) => {
    if (!active) return;

    if (lastSelectedRowKey && tableMeta?.rowKeysCache) {
      const lastSelectedRowIdx = tableMeta.rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      // 上次选中的值已不在当前列表中，是异常的表现
      if (lastSelectedRowIdx < 0) return;

      const diff = selectedRowIndex - lastSelectedRowIdx;
      if (diff < 0) {
        // 选择上面的兄弟
        tableMeta?.selectRows?.(
          new Set(tableMeta.rowKeysCache.orderedKeys.slice(lastSelectedRowIdx + diff, lastSelectedRowIdx + 1)),
          evt,
          lastSelectedRow.current?.id
        );
      } else {
        // 选择下面的兄弟
        tableMeta?.selectRows?.(
          new Set(tableMeta.rowKeysCache.orderedKeys.slice(lastSelectedRowIdx, lastSelectedRowIdx + diff + 1)),
          evt,
          lastSelectedRow.current?.id
        );
      }
    }
  });

  return { handleMultiSelect };
};
