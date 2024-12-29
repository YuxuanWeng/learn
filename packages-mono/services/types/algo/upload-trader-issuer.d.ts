import type { BaseResponse } from '../common';

/**
 * @description 上传客户推荐名单
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/upload_issuer_list
 */
export declare namespace UploadIssuerList {
  type Request = {
    trader_id: string;
    issuer_code_list?: string[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
