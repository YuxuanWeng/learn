import type { SafeValue } from '@fepkg/common/types';
import { RequestResponse, StatusCode } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserSettingFunction } from '@fepkg/services/types/enum';
import type { UserSettingGet } from '@fepkg/services/types/user/setting-get';
import { useQuery } from '@tanstack/react-query';
import type { QueryFunction, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { miscStorage } from '@/localdb/miscStorage';
import { getUserSettingsInitDataArr } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';

export type ConfigFetchData = RequestResponse<UserSettingGet.Response>;

export const getSettingsQueryKey = (list?: UserSettingFunction[]) => {
  const { productType } = miscStorage;

  return [APIs.user.settingGet, list, productType] as const;
};

const getSettingsQueryFn =
  (list?: UserSettingFunction[]): QueryFunction<ConfigFetchData> =>
  () => {
    const setting_list = getUserSettingsInitDataArr(list);
    return {
      setting_list,
      base_response: { code: StatusCode.Success, msg: 'success' }
    };
  };

/**
 * @description 获取用户设置项
 * @param list 设置项的 Enum 列表
 * @param requestConfig request 配置项
 * @param queryOptions query 配置项
 */
export const useSettings = <TSelectData = ConfigFetchData>(
  list?: UserSettingFunction[],
  queryOptions?: Omit<
    UseQueryOptions<ConfigFetchData, unknown, SafeValue<TSelectData, ConfigFetchData>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<SafeValue<TSelectData, ConfigFetchData>> => {
  const queryKey = getSettingsQueryKey(list);
  const queryFn = getSettingsQueryFn(list);

  return useQuery<ConfigFetchData, unknown, SafeValue<TSelectData, ConfigFetchData>>({
    queryKey,
    queryFn,
    staleTime: 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    ...queryOptions
  });
};
