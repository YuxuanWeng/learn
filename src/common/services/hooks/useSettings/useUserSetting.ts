import { useCallback, useMemo } from 'react';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useMultiLocalStorage } from '@/common/hooks/useMultiLocalStorage';
import {
  quoteDisplaySettingsTypes,
  quotePanelSettingsTypes
} from '@/pages/Base/SystemSetting/components/QuoteSettings/constants';
import {
  CommonTypeValue,
  IUserSettingRawValue,
  IUserSettingValue
} from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import { getUserSettingsKey, getValueByProductType } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { LocalStoragePrefix } from '../../api/user/setting-mul-upsert';

export const quoteSetting = [...quotePanelSettingsTypes, ...quoteDisplaySettingsTypes];

/**
 *
 * @param list 用户设置的枚举数组
 * @returns userSetting-设置对象, loading态, getSetting-获取单设置的方法
 */
export const useUserSetting = <T extends Map<UserSettingFunction, CommonTypeValue>>(list: UserSettingFunction[]) => {
  const { storedValues, loading } = useMultiLocalStorage<IUserSettingRawValue>(
    list.reduce((acc, cur) => {
      acc[getUserSettingsKey(cur)] = undefined;
      return acc;
    }, {} as IUserSettingValue)
  );

  const userSetting = useMemo(() => {
    return new Map(
      Object.entries(storedValues).map(([key, value]) => {
        const regex = new RegExp(`^${LocalStoragePrefix}(\\d+)$`);
        const match = key.match(regex);

        const formatKey = Number(match ? match[1] : key);
        const formatValue = getValueByProductType(value, formatKey);

        return [formatKey, formatValue];
      })
    ) as T;
  }, [storedValues]);

  const getSetting = useCallback(
    <R = CommonTypeValue>(func: UserSettingFunction) => userSetting.get(func) as R | undefined,
    [userSetting]
  );

  return { userSetting, loading, getSetting } as const;
};
