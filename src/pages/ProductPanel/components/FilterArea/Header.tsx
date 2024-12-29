import { useMemo } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Popover } from '@fepkg/components/Popover';
import {
  IconDecoration1,
  IconDownDouble,
  IconMenuFold,
  IconMenuUnfold,
  IconReset,
  IconSave,
  IconUpDouble
} from '@fepkg/icon-park-react';
import { Rename } from '@/components/Rename';
import { miscStorage } from '@/localdb/miscStorage';
import { Menu } from '@/pages/ProductPanel/components/Menu';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { useProductPanel } from '../../providers/PanelProvider';

export const Header = ({ showMenu }: { showMenu?: boolean }) => {
  const { sidebarOpen, filterOpen, groupOpen, toggleGroupOpen, toggleSidebarOpen, toggleFilterOpen } =
    useProductPanel();
  const { activeGroupState, groupState, saveGroup, rollbackGroup, rename } = useMainGroupData();

  const currentGroup = useMemo(
    () => groupState.groupList.find(v => v.groupId === activeGroupState.activeGroup?.groupId),
    [activeGroupState.activeGroup?.groupId, groupState.groupList]
  );
  const isShare = currentGroup?.creatorId !== miscStorage.userInfo?.user_id;
  return (
    <header
      className={cx(
        'flex justify-between items-center h-12 px-3 border border-r-0 border-solid border-gray-600 bg-gray-800 z-10 select-none',
        showMenu && !groupOpen && 'rounded-tl-2xl',
        !showMenu ? 'border-l-0' : ''
      )}
    >
      {!groupOpen && showMenu ? (
        <Popover
          trigger="hover"
          placement="bottom-start"
          arrow={false}
          // 不需要额外的不边距
          floatingProps={{ className: '!p-0 overflow-hidden' }}
          // 关闭后不能销毁浮动层，否则会同时销毁Menu中的分享看板，导致浮动层关闭后分享看板也被关闭
          destroyOnClose={false}
          updateByOpen
          content={
            <div className="h-[500px] [@media(min-height:672px){&}]:h-[580px] [@media(min-height:800px){&}]:h-[640px]">
              <Menu floatingMode />
            </div>
          }
        >
          <Button.Icon
            text
            icon={<IconMenuUnfold />}
            onClick={toggleGroupOpen}
          />
        </Popover>
      ) : (
        <IconDecoration1 className="text-2xl/0 text-primary-100" />
      )}
      <Rename
        key={currentGroup?.groupId}
        disabled={isShare}
        name={currentGroup?.groupName ?? ''}
        subName={isShare ? currentGroup?.creatorName : ''}
        // onChange={async (value: string, byBlur = false) => {
        //   const updateIsSuccess = await rename(activeGroupState.activeGroup?.groupId ?? '', value, byBlur);
        //   return updateIsSuccess;
        // }}
      />

      <section className="flex gap-3">
        {activeGroupState.hasModified && (
          <>
            <Button.Icon
              className="h-7"
              icon={<IconReset />}
              onClick={() => {
                rollbackGroup();
              }}
            >
              重置看板
            </Button.Icon>
            {!isShare ? (
              <Button.Icon
                className="h-7"
                icon={<IconSave />}
                onClick={() => {
                  saveGroup(activeGroupState.activeGroup?.groupId || '');
                }}
              >
                保存看板
              </Button.Icon>
            ) : null}
          </>
        )}

        <Button.Icon
          key={`${filterOpen}`}
          className="w-7 h-7"
          icon={filterOpen ? <IconUpDouble /> : <IconDownDouble />}
          tooltip={{ content: filterOpen ? '收起筛选项' : '展开筛选项', delay: { open: 600 } }}
          onClick={() => {
            toggleFilterOpen();
          }}
        />
        {!sidebarOpen && (
          <Button.Icon
            className="w-7 h-7"
            icon={<IconMenuFold />}
            tooltip={{ content: '展开右边栏', delay: { open: 600 } }}
            onClick={toggleSidebarOpen}
          />
        )}
      </section>
    </header>
  );
};
