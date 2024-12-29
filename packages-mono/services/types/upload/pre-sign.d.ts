import type { BaseResponse } from '../common';
import { PreSignMethod } from '../enum';

/**
 * @description 预签名minio请求
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/upload/pre_sign
 */
export declare namespace UploadPreSign {
  type Request = {
    method: PreSignMethod;
    bucket_name: string;
    object_name: string;
    expiry?: number;
  };

  type Response = {
    base_response?: BaseResponse;
    signed_url?: string;
  };
}
