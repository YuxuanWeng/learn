import { useEffect } from 'react';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { GLOBAL_SCOPE } from '@/common/atoms';
import { useMultiLocalStorage } from '@/common/hooks/useMultiLocalStorage';
import { LocalStoragePrefix } from '@/common/services/api/user/setting-mul-upsert';
import { DefaultOptimalQuoteDisplayAmount } from '@/pages/Base/SystemSetting/components/QuoteSettings/constants';
import { IUserSettingValue } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';
import { getUserSettingsKey, getValueByProductType } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';

const userInitSettings = {
  [getUserSettingsKey(UserSettingFunction.UserSettingOptimalQuoteDisplayAmount)]: DefaultOptimalQuoteDisplayAmount
};

const userSettingAtom = atom<IUserSettingValue | null>(null);
export const useUserSettingJotai = () => useAtomValue(userSettingAtom, GLOBAL_SCOPE);

const SyncUserSettings = () => {
  const { storedValues } = useMultiLocalStorage<IUserSettingValue>(userInitSettings);
  const setUserSetting = useSetAtom(userSettingAtom, GLOBAL_SCOPE);

  useEffect(() => {
    const formatValue = Object.keys(storedValues).reduce((acc, cur) => {
      const regex = new RegExp(`^${LocalStoragePrefix}(\\d+)$`);
      const match = cur.match(regex);
      const key = match ? match[1] : cur;
      const value = getValueByProductType(storedValues[cur], Number(key));

      return {
        ...acc,
        [key]: value
      };
    }, {} as IUserSettingValue);

    setUserSetting(formatValue);
  }, [setUserSetting, storedValues]);

  return null;
};

export default SyncUserSettings;
