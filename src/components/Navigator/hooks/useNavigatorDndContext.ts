import { useRef } from 'react';
import { useRerender } from '@fepkg/common/hooks';
import { DragEndEvent, DragMoveEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEventListener } from 'usehooks-ts';
import { SortablePosition } from '@/types/sortable';
import { DROPPABLE_AREA_ID } from '../constants';
import { useNavigator } from '../providers/NavigatorProvider';
import { NavigatorItemId } from '../types';
import { getInsertPosition } from '../utils';

const reorder = <T>(list: T[], from: number, to: number) => {
  const res = [...list];
  res.splice(to < 0 ? res.length + to : to, 0, res.splice(from, 1)[0]);

  return res;
};

export const useNavigatorDndContext = () => {
  const { navigators, activeInfo, updateMenuItems, setActiveId, setMoreOpen } = useNavigator();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 20 } }));

  const positionCache = useRef<SortablePosition | undefined>();
  const render = useRerender();

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as NavigatorItemId);
    setMoreOpen(true);
  };

  const onDragCancel = () => {
    setActiveId(null);
    setMoreOpen(false);
  };

  const onDragMove = ({ active, over }: DragMoveEvent) => {
    if (!over) return;
    if (over.id === active?.id) return;

    const translated = active?.rect.current.translated;
    if (!translated) return;

    const position = getInsertPosition(over.id, over, active);

    if (positionCache.current !== position) {
      positionCache.current = position;
      render();
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (activeInfo.index !== undefined && over) {
      const isOveredFixedItem = navigators.all.some(item => item?.fixed && item.id === over.id);
      // 如果悬浮在 「更多」 或者 droppable area 内，说明需要固定隐藏
      const fixed = over.id === NavigatorItemId.More || over.id === DROPPABLE_AREA_ID || isOveredFixedItem;

      const items = navigators.all.map(item => {
        if (activeInfo?.item?.id === item.id) return { ...item, fixed };
        return item;
      });

      const from = activeInfo.index;

      switch (over.id) {
        case NavigatorItemId.Market:
          // over 为行情看板时，只能往下插入排序
          updateMenuItems(reorder(items, from, 1));
          break;
        case NavigatorItemId.More:
        case DROPPABLE_AREA_ID:
          // 拖到到更多按钮处时，将其固定在更多弹窗内
          updateMenuItems(reorder(items, from, -1));
          break;
        default: {
          let to = navigators.keys.indexOf(over.id as NavigatorItemId);

          if (over.id && activeInfo.item?.id !== over.id) {
            const position = getInsertPosition(over.id, over, active);
            if (!position) return;

            // 如果是从后往前插入
            if (from > to) {
              // 如果是需要插入 over 的 after 时，则实际上的 to 是 over 后面一项
              if (position === SortablePosition.After) to += 1;
            } else {
              // 如果是从前往后插入
              // 如果是需要插入 over 的 before 时，则实际上的 to 是 over 前面一项
              // eslint-disable-next-line no-lonely-if
              if (position === SortablePosition.Before) {
                if (to !== 1) to -= 1;
              }
            }

            updateMenuItems(reorder(items, from, to));
          }
          break;
        }
      }
    }

    onDragCancel();
  };

  useEventListener(
    'mouseleave',
    () => {
      if (activeInfo?.item?.id) onDragCancel();
    },
    { current: document.body }
  );

  return { sensors, onDragStart, onDragCancel, onDragMove, onDragEnd };
};
