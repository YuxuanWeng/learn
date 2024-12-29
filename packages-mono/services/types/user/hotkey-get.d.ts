import type { BaseResponse, UserHotkey } from '../common';
import { UserHotkeyFunction } from '../enum';

/**
 * @description 获取个人快捷键列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/hotkey/get
 */
export declare namespace UserHotkeyGet {
  type Request = {
    function_list?: UserHotkeyFunction[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    hotkey_list?: UserHotkey[];
    base_response?: BaseResponse;
  };
}
