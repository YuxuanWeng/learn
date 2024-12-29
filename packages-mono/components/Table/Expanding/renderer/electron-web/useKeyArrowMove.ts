import { useEffect } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { isElement, isTextAreaElement, isTextInputElement } from '@fepkg/common/utils/element';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { SCROLL_DELAY } from '../../../constants';
import { useTableProps } from '../../../providers/TablePropsProvider';
import { useTableState } from '../../../providers/TableStateProvider';
import { ExpandingRowKeysCache, RowData } from '../../../types';

const useKeyArrowUp = <T extends RowData>(table: Table<T>, rowKeysCache: ExpandingRowKeysCache) => {
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
        lastSelectedRowIdx = rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      }

      // 如果已有选中的行，且选中行数量为一
      if (tableMeta?.selectedKeys && tableMeta?.selectedKeys.size === 1 && lastSelectedRowIdx > 0) {
        let prevRowIndex = lastSelectedRowIdx - 1;
        let row = rows[prevRowIndex];
        let rowKey = row?.id;

        // 如果前一行不存在索引，可能为父项，需要跳过，并选中其前一项
        if (!rowKeysCache.index2KeyCache.has(prevRowIndex)) {
          prevRowIndex -= 1;
          row = rows[prevRowIndex];
          rowKey = row?.id;
        }

        // 如果不能再往前了，停止
        if (prevRowIndex < 0) return;

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

const useKeyArrowDown = <T extends RowData>(table: Table<T>, rowKeysCache: ExpandingRowKeysCache) => {
  const { meta: tableMeta } = table.options;
  const { active } = useTableProps<T>();
  const { lastSelectedRow, lastSelectedRowKey, tRowRefs } = useTableState<T>();

  const handleKeyArrowDown = useMemoizedFn((evt: KeyboardEvent) => {
    if (evt.key === KeyboardKeys.ArrowDown) {
      if (isElement(evt.target) && (isTextInputElement(evt.target) || isTextAreaElement(evt.target))) return;
      if (hasRegistered('down')) return;
      if (hasModalVisible()) return;

      evt.preventDefault();

      const { rows } = table.getRowModel();

      let lastSelectedRowIdx = -1;
      if (lastSelectedRowKey) {
        lastSelectedRowIdx = rowKeysCache.indexCache.get(lastSelectedRowKey) ?? -1;
      }

      // 如果已有选中的行，且选中行数量为一
      if (tableMeta?.selectedKeys && tableMeta?.selectedKeys.size === 1 && lastSelectedRowIdx < rows.length - 1) {
        let nextRowIndex = lastSelectedRowIdx + 1;
        let row = rows[nextRowIndex];
        let rowKey = row?.id;

        // 如果后一行不存在索引，可能为父项，需要跳过，并选中其后一项
        if (!rowKeysCache.index2KeyCache.has(nextRowIndex)) {
          nextRowIndex += 1;
          row = rows[nextRowIndex];
          rowKey = row?.id;
        }

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
    if (active) window.addEventListener('keydown', handleKeyArrowDown);
    return () => {
      if (active) window.removeEventListener('keydown', handleKeyArrowDown);
    };
  }, [active, handleKeyArrowDown]);
};

export const useKeyArrowMove = <T extends RowData>(table: Table<T>, rowKeysCache: ExpandingRowKeysCache) => {
  useKeyArrowUp(table, rowKeysCache);
  useKeyArrowDown(table, rowKeysCache);
};
