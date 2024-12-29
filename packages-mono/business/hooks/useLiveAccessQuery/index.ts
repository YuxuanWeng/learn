import { useMessageFeedLiveQuery } from '@fepkg/business/hooks/message-feed/useMessageFeedLiveQuery';
import { getMessageFeedChannel } from '@fepkg/business/hooks/message-feed/utils';
import { fetchUserAccessInfo } from '@fepkg/services/api/auth/access-user-info';
import { checkLogin } from '@fepkg/services/api/auth/check-login-get';
import { User } from '@fepkg/services/types/bdm-common';
import { FrontendSyncMsgScene } from '@fepkg/services/types/bds-enum';
import { QueryFunction } from '@tanstack/react-query';
import { useLiveAccessQueryProps } from './types';

export const ACCESS_STALE_TIME = 60 * 60 * 1000;

export const liveAccessQueryFn: QueryFunction<User> = async ({ queryKey, signal }) => {
  const res = await fetchUserAccessInfo({ signal });
  const result = await checkLogin({ signal });

  return { ...((result.user ?? {}) as User), access_code_list: res.access_code_list };
};

export const useLiveAccessQuery = ({ userId, enable, onSuccess }: useLiveAccessQueryProps) => {
  const query = useMessageFeedLiveQuery<User>({
    centrifugeChannel: getMessageFeedChannel(FrontendSyncMsgScene.UserProductAccessSync, userId),
    queryFn: liveAccessQueryFn,
    enabled: enable && Boolean(userId),
    refetchInterval: ACCESS_STALE_TIME,
    handleWSMessage: (user: User) => {
      onSuccess?.(user);
      return user;
    },
    onSuccess
  });

  return { ...query };
};
