import { MouseEvent } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useEventListener } from 'usehooks-ts';
import { useTableProps } from '../../../providers/TablePropsProvider';
import { useTableState } from '../../../providers/TableStateProvider';
import { ExpandingRowKeysCache, RowData } from '../../../types';
import { getTop, getVisibleRowIndex } from '../../../utils';
import { useTRowMultiSelect } from './useTRowMultiSelect';

export const useTRowMouseEvent = <T extends RowData>(table: Table<T>, rowKeysCache: ExpandingRowKeysCache) => {
  const { meta: tableMeta } = table.options;
  const { active, lineHeight, multiSelectEnabled } = useTableProps<T>();
  const { selecting, lastSelectedRow, lastSelectedRowKey, tBodyRef } = useTableState<T>();
  const { handleMultiSelect } = useTRowMultiSelect<T>(table, rowKeysCache);

  const handleMouseEnter = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, row: Row<T>) => {
    if (!active) return;

    // 有时下方的 handleMouseUp 获取不到鼠标按键松开的事件，故此处特殊处理
    if (!evt.buttons) {
      if (selecting.current) selecting.current = false;
      return;
    }

    const specialKeyPress = evt.ctrlKey || evt.metaKey || evt.shiftKey;

    if (selecting.current && !specialKeyPress && multiSelectEnabled) {
      handleMultiSelect(evt, row.id);
    }
  });

  const handleMouseDown = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, row: Row<T>) => {
    if (!active) return;
    // 如果是鼠标右键，且已选择的数量大于 1
    if (evt.button === 2 && tableMeta?.selectedKeys?.size && tableMeta.selectedKeys.size > 1) return;

    // 点击父项时，取消选中其以下的子项，并阻止冒泡
    if (row?.original?.isGroupHeader) {
      // 阻止冒泡是以免被上层事件捕获然后清空选项
      evt.stopPropagation();

      const isExpanded = row.getIsExpanded();
      // 如果该父项没有打开，则表示点击父项会展开子项，此时不做任何处理
      if (!isExpanded) return;

      // 如果该父项已经打开，则表示点击父项会折叠子项，此时需要取消选中子项
      const newSelectedKeys = new Set(tableMeta?.selectedKeys ?? []);

      for (let i = 0, len = row.subRows.length; i < len; i++) {
        newSelectedKeys.delete(row.subRows[i].id);
      }

      tableMeta?.selectRows?.(newSelectedKeys, evt);
      return;
    }

    selecting.current = true;

    const rowKey = row.id ?? '';

    if (multiSelectEnabled && evt.shiftKey) {
      handleMultiSelect(evt, row.id);
      return;
    }

    if (evt.ctrlKey || evt.metaKey) {
      evt.preventDefault();

      const newSelectedKeys = new Set(tableMeta?.selectedKeys ?? []);
      if (tableMeta?.selectedKeys?.has(rowKey)) {
        newSelectedKeys.delete(rowKey);
      } else {
        // 如果不支持多选，先清空，再添加新的
        if (!multiSelectEnabled) newSelectedKeys.clear();
        newSelectedKeys.add(rowKey);
      }
      tableMeta?.selectRows?.(newSelectedKeys, evt, row.id);
    } else {
      tableMeta?.selectRows?.(new Set([rowKey]), evt, row.id);
    }

    if (lastSelectedRowKey !== rowKey) {
      lastSelectedRow.current = row;
    }
  });

  useEventListener('mouseup', _evt => {
    if (!active) return;
    if (!multiSelectEnabled) return;

    const evt = _evt as unknown as MouseEvent<HTMLDivElement>;

    if (selecting.current) {
      const top = getTop(tBodyRef?.current);
      const tBodyClientHeight = tBodyRef?.current?.clientHeight ?? 0;
      const tBodyScrollTop = tBodyRef?.current?.scrollTop ?? 0;
      /** 有特殊按键按下 */
      const specialKeyPress = evt.ctrlKey || evt.metaKey || evt.shiftKey;

      if (specialKeyPress) return;

      if (evt.clientY < top && !specialKeyPress) {
        // 向上勾选
        const topIndex = getVisibleRowIndex('top', lineHeight, tBodyScrollTop);
        let key = rowKeysCache.index2KeyCache.get(topIndex);
        // 如果没有 key，说明上下面的是父项，则再向下找一行，找不到就算了，这种情况比较极限，不兜底了（这里不用 while 是怕出现死循环）
        if (!key) key = rowKeysCache.index2KeyCache.get(topIndex + 1);

        if (key) handleMultiSelect(evt, key);
      } else if (evt.clientY > top + tBodyClientHeight && !specialKeyPress) {
        // 向下勾选
        const bottomIndex = getVisibleRowIndex('bottom', lineHeight, tBodyScrollTop, tBodyClientHeight);
        let key = rowKeysCache.index2KeyCache.get(bottomIndex);
        // 如果没有 key，说明最下面的是父项，则再向上找一行，找不到就算了，这种情况比较极限，不兜底了（这里不用 while 是怕出现死循环）
        if (!key) key = rowKeysCache.index2KeyCache.get(bottomIndex - 1);

        if (key) handleMultiSelect(evt, key);
      }
    }

    selecting.current = false;
  });

  return { handleMouseEnter, handleMouseDown };
};
