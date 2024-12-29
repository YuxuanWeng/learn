import { useEffect } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { isElement, isTextAreaElement, isTextInputElement } from '@fepkg/common/utils/element';
import { hasRegistered } from '@fepkg/common/utils/hotkey/register';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useTableProps } from '../providers/TablePropsProvider';
import { RowData } from '../types';

export const useKeyAllSelect = <T extends RowData>(table: Table<T>) => {
  const { meta: tableMeta } = table.options;
  const { active, keyboardSelectAllEnabled } = useTableProps<T>();

  const handleKeyAllSelect = useMemoizedFn((evt: KeyboardEvent) => {
    if (hasModalVisible()) return;

    if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === KeyboardKeys.KeyA) {
      if (isElement(evt.target) && (isTextInputElement(evt.target) || isTextAreaElement(evt.target))) return;
      if (hasRegistered('cmd+A') || hasRegistered('ctrl+A')) return;

      evt.preventDefault();
      evt.stopPropagation();

      if (tableMeta?.rowKeysCache) {
        tableMeta?.selectRows?.(new Set(tableMeta?.rowKeysCache.keys), evt);
      }
    }
  });

  useEffect(() => {
    if (active && keyboardSelectAllEnabled) window.addEventListener('keydown', handleKeyAllSelect);
    return () => {
      if (active && keyboardSelectAllEnabled) window.removeEventListener('keydown', handleKeyAllSelect);
    };
  }, [active, keyboardSelectAllEnabled, handleKeyAllSelect]);
};
