import type { BaseResponse } from '../common';

/**
 * @description 获取交易员配置选项内容
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/get_config
 */
export declare namespace GetConfig {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response: BaseResponse;
    clear_speed_type_list?: SelectTag[];
    big_volume_type_list?: SelectTag[];
    internal_type_list?: SelectTag[];
    bargain_flag_type_list?: SelectTag[];
  };

  export type SelectTag = {
    value: number; // value
    label: string; // 文案
  };
}
