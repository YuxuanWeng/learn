import { MouseEvent } from 'react';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { Row, Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useEventListener } from 'usehooks-ts';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData } from '../types';
import { getTop, getVisibleRowIndex } from '../utils';
import { useTRowMultiSelect } from './useTRowMultiSelect';

const getTargetIndex = (rowIdx: number, groupFirstIndex?: number, groupLastIndex?: number) => {
  let targetIdx = rowIdx;

  if (groupFirstIndex !== void 0 && targetIdx < groupFirstIndex) {
    // 如果 row.index 小于当前分组的首位下标，应不能再向上选择
    targetIdx = groupFirstIndex;
  } else if (groupLastIndex !== void 0 && targetIdx > groupLastIndex) {
    // 如果 row.index 大于当前分组的末位下标，应不能再向下选择
    targetIdx = groupLastIndex;
  }

  return targetIdx;
};

export const GROUP_TABLE_SELECTING_CLS = 's-group-table-selecting';

const changeSelecting = (selecting: boolean) => {
  if (selecting) document.body.classList.add(GROUP_TABLE_SELECTING_CLS);
  else document.body.classList.remove(GROUP_TABLE_SELECTING_CLS);

  return selecting;
};

export const useGroupTRowMouseEvent = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { active, lineHeight, multiSelectEnabled } = useTableProps<T>();
  const { selecting, lastSelectedRow, lastSelectedRowKey, tBodyRef } = useTableState<T>();
  const { handleMultiSelect: multiSelect } = useTRowMultiSelect<T>(table);

  const handleMultiSelect = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, selectedRowIndex: number) => {
    const rowOriginal = lastSelectedRow.current?.original;
    const groupFirstKey = rowOriginal?.groupItemRowKeys?.at(0);
    const groupLastKey = rowOriginal?.groupItemRowKeys?.at(-1);

    if (groupFirstKey && groupLastKey) {
      const groupFirstIndex = tableMeta?.rowKeysCache.indexCache.get(groupFirstKey);
      const groupLastIndex = tableMeta?.rowKeysCache.indexCache.get(groupLastKey);

      const targetIdx = getTargetIndex(selectedRowIndex, groupFirstIndex, groupLastIndex);
      multiSelect(evt, targetIdx);
    }
  });

  const handleMouseEnter = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, row: Row<T>) => {
    if (!active) return;

    // 有时下方的 handleMouseUp 获取不到鼠标按键松开的事件，故此处特殊处理
    if (!evt.buttons) {
      if (selecting.current) selecting.current = changeSelecting(false);
      return;
    }

    // 如果焦点在表格的input中，进入到某一行时就不用触发多选了
    if (isTextInputElement(document.activeElement)) return;

    const specialKeyPress = evt.ctrlKey || evt.metaKey || evt.shiftKey;

    if (selecting.current && !specialKeyPress && multiSelectEnabled) {
      handleMultiSelect(evt, row.index);
    }
  });

  const handleMouseDown = useMemoizedFn((evt: MouseEvent<HTMLDivElement>, row: Row<T>) => {
    if (!active) return;
    // 如果是鼠标右键，且已选择的数量大于 1
    if (evt.button === 2 && tableMeta?.selectedKeys?.size && tableMeta.selectedKeys.size > 1) return;

    if (row?.original?.isGroupHeader) return;

    // 如果当前焦点在input中，此时的鼠标操作是针对input的，接下来的逻辑就不用考虑了
    if (isTextInputElement(document.activeElement)) return;

    selecting.current = changeSelecting(true);

    const rowKey = row.id ?? '';

    if (multiSelectEnabled && evt.shiftKey) {
      handleMultiSelect(evt, row.index);
      return;
    }

    /** 是否为相同分组 */
    const isSameGroup = row.original?.groupHeaderRowKey === lastSelectedRow.current?.original?.groupHeaderRowKey;

    if (multiSelectEnabled && (evt.ctrlKey || evt.metaKey) && isSameGroup) {
      evt.preventDefault();

      const newSelectedKeys = new Set(tableMeta?.selectedKeys ?? []);
      if (tableMeta?.selectedKeys?.has(rowKey)) {
        newSelectedKeys.delete(rowKey);
      } else {
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

      // 取消选中状态
      document.getSelection()?.empty();
      selecting.current = changeSelecting(false);
    }
  });

  return { handleMouseEnter, handleMouseDown };
};
