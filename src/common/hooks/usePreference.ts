import { UserPreferenceType } from '@fepkg/services/types/enum';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { useLocalforage } from '@/common/hooks/useLocalforage';
import { fetchPreference } from '@/common/services/api/user/preference-get';
import { mulUpsertPreference } from '../services/api/user/preference-mul-upsert';

export const PreferenceKey = 'Current_Preference';

export const usePreference = (key?: string) => {
  const [data, getPreference, set, rm] = useLocalforage<Map<string, string>>(key ?? PreferenceKey);
  // 避免意外情况导致的data被置为null；
  const preference = data ?? new Map<string, string>();

  /** 将用户偏好读取到localForage中 */
  const initPreference = async (_key?: string) => {
    const initData = await fetchPreference({ type_list: [UserPreferenceType.UserPreferenceSearchTrader] });
    const preferenceData = initData?.preference_list;
    if (preferenceData?.length) {
      const preferenceMap = new Map(preferenceData?.map(item => [item.key, item.value]));
      set(preferenceMap, _key ?? key);
    } else {
      set(new Map<string, string>(), _key ?? key);
    }
  };

  const removePreference = (_key?: string) => {
    rm(_key ?? key);
  };

  const updatePreference = (preferenceKey: string, preferenceValue: string) => {
    const updatedValue = new Map(preference);
    updatedValue.set(preferenceKey, preferenceValue);

    const { emit } = window.Broadcast;
    emit(BroadcastChannelEnum.LOCAL_FORGE_UPDATE, updatedValue, key ?? PreferenceKey);
    set(updatedValue, key ?? PreferenceKey);

    // 上传服务端
    const upsertPreference = {
      preference_type: UserPreferenceType.UserPreferenceSearchTrader,
      key: preferenceKey,
      value: preferenceValue
    };

    return mulUpsertPreference({ preference_list: [upsertPreference] });
  };

  return {
    preference,
    initPreference,
    getPreference,
    updatePreference,
    removePreference
  };
};
