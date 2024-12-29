import type { BaseResponse } from '../common';
import { OperationSource, ProductType } from '../enum';

/**
 * @description 新增报价草稿
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/add
 */
export declare namespace BondQuoteDraftAdd {
  type Request = {
    product_type: ProductType;
    text?: string;
    img_url?: string;
    source: OperationSource; // 仅支持8/9/16
    trader_id?: string;
    flag_star?: number;
    img_name?: string;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
