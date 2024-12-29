import { useMemo } from 'react';
import { parseJSON } from '@fepkg/common/utils/utils';
import { FrontendSyncMsgScene, UserSettingFunction } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { useMessageFeedLiveQuery } from '../../../hooks/message-feed/useMessageFeedLiveQuery';
import { getMessageFeedChannel } from '../../../hooks/message-feed/utils';
import { useSetting } from '../../../hooks/useSetting';
import { ToastConfigProps } from '../types';

type UserSettingMessageCenterType = {
  isToast?: boolean;
};

export const ToastConfigContainer = createContainer((initialState?: ToastConfigProps) => {
  const { userId } = initialState ?? {};

  const { query, mutation } = useSetting(userId, [UserSettingFunction.UserSettingMessageCenter]);

  const messageCenterUserSetting = useMemo(() => {
    // 防止query.data不是数组
    try {
      return parseJSON<UserSettingMessageCenterType>(query.data?.[0]?.value ?? '{}');
    } catch {
      return undefined;
    }
  }, [query.data]);

  // 监听本人useSetting变更
  useMessageFeedLiveQuery({
    centrifugeChannel: getMessageFeedChannel(FrontendSyncMsgScene.UserSetting, userId),
    queryKey: ['ToastConfigContainer'],
    queryFn: () => [],
    handleWSMessage: (wsData: UserSettingFunction[]) => {
      query.refetch();
      return wsData;
    }
  });

  const isToast = messageCenterUserSetting?.isToast ?? true;

  const toggleToastConfig = useMemoizedFn(() => {
    mutation.mutate([
      {
        function: UserSettingFunction.UserSettingMessageCenter,
        value: JSON.stringify({ ...messageCenterUserSetting, isToast: !isToast })
      }
    ]);
  });

  return {
    isToast,

    toggleToastConfig
  };
});

export const ToastConfigProvider = ToastConfigContainer.Provider;
export const useToastConfig = ToastConfigContainer.useContainer;
