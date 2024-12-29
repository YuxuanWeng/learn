import { Table } from '@tanstack/react-table';
import { RowData } from '../types';
import { useTableContainerRect } from './useTableResizeObserver';

export const useTableWidth = <T extends RowData>(table: Table<T>) => {
  const containerRect = useTableContainerRect();
  const centerTotalSize = table.getRightTotalSize();

  if (containerRect && centerTotalSize < containerRect.width) return containerRect.width;
  return centerTotalSize;
};
