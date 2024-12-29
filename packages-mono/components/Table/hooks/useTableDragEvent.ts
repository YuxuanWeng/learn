import { DragEventHandler } from 'react';

const handleDisableDrag: DragEventHandler<HTMLDivElement> = evt => {
  evt.preventDefault();
  evt.stopPropagation();
  return false;
};

export const useTableDragEvent = (draggable = false) => {
  if (draggable) return {};
  return {
    onDrag: handleDisableDrag,
    onDragStart: handleDisableDrag,
    onDragOver: handleDisableDrag,
    onDragEnter: handleDisableDrag,
    onDragEnd: handleDisableDrag,
    onDrop: handleDisableDrag
  };
};
