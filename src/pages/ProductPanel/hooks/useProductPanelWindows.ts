import { useLayoutEffect, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { DialogEvent } from 'app/types/IPCEvents';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { useDialogWindow } from '@/common/hooks/useDialog';

export const useProductPanelWindows = (onPanelCancel: (groupId: string) => void) => {
  // ..已打开的行情面版窗口
  const [productPanelWindowIds, setProductPanelWindowIds] = useState<string[]>([]);
  const { openDialog } = useDialogWindow();
  const opening = useRef<boolean>(false);

  useLayoutEffect(
    () => console.log('-- productPanelWindows change --', productPanelWindowIds),
    [productPanelWindowIds]
  );

  useLayoutEffect(() => {
    const off = window.Main?.on?.(DialogEvent.ProductPanelChange, (panelIds?: string[]) => {
      opening.current = false;
      setProductPanelWindowIds(panelIds || []);
    });
    return () => {
      off?.();
    };
  }, []);

  const openProductPanelWindow = useMemoizedFn((type: string, groupId: string, isSharedGroup: boolean) => {
    if (opening.current) {
      console.log('open被拦住了', Date.now());
      return false;
    }
    opening.current = true;
    openDialog(
      {
        /**
         * 这里的name不是最终name；
         * 主进程会以 `${WindowName.ProductPanel}__${groupId}` 的规则拼接；
         */
        name: WindowName.ProductPanel,
        custom: {
          route: CommonRoute.ProductPanel,
          routePathParams: [type, groupId],
          urlParams: `groupId=${groupId}&isSharedGroup=${isSharedGroup}`
        },
        /** 高宽都不要传，需要主进程根据当前首页窗口的尺寸动态计算 */
        options: { resizable: true },
        numberLimit: 5
      },
      {
        onCancel: () => {
          onPanelCancel(groupId);
        },
        onError: () => {
          console.log('执行onError');
          console.log('把opening置为false 2', Date.now());
          opening.current = false;
        }
      }
    );
    return true;
  });

  return {
    openProductPanelWindow,
    productPanelWindowIds
  };
};
