import type { BaseResponse } from '../common';
import { AutoQuoteCountDown } from '../enum';

/**
 * @description 获取自动挂单broker配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/get_auto_quote_conf
 */
export declare namespace GetAutoQuoteConf {
  type Request = {
    broker_qm_id: string; // broker的qmid
  };

  type Response = {
    base_response: BaseResponse;
    count_down_switch: boolean; // 倒计时开关 true：开启，false：关闭
    count_down: AutoQuoteCountDown; // 倒计时枚举
  };
}
