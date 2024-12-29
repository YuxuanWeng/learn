import { DragOverlay, useDndContext } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { SortableData } from '@dnd-kit/sortable';
import { useTableState } from '../providers/TableStateProvider';
import { RowData, THeaderOverlayProps } from '../types';
import { ColumnHeader } from './ColumnHeader';

export const THeaderDragOverlay = <T extends RowData>({ table, header }: THeaderOverlayProps<T>) => {
  const dnd = useDndContext();
  const { tHeadRef } = useTableState();

  if (!header) return null;

  const overlayEl = dnd.dragOverlay.nodeRef.current;
  const overlayElWidth = dnd.dragOverlay.rect?.width ?? 0;

  const tHeadLeft = tHeadRef.current?.getBoundingClientRect().left ?? 0;
  const overlayLeft = overlayEl?.getBoundingClientRect().left ?? 0;

  const overIdx = (dnd.over?.data?.current as SortableData)?.sortable?.index ?? 0;
  const activeIdx = (dnd.active?.data?.current as SortableData)?.sortable?.index ?? 0;

  const overLeft = dnd.over?.rect?.left ?? 0;
  const overWidth = dnd.over?.rect?.width ?? 0;

  let translateX: number | undefined;
  if (overIdx < activeIdx) {
    translateX = overLeft - tHeadLeft;
  } else if (overIdx > activeIdx) {
    translateX = overLeft - tHeadLeft + overWidth;
  }

  return (
    <>
      <DragOverlay
        dropAnimation={null}
        modifiers={[snapCenterToCursor]}
      >
        <ColumnHeader<T>
          className="!bg-gray-800/80 !border-primary-100 backdrop-blur-xs"
          table={table}
          header={header}
        />
      </DragOverlay>

      <div
        className="z-[100] absolute top-0 left-0 w-px h-full bg-black/40 will-change-transform"
        style={{ transform: `translateX(${overlayLeft - tHeadLeft}px)`, width: overlayElWidth }}
      />

      <div
        className="z-[100] absolute top-0 left-0 w-0.5 h-full bg-primary-100 will-change-transform"
        style={{ transform: `translateX(${translateX}px)`, display: translateX !== void 0 ? 'block' : 'none' }}
      />
    </>
  );
};
