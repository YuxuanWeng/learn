import { MouseEvent } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useEventListener } from 'usehooks-ts';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData } from '../types';
import { getTop, getVisibleRowIndex } from '../utils';
import { useTRowMultiSelect } from './useTRowMultiSelect';

export const useTRowMouseEvent = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { active, lineHeight, multiSelectEnabled } = useTableProps<T>();
  const { selecting, lastSelectedRow, lastSelectedRowKey, tBodyRef } = useTableState<T>();
  const { handleMultiSelect } = useTRowMultiSelect<T>(table);

  const handleMouseEnter = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, row: Row<T>) => {
    if (!active) return;

    // 有时下方的 handleMouseUp 获取不到鼠标按键松开的事件，故此处特殊处理
    if (!evt.buttons) {
      if (selecting.current) selecting.current = false;
      return;
    }

    const specialKeyPress = evt.ctrlKey || evt.metaKey || evt.shiftKey;

    if (selecting.current && !specialKeyPress && multiSelectEnabled) {
      handleMultiSelect(evt, row.index);
    }
  });

  const handleMouseDown = (evt: MouseEvent<HTMLDivElement>, row: Row<T>) => {
    if (!active) return;
    // 如果是鼠标右键，且已选择的数量大于 1
    if (evt.button === 2 && tableMeta?.selectedKeys?.size && tableMeta.selectedKeys.size > 1) return;

    // 因市场成交需浮窗需要捕捉该事件，故不能取消冒泡，为防止之后出错，此处仅注释掉
    // evt.stopPropagation();

    selecting.current = true;

    const rowKey = row.id ?? '';

    if (multiSelectEnabled && evt.shiftKey) {
      handleMultiSelect(evt, row.index);
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
      tableMeta?.selectRows?.(newSelectedKeys, evt);
    } else {
      tableMeta?.selectRows?.(new Set([rowKey]), evt);
    }

    if (lastSelectedRowKey !== rowKey) {
      lastSelectedRow.current = row;
    }
  };

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

      if (evt.clientY < top && !specialKeyPress) {
        // 向上勾选
        handleMultiSelect(evt, getVisibleRowIndex('top', lineHeight, tBodyScrollTop));
      } else if (evt.clientY > top + tBodyClientHeight && !specialKeyPress) {
        // 向下勾选
        handleMultiSelect(evt, getVisibleRowIndex('bottom', lineHeight, tBodyScrollTop, tBodyClientHeight));
      }
    }

    selecting.current = false;
  });

  return { handleMouseEnter, handleMouseDown };
};
