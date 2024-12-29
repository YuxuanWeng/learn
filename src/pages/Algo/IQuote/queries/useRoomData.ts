import { useEffect, useRef, useState } from 'react';
import { useMessageFeedLiveQuery } from '@fepkg/business/hooks/message-feed/useMessageFeedLiveQuery';
import { getMessageFeedChannel } from '@fepkg/business/hooks/message-feed/utils';
import { APIs } from '@fepkg/services/apis';
import { RoomDetailSyncType } from '@fepkg/services/types/algo-enum';
import { FrontendSyncMsgScene } from '@fepkg/services/types/bds-enum';
import type { QuickChatCardInfo, QuickChatSyncRoomDetail } from '@fepkg/services/types/common';
import { useQuery } from '@tanstack/react-query';
import { max } from 'lodash-es';
import { fetchCardsInfo } from '@/common/services/api/algo/quick-chat-api/get-cards-info';
import { getIQuoteFullRoom } from '@/common/services/api/algo/quick-chat-api/get-iquote-full-room';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { BdsProductTypeMap } from '../constants';
import { useLocalTimer } from '../providers/LocalTimerProvider';
import { RoomWithCards } from '../types';

const getIsCardNotTimeOut = (card: QuickChatCardInfo, timeNow: number) => {
  return timeNow - new Date(card.recognition_time ?? '').getTime() < 3600 * 1000;
};

const getTimeIsToday = (time?: string) => {
  if (time == null) return false;

  const now = Date.now();

  const dayTime = 3600 * 24 * 1000;

  const todayTime = now - (now % dayTime);

  const targetTime = Number(time);
  const targetDay = targetTime - (targetTime % dayTime);

  return todayTime === targetDay;
};

/** 房间列表 */
export const useRoomData = () => {
  const { productType } = useProductParams();
  const [rooms, setRooms] = useState<RoomWithCards[]>();

  const { timeNow } = useLocalTimer();

  const roomsRef = useRef(rooms);
  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  const channel = getMessageFeedChannel(
    FrontendSyncMsgScene.IQuoteRoomDetailSync,
    `${miscStorage.userInfo?.user_id}_${productType}`
  );

  // 全量拉取成功之前的消息队列
  const msgStackRef = useRef<QuickChatSyncRoomDetail[]>([]);

  const updateRoomsWithMsg = async (data: QuickChatSyncRoomDetail, isStashedMsg = false) => {
    const oldDataUpdatedAt = max((roomsRef.current ?? []).map(r => Number(r.update_time))) ?? 0;
    const newUpdatedAt = Number(data.room_info.update_time ?? 0);

    if (oldDataUpdatedAt <= newUpdatedAt || !isStashedMsg) {
      const newCards =
        data?.msg_type === RoomDetailSyncType.RoomDetailSyncTypeUpsert && data.isCardChanged
          ? (await fetchCardsInfo({ room_id: data.room_info.room_id, product_type: BdsProductTypeMap[productType] }))
              .card_info_list ?? []
          : null;

      setRooms(oldRooms => {
        if (oldRooms == null) return oldRooms;
        const result = [...oldRooms];
        if (data?.msg_type === RoomDetailSyncType.RoomDetailSyncTypeUpsert) {
          const updateTargetIndex = oldRooms.findIndex(r => r.room_id === data.room_info.room_id);
          const updateTarget = oldRooms[updateTargetIndex];

          const newRoom = {
            ...data.room_info,
            cards: (newCards ?? updateTarget?.cards ?? []).map(c => ({ ...c, room_id: data.room_info.room_id }))
          };

          if (updateTargetIndex !== -1) {
            result.splice(updateTargetIndex, 1);
          }

          return [...(result ?? []), newRoom];
        }

        if (data?.msg_type === RoomDetailSyncType.RoomDetailSyncTypeDelete) {
          const updateTargetIndex = oldRooms?.findIndex(r => r.room_id === data.room_info.room_id);
          if (updateTargetIndex !== -1) {
            result.splice(updateTargetIndex, 1);
          }
          return [
            ...(result ?? []),
            {
              ...oldRooms[updateTargetIndex],
              cards: []
            }
          ];
        }

        return result;
      });
    } else {
      console.log('aborted');
    }
  };

  // bad practice
  // hook待优化
  const { centrifugeState } = useMessageFeedLiveQuery<QuickChatSyncRoomDetail | 'empty'>({
    centrifugeChannel: channel,
    queryFn: () => 'empty',
    handleWSMessage: (data: QuickChatSyncRoomDetail) => {
      if (data != null) {
        if (roomsRef.current == null) {
          msgStackRef.current = [data, ...msgStackRef.current];
        } else {
          updateRoomsWithMsg(data);
        }
      }

      return data ?? 'empty';
    }
  });

  useQuery({
    queryKey: [APIs.algo.getIQuoteFullRoom, productType] as const,
    queryFn: async ({ signal }) => {
      const res = await getIQuoteFullRoom({ product_type: BdsProductTypeMap[productType] }, { signal });
      return res;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: Infinity,
    refetchInterval: 5000,
    enabled: rooms == null || centrifugeState === 'idle' || centrifugeState === 'error',
    onSuccess: data => {
      setRooms(
        (data.rooms ?? []).map(r => ({
          ...r,
          cards: data.cards?.filter(c => c.room_id === r.room_id) ?? []
        }))
      );

      if (msgStackRef.current.length !== 0) {
        msgStackRef.current.forEach(msg => updateRoomsWithMsg(msg, true));
        msgStackRef.current = [];
      }
    }
  });

  // 不保证顺序
  return {
    rooms: rooms?.map(r => ({
      ...r,
      // 只需要当天的聊天时间
      last_chat_time: getTimeIsToday(r.last_chat_time) ? r.last_chat_time : undefined,
      cards: r.cards.filter(c => c.product_type === BdsProductTypeMap[productType] && getIsCardNotTimeOut(c, timeNow))
    }))
  };
};
