import type { BaseResponse } from '../common';
import { AudioType, DealType, ProductType } from '../enum';

export type AudioRecord = {
  record_id: string;
  product_type: ProductType;
  key_market: string;
  audio_type: AudioType;
  text: string;
  create_time: string;
  audio_text: string;
  deal_type: DealType;
};

/**
 * @description 获取语音播报列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/spot_pricing/audio_record/get
 */
export declare namespace DealSpotPricingAudioRecordGet {
  type Request = {
    product_type: ProductType;
    start_time: string;
    last_record_id?: string;
  };

  type Response = {
    base_response?: BaseResponse;
    audio_record_list?: AudioRecord[]; // 理论上最多有8条
  };
}
