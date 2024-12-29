import { useRef, useState } from 'react';
import { createContainer } from 'unstated-next';

export const MessageCenterCommonActionContainer = createContainer(() => {
  /** 消息中心列表Ref */
  const listRef = useRef<HTMLDivElement>(null);

  /** 消息中心打开状态 */
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);

  /** BackTop展示文字 */
  const [hasNewMessage, setHasNewMessage] = useState(false);
  /** BackTop所监听的list的ScrollTop */
  const listScrollTop = useRef(0);
  const updateScrollTop = (top: number) => {
    listScrollTop.current = top;
  };

  return {
    listRef,

    hasNewMessage,
    setHasNewMessage,

    listScrollTop,
    updateScrollTop,

    messageCenterOpen,
    setMessageCenterOpen
  };
});

export const MessageCenterCommonActionProvider = MessageCenterCommonActionContainer.Provider;
export const useMessageCenterCommonAction = MessageCenterCommonActionContainer.useContainer;
