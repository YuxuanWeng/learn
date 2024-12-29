import type { BaseResponse, UploadFileScene } from '../common';

/**
 * @description 预签名上传链接
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/upload/pre_sign_put
 */
export declare namespace UploadPreSignPut {
  type Request = {
    scene: UploadFileScene;
    extension: string;
  };

  type Response = {
    base_response?: BaseResponse;
    upload_url?: string;
    file_url?: string;
  };
}
