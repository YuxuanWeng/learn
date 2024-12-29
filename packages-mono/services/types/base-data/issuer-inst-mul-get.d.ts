import type { BaseResponse, InstInfo } from '../common';

/**
 * @description 根据发行商代码查询发行人信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/issuer_inst/mul_get
 */
export declare namespace BaseDataIssuerInstMulGet {
  type Request = {
    inst_code_list?: string[]; // 发行商代码
  };

  type Response = {
    status_code: number;
    status_msg: string;
    inst_info_list?: InstInfo[];
    base_response?: BaseResponse;
  };
}
