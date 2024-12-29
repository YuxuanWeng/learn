import { fetchUserSetting } from '@fepkg/services/api/user/setting-get';
import { mulUpsertUserSetting } from '@fepkg/services/api/user/setting-mul-upsert';
import { APIs } from '@fepkg/services/apis';
import { UserSetting } from '@fepkg/services/types/common';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 60 * 1000;

export const getSettingQueryKey = (userId?: string, list?: UserSettingFunction[]) => {
  return [APIs.user.settingGet, userId, list] as const;
};

/**
 * @description 获取用户设置项
 * @param userId 用户 Id
 * @param list 设置项的 Enum 列表
 * @param queryOptions query 配置项
 */
export const useSetting = (
  userId?: string,
  list?: UserSettingFunction[],
  queryOptions?: Omit<UseQueryOptions<UserSetting[], unknown, UserSetting[]>, 'queryKey' | 'queryFn'>
) => {
  const queryClient = useQueryClient();
  const queryKey = getSettingQueryKey(userId, list);

  // 这样写是为了让 query 检测出 data 被使用了
  const { data, ...restQuery } = useQuery<UserSetting[], unknown, UserSetting[]>({
    queryKey,
    queryFn: async ({ signal }) => {
      const resp = await fetchUserSetting({ function_list: list }, { signal });
      return resp?.setting_list ?? [];
    },
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    refetchInterval: DEFAULT_STALE_TIME,
    ...queryOptions
  });

  const mutation = useMutation({
    mutationFn(val: UserSetting[]) {
      return mulUpsertUserSetting({ setting_list: val });
    },
    onMutate(target) {
      const cache = queryClient.getQueryData(queryKey, { exact: true });

      queryClient.setQueryData(queryKey, target);

      // 乐观更新失败的回滚函数
      return () => {
        queryClient.setQueryData(queryKey, cache);
      };
    },
    onError(_, __, restoreCache) {
      // 失败时回滚缓存内的内容
      restoreCache?.();
    }
  });

  return { queryKey, query: { data, ...restQuery }, mutation };
};
