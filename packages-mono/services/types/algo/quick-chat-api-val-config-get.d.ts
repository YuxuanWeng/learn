import type { BaseResponse } from '../common';
import { BdsProductType, ValuationConfType } from '../enum';

/**
 * @description 获取估值配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/val_config_get
 */
export declare namespace ValConfigGet {
  type Request = {
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    val_type: ValuationConfType; // 估值类型
  };
}
