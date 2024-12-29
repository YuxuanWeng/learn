import type { BaseResponse } from '../common';
import { BargainFlagType, BdsProductType, BigVolumeType, ClearSpeedType, InternalType } from '../enum';

/**
 * @description 修改交易员配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/update_trader_config
 */
export declare namespace UpdateTraderConfig {
  type Request = {
    trader_id: string; // 交易员id
    clear_speed_type?: ClearSpeedType; // 交割
    big_volume_type?: BigVolumeType; // 大量
    internal_type?: InternalType; // 明/暗盘
    bargain_flag_type?: BargainFlagType; // 置信度
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
