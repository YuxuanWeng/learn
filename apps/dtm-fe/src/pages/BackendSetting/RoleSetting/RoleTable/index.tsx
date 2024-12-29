import { useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { ModalUtils } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAddCircle } from '@fepkg/icon-park-react';
import { useProductParams } from '@/hooks/useProductParams';
import { DndContext, DragOverEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { createTempId } from '../../utils';
import { useRole } from '../providers/RoleProvider';
import { IRoleItemRef, RoleItem } from './RoleItem';
import { ROLE_ITEM_PLACEHOLDER_ID } from './constants';

const getNewRoleItem = (approval_role_level: number, product_type, isPlaceHolder = false) => {
  const approval_role_id = isPlaceHolder ? ROLE_ITEM_PLACEHOLDER_ID : createTempId();
  return {
    approval_role_name: '',
    approval_role_level,
    approval_role_id,
    product_type
  };
};

export const RoleTable = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [initialize] = useOverlayScrollbars({
    options: { scrollbars: { autoHide: 'leave', autoHideDelay: 0 } }
  });
  useEffect(() => {
    if (scrollRef.current) {
      initialize(scrollRef.current);
    }
  }, [initialize]);

  const { isEdit, showRoleSettingList, updateList, setUpdateList, replaceRoleTable, needNotify, setNeedNotify } =
    useRole();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 20 } }));
  const { productType } = useProductParams();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentHoverOption, setCurrentHoverOption] = useState<string | null>(null);
  const lastItemRef = useRef<IRoleItemRef | null>(null);

  const activeInfo = useMemo(() => {
    for (let i = 0, len = showRoleSettingList.length; i < len; i++) {
      const item = showRoleSettingList[i];
      if (activeId === item?.approval_role_id) return { index: i, item };
    }
    return { index: 0 };
  }, [activeId, showRoleSettingList]);

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

    setCurrentHoverOption(null);
    setActiveId(null);

    if (needNotify) {
      ModalUtils.warning({
        title: '级别变更',
        content: '该操作将影响成交单审核状态重置，请谨慎操作！',
        okText: '我知道了',
        onOk() {
          replaceRoleTable(dragValue, dropValue === ROLE_ITEM_PLACEHOLDER_ID ? undefined : dropValue);
          setNeedNotify(false);
        }
      });
    } else {
      replaceRoleTable(dragValue, dropValue === ROLE_ITEM_PLACEHOLDER_ID ? undefined : dropValue);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over?.id === event.active?.id) return;
    setCurrentHoverOption(event.over?.id.toString() ?? null);
  };

  const addRole = () => {
    setUpdateList([...updateList, { ...getNewRoleItem(updateList.length + 1, productType) }]);
  };

  const itemKeys = showRoleSettingList.map(item => item.approval_role_id || '');

  return (
    <div
      // 这里需要一个最小宽度，目的是可以表格可以横向滚动
      className="flex-1 bg-gray-800 rounded-lg min-w-[1024px]"
      ref={scrollRef}
    >
      {/* 需要一个最小宽度，否则表格行宽度不固定，会被一直压缩，导致列展示异常 */}
      <div className="min-w-[1130px]">
        <div className="flex text-gray-200 h-12 items-center border-0 border-b border-dashed border-gray-600">
          <div className="flex h-12 w-12" />
          <div className="flex w-80 justify-center">级别</div>
          <div className="flex pl-4 flex-1">审核角色名称</div>
          <div className="flex pl-4 flex-1">成员</div>
          <div className="flex pl-4 w-40 justify-center">{isEdit && '操作'}</div>
        </div>
        {showRoleSettingList?.length ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemKeys}
              disabled={!isEdit}
            >
              {[...showRoleSettingList, { ...getNewRoleItem(updateList.length + 1, productType, true) }].map(
                (i, index) => {
                  return (
                    <RoleItem
                      {...i}
                      ref={node => {
                        if (index === showRoleSettingList.length - 1) lastItemRef.current = node;
                      }}
                      key={`${i.approval_role_id}${i.approval_role_level}`}
                      currentHoverOption={currentHoverOption}
                      deleteDisabled={showRoleSettingList.length <= 1}
                      activeId={activeId}
                    />
                  );
                }
              )}
            </SortableContext>

            {/* 拖拽时候的样式 */}
            <DragOverlay>
              {activeInfo.item && (
                <RoleItem
                  {...activeInfo.item}
                  currentHoverOption={currentHoverOption}
                  deleteDisabled
                  isDragOverlay
                />
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          <Placeholder
            className={cx('mt-10', isEdit && 'hidden')}
            size="md"
            type="no-data"
          />
        )}
        {isEdit && (
          <div className="m-4">
            <Tooltip
              destroyOnClose
              visible
              content={showRoleSettingList.length === 10 ? '数量已达上限' : ''}
            >
              <Button
                className="w-[108px]"
                type="gray"
                plain
                disabled={showRoleSettingList.length === 10}
                icon={<IconAddCircle />}
                onClick={() => {
                  addRole();
                  // 下次渲染后再执行focus
                  requestIdleCallback(() => {
                    lastItemRef.current?.focusRole?.();
                  });
                }}
              >
                添加角色
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
