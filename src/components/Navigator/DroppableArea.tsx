import cx from 'classnames';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { NavigatorSortableItem } from './SortableItem';
import { DROPPABLE_AREA_ID } from './constants';
import { useNavigator } from './providers/NavigatorProvider';
import { NavigatorSortableContainerId } from './types';

export const DroppableArea = () => {
  const { navigators, navigatorInfoMap, handleItemClick, handleItemCtxMenu } = useNavigator();
  const { setNodeRef, isOver: isAreaOver, active, over } = useDroppable({ id: DROPPABLE_AREA_ID });

  const isUnFixedDragging = active !== null && navigators.fixed.every(item => item.id !== active?.id);
  const isFixedOver = navigators.fixed.some(item => item.id === over?.id);
  const isOver = isAreaOver || isFixedOver;

  const showSpilt = !!navigators.invisible.length && (!!navigators.fixed.length || isUnFixedDragging);

  return (
    <>
      {showSpilt && <div className="w-full h-px bg-gray-500" />}
      {!!navigators.fixed.length && <span className="text-xs text-center text-gray-200">已固定隐藏应用</span>}

      <SortableContext
        id={NavigatorSortableContainerId.Fixed}
        items={navigators.fixed.map(item => item.id)}
      >
        {navigators.fixed.map(item => {
          return (
            <NavigatorSortableItem
              {...item}
              key={item.id}
              horizontal
              sortable={navigatorInfoMap[item.id]?.sortable}
              onClick={() => handleItemClick(item.id)}
              onContextMenu={evt => handleItemCtxMenu(evt, item.id)}
            />
          );
        })}
      </SortableContext>

      <div
        ref={setNodeRef}
        className={cx(
          'flex-center h-10 rounded-lg',
          isOver ? 'text-primary-100' : 'text-gray-200',
          isAreaOver && 'bg-primary-600'
        )}
      >
        <span>{isOver ? '释放即固定' : '拖拽至此以固定'}</span>
      </div>
    </>
  );
};
