import type { BaseResponse } from '../common';
import { BdsProductType, ValuationConfType } from '../enum';

/**
 * @description 修改估值配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/val_config_update
 */
export declare namespace ValConfigUpdate {
  type Request = {
    val_type: ValuationConfType; // 估值类型
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
