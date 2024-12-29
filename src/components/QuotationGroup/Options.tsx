import { useMemo, useState } from 'react';
import cx from 'classnames';
import { PopoverPosition } from '@fepkg/common/types';
import { Button } from '@fepkg/components/Button';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import {
  IconCopyFilled,
  IconDeleteFilled,
  IconDrag,
  IconNewWindow,
  IconShare,
  IconShareFilled
} from '@fepkg/icon-park-react';
import { DndContext, DragOverEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { miscStorage } from '@/localdb/miscStorage';
import { GroupManageItem } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { ContextMenuItemType, OptionsProps } from './types';
import styles from './index.module.less';

export const DRAGGABLE_TYPE = 'option-item';

const PLACEHOLDER_GROUP_ID = 'placeholder_group_id';

const ContextMenuOptions = [
  { label: '复制', icon: <IconCopyFilled />, value: ContextMenuItemType.copy },
  { label: '分享', icon: <IconShareFilled />, value: ContextMenuItemType.share },
  { label: '删除', icon: <IconDeleteFilled />, value: ContextMenuItemType.delete }
];

const always = () => true;

const Item = ({
  option,
  activeKey,
  hiddenOpenIcon = false,
  currentHoverOption,
  onChecked,
  enableSort,
  onOpen,
  onContextMenu
}: Omit<OptionsProps, 'data'> & { option: GroupManageItem; hiddenOpenIcon?: boolean }) => {
  const { attributes, listeners, isDragging, isSorting, setNodeRef, transform, transition } = useSortable({
    id: option.groupId || '',
    animateLayoutChanges: always,
    data: { id: option.groupId || '' }
  });

  const isChecked = activeKey === option.groupId;

  const baseCls = cx(
    'h-[44px] flex items-center w-full rounded-lg select-none justify-between cursor-pointer',
    'border border-solid border-transparent',
    'hover:border-gray-500 hover:border-solid'
  );

  const showLine = currentHoverOption === option.groupId;

  const isShare = option.creatorId !== miscStorage.userInfo?.user_id;

  const groupName = option?.groupName;

  const checkedCls = isChecked ? 'bg-gray-500 text-gray-000' : 'bg-transparent text-gray-100';

  if (option.groupId === PLACEHOLDER_GROUP_ID) {
    return (
      <div
        ref={setNodeRef}
        className={cx('border border-solid border-transparent h-3', showLine && 'border-t-primary-200')}
      />
    );
  }

  return (
    <div
      className={cx(styles['option-container'], 'mt-3')}
      key={option.groupId}
      ref={setNodeRef}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform)
      }}
      {...listeners}
      {...attributes}
      tabIndex={-1}
    >
      {/* 拖拽时显示的一条直线 */}
      <div className={cx('border border-solid border-transparent', showLine && 'border-t-primary-200')} />

      {/* hover 前显示的样式 */}
      <div
        className={cx(
          baseCls,
          styles['option-inner-display'],
          checkedCls,
          isDragging && 'border border-solid !border-gray-500 text-gray-300'
        )}
      >
        <span className={cx('ml-[24px] truncate text-sm px-1')}>{groupName}</span>
        {isShare && (
          <div className="flex items-center text-gray-300">
            <IconShare
              size={12}
              className="cursor-grab"
            />
            <span className="pl-1 text-xs w-14 truncate">{option.creatorName}</span>
          </div>
        )}
      </div>

      {/* hover 后显示的样式 */}
      <div
        className={cx(
          baseCls,
          styles['option-inner-hover'],
          checkedCls,
          'hover:text-gray-000',
          isDragging && 'hover:border-gray-500 hover:border-solid !text-gray-300'
        )}
        onClick={evt => {
          if (evt.buttons !== 2 && !isDragging) onChecked?.(option.groupId ?? '');
        }}
        onContextMenu={evt => {
          onContextMenu?.(evt, option);
        }}
      >
        <div className={cx('flex items-center flex-1', isDragging && 'cursor-grabbing')}>
          {/* 不用排序时不需要展示可拖拽图标 */}
          <IconDrag className={cx('ml-1 cursor-grab', isDragging && 'text-gray-300', !enableSort && 'opacity-0')} />
          <span className={cx('ml-2 truncate text-sm', isShare ? 'w-[60px]' : 'w-[100px]')}>{groupName}</span>
        </div>

        {!hiddenOpenIcon && (
          <Button.Icon
            text
            icon={<IconNewWindow />}
            className={cx(isDragging && 'bg-gray-300', 'mr-1')}
            onMouseDown={evt => {
              evt.stopPropagation();
            }}
            onClick={evt => {
              evt.stopPropagation();
              console.log('调用打开新窗口功能', option.groupId, option.groupName);
              onOpen?.(option.groupId ?? '');
            }}
            tooltip={{ content: '在新窗口打开' }}
          />
        )}
      </div>
    </div>
  );
};

export const Options = ({
  data = [],
  onContextMenuClick,
  hiddenOpenIconIds,
  isLastOpened,
  onDrop,
  enableSort = true,
  ...rest
}: OptionsProps) => {
  const [currentHoverOption, setCurrentHoverOption] = useState<string | undefined>();
  const [currentContextData, setCurrentContextData] = useState<GroupManageItem | undefined>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<PopoverPosition>({ x: 0, y: 0 });

  const getContextMenuItems = () => {
    let alreadyOpen = false;
    if (currentContextData?.groupId && hiddenOpenIconIds) {
      alreadyOpen = hiddenOpenIconIds.includes(currentContextData?.groupId);
    }
    const onlyOneOption = data?.length === 1;
    /* 两种情况不允许出现删除选项：
    1.当前台子（例如:NCD一级)下只有一个看板时
    2.同时展示的所有台子（NCD），只剩下一个尚未被独立打开的看板，且选中的正好是该看板时
    备注：只剩下一个尚未被独立打开的看板，但右键选中的是已经打开的看板时，允许删除
    */
    return onlyOneOption || (isLastOpened && !alreadyOpen)
      ? ContextMenuOptions.filter(item => item.value != ContextMenuItemType.delete)
      : ContextMenuOptions;
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeInfo = useMemo(() => {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (activeId === data[i].groupId) return { index: i, item };
    }
    return { index: 0 };
  }, [activeId, data]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 20 } }));

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragOverEvent) => {
    if (!event.active?.id) return;
    const dragValue = event.active.id.toString();
    const dropValue = event.over?.id.toString();

    if (!dropValue) return;
    onDrop?.(dragValue, dropValue === PLACEHOLDER_GROUP_ID ? undefined : dropValue);
    setCurrentHoverOption(undefined);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over?.id === event.active?.id) return;
    setCurrentHoverOption(event.over?.id.toString());
  };

  const itemKeys = data.map(item => item.groupId || '');

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          disabled={!enableSort}
          items={itemKeys}
        >
          {[...data, { groupId: PLACEHOLDER_GROUP_ID }]?.map(option => {
            const isOpened = hiddenOpenIconIds?.some(v => v === option.groupId);
            const hiddenOpenIcon = isOpened || isLastOpened;
            return (
              <Item
                hiddenOpenIcon={hiddenOpenIcon}
                key={option.groupId}
                option={option}
                enableSort={enableSort}
                currentHoverOption={currentHoverOption}
                onContextMenu={(evt, val) => {
                  evt.preventDefault();
                  setMenuVisible(true);
                  setMenuPosition({ x: evt.clientX, y: evt.clientY });
                  setCurrentContextData(val);
                }}
                {...rest}
              />
            );
          })}
        </SortableContext>

        {/* 拖拽时候的样式 */}
        <DragOverlay>
          {activeInfo.item && (
            <div className="flex justify-between items-center border border-solid border-gray-500 !h-11 rounded-lg !bg-gray-800/80 backdrop-blur-xs">
              <div className="flex items-center flex-1 cursor-grabbing">
                <IconDrag className="ml-1 text-gray-300 cursor-grabbing" />
                <span className="ml-2 truncate text-sm w-[100px]">{activeInfo.item.groupName}</span>
              </div>

              <Button.Icon
                text
                icon={<IconNewWindow className="text-gray-300" />}
                className="mr-1"
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ContextMenu
        open={menuVisible}
        position={menuPosition}
        // 悬浮模式不用排序，认为不排序时就是悬浮模式。悬浮模式时contextMenu需要被渲染到popover的浮动层中，否则鼠标进入contextMenu后popover就会自动关闭
        portal={enableSort}
        className="w-[100px] grid gap-y-2"
        onOpenChange={val => {
          if (!val) {
            setMenuPosition({ x: 0, y: 0 });
            setCurrentContextData(undefined);
          }
          setMenuVisible(val);
        }}
      >
        {getContextMenuItems().map(menu => {
          return (
            <MenuItem
              className="!h-8"
              icon={menu.icon}
              key={menu.label}
              onClick={evt => {
                onContextMenuClick?.(evt, menu.value, currentContextData?.groupId);
              }}
            >
              <span className="ml-2 text-sm">{menu.label}</span>
            </MenuItem>
          );
        })}
      </ContextMenu>
    </div>
  );
};
