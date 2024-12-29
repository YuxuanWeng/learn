import { useEffect } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { isElement, isTextAreaElement, isTextInputElement } from '@fepkg/common/utils/element';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { SCROLL_DELAY } from '../constants';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData, ScrollToIndexHandler } from '../types';

const useKeyArrowUp = <T extends RowData>(table: Table<T>, scrollToIndex: ScrollToIndexHandler) => {
  const { meta: tableMeta } = table.options;
  const { active, arrowMoveSelectEnabled } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey } = useTableState<T>();

  const handleKeyArrowUp = useMemoizedFn((evt: KeyboardEvent) => {
    if (evt.key === KeyboardKeys.ArrowUp) {
      if (isElement(evt.target) && (isTextInputElement(evt.target) || isTextAreaElement(evt.target))) return;
      if (hasModalVisible()) return;
      if (hasRegistered('up')) return;

      evt.preventDefault();

      let lastSelectedRowIdx = -1;
      if (lastSelectedRowKey) {
        lastSelectedRowIdx = tableMeta?.rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      }

      const groupFirstKey = lastSelectedRow.current?.original?.groupItemRowKeys?.at(0);
      if (!groupFirstKey) return;

      const groupFirstIndex = tableMeta?.rowKeysCache.indexCache.get(groupFirstKey);

      // 如果已有选中的行，且选中行数量为一
      if (
        tableMeta?.selectedKeys &&
        tableMeta?.selectedKeys.size === 1 &&
        groupFirstIndex !== undefined &&
        lastSelectedRowIdx > groupFirstIndex
      ) {
        const { rows } = table.getRowModel();

        const prevRowIndex = lastSelectedRowIdx - 1;
        const row = rows[prevRowIndex];
        const rowKey = row?.id;
        if (row && rowKey) {
          requestAnimationFrame(() => {
            tableMeta?.selectRows?.(new Set([rowKey]), evt, row.id);
            lastSelectedRow.current = row;

            setTimeout(() => {
              scrollToIndex?.(prevRowIndex, { align: 'auto' });
            }, SCROLL_DELAY);
          });
        }
      }
    }
  });

  useEffect(() => {
    if (active && arrowMoveSelectEnabled) window.addEventListener('keydown', handleKeyArrowUp);
    return () => {
      if (active && arrowMoveSelectEnabled) window.removeEventListener('keydown', handleKeyArrowUp);
    };
  }, [active, arrowMoveSelectEnabled, handleKeyArrowUp]);
};

const useKeyArrowDown = <T extends RowData>(table: Table<T>, scrollToIndex: ScrollToIndexHandler) => {
  const { meta: tableMeta } = table.options;
  const { active, arrowMoveSelectEnabled } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey } = useTableState<T>();

  const handleKeyArrowDown = useMemoizedFn((evt: KeyboardEvent) => {
    if (evt.key === KeyboardKeys.ArrowDown) {
      if (isElement(evt.target) && (isTextInputElement(evt.target) || isTextAreaElement(evt.target))) return;
      if (hasRegistered('down')) return;
      if (hasModalVisible()) return;

      evt.preventDefault();

      let lastSelectedRowIdx = -1;
      if (lastSelectedRowKey) {
        lastSelectedRowIdx = tableMeta?.rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      }

      const groupLastKey = lastSelectedRow.current?.original?.groupItemRowKeys?.at(-1);
      if (!groupLastKey) return;

      const groupLastIndex = tableMeta?.rowKeysCache.indexCache.get(groupLastKey);

      // 如果已有选中的行，且选中行数量为一
      if (
        tableMeta?.selectedKeys &&
        tableMeta?.selectedKeys.size === 1 &&
        groupLastIndex !== undefined &&
        lastSelectedRowIdx < groupLastIndex
      ) {
        const { rows } = table.getRowModel();

        const nextRowIndex = lastSelectedRowIdx + 1;
        const row = rows[nextRowIndex];
        const rowKey = row?.id;
        if (row && rowKey) {
          requestAnimationFrame(() => {
            tableMeta?.selectRows?.(new Set([rowKey]), evt, row.id);
            lastSelectedRow.current = row;

            setTimeout(() => {
              scrollToIndex?.(nextRowIndex, { align: 'auto' });
            }, SCROLL_DELAY);
          });
        }
      }
    }
  });

  useEffect(() => {
    if (active && arrowMoveSelectEnabled) window.addEventListener('keydown', handleKeyArrowDown);
    return () => {
      if (active && arrowMoveSelectEnabled) window.removeEventListener('keydown', handleKeyArrowDown);
    };
  }, [active, arrowMoveSelectEnabled, handleKeyArrowDown]);
};

export const useGroupKeyArrowMove = <T extends RowData>(table: Table<T>, scrollToIndex: ScrollToIndexHandler) => {
  useKeyArrowUp(table, scrollToIndex);
  useKeyArrowDown(table, scrollToIndex);
};
