import { MutableRefObject, useRef } from 'react';
import { Row } from '@tanstack/react-table';
import { createContainer } from 'unstated-next';
import { RowData } from '../types';

const TableStateContainer = createContainer(() => {
  const selecting = useRef(false);
  const lastSelectedRow = useRef<Row<RowData>>();

  const tHeadRef = useRef<HTMLDivElement>(null);
  const tBodyRef = useRef<HTMLDivElement>(null);
  const tRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  return {
    selecting,
    lastSelectedRow,
    lastSelectedRowKey: lastSelectedRow.current?.id,

    tHeadRef,
    tBodyRef,
    tRowRefs
  };
});

export const TableStateProvider = TableStateContainer.Provider;
export const useTableState = TableStateContainer.useContainer as <T extends RowData>() => Omit<
  ReturnType<typeof TableStateContainer.useContainer>,
  'lastSelectedRow'
> & {
  lastSelectedRow: MutableRefObject<Row<T> | undefined>;
};
