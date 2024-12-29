import { HTMLProps, MouseEvent, ReactNode, RefObject } from 'react';
import { ButtonProps } from '@fepkg/components/Button';
import { SystemType } from '@fepkg/components/Logo';
import { Message } from '@fepkg/services/types/common';

export type MessageRendererProps = HTMLProps<HTMLDivElement> & {
  /** 消息 */
  message?: Message;
  /** 点击删除按钮时的回调 */
  onDelete?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type MessageBackTopProps = ButtonProps & {
  /** 设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数，默认为 window */
  target: RefObject<HTMLElement>;
  /** 对应元素滚动时的回调 */
  onTargetScroll?: (evt: Event) => void;
};

export type MessageCenterProps = {
  userId?: string;
  onMessageClick?: (message: Message) => Promise<boolean | void>;
  btnClassName?: string;
};

export type MessageCenterDataProps = {
  userId?: string;
};

export type ToastConfigProps = {
  userId?: string;
};

export type MessageOptProps = {
  onMessageClick?: (message: Message) => Promise<boolean | void>;
};

export type UserMessage = Message & {
  isHistoryDivider?: boolean;
};

export type MessageNotificationProps = HTMLProps<HTMLDivElement> & {
  onClickClose?: (e: MouseEvent<HTMLSpanElement>) => void;
  icon?: React.ReactNode;
};

export type ToastMessageProps = {
  system?: SystemType;
  messageId: string;
  icon?: ReactNode;
  content: ReactNode;
};
