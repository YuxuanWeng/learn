import { Context, PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { LineHeightMap } from '../constants';
import { RowData, TableProps } from '../types';

type TablePropsContextType<T extends RowData = object, ColumnKey = string, SortedField = string> =
  | (TableProps<T, ColumnKey, SortedField> & { lineHeight: number })
  | undefined;

const TablePropsContext = createContext<TablePropsContextType>(undefined);

export const TablePropsProvider = <T extends RowData, ColumnKey = string, SortedField = string>({
  children,
  active = true,
  size = 'sm',
  hasColumnSettings = true,
  cssVirtual = true,
  multiSelectEnabled = true,
  arrowMoveSelectEnabled = true,
  keyboardSelectAllEnabled = true,
  showWatermark = true,
  showHeader = true,
  showHeaderReorder = true,
  showHeaderResizer = true,
  showHeaderContextMenu = true,
  showPlaceholder = true,
  showHeaderDivide = true,
  ...restProps
}: PropsWithChildren<TableProps<T, ColumnKey, SortedField>>) => {
  const lineHeight = LineHeightMap[size];
  const contextValue = useMemo(
    () =>
      ({
        active,
        size,
        lineHeight,
        hasColumnSettings,
        cssVirtual,
        multiSelectEnabled,
        arrowMoveSelectEnabled,
        keyboardSelectAllEnabled,
        showWatermark,
        showHeader,
        showHeaderReorder,
        showHeaderResizer,
        showHeaderContextMenu,
        showPlaceholder,
        showHeaderDivide,
        ...restProps
      }) as TablePropsContextType,
    [
      active,
      size,
      lineHeight,
      hasColumnSettings,
      cssVirtual,
      multiSelectEnabled,
      arrowMoveSelectEnabled,
      keyboardSelectAllEnabled,
      showWatermark,
      showHeader,
      showHeaderReorder,
      showHeaderResizer,
      showHeaderContextMenu,
      showPlaceholder,
      showHeaderDivide,
      restProps
    ]
  );

  return <TablePropsContext.Provider value={contextValue}>{children}</TablePropsContext.Provider>;
};

export const useTableProps = <T extends RowData, ColumnKey = string, SortedField = string>() => {
  const context = useContext<TablePropsContextType<T, ColumnKey, SortedField>>(
    TablePropsContext as Context<TablePropsContextType<T, ColumnKey, SortedField>>
  );

  if (!context) {
    throw new Error('No value provided for context');
  }

  return context;
};
