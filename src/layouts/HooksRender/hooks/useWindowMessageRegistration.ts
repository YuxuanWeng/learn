import { useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import { WindowChannelEventEnum } from 'app/types/IPCEvents';
import { DialogChannelAction, DialogChannelData } from 'app/types/dialog-v2';
import { useSetChildPortCache, useSetParentPort } from '@/common/atoms';

const channelEventPipe: ((ev: MessageEvent<any>) => void)[] = [];
export const addChannelEventPipeItem = (messageEvent: (ev: MessageEvent<any>) => void) => {
  channelEventPipe.push(messageEvent);
};
export const removeChannelEventPipeItem = (messageEvent: (ev: MessageEvent<any>) => void) => {
  for (let i = channelEventPipe.length; i < channelEventPipe.length - 1; i++) {
    const item = channelEventPipe[i];
    if (item === messageEvent) {
      channelEventPipe.splice(i, 1);
      return;
    }
  }
};

export const useWindowMessageRegistration = () => {
  const setParentPort = useSetParentPort();
  const setChildPortCache = useSetChildPortCache();

  useEffect(() => {
    /** 通知preload窗口已就绪 */
    window.Dialog?.setDialogContextReady?.();
  }, []);

  const handlePortMessage = useMemoizedFn((evt: MessageEvent<DialogChannelData>, port: MessagePort, msg: any) => {
    if (!evt || !evt.data) return;
    if (evt?.data?.action === DialogChannelAction.Close) {
      port.close();
      setChildPortCache(prev => {
        const newCache = { ...prev };
        delete newCache[msg?.winName ?? ''];
        return newCache;
      });
      return;
    }

    channelEventPipe.forEach(fn => {
      if (fn && typeof fn === 'function') {
        fn(evt);
      }
    });
  });

  const handleWindowMessage = useMemoizedFn((event: MessageEvent<any>) => {
    if (
      event == null ||
      event.source !== window ||
      event.ports == null ||
      event.data == null ||
      event.data.type == null ||
      event.data.msg == null
    ) {
      return;
    }
    const { type, msg } = event.data;
    const isParentChannel = type === WindowChannelEventEnum.ParentChannelToBrowser;
    const isChildChannel = type === WindowChannelEventEnum.ChildChannelToBrowser;
    if (!isParentChannel && !isChildChannel) return;
    const [port] = event.ports;
    // ..当前窗口为父窗口
    if (isParentChannel) {
      setChildPortCache(prev => ({ ...prev, [msg.winName]: port }));
    }
    // ..当前窗口为子窗口
    else if (isChildChannel) {
      setParentPort(port);
    }
    port.addEventListener('message', e => handlePortMessage(e, port, msg));

    if (!msg.instantMessaging) {
      port.start();
    }
  });

  useEffect(() => {
    window.removeEventListener('message', handleWindowMessage);
    window.addEventListener('message', handleWindowMessage);

    return () => window.removeEventListener('message', handleWindowMessage);
  }, [handleWindowMessage]);
};
