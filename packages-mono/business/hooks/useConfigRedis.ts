import { fetchConfigRedis } from '@fepkg/services/api/template/get';
import { setConfigRedis } from '@fepkg/services/api/template/set';
import { ConfigRedisGetParams, ConfigRedisSetParams } from '@fepkg/services/api/template/validate';
import { APIs } from '@fepkg/services/apis';
import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 60 * 1000;

export const getConfigRedisQueryKey = (key: string) => {
  return [APIs.template.get, key] as const;
};

/**
 * @description 从 redis 处获取 config（慎用，会有丢数据无法恢复的风险）
 * @param params 获取参数
 * @param queryOptions query 配置项
 */
export const useConfigRedis = <T>(
  params: ConfigRedisGetParams<T>,
  queryOptions?: Omit<
    UseQueryOptions<T | undefined, unknown, T | undefined, ReturnType<typeof getConfigRedisQueryKey>>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryClient = useQueryClient();
  const queryKey = getConfigRedisQueryKey(params.key);

  // 这样写是为了让 query 检测出 data 被使用了
  const { data, ...restQuery } = useQuery<
    T | undefined,
    unknown,
    T | undefined,
    ReturnType<typeof getConfigRedisQueryKey>
  >({
    queryKey,
    queryFn: ({ signal }) => fetchConfigRedis<T>(params, { signal }),
    staleTime: DEFAULT_STALE_TIME,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    refetchInterval: DEFAULT_STALE_TIME,
    ...queryOptions
  });

  const mutation = useMutation({
    mutationFn: async (val: ConfigRedisSetParams<T>) => {
      return setConfigRedis<T>(val);
    },
    onMutate(target) {
      const cache = queryClient.getQueryData(queryKey, { exact: true });

      queryClient.setQueryData(queryKey, target.value);

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
