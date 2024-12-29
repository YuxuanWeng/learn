import cx from 'classnames';
import { useProductParams } from '@/layouts/Home/hooks';
import { Header } from './Header';
import { Options } from './Options';
import { QuotationGroupProps } from './types';

export const QuotationGroup = (props: QuotationGroupProps) => {
  const {
    title,
    visible,
    className = '',
    activeKey,
    options,
    floatingMode,
    hiddenOpenIconIds,
    onDrop,
    onAddClick,
    onExtendClick,
    onContextMenuClick,
    onChecked,
    isGroupReachLimit,
    onOpen
  } = props;

  const { productType } = useProductParams();

  // 仍然存活的窗口，有的窗口虽然已经打开了，但已经被删除了只是没有关掉，此时应排除
  const stillAliveOpenIds = hiddenOpenIconIds?.filter(
    groupId => options?.some(group => group.groupId === groupId || false)
  );

  // 当前页只有一个满足展示条件的看板（总数减去已经新窗口打开的）
  const isLastNotOpened = (options?.length || 0) - (stillAliveOpenIds?.length || 0) === 1;

  if (!visible) return null;
  return (
    <div
      className={cx('pl-2 w-full h-full flex flex-col flex-1 overflow-hidden', className)}
      onContextMenu={evt => {
        evt.preventDefault();
      }}
    >
      <Header
        title={title}
        floatingMode={floatingMode}
        disabledAdd={isGroupReachLimit?.(productType)}
        onAddClick={() => {
          onAddClick?.(productType);
        }}
        onExtendClick={onExtendClick}
      />

      <div className="h-0 flex-auto overflow-y-overlay pr-2 overflow-x-hidden">
        <Options
          data={options}
          // 悬浮模式不启用排序
          enableSort={!floatingMode}
          hiddenOpenIconIds={hiddenOpenIconIds}
          isLastOpened={isLastNotOpened}
          activeKey={activeKey}
          onChecked={onChecked}
          onOpen={onOpen}
          onDrop={onDrop}
          onContextMenuClick={(evt, type, val) => {
            onContextMenuClick?.(evt, type, val, productType);
          }}
        />
      </div>
    </div>
  );
};
