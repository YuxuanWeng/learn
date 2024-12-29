import { MouseEventHandler, useMemo, useState } from 'react';
import cx from 'classnames';
import { isTextInputElement } from '@fepkg/common/utils/element';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useEventListener } from 'usehooks-ts';
import { useTBodyScrollEvent } from '../hooks/useTBodyScrollEvent';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData, TBodyProps } from '../types';
import { DraggableRow } from './DraggableRow';

export const DraggableTBody = <T extends RowData>({ className, table, tableWidth, ...restProps }: TBodyProps<T>) => {
  const { active: tableActive, copyEnabled, onDrag } = useTableProps<T>();
  const { tBodyRef, selecting } = useTableState();
  const { handleTBodyWrapperScroll, handleContainerWheel } = useTBodyScrollEvent();

  const tbodyCls = cx('s-tbody', className);
  const { rows } = table.getRowModel();
  const { meta: tableMeta } = table.options;

  const handleTBodyMouseDown: MouseEventHandler<HTMLDivElement> = evt => {
    if (!tableActive) return;
    // evt.preventDefault();
    if (!selecting.current && evt.buttons !== 2) {
      // 点击空白区域，清空选项（避开滚动条）
      tableMeta?.selectRows?.(new Set(), evt);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 20 } }));

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [draggable, setDraggable] = useState(false);

  const activeInfo = useMemo(() => {
    for (let i = 0, len = rows.length; i < len; i++) {
      const item = rows[i];
      if (activeId === rows[i].id) return { index: i, item };
    }
    return { index: 0 };
  }, [activeId, rows]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragOverEvent) => {
    if (!event.active?.id) return;
    const dragValue = event.active.id.toString();
    const dropValue = event.over?.id.toString() ?? '';
    // if (dragValue === dropValue) return;
    if (!dropValue) return;
    const draggedIndex = table.getRow(dragValue).index;
    const targetIndex = table.getRow(dropValue).index;
    const list = table.options.data;
    list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, table.getRow(dragValue).original);
    onDrag?.([...list]);
  };

  useEventListener('focusin', () => setDraggable(isTextInputElement(document.activeElement)));

  return (
    <div
      ref={tBodyRef}
      className="s-tbody-wrapper s-drag-table-wrapper"
      onScroll={handleTBodyWrapperScroll}
      onWheel={handleContainerWheel}
      {...restProps}
    >
      <div
        tabIndex={-1}
        className={tbodyCls}
        style={{ width: tableWidth }}
        onMouseDown={handleTBodyMouseDown}
        // 阻止复制元素
        onKeyDown={evt => {
          if (evt.key.toLowerCase() === KeyboardKeys.KeyC) {
            if (evt.ctrlKey || evt.metaKey) {
              if (!copyEnabled) evt.preventDefault();
            }
          }
        }}
      >
        <div className="s-tbody-inner">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              disabled={draggable}
              items={rows.map(i => i.id)}
            >
              {rows.map(row => {
                return (
                  <DraggableRow
                    key={row.id}
                    table={table}
                    row={row}
                  />
                );
              })}
            </SortableContext>

            <DragOverlay dropAnimation={null}>
              {activeInfo.item && (
                <DraggableRow
                  table={table}
                  dragging
                  row={rows[activeInfo.index]}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};
