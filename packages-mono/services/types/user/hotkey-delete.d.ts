import type { BaseResponse } from '../common';
import { UserHotkeyFunction } from '../enum';

/**
 * @description 删除个人快捷键
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/hotkey/delete
 */
export declare namespace UserHotkeyDelete {
  type Request = {
    function: UserHotkeyFunction;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
