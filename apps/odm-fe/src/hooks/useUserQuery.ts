import { APIs } from '@fepkg/services/apis';
import { CheckLogin } from '@fepkg/services/types/auth/check-login';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { checkLogin } from '@/common/services/api/auth/check-login-get';
import { useToken } from './useToken';

export const getUserQueryKey = (token?: string) => [APIs.auth.checkLogin, token] as const;

export const userQueryFn: QueryFunction<CheckLogin.Response | undefined, ReturnType<typeof getUserQueryKey>> = ({
  queryKey,
  signal
}) => {
  const [, token] = queryKey;
  if (!token) return undefined;
  return checkLogin({ signal });
};

export const useUserQuery = (enable?: boolean) => {
  const { token } = useToken();

  const query = useQuery({
    queryKey: getUserQueryKey(token),
    queryFn: userQueryFn,
    enabled: !!token && enable,
    refetchOnReconnect: 'always',
    notifyOnChangeProps: ['data', 'refetch']
  });

  return { user: query.data?.user, ...query };
};
