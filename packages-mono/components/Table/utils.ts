import { ExpandedState, Row } from '@tanstack/react-table';
import { MIN_CELL_WIDTH } from './constants';
import { GetRowKey, RowData } from './types';

export const getRowKey = <T extends RowData>(rowKey: string | GetRowKey<T>, original: T): string => {
  if (typeof rowKey === 'function') {
    return rowKey(original)?.toString();
  }
  return original[rowKey];
};

// 获取该元素到页面顶部的距离
export const getTop = (el?: HTMLElement | null) => {
  if (!el) return 0;

  const { offsetParent } = el;
  let offset = el.offsetTop;

  if (offsetParent instanceof HTMLElement) offset += getTop(offsetParent);
  return offset ?? 0;
};

// 获取表格可视区域的第一/最后行的index
export const getVisibleRowIndex = (
  position: 'top' | 'bottom',
  lineHeight: number,
  tBodyScrollTop: number,
  tBodyClientHeight?: number
) => {
  if (position === 'top') return Math.floor(tBodyScrollTop / lineHeight);
  return Math.floor(((tBodyClientHeight ?? 0) + tBodyScrollTop) / lineHeight);
};

export const getTableWidth = (
  sizeGetter: () => number,
  resizing: boolean,
  deltaOffset?: number | null,
  minSize?: number
) => {
  const width = sizeGetter() + (resizing ? deltaOffset ?? 0 : 0);
  return Math.max(width, minSize ?? MIN_CELL_WIDTH);
};

export const isParentNode = <T>(row: Row<T>) => !row.parentId;

export const isExpandParentNode = <T>(row: Row<T>) => row.getCanExpand() && row.depth === 0;

/** 获取当前页的展开项 */
export const getExpanded = <T extends RowData & { children?: T[] }>(
  rowKey: string | GetRowKey<T>,
  shrinkSet: Set<string>,
  data: T[]
) => {
  const expanded: ExpandedState = {};

  const appendExpanded = (list: T[]) => {
    for (const i of list) {
      const key = getRowKey(rowKey, i);
      if (!shrinkSet.has(key)) {
        expanded[key] = true;
      }

      appendExpanded(i.children ?? []);
    }
  };

  appendExpanded(data);

  return expanded;
};

/** 获取可见的单元格 */
export const getVisibleCells = <T extends RowData>(row: Row<T>) => {
  if (row?.original?.isGroupHeader) {
    const [header] = row.getLeftVisibleCells();
    return [header];
  }

  if (row?.original?.isGroupFooter) {
    const [, footer] = row.getLeftVisibleCells();
    return [footer];
  }
  return row.getRightVisibleCells();
};
