import type { BaseResponse } from '../common';
import { AliyunTokenType } from '../enum';

/**
 * @description 获取阿里云token
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/aliyun_token/get
 */
export declare namespace BaseAliyunTokenGet {
  type Request = {
    biz_type: AliyunTokenType;
  };

  type Response = {
    base_response?: BaseResponse;
    token?: string;
    expired_at?: string;
  };
}
