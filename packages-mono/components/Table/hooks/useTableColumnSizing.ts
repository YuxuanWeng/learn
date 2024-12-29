import { useEffect, useState } from 'react';
import { ColumnSizingState } from '@tanstack/react-table';
import { isEqual } from 'lodash-es';
import { ColumnSettingDef } from '../types';

export const useTableColumnSizing = <ColumnKey = string>(columnSettings?: ColumnSettingDef<ColumnKey>[]) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    return (
      columnSettings?.reduce(
        (prev, cur) => ({ ...prev, [cur.key as unknown as string]: cur.width }),
        {} as ColumnSizingState
      ) ?? {}
    );
  });

  // Sync ColumnSizing
  useEffect(() => {
    setColumnSizing(prevSizing => {
      const newSizing =
        columnSettings?.reduce(
          (prev, cur) => ({ ...prev, [cur.key as unknown as string]: cur.width }),
          {} as ColumnSizingState
        ) ?? {};
      if (isEqual(newSizing, prevSizing)) return prevSizing;
      return newSizing;
    });
  }, [columnSettings]);

  return [columnSizing, setColumnSizing] as const;
};
