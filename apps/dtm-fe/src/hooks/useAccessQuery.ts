import { AccessCode } from '@fepkg/services/access-code';
import { fetchUserAccessInfo } from '@fepkg/services/api/auth/access-user-info';
import { APIs } from '@fepkg/services/apis';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useToken } from './useToken';

export const getAccessQueryKey = (token?: string) => [APIs.auth.getUserAccess, token] as const;

export const accessQueryFn: QueryFunction<Set<AccessCode> | undefined, ReturnType<typeof getAccessQueryKey>> = async ({
  queryKey,
  signal
}) => {
  const [, token] = queryKey;
  if (!token) return undefined;
  const res = await fetchUserAccessInfo({ signal });
  // 权限列表因为都是 import { AccessCode } from @fepkg/services/access-code
  // 这里直接使用 Set<AccessCode> 减少查询时间复杂度
  return new Set(res?.access_code_list ?? []);
};

export const useAccessQuery = () => {
  const { token } = useToken();

  const query = useQuery({
    queryKey: getAccessQueryKey(token),
    queryFn: accessQueryFn,
    enabled: !!token,
    notifyOnChangeProps: ['data', 'refetch'],
    refetchOnReconnect: 'always'
  });

  return query;
};
