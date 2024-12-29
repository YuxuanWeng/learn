import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { MessageMulGet } from '../../types/message/mul-get';

/**
 * @description 获取消息列表，返回最近两天内的近200条，若这200条有n条被删除，返回200-n条
 * @url /api/v1/bdm/bds/bds_api/message/mul_get
 */
export const fetchMulMessage = (config?: RequestConfig) => {
  return getRequest().post<MessageMulGet.Response>(APIs.message.mulGet, {}, config);
};
