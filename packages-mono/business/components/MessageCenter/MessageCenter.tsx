import cx from 'classnames';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { Button } from '@fepkg/components/Button';
import { Popover } from '@fepkg/components/Popover';
import { IconNotification } from '@fepkg/icon-park-react';
import { Content } from './Content';
import {
  MessageCenterCommonActionProvider,
  useMessageCenterCommonAction
} from './providers/MessageCenterCommonActionProvider';
import { MessageCenterDataProvider, useMessageCenterData } from './providers/MessageCenterDataProvider';
import { MessageOptProvider } from './providers/MessageOptProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import { ToastConfigProvider } from './providers/ToastConfigProvider';
import { MessageCenterProps } from './types';

const MessageCenterInner = ({ btnClassName }: { btnClassName?: string }) => {
  const { unReadMessageCount, refetch } = useMessageCenterData();
  const { messageCenterOpen, setMessageCenterOpen } = useMessageCenterCommonAction();
  return (
    <Popover
      offset={4}
      arrow={false}
      open={messageCenterOpen}
      floatingProps={{ className: '!p-0 overflow-hidden' }}
      content={<Content />}
      onOpenChange={val => {
        if (val) refetch();
        setMessageCenterOpen(val);
      }}
    >
      <BadgeV2
        count={unReadMessageCount}
        style={{ top: 6, right: 2 }}
      >
        <Button.Icon
          className={cx('w-7 h-7', btnClassName)}
          icon={<IconNotification />}
          onDoubleClick={e => e.stopPropagation()}
        />
      </BadgeV2>
    </Popover>
  );
};

export const MessageCenter = (props: MessageCenterProps) => {
  const { userId, onMessageClick, btnClassName } = props;
  return (
    <MessageCenterCommonActionProvider>
      <NotificationProvider>
        <ToastConfigProvider initialState={{ userId }}>
          <MessageCenterDataProvider initialState={{ userId }}>
            <MessageOptProvider initialState={{ onMessageClick }}>
              <MessageCenterInner btnClassName={btnClassName} />
            </MessageOptProvider>
          </MessageCenterDataProvider>
        </ToastConfigProvider>
      </NotificationProvider>
    </MessageCenterCommonActionProvider>
  );
};
