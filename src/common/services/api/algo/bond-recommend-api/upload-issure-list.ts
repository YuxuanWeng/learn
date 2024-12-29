import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UploadIssuerList } from '@fepkg/services/types/algo/upload-trader-issuer';
import request from '@/common/request';

/**
 * @description 上传客户推荐名单
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/upload_issuer_list
 */

export const uploadIssureList = (params: UploadIssuerList.Request, config?: RequestConfig) => {
  return request.post<UploadIssuerList.Response>(APIs.algo.uploadIssuerList, params, {
    ...config,
    isAlgo: true
  });
};
