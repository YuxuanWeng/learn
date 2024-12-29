import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useMergeRefs } from '@floating-ui/react';
import { SortablePosition } from '@/types/sortable';
import { NavigatorItem } from './Item';
import { NavigatorItemId, NavigatorItemProps } from './types';
import { getInsertPosition } from './utils';

const always = () => true;

export const NavigatorSortableItem = forwardRef<HTMLDivElement, NavigatorItemProps>(({ position, ...props }, ref) => {
  const { id, sortable = true } = props;

  const { attributes, listeners, isDragging, active, over, setNodeRef, transition } = useSortable({
    id,
    animateLayoutChanges: always,
    disabled: !sortable
  });

  const mergedRefs = useMergeRefs([ref, setNodeRef]);

  position = sortable ? getInsertPosition(id, over, active) : undefined;
  if (id === NavigatorItemId.Market && over?.id === id) position = SortablePosition.After;

  return (
    <NavigatorItem
      ref={mergedRefs}
      style={{ transition }}
      sortable={sortable}
      dragging={isDragging}
      position={position}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
});
