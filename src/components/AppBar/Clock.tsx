import { useMemo, useState } from 'react';
import { Caption } from '@fepkg/components/Caption';
import { message } from '@fepkg/components/Message';
import moment from 'moment';
import { useInterval } from 'usehooks-ts';
import { useIsConnectionLoss, useIsSyncError, useOfflineTipVisible } from '@/common/atoms';
import { SyncErrorMessageForMain, SyncWarningMessage } from '@/common/hooks/data-localization/useSyncError';

type Tip = { type: 'orange' | 'danger'; msg: string; color: string };

export const Clock = () => {
  const [time, setTime] = useState(() => moment().format('MM-DD HH:mm:ss'));
  const offlineTipVisible = useOfflineTipVisible();
  const isSyncError = useIsSyncError();
  const isConnectionLoss = useIsConnectionLoss();

  const offlineTip: Tip | null = useMemo(() => {
    let result: Tip | null = null;
    if (offlineTipVisible) {
      result = { type: 'orange', msg: '当前网络异常，请检查你的网络设置！', color: 'text-orange-100' };
      message.warn(result.msg);
    }
    if (isConnectionLoss && !isSyncError) {
      result = { type: 'orange', msg: SyncWarningMessage, color: 'text-orange-100' };
    }
    if (isSyncError) {
      result = { type: 'danger', msg: SyncErrorMessageForMain, color: 'text-danger-100' };
    }
    return result;
  }, [isConnectionLoss, isSyncError, offlineTipVisible]);

  useInterval(() => {
    setTime(moment().format('MM-DD HH:mm:ss'));
  }, 1000);

  return (
    <div>
      <span className={offlineTip?.color}>{offlineTip?.msg}</span>
      <Caption
        type={offlineTip?.type}
        childrenCls="text-gray-100 text-xs w-[100px]"
      >
        {time}
      </Caption>
    </div>
  );
};
