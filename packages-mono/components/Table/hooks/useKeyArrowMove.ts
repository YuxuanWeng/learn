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
import { RowData } from '../types';

const useKeyArrowUp = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { active, arrowMoveSelectEnabled } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey, tRowRefs } = useTableState<T>();

  const handleKeyArrowUp = useMemoizedFn((evt: KeyboardEvent) => {
    if (evt.key === KeyboardKeys.ArrowUp) {
      if (isElement(evt.target) && (isTextInputElement(evt.target) || isTextAreaElement(evt.target))) return;
      if (hasModalVisible()) return;
      if (hasRegistered('up')) return;

      evt.preventDefault();

      const { rows } = table.getRowModel();

      let lastSelectedRowIdx = -1;
      if (lastSelectedRowKey) {
        lastSelectedRowIdx = tableMeta?.rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      }

      // 如果已有选中的行，且选中行数量为一
      if (tableMeta?.selectedKeys && tableMeta?.selectedKeys.size === 1 && lastSelectedRowIdx > 0) {
        const prevRowIndex = lastSelectedRowIdx - 1;
        const row = rows[prevRowIndex];
        const rowKey = row?.id;
        if (row && rowKey) {
          requestAnimationFrame(() => {
            tableMeta?.selectRows?.(new Set([rowKey]), evt, row.id);
            lastSelectedRow.current = row;

            setTimeout(() => {
              tRowRefs.current?.[prevRowIndex]?.scrollIntoView({ block: 'nearest' });
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

const useKeyArrowDown = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { active, arrowMoveSelectEnabled } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey, tRowRefs } = useTableState<T>();

  const handleKeyArrowDown = useMemoizedFn((evt: KeyboardEvent) => {
    if (evt.key === KeyboardKeys.ArrowDown) {
      if (isElement(evt.target) && (isTextInputElement(evt.target) || isTextAreaElement(evt.target))) return;
      if (hasModalVisible()) return;
      if (hasRegistered('down')) return;

      evt.preventDefault();

      const { rows } = table.getRowModel();

      let lastSelectedRowIdx = -1;
      if (lastSelectedRowKey) {
        lastSelectedRowIdx = tableMeta?.rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      }

      // 如果已有选中的行，且选中行数量为一
      if (tableMeta?.selectedKeys && tableMeta?.selectedKeys.size === 1 && lastSelectedRowIdx < rows.length - 1) {
        const nextRowIndex = lastSelectedRowIdx + 1;
        const row = rows[nextRowIndex];
        const rowKey = row?.id;
        if (row && rowKey) {
          requestAnimationFrame(() => {
            lastSelectedRow.current = row;
            tableMeta?.selectRows?.(new Set([rowKey]), evt, lastSelectedRow.current?.id);

            setTimeout(() => {
              tRowRefs.current?.[nextRowIndex]?.scrollIntoView({ block: 'nearest' });
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

export const useKeyArrowMove = <T extends RowData>(table: Table<T>) => {
  useKeyArrowUp(table);
  useKeyArrowDown(table);
};
