import type { BaseResponse, IssuerLite } from '../common';
import { BankType } from '../enum';

/**
 * @description 拉取发行人信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/issuer_inst/get_all
 */
export declare namespace BaseDataIssuerInstGetAll {
  type Request = {
    bank_type_list?: BankType[];
  };

  type Response = {
    base_response?: BaseResponse;
    issuer_lite_list?: IssuerLite[];
  };
}
