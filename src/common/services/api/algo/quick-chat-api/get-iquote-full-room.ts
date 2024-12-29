import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { RoomGetAll } from '@fepkg/services/types/algo/quick-chat-api-room-get-all';
import request from '@/common/request';

/**
 * @description 获取房间全量数据
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/room_get_all
 */
export const getIQuoteFullRoom = (params: RoomGetAll.Request, config?: RequestConfig) => {
  return request.post<RoomGetAll.Response>(APIs.algo.getIQuoteFullRoom, params, { ...config, isAlgo: true });
};
