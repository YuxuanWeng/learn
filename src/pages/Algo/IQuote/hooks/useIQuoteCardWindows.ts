import { useLayoutEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { DialogEvent } from 'app/types/IPCEvents';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { useDialogWindow } from '@/common/hooks/useDialog';

export const useIQuoteCardWindows = () => {
  // ..已打开的行情面版窗口
  const [iquoteCardWindowIds, setIQuoteCardWindowIds] = useState<string[]>([]);
  const { openDialog } = useDialogWindow();

  useLayoutEffect(() => console.log('-- iquoteCardWindows change --', iquoteCardWindowIds), [iquoteCardWindowIds]);

  useLayoutEffect(() => {
    const off = window.Main?.on?.(DialogEvent.IQuoteCardChange, (cardIds?: string[]) => {
      setIQuoteCardWindowIds(cardIds || []);
    });
    return () => {
      off?.();
    };
  }, []);

  const openIQuoteCardWindow = useMemoizedFn((productType: string, roomId: string) => {
    openDialog({
      /**
       * 这里的name不是最终name；
       * 主进程会以 `${WindowName.IQuoteCard}__${roomId}` 的规则拼接；
       */
      name: WindowName.IQuoteCard,
      custom: {
        route: CommonRoute.IQuoteCard,
        routePathParams: [productType],
        context: { roomId }
      },
      options: { resizable: true, width: 448, height: 490, minWidth: 448, minHeight: 490, maxWidth: 448 },
      numberLimit: 10
    });

    return true;
  });

  return {
    openIQuoteCardWindow,
    iquoteCardWindowIds
  };
};
