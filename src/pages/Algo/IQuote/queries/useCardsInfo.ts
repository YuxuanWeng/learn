import { useState } from 'react';
import { APIs } from '@fepkg/services/apis';
import type { QuickChatCardInfo } from '@fepkg/services/types/common';
import { useQuery } from '@tanstack/react-query';
import { fetchCardsInfo } from '@/common/services/api/algo/quick-chat-api/get-cards-info';
import { useProductParams } from '@/layouts/Home/hooks';
import { BdsProductTypeMap } from '../constants';

/** 获取快聊卡片信息 */
export const useCardsInfo = (roomId?: string) => {
  const { productType } = useProductParams();

  /** 快聊卡片信息 */
  const [chatCards, setChatCards] = useState<QuickChatCardInfo[]>();

  /** 当前信息对应的roomId，比hooks参数的roomId更新迟一些 */
  const [dataRoomId, setDataRoomId] = useState<string>();

  const [redDotStatus, setRedDotStatus] = useState(false);

  const { refetch } = useQuery({
    queryKey: [APIs.algo.getCardsInfo, roomId, productType] as const,
    queryFn: async ({ signal }) => {
      if (!roomId) return void 0;
      const res = await fetchCardsInfo({ room_id: roomId, product_type: BdsProductTypeMap[productType] }, { signal });
      return { ...res, roomId };
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: Infinity,
    refetchInterval: 1500,
    onSuccess: data => {
      setChatCards(data?.card_info_list);
      setRedDotStatus(data?.red_dot_status ?? false);
      setDataRoomId(data?.roomId);
    }
  });
  return {
    chatCards: dataRoomId === roomId ? chatCards : undefined,
    redDotStatus,
    setRedDotStatus,
    refetch
  };
};
