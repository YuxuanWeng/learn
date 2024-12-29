import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserSettingMulUpsert } from '@fepkg/services/types/user/setting-mul-upsert';
import { MultiStorageEvent } from '@/common/hooks/useMultiLocalStorage';
import request from '@/common/request';

/**
 * @description 新建/更新个人设置
 * @url /api/v1/bdm/bds/bds_api/user/setting/mul_upsert
 */
export const LocalStoragePrefix = 'userSettings_functionType';

export const mulUpsertUserSetting = async (params: UserSettingMulUpsert.Request, config?: RequestConfig) => {
  return request.post<UserSettingMulUpsert.Response>(APIs.user.settingMulUpsert, params, config).then(result => {
    params.setting_list?.forEach(item => {
      if (item.value === undefined || item.value === 'undefined') {
        localStorage.removeItem(`${LocalStoragePrefix}${item.function}`);
      } else {
        localStorage.setItem(`${LocalStoragePrefix}${item.function}`, String(item.value));
        // 需要 dispatchEvent 一个自定义事件以便本页面内容会 change
        window.dispatchEvent(new MultiStorageEvent('local-storage', `${LocalStoragePrefix}${item.function}`));
      }
    });

    return result;
  });
};
