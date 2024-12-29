import type { BaseResponse } from '../common';
import { BargainFlagType, BdsProductType, BigVolumeType, ClearSpeedType, InternalType } from '../enum';

/**
 * @description 获取交易员配置列表
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/get_trader_config_list
 */
export declare namespace GetTraderConfigList {
  type Request = {
    trader_id?: string; // 用于当前房间该trader置顶逻辑
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    trader_config_list?: TraderConfig[];
  };

  export type TraderConfig = {
    trader_id: string; // 交易员id
    trader_name: string; // 交易员名字
    trader_pinyin: string; // 交易员拼音
    trader_first_pinyin: string; // 交易员简拼
    trader_qq: string; // 交易员QQ
    inst_name: string; // 机构名称
    inst_pinyin: string; // 机构拼音
    inst_first_pinyin: string; // 机构简拼
    clear_speed_type: ClearSpeedType; // 交割
    big_volume_type: BigVolumeType; // 大量
    internal_type: InternalType; // 明/暗盘
    bargain_flag_type: BargainFlagType; // 置信度
    flag_valid_trader?: boolean; // 交易员是否有效
    flag_valid_inst?: boolean; // 机构是否有效
  };
}
