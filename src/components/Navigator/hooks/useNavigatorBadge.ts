import { useCallback } from 'react';
import { CheckVersionResult } from 'app/utils/check-version';
import { useAtomValue } from 'jotai';
import { versionInfoAtom } from '@/components/VersionSettings/atoms';
import { checkVersion } from '@/components/VersionSettings/utils';
import { useOpenQuoteRemind } from '@/pages/Algo/MarketTrack/hooks/useOpenQuoteRemindDialog';
import { NavigatorItemId, NavigatorMenuItem } from '../types';

export const useNavigatorBadge = () => {
  // 行情追踪相关 badge
  const { openQuoteRemindDialog, notification } = useOpenQuoteRemind();

  // 系统设置相关 badge
  const versionInfo = useAtomValue(versionInfoAtom);
  const isLatestVersion = versionInfo && checkVersion(versionInfo) !== CheckVersionResult.Latest;

  const getBadgeStatus = useCallback(
    (item: NavigatorMenuItem) => {
      const getShowBadge = () => {
        switch (item.id) {
          case NavigatorItemId.QuoteReminder:
            return notification !== undefined;
          case NavigatorItemId.Setting:
            return isLatestVersion;
          default:
            return false;
        }
      };

      const showBadge = getShowBadge();
      return showBadge;
    },
    [isLatestVersion, notification]
  );

  return { openQuoteRemindDialog, getBadgeStatus };
};
