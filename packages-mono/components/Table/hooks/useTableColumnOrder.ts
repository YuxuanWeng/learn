import { useEffect, useState } from 'react';
import { ColumnOrderState } from '@tanstack/react-table';
import { isEqual } from 'lodash-es';
import { GROUP_HEADER_ID } from '../constants';
import { ColumnSettingDef } from '../types';

export const useTableColumnOrder = <ColumnKey = string>(
  columnSettings?: ColumnSettingDef<ColumnKey>[],
  isExpandTable = false
) => {
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => {
    return columnSettings?.map(item => item.key as unknown as string) ?? [];
  });

  // Sync ColumnOrder
  useEffect(() => {
    setColumnOrder(prev => {
      const newOrder = columnSettings?.map(item => item.key as unknown as string) ?? [];
      if (isEqual(newOrder, prev)) return prev;
      // 如果是支持扩展的列表，列表第一列永远是表示扩展行的列
      if (isExpandTable) {
        return [GROUP_HEADER_ID].concat(newOrder);
      }
      return newOrder;
    });
  }, [columnSettings, isExpandTable]);

  return [columnOrder, setColumnOrder] as const;
};
