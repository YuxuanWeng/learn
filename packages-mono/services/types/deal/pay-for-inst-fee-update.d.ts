import type { BaseResponse, PayForInstFee } from '../common';

/**
 * @description 创建/更新代付机构费用设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/fee_update
 */
export declare namespace DealPayForInstFeeUpdate {
  type Request = {
    inst_id: string;
    pay_for_inst_fee_list?: PayForInstFee[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
