import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserHotkeyGet } from '@fepkg/services/types/user/hotkey-get';
import request from '@/common/request';

/**
 * @description 获取个人快捷键列表
 * @url /api/v1/bdm/bds/bds_api/user/hotkey/get
 */
export const fetchUserHotkey = (params: UserHotkeyGet.Request, config?: RequestConfig) => {
  return request.post<UserHotkeyGet.Response>(APIs.user.hotkeyGet, params, config);
};
