import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UploadPreSignPut } from '@fepkg/services/types/upload/pre-sign-put';

/**
 * @description 预签名上传链接
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/upload/pre_sign_put
 */
export const fetchPreSign = (params: UploadPreSignPut.Request, config?: RequestConfig) => {
  return getRequest().post<UploadPreSignPut.Response>(APIs.upload.preSignPut, params, config);
};
