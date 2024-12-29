import { useMemo } from 'react';
import { VisibilityState } from '@tanstack/react-table';
import { ColumnSettingDef } from '../types';

const getShowSettingPlaceholder = (columnVisibility?: VisibilityState) => {
  if (!columnVisibility || !Object.keys(columnVisibility).length) return false;

  let keysNum = 0;
  let falsyValueNum = 0;

  for (const key in columnVisibility) {
    if (Object.prototype.hasOwnProperty.call(columnVisibility, key)) {
      keysNum += 1;
      if (!columnVisibility[key]) {
        falsyValueNum += 1;
      }
    }
  }
  return falsyValueNum === keysNum;
};

export const useTableColumnVisibility = <ColumnKey = string>(columnSettings?: ColumnSettingDef<ColumnKey>[]) => {
  const columnVisibilityCache = useMemo(() => {
    const visibility: VisibilityState = {};
    const visibleKeys: string[] = [];

    columnSettings?.forEach(item => {
      const columnKey = item.key as unknown as string;
      visibility[columnKey] = item?.visible ?? false;

      if (item?.visible) {
        visibleKeys.push(columnKey);
      }
    });

    const showSettingPlaceholder = getShowSettingPlaceholder(visibility);

    return { visibility, visibleKeys, showSettingPlaceholder };
  }, [columnSettings]);

  return { columnVisibilityCache };
};
