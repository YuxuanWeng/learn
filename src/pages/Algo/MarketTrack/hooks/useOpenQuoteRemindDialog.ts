import { useEffect, useState } from 'react';
import { OppositePriceNotification } from '@fepkg/services/types/bds-common';
import { useMemoizedFn } from 'ahooks';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMarketTrackMessageFeedLiveQuery } from '../PriceRemind/hooks/useMarketTrackMessageFeedLiveQuery';

export const useOpenQuoteRemind = () => {
  const { productType } = useProductParams();
  // ws发送的行情追踪数据
  const { updateNotification } = useMarketTrackMessageFeedLiveQuery({ productType, usedByMenu: true });
  const [notification, setNotification] = useState<OppositePriceNotification>();

  useEffect(() => {
    if (updateNotification) {
      setNotification(updateNotification);
    }
  }, [updateNotification]);

  // 窗口打开状态
  const [open, setOpen] = useState(false);
  const { openDialog } = useDialogWindow();

  const openQuoteRemindDialog = useMemoizedFn(() => {
    setOpen(true);
    openDialog(
      {
        name: WindowName.WatchQuoteRemindDialog,
        custom: { route: CommonRoute.MarketTrack, routePathParams: [productType.toString()] },
        options: { width: 1200, height: 800, minWidth: 960, minHeight: 720, resizable: true }
      },
      {
        onCancel: () => {
          setOpen(false);
          setNotification(undefined);
        }
      }
    );
  });

  return { openQuoteRemindDialog, notification: open ? undefined : notification };
};
