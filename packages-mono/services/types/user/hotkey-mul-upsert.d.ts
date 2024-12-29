import type { BaseResponse, UserHotkey } from '../common';

/**
 * @description 新建/更新个人快捷键
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/hotkey/mul_upsert
 */
export declare namespace UserHotkeyMulUpsert {
  type Request = {
    hotkey_list?: UserHotkey[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
