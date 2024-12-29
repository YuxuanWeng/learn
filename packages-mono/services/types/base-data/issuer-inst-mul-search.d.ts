import type { BaseResponse, InstInfo } from '../common';

/**
 * @description 批量搜索发行人
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/issuer_inst/mul_search
 */
export declare namespace BaseDataIssuerInstMulSearch {
  type Request = {
    keyword_list?: string[]; // 关键字列表
  };

  type Response = {
    base_response?: BaseResponse;
    issuer_info_list?: InstInfo[];
  };
}
