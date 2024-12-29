import { fetchConfig } from '@fepkg/services/api/config/get';
import { setConfig } from '@fepkg/services/api/config/set';
import { ConfigGetParams, ConfigSetParams } from '@fepkg/services/api/config/validate';
import { APIs } from '@fepkg/services/apis';
import { ConfigGet } from '@fepkg/services/types/config/get';
import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 60 * 1000;

export const getConfigQueryKey = (params: ConfigGet.Request) => {
  return [APIs.config.get, params.namespace, params.key] as const;
};

/**
 * @description 获取系统 config
 * @param params 获取参数
 * @param queryOptions query 配置项
 */
export const useConfig = <T>(
  params: ConfigGetParams<T>,
  queryOptions?: Omit<
    UseQueryOptions<T | undefined, unknown, T | undefined, ReturnType<typeof getConfigQueryKey>>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryClient = useQueryClient();
  const queryKey = getConfigQueryKey(params);

  // 这样写是为了让 query 检测出 data 被使用了
  const { data, ...restQuery } = useQuery<T | undefined, unknown, T | undefined, ReturnType<typeof getConfigQueryKey>>({
    queryKey,
    queryFn: ({ signal }) => fetchConfig<T>(params, { signal }),
    staleTime: DEFAULT_STALE_TIME,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    refetchInterval: DEFAULT_STALE_TIME,
    ...queryOptions
  });

  const mutation = useMutation({
    mutationFn: async (val: ConfigSetParams<T>) => {
      return setConfig<T>(val);
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
