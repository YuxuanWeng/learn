import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserHotkeyMulUpsert } from '@fepkg/services/types/user/hotkey-mul-upsert';
import request from '@/common/request';

/**
 * @description 新建/更新个人设置
 * @url /api/v1/bdm/bds/bds_api/user/hotkey/mul_upsert
 */
export const mulUpsertUserHotkey = (params: UserHotkeyMulUpsert.Request, config?: RequestConfig) => {
  return request.post<UserHotkeyMulUpsert.Response>(APIs.user.hotkeyMulUpsert, params, config);
};
