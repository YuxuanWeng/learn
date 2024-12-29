import { checkLogin } from '@fepkg/services/api/auth/check-login-get';
import { APIs } from '@fepkg/services/apis';
import { User } from '@fepkg/services/types/bdm-common';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { GLOBAL_SCOPE, isUserQueryError } from '@/common/atoms';
import { miscStorage } from '@/localdb/miscStorage';

const STALE_TIME = 60 * 1000;

export const getUserQueryKey = (token?: string) => [APIs.auth.checkLogin, token] as const;

export const userQueryFn: QueryFunction<User | undefined, ReturnType<typeof getUserQueryKey>> = async ({
  queryKey,
  signal
}) => {
  const [, token] = queryKey;
  if (!token) return undefined;

  const result = await checkLogin({ signal });
  if (result?.user) {
    miscStorage.userInfo = result.user;
  }
  return result.user ?? miscStorage.userInfo;
};

/**
 * 调取checkLogin接口，获取当前用户信息
 * @param poling 是否开启轮询(检测业务产品权限变更或账号不可用时退登)
 * */
export const useUserQuery = (poling?: boolean, enable = true) => {
  const hasError = useAtomValue(isUserQueryError, GLOBAL_SCOPE);
  const token = miscStorage.token;

  const query = useQuery({
    queryKey: getUserQueryKey(token),
    queryFn: userQueryFn,
    enabled: !!token && enable && !hasError,
    initialData: miscStorage.userInfo,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: poling,
    refetchIntervalInBackground: poling,
    refetchInterval: poling ? STALE_TIME : Infinity,
    staleTime: poling ? STALE_TIME : Infinity,
    cacheTime: poling ? STALE_TIME : Infinity,
    notifyOnChangeProps: ['data', 'refetch']
  });

  return query;
};
