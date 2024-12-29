import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { RoomRead } from '@fepkg/services/types/algo/quick-chat-api-room-read';
import request from '@/common/request';

/**
 * @description 通知后端已读
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/room_read
 */
export const updateRoomReadied = (params: RoomRead.Request, config?: RequestConfig) => {
  return request.post<RoomRead.Response>(APIs.algo.updateRoomReadied, params, { ...config, isAlgo: true });
};
