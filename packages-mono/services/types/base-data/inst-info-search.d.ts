import type { BaseResponse, InstInfo } from '../common';

/**
 * @description 搜索发行人/担保人
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/inst_info/search
 */
export declare namespace BaseDataInstInfoSearch {
  type Request = {
    keyword: string; // 搜索文本
    offset?: number;
    count?: number;
    flag_issuer?: boolean;
    flag_warranter?: boolean;
    inst_code_list?: string[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    inst_info_list?: InstInfo[];
    total: number;
    base_response?: BaseResponse;
  };
}
