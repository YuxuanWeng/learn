import type { BaseResponse, PayForInst } from '../common';
import { ProductType } from '../enum';

/**
 * @description 获取机构的代付机构信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/get
 */
export declare namespace DealPayForInstGet {
  type Request = {
    product_type: ProductType;
    offset: number;
    count: number;
  };

  type Response = {
    base_response?: BaseResponse;
    pay_for_inst_list?: PayForInst[];
    total: number;
  };
}
