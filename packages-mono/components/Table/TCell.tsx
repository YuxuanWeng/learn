import { memo } from 'react';
import cx from 'classnames';
import { flexRender } from '@tanstack/react-table';
import { isEqual } from 'lodash-es';
import { useTableDragEvent } from './hooks/useTableDragEvent';
import { RowData, TCellProps } from './types';

export const TCell = <T extends RowData>({ tableMeta, row, cell, width, draggable }: TCellProps<T>) => {
  const { meta: columnMeta } = cell.column.columnDef;

  const tdCls = cx(
    'shihe-table-cell td',
    typeof columnMeta?.tdCls === 'function' ? columnMeta?.tdCls(cell.row) : columnMeta?.tdCls
  );

  const dragEvents = useTableDragEvent(draggable);

  const content = flexRender(cell.column.columnDef.cell, cell.getContext()) as JSX.Element;

  if (row?.original?.isGroupHeader || row?.original?.isGroupFooter) return content;

  return (
    <div
      className={tdCls}
      style={{ width }}
      {...dragEvents}
      onMouseDown={evt => {
        tableMeta?.triggerCellMouseDown?.(evt, row.original, columnMeta?.columnKey);
      }}
      onMouseUp={evt => {
        tableMeta?.triggerCellMouseUp?.(evt, row.original, columnMeta?.columnKey);
      }}
      onMouseEnter={evt => {
        tableMeta?.triggerCellMouseEnter?.(evt, row.original, columnMeta?.columnKey);
      }}
      onMouseLeave={evt => {
        tableMeta?.triggerCellMouseLeave?.(evt, row.original, columnMeta?.columnKey);
      }}
      onDoubleClick={evt => {
        tableMeta?.triggerCellDoubleClick?.(evt, row.original, columnMeta?.columnKey);
      }}
      onClick={evt => {
        tableMeta?.triggerCellClick?.(evt, row.original, columnMeta?.columnKey);
      }}
      onContextMenu={evt => {
        tableMeta?.triggerCellContextMenu?.(evt, row.original, columnMeta?.columnKey);
      }}
    >
      {content}
    </div>
  );
};

export const PureTCell = memo(TCell, (prev, next) => {
  return (
    isEqual(prev?.row?.original, next?.row?.original) &&
    prev.width === next.width &&
    prev?.expanded === next?.expanded &&
    prev?.row?.parentId === next?.row?.parentId
  );
}) as typeof TCell;
