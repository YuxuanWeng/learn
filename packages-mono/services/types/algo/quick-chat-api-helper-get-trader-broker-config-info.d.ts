import type { BaseResponse } from '../common';
import {
  BargainFlagType,
  BdsProductType,
  BigVolumeType,
  ClearSpeedType,
  InternalType,
  ValuationConfType
} from '../enum';

/**
 * @description 获取小助手交易员配置列表
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/helper/get_trader_broker_config_info
 */
export declare namespace HelperGetTraderBrokerConfigInfo {
  type Request = {
    broker_id: string;
    trader_id: string;
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    trader_config_list?: HelperTraderConfig[];
    broker_conf_info: HelperBrokerConfig;
  };

  export type HelperTraderConfig = {
    broker_id: string; // 交易员id
    trader_id: string; // 交易员名字
    clear_speed_type: ClearSpeedType; // 交割
    big_volume_type: BigVolumeType; // 大量
    internal_type: InternalType; // 明/暗盘
    bargain_flag_type: BargainFlagType; // 置信度
  };

  export type HelperBrokerConfig = {
    val_type?: ValuationConfType;
  };
}
