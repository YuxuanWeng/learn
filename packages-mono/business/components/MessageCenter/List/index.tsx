import { useCallback } from 'react';
import { useVirtual } from 'react-virtual';
import { isElement } from '@fepkg/common/utils/element';
import { Placeholder } from '@fepkg/components/Placeholder';
import { MessageType } from '@fepkg/services/types/bds-enum';
import { Compat } from '../MessageRenderer/Compat';
import { HistoryDivider } from '../MessageRenderer/HistoryDivider';
import { UrgentDeal } from '../MessageRenderer/UrgentDeal';
import { useMessageCenterCommonAction } from '../providers/MessageCenterCommonActionProvider';
import { useMessageCenterData } from '../providers/MessageCenterDataProvider';
import { useMessageOpt } from '../providers/MessageOptProvider';
import { BackTop, MESSAGE_HEIGHT } from './BackTop';

const VirtualList = () => {
  const { messageList } = useMessageCenterData();

  const { deleteMessage, readMessage, onMessageClick } = useMessageOpt();
  const { listRef, setMessageCenterOpen } = useMessageCenterCommonAction();

  const estimateSize = useCallback(
    index => {
      const data = messageList[index];

      if (data.isHistoryDivider) {
        return 96 + 8 + 40; // div96 + pb8 + divider40
      }

      return 96 + 8; // div96 + pb8
    },
    [messageList]
  );

  const { virtualItems, totalSize } = useVirtual({
    size: messageList?.length ?? 0,
    parentRef: listRef,
    estimateSize,
    overscan: 10
  });

  return (
    <div
      className="relative w-full"
      style={{ height: totalSize }}
    >
      {virtualItems.map(item => {
        const currentItem = messageList[item.index];
        const Component = currentItem.message_type === MessageType.MessageTypeUrgentDeal ? UrgentDeal : Compat;

        return (
          <div
            key={item.index}
            className="absolute w-full top-0 left-0 pb-2"
            style={{
              height: item.size,
              transform: `translateY(${item.start}px)`
            }}
          >
            {currentItem.isHistoryDivider && <HistoryDivider />}
            <Component
              message={currentItem}
              onDelete={() => deleteMessage(currentItem.message_id)}
              onClick={async () => {
                readMessage(currentItem.message_id);
                const closeMessageCenter = await onMessageClick?.(currentItem);
                if (closeMessageCenter) {
                  setMessageCenterOpen(false);
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const List = () => {
  const { messageList } = useMessageCenterData();

  const { listRef, hasNewMessage, updateScrollTop, setHasNewMessage } = useMessageCenterCommonAction();

  return (
    <div
      ref={listRef}
      className="flex-1 mr-0.5 pl-3 pr-0.5 overflow-y-auto scrollbar-stable"
    >
      {messageList?.length ? (
        <VirtualList />
      ) : (
        <div className="w-full h-full flex">
          <Placeholder
            type="no-data"
            size="xs"
            label="暂未收到消息"
          />
        </div>
      )}

      <BackTop
        target={listRef}
        onTargetScroll={evt => {
          const el = evt.target;
          if (!isElement(el)) return;
          const { scrollTop } = el;
          updateScrollTop(scrollTop);
          if (scrollTop <= MESSAGE_HEIGHT) setHasNewMessage(false);
        }}
      >
        {hasNewMessage && '有新消息'}
      </BackTop>
    </div>
  );
};
