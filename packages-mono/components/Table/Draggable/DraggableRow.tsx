import cx from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { TRow } from '../TRow';
import { useTRowMouseEvent } from '../hooks/useTRowMouseEvent';
import { useTableState } from '../providers/TableStateProvider';
import { DraggableTRowProps, RowData } from '../types';

export const DraggableRow = <T extends RowData>({ table, dragging, row }: DraggableTRowProps<T>) => {
  const { attributes, isOver, overIndex, activeIndex, listeners, isDragging, setNodeRef } = useSortable({
    id: row.id
  });

  const { tRowRefs } = useTableState();
  const { handleMouseDown } = useTRowMouseEvent(table);
  const { meta: tableMeta } = table.options;
  const selected = !!tableMeta?.selectedKeys?.has(row.id ?? '');
  const disabled = !!tableMeta?.disabledKeys?.has(row.id ?? '');

  return (
    <TRow<T>
      className={cx(
        dragging
          ? '!bg-gray-800/80 before:!border-gray-500 before:!rounded-lg rounded-lg backdrop-blur-xs'
          : 'draggable-tr',
        isOver && overIndex > activeIndex ? 'drop-tr-target-down' : '',
        isOver && overIndex < activeIndex ? 'drop-tr-target-up' : ''
      )}
      ref={node => {
        setNodeRef(node);
        tRowRefs.current[row.index] = node;
      }}
      draggable
      style={{
        // 禁用拖拽状态的鼠标事件
        pointerEvents: dragging ? 'none' : 'auto',
        opacity: isDragging ? 0.4 : 1
      }}
      {...listeners}
      {...attributes}
      tabIndex={-1}
      table={table}
      row={row}
      selected={selected}
      disabled={disabled}
      onMouseDown={evt => handleMouseDown(evt, row)}
    />
  );
};
