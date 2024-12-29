import type { BaseResponse, PayForInstWithFee } from '../common';

/**
 * @description 批量获取机构费用设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/fee_get
 */
export declare namespace DealPayForInstFeeGet {
  type Request = {
    inst_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    pay_for_inst_with_fee_list?: PayForInstWithFee[];
  };
}
