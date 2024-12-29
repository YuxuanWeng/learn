import { MouseEventHandler, useMemo, useState } from 'react';
import { PopoverPosition } from '@fepkg/common/types';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { IconReferSystem } from '@fepkg/icon-park-react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { ColumnOrderState } from '@tanstack/react-table';
import { THeadResizeProvider } from '../providers/THeadResizeProvider';
import { useTableProps } from '../providers/TablePropsProvider';
import { useTableState } from '../providers/TableStateProvider';
import { RowData, THeadProps } from '../types';
import { THeaderDragOverlay } from './DragOverlay';
import { THeaderResizeOverlay } from './ResizeOverlay';
import { SortableColumnHeader } from './SortableColumnHeader';
import '../index.less';

const reorderColumn = (draggedColId: string, targetColId: string, columnOrder: string[]): ColumnOrderState => {
  const draggedColIndex = columnOrder.indexOf(draggedColId);
  const targetColIndex = columnOrder.indexOf(targetColId);

  columnOrder.splice(draggedColIndex, 1);
  columnOrder.splice(targetColIndex, 0, draggedColId);

  return [...columnOrder];
};

const Inner = <T extends RowData>({ table, tableWidth, showHeaderDivide }: THeadProps<T>) => {
  const { showHeaderReorder, showHeaderResizer, showHeaderContextMenu, showHeaderDefaultSorter } = useTableProps<T>();
  const { tHeadRef } = useTableState();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 20 } }));
  const [sortActiveId, setSortActiveId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ x: 0, y: 0 });

  const { getRightFlatHeaders, getState, setColumnOrder } = table;
  const { meta: tableMeta } = table.options;
  const { columnOrder } = getState();
  const headers = getRightFlatHeaders();

  const sortActiveInfo = useMemo(() => {
    for (let i = 0, len = headers.length; i < len; i++) {
      const header = headers[i];
      if (sortActiveId === header.id) return { index: i, header };
    }
    return { index: 0 };
  }, [sortActiveId, headers]);

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = evt => {
    if (!showHeaderContextMenu) return;
    setOpen(true);
    setPosition({ x: evt.pageX, y: evt.pageY });
  };

  const handleMenuItemClick = () => {
    if (!showHeaderContextMenu) return;
    tableMeta?.triggerColumnSetting?.();
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setSortActiveId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over) {
      const newColumnOrder = reorderColumn(active.id as string, over.id as string, columnOrder);
      setColumnOrder(newColumnOrder);
    }

    setSortActiveId(null);
  };

  const handleDragCancel = () => {
    setSortActiveId(null);
  };

  const tHeadNode = (
    <div
      ref={tHeadRef}
      className="s-thead"
      onScroll={evt => {
        evt.stopPropagation();
        evt.preventDefault();
        return false;
      }}
      onContextMenu={handleContextMenu}
    >
      <div
        className="tr"
        style={{ width: tableWidth }}
      >
        {headers.map(header => {
          return (
            <SortableColumnHeader<T>
              key={header.id}
              table={table}
              header={header}
              showHeaderReorder={showHeaderReorder}
              showHeaderResizer={showHeaderResizer}
              showHeaderDefaultSorter={showHeaderDefaultSorter}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {showHeaderReorder ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={columnOrder}
            disabled={!showHeaderReorder}
          >
            {tHeadNode}
          </SortableContext>

          <THeaderDragOverlay
            table={table}
            header={sortActiveInfo?.header}
          />
        </DndContext>
      ) : (
        tHeadNode
      )}

      {/* 虚线背景色与表头一致，避免虚线样式异常 */}
      {showHeaderDivide && <div className="component-dashed-x-600 bg-gray-800 h-px" />}

      {showHeaderResizer && <THeaderResizeOverlay />}

      {showHeaderContextMenu && (
        <ContextMenu
          open={open}
          position={position}
          className="!p-0 !min-w-fit"
          onOpenChange={setOpen}
        >
          <MenuItem
            className="flex-center gap-2 !w-[116px] !h-9 !text-sm"
            onClick={handleMenuItemClick}
            icon={<IconReferSystem />}
          >
            表格设置
          </MenuItem>
        </ContextMenu>
      )}
    </>
  );
};

export const THead = <T extends RowData>(props: THeadProps<T>) => {
  return (
    <THeadResizeProvider>
      <Inner {...props} />
    </THeadResizeProvider>
  );
};
