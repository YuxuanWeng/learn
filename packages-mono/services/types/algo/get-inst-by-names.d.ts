import type { BaseResponse } from '../common';

/**
 * @description 根据主体机构名称获取机构信息
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_inst_by_name
 */
export declare namespace GetInstByName {
  type Request = {
    name_list?: string[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    inst_list?: InstInfo[];
  };

  export type InstInfo = {
    inst_id: string;
    inst_code: string;
    full_name_zh: string;
    short_name_zh: string;
    inst_type?: string;
  };
}
