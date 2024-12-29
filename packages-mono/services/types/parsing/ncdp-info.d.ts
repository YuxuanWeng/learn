import type { BaseResponse, NCDPInfo } from '../common';

/**
 * @description ncd一级录入文本识别
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/parsing/ncdp_info
 */
export declare namespace ParsingNcdpInfo {
  type Request = {
    user_input: string;
  };

  type Response = {
    base_response?: BaseResponse;
    ncdp_list?: NCDPInfo[];
  };
}
