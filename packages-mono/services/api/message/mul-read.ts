import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { MessageMulRead } from '../../types/message/mul-read';

/**
 * @description 消息置为已读
 * @url /api/v1/bdm/bds/bds_api/message/mul_read
 */
export const mulReadMessage = (params: MessageMulRead.Request, config?: RequestConfig) => {
  return getRequest().post<MessageMulRead.Response>(APIs.message.mulRead, params, config);
};
