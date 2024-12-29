import { MouseEventHandler, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { useMergeRefs } from '@floating-ui/react';
import { Header, Table } from '@tanstack/react-table';
import { useMemoizedFn } from 'ahooks';
import { useTHeadResize } from '../providers/THeadResizeProvider';
import { RowData } from '../types';
import { getTableWidth } from '../utils';
import { ColumnHeader } from './ColumnHeader';

type SortableColumnHeaderProps<T extends RowData> = {
  table: Table<T>;
  header: Header<T, unknown>;
  showHeaderReorder?: boolean;
  showHeaderResizer?: boolean;
  showHeaderDefaultSorter?: boolean;
};

const always = () => false;

const resizerCls = cx(
  's-thead-th-resizer absolute -top-0.5 -right-0.5 w-1.5 h-10',
  'bg-transparent cursor-col-resize select-none touch-none'
);

export const SortableColumnHeader = <T extends RowData>({
  table,
  header,
  showHeaderReorder,
  showHeaderResizer,
  showHeaderDefaultSorter
}: SortableColumnHeaderProps<T>) => {
  const { meta: tableMeta } = table.options;
  const { column } = header;
  const { meta: columnMeta, minSize } = column.columnDef;
  const { reorderable = showHeaderReorder } = columnMeta ?? {};

  const resizing = header.column.getIsResizing();

  const { attributes, listeners, isDragging, setNodeRef } = useSortable({
    id: header.id,
    animateLayoutChanges: always,
    disabled: !reorderable
  });
  const { resizingTHeadRef } = useTHeadResize();
  const ref = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([ref, setNodeRef]);

  const handleSort = () => {
    if (columnMeta?.sortedField) tableMeta?.sortColumn?.(columnMeta.sortedField);
  };

  const handleResize: MouseEventHandler<HTMLDivElement> = useMemoizedFn(evt => {
    // 阻止冒泡，防止触发排序
    evt.stopPropagation();

    document.addEventListener(
      'mouseup',
      () => {
        if (columnMeta?.columnKey) {
          const width = getTableWidth(header.getSize, true, table.getState().columnSizingInfo?.deltaOffset, minSize);
          tableMeta?.resizeColumn?.(columnMeta.columnKey, width);
          tableMeta?.setColumnSizing(prev => {
            return { ...prev, [columnMeta.columnKey]: width };
          });

          resizingTHeadRef.current = null;
        }
      },
      { once: true }
    );

    resizingTHeadRef.current = ref.current;
    header.getResizeHandler()(evt);
  });

  // 添加一个全局鼠标移动样式
  useEffect(() => {
    if (!showHeaderResizer) return;

    if (resizing) document.body.classList.add('s-thead-resizing');
    else document.body.classList.remove('s-thead-resizing');
  }, [showHeaderResizer, resizing]);

  return (
    <ColumnHeader<T>
      ref={mergedRefs}
      table={table}
      header={header}
      resizer={
        showHeaderResizer && (
          <div
            className={resizerCls}
            onMouseDown={handleResize}
            // 阻止上级元素 onClick 的排序事件
            onClick={evt => evt.stopPropagation()}
            // 阻止上级元素 onPointerDown 的拖拽排序事件
            onPointerDown={evt => evt.stopPropagation()}
          />
        )
      }
      dragging={isDragging}
      resizing={resizing}
      showHeaderReorder={showHeaderReorder}
      showHeaderResizer={showHeaderResizer}
      showHeaderDefaultSorter={showHeaderDefaultSorter}
      onClick={handleSort}
      {...attributes}
      {...listeners}
    />
  );
};
