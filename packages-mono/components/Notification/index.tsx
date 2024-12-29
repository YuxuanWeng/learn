import { ReactNode } from 'react';
import { notification as antdNotification } from 'antd';

type CustomMessageType = {
  content: ReactNode;
  duration?: number;
  key?: string;
  onClose?: () => void;
};

export const notification = {
  ...antdNotification,
  custom({ key, content, duration, onClose }: CustomMessageType) {
    antdNotification.open({
      key,
      description: null,
      message: content,
      className: 'ant-notification-notice-custom',
      icon: null,
      duration: duration ?? 3,
      closeIcon: null,
      onClose,
      placement: 'topLeft'
    });
  }
};

// 限制同时展示的条数为1，后面的会把前面的notification顶掉
antdNotification.config({
  maxCount: 1
});

export const destroyMessage = (messageKey: string) => {
  antdNotification.close(messageKey);
};
