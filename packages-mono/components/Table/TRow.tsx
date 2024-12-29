import { ForwardedRef, forwardRef, memo } from 'react';
import cx from 'classnames';
import { IconDrag } from '@fepkg/icon-park-react';
import {
  ColumnOrderState,
  ColumnSizingInfoState,
  ColumnSizingState,
  Row,
  Table,
  VisibilityState
} from '@tanstack/react-table';
import { PureTCell } from './TCell';
import { useTableDragEvent } from './hooks/useTableDragEvent';
import { RowData, TRowProps } from './types';
import { getTableWidth, getVisibleCells } from './utils';

type TCellContainerProps<T extends RowData> = {
  table: Table<T>;
  row: Row<T>;
  expanded?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  columnSizingInfo?: ColumnSizingInfoState;
  // eslint-disable-next-line react/no-unused-prop-types
  columnSizing?: ColumnSizingState;
  // eslint-disable-next-line react/no-unused-prop-types
  columnOrder?: ColumnOrderState;
  // eslint-disable-next-line react/no-unused-prop-types
  columnVisibility?: VisibilityState;
};

const TCellContainer = <T extends RowData>({ table, row, expanded }: TCellContainerProps<T>) => {
  const visibleCells = getVisibleCells(row);

  return (
    <>
      {visibleCells.map(cell => {
        const { minSize, meta } = cell.column.columnDef;
        const resizing = cell.column.getIsResizing();
        let width: string | number;

        if (row?.original?.isGroupHeader || row?.original?.isGroupFooter) {
          width = '100%';
        } else {
          width = getTableWidth(cell.column.getSize, resizing, table.getState().columnSizingInfo?.deltaOffset, minSize);
        }

        return (
          <PureTCell<T>
            key={cell.id}
            tableMeta={table.options.meta}
            row={row}
            cell={cell}
            width={width}
            expanded={meta?.expandable ? expanded : undefined}
          />
        );
      })}
    </>
  );
};

const PureTCellContainer = memo(TCellContainer) as typeof TCellContainer;

const TRowInner = <T extends RowData>(
  { table, className, row, selected, disabled, draggable, onMouseEnter, onMouseDown, ...rest }: TRowProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const trCls = cx('tr group', selected && 'selected', disabled && 'disabled', className);

  const { columnSizingInfo, columnOrder, columnSizing, columnVisibility } = table.getState();
  const dragEvents = useTableDragEvent();

  return (
    <div
      ref={ref}
      className={trCls}
      draggable={false}
      onClick={evt => evt.stopPropagation()}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      {...rest}
      {...dragEvents}
    >
      {/* 如果支持拖拽，需要展示这个表示可拖拽的图标 */}
      {draggable ? <IconDrag className="drag-tips text-gray-100 flex-center" /> : null}
      <PureTCellContainer
        table={table}
        row={row}
        expanded={row.getIsExpanded()}
        columnSizingInfo={columnSizingInfo}
        columnOrder={columnOrder}
        columnSizing={columnSizing}
        columnVisibility={columnVisibility}
      />
    </div>
  );
};

export const TRow = forwardRef(TRowInner) as <T extends RowData>(
  props: TRowProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof TRowInner>;
