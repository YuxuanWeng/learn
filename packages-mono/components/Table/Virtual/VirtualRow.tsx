import { ForwardedRef, forwardRef, memo } from 'react';
import { useVirtual } from 'react-virtual';
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
import { PureTCell } from '../TCell';
import { useTableDragEvent } from '../hooks/useTableDragEvent';
import { RowData, TRowProps } from '../types';
import { getTableWidth, getVisibleCells } from '../utils';

type TCellContainerProps<T extends RowData> = {
  table: Table<T>;
  row: Row<T>;
  virtualizer: ReturnType<typeof useVirtual>;
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

type VirtualRowProps<T extends RowData> = TRowProps<T> & {
  /** 列表横向虚拟滚动 */
  rowVirtualizer: ReturnType<typeof useVirtual>;
};

const TCellContainer = <T extends RowData>({ table, row, expanded, virtualizer }: TCellContainerProps<T>) => {
  const visibleCells = getVisibleCells(row);
  const { virtualItems, totalSize } = virtualizer;
  const paddingLeft = virtualItems.length > 0 ? virtualItems[0]?.start ?? 0 : 0;
  const paddingRight = virtualItems.length > 0 ? totalSize - (virtualItems.at(-1)?.end ?? 0) : 0;

  return (
    <>
      {paddingLeft > 0 && <div style={{ width: paddingLeft }} />}
      {virtualItems.map(item => {
        const cell = visibleCells[item.index];
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
      {paddingRight > 0 && <div style={{ width: paddingRight }} />}
    </>
  );
};

const PureTCellContainer = memo(TCellContainer) as typeof TCellContainer;

const TRowInner = <T extends RowData>(
  {
    table,
    className,
    row,
    selected,
    disabled,
    draggable,
    onMouseEnter,
    onMouseDown,
    rowVirtualizer,
    ...rest
  }: VirtualRowProps<T>,
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
        virtualizer={rowVirtualizer}
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

export const VirtualRow = forwardRef(TRowInner) as <T extends RowData>(
  props: VirtualRowProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof TRowInner>;
