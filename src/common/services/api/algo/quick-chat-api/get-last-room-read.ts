import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { RoomReadStatusGet } from '@fepkg/services/types/algo/quick-chat-api-room-read-status-get';
import request from '@/common/request';

/**
 * @description 获取快聊房间已读信息
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/room_read_status_get
 */
export const getLastRoomReadStatus = (params: RoomReadStatusGet.Request, config?: RequestConfig) => {
  return request.post<RoomReadStatusGet.Response>(APIs.algo.getLastRoomReadStatus, params, { ...config, isAlgo: true });
};
