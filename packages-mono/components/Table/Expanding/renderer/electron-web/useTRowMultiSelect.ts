import { MouseEvent } from 'react';
import { Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useTableProps } from '../../../providers/TablePropsProvider';
import { useTableState } from '../../../providers/TableStateProvider';
import { ExpandingRowKeysCache, RowData } from '../../../types';

export const useTRowMultiSelect = <T extends RowData>(table: Table<T>, rowKeysCache: ExpandingRowKeysCache) => {
  const { meta: tableMeta } = table.options;
  const { active } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey } = useTableState<T>();

  const handleMultiSelect = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, selectedRowKey: string) => {
    if (!active) return;

    const selectedRowIndex = rowKeysCache.indexCache.get(selectedRowKey);
    // 如果没有选中的值，说明可能滑拉到了父项，不用动就行
    if (selectedRowIndex === undefined) return;

    if (lastSelectedRowKey && rowKeysCache) {
      const lastSelectedRowIdx = rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      // 上次选中的值已不在当前列表中，是异常的表现
      if (lastSelectedRowIdx < 0) return;

      const diff = selectedRowIndex - lastSelectedRowIdx;
      if (diff < 0) {
        // 选择上面的兄弟
        const slice = rowKeysCache.orderedKeys.slice(lastSelectedRowIdx + diff, lastSelectedRowIdx + 1);
        const keys: string[] = [];

        for (let i = 0, len = slice.length; i < len; i++) {
          const item = slice[i];
          if (!item.canExpand) keys.push(item.key);
        }
        tableMeta?.selectRows?.(new Set(keys), evt, lastSelectedRow.current?.id);
      } else {
        // 选择下面的兄弟
        const slice = rowKeysCache.orderedKeys.slice(lastSelectedRowIdx, lastSelectedRowIdx + diff + 1);
        const keys: string[] = [];

        for (let i = 0, len = slice.length; i < len; i++) {
          const item = slice[i];
          if (!item.canExpand) keys.push(item.key);
        }

        tableMeta?.selectRows?.(new Set(keys), evt, lastSelectedRow.current?.id);
      }
    }
  });

  return { handleMultiSelect };
};
