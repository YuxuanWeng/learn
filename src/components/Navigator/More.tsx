import { useMemo } from 'react';
import { Popover } from '@fepkg/components/Popover';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { DroppableArea } from './DroppableArea';
import { NavigatorItem } from './Item';
import { NavigatorSortableItem } from './SortableItem';
import { NAVIGATOR_MORE_ID } from './constants';
import { useNavigator } from './providers/NavigatorProvider';
import { NavigatorItemId, NavigatorSortableContainerId } from './types';

const Content = () => {
  const { navigators, navigatorInfoMap, handleItemClick, handleItemCtxMenu } = useNavigator();

  return (
    <div
      id={NAVIGATOR_MORE_ID}
      className="flex flex-col gap-3"
    >
      <SortableContext
        id={NavigatorSortableContainerId.Invisible}
        items={navigators.invisible.map(item => item.id)}
      >
        {navigators.invisible.map(item => {
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

      <DroppableArea />
    </div>
  );
};

export const NavigatorMore = () => {
  const { navigators, checkedId, moreOpen, setMoreOpen } = useNavigator();

  const { setNodeRef, isOver } = useDroppable({ id: NavigatorItemId.More });

  const showBadge = navigators.fixed.some(item => item.badge);
  const visible = moreOpen || navigators.invisible.length > 0 || navigators.fixed.length > 0;

  // 如果「设置」、「成交单」不能直接看到，并且选中，此时也需选中更多
  const checked = useMemo(() => {
    for (const item of [...navigators.invisible, ...navigators.fixed]) {
      if (item.id === NavigatorItemId.Setting || item.id === NavigatorItemId.ReceiptDeal) {
        if (item.id === checkedId) {
          return true;
        }
      }
    }
    return false;
  }, [checkedId, navigators.fixed, navigators.invisible]);

  return (
    <Popover
      open={moreOpen}
      floatingProps={{ className: '!p-[11px]' }}
      placement="right-end"
      arrow={false}
      destroyOnClose={false}
      content={moreOpen ? <Content /> : null}
      onOpenChange={setMoreOpen}
    >
      {visible ? (
        <NavigatorItem
          id={NavigatorItemId.More}
          ref={setNodeRef}
          label="更多"
          checked={checked}
          className={isOver ? '!border-gray-500 s-icon-two-tone-fill' : ''}
          badge={showBadge}
        />
      ) : null}
    </Popover>
  );
};
