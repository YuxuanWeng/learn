import { useRef } from 'react';
import { Logo } from '@fepkg/components/Logo';
import { destroyMessage, notification } from '@fepkg/components/Notification';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { Notification } from '../Notification';
import { ToastMessageProps } from '../types';
import { useMessageCenterCommonAction } from './MessageCenterCommonActionProvider';

const MessageIntervalTime = 5000;

export const NotificationContainer = createContainer(() => {
  const destroyTimer = useRef<NodeJS.Timeout>();
  const lastToastTime = useRef(0);
  const isHovering = useRef(false);

  const updateLastToastTime = useMemoizedFn((time: number) => {
    lastToastTime.current = time;
  });

  const { setMessageCenterOpen } = useMessageCenterCommonAction();

  const toast = useMemoizedFn(({ content, messageId, system = 'oms', icon }: ToastMessageProps) => {
    // icon传null则为null，不传则赋上默认值
    if (icon === undefined) {
      icon = (
        <Logo
          system={system}
          size="xs"
        />
      );
    }

    const closeMessage = (delayTime: number) => {
      isHovering.current = false;
      destroyTimer.current = setTimeout(() => {
        if (!isHovering.current) {
          destroyMessage(messageId);
          updateLastToastTime(0);
        }
      }, delayTime);
    };

    const onMouseLeave = () => {
      const showTime = Date.now() - lastToastTime.current;
      const delayTime = showTime > MessageIntervalTime ? 0 : MessageIntervalTime - showTime;
      closeMessage(delayTime);
    };

    notification.custom({
      key: messageId,
      content: (
        <Notification
          icon={icon}
          onMouseEnter={() => {
            isHovering.current = true;
            clearTimeout(destroyTimer.current);
          }}
          onMouseLeave={onMouseLeave}
          onClick={e => {
            closeMessage(0);

            setMessageCenterOpen(true);

            e.stopPropagation();
          }}
          onClickClose={e => {
            closeMessage(0);
            e.stopPropagation();
          }}
        >
          {content}
        </Notification>
      ),
      duration: MessageIntervalTime / 1000
    });
    updateLastToastTime(Date.now());
  });

  const isToasting = useMemoizedFn(() => {
    const now = Date.now();
    return isHovering.current || now - lastToastTime.current <= MessageIntervalTime;
  });

  return {
    toast,
    isToasting
  };
});

export const NotificationProvider = NotificationContainer.Provider;
export const useNotification = NotificationContainer.useContainer;
