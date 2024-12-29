import { IconProvider } from '@fepkg/icon-park-react';
import { DndContext, DragOverlay, MeasuringStrategy } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { FloatingPortal } from '@floating-ui/react';
import { NavigatorContextMenu } from './ContextMenu';
import { NavigatorItem } from './Item';
import { NavigatorMore } from './More';
import { ProductSwitch } from './ProductSwitch';
import { NavigatorSortableItem } from './SortableItem';
import { useNavigatorDndContext } from './hooks/useNavigatorDndContext';
import { NavigatorProvider, useNavigator } from './providers/NavigatorProvider';
import { NavigatorSortableContainerId } from './types';

const Inner = () => {
  const { navRef, navigators, navigatorInfoMap, activeInfo, handleItemClick, handleItemCtxMenu } = useNavigator();
  const dndContext = useNavigatorDndContext();

  return (
    <nav
      ref={navRef}
      className="z-50 flex flex-col items-center justify-between w-20 pb-6 bg-gray-800 home-navigator"
    >
      <IconProvider value={{ theme: 'two-tone', size: 24 }}>
        <DndContext
          {...dndContext}
          autoScroll={false}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          <SortableContext
            id={NavigatorSortableContainerId.Visible}
            items={navigators.visible.map(item => item.id)}
          >
            <menu className="flex flex-col flex-auto h-0 gap-3 overflow-hidden">
              {navigators.visible.map(item => {
                return (
                  <NavigatorSortableItem
                    {...item}
                    key={item.id}
                    sortable={navigatorInfoMap[item.id]?.sortable}
                    onClick={() => handleItemClick(item.id)}
                    onContextMenu={evt => handleItemCtxMenu(evt, item.id)}
                  />
                );
              })}

              <NavigatorMore />
            </menu>
          </SortableContext>

          <FloatingPortal id="floating-container">
            <DragOverlay
              zIndex={9999}
              dropAnimation={null}
            >
              {activeInfo?.item && (
                <NavigatorItem
                  {...activeInfo.item}
                  overlay
                />
              )}
            </DragOverlay>
          </FloatingPortal>
        </DndContext>

        <ProductSwitch />
      </IconProvider>

      <NavigatorContextMenu />
    </nav>
  );
};

export const Navigator = () => {
  return (
    <NavigatorProvider>
      <Inner />
    </NavigatorProvider>
  );
};
