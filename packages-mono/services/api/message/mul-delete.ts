import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { MessageMulDelete } from '../../types/message/mul-delete';

/**
 * @description 删除消息
 * @url /api/v1/bdm/bds/bds_api/message/mul_delete
 */
export const mulDeleteMessage = (params: MessageMulDelete.Request, config?: RequestConfig) => {
  return getRequest().post<MessageMulDelete.Response>(APIs.message.mulDelete, params, config);
};
