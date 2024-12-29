import { PropsWithChildren } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { S_TABLE_ATOM_SCOPE } from '../constants';
import { RowData, TableProps } from '../types';
import { TablePropsProvider } from './TablePropsProvider';
import { TableStateProvider } from './TableStateProvider';

export const TableProvider = <T extends RowData, ColumnKey = string, SortedField = string>({
  children,
  ...props
}: PropsWithChildren<TableProps<T, ColumnKey, SortedField>>) => {
  return (
    <JotaiProvider scope={S_TABLE_ATOM_SCOPE}>
      <TablePropsProvider {...props}>
        <TableStateProvider>{children}</TableStateProvider>
      </TablePropsProvider>
    </JotaiProvider>
  );
};
