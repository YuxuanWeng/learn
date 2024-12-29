import { useEffect, useMemo, useRef, useState } from 'react';
import { maxBy } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useProductParams } from '@/layouts/Home/hooks';
import { BdsProductTypeMap, ProductTypeMap } from '../constants';
import { useIQuoteCardWindows } from '../hooks/useIQuoteCardWindows';
import { useCardsInfo } from '../queries/useCardsInfo';
import { useRoomData } from '../queries/useRoomData';
import { OperationCardProp } from '../types';
import { useLocalTimer } from './LocalTimerProvider';

/** 快聊卡片信息 && 盘口信息上下文 */
const RoomCardsContainer = createContainer(() => {
  const { productType } = useProductParams();
  const bdsProductType = BdsProductTypeMap[productType];

  const { rooms } = useRoomData();

  const [filterText, setFilterText] = useState('');

  const cardsInfo = useCardsInfo('');
  const { iquoteCardWindowIds } = useIQuoteCardWindows();

  const chatCards = useMemo(() => {
    return cardsInfo?.chatCards?.filter(c => c.product_type === ProductTypeMap[productType]);
  }, [cardsInfo, productType]);

  const [innerCards, setInnerCards] = useState<OperationCardProp[]>(chatCards ?? []);

  const { timeNow } = useLocalTimer();

  const visibleRooms = useMemo(() => {
    return [...(rooms ?? [])].filter(
      r =>
        r.cards.length > 0 &&
        !iquoteCardWindowIds.includes(r.room_id) &&
        (r.trader_name_first_pinyin?.includes(filterText) ||
          r.trader_name_pinyin?.includes(filterText) ||
          r.trader_name?.includes(filterText) ||
          !filterText)
    );
  }, [rooms, iquoteCardWindowIds, timeNow, filterText]);

  const displayRooms = useMemo(() => {
    const top = rooms?.some(r => r.last_chat_time != null)
      ? maxBy(
          rooms.filter(r => r.last_chat_time),
          r => Number(r.last_chat_time)
        )
      : null;

    return top == null || visibleRooms.every(r => r.room_id !== top.room_id)
      ? [...visibleRooms].sort((a, b) => Number(b.last_recognition_time) - Number(a.last_recognition_time))
      : [
          top,
          ...visibleRooms
            .filter(r => r.room_id !== top.room_id)
            .sort((a, b) => Number(b.last_recognition_time) - Number(a.last_recognition_time))
        ];
  }, [visibleRooms, rooms]);

  const headerRooms = useMemo(
    () => [...(rooms ?? [])].filter(r => r.cards.length > 0).sort((a, b) => b.cards.length - a.cards.length),
    [rooms]
  );

  // 卡片列表的容器
  const lastInitElement = useRef<HTMLDivElement>();

  // 区域内可见的房间列表
  // 房间进入可视区域时视为已读
  const [visibleRoomIds, setVisibleRoomIds] = useState<Set<string>>(new Set());

  const [roomExpandInfo, setRoomExpandInfo] = useState<{ roomID: string; isExpand: boolean }[]>([]);

  // 给IntersectionObserver用
  const roomExpandInfoRef = useRef(roomExpandInfo);

  useEffect(() => {
    roomExpandInfoRef.current = roomExpandInfo;
  }, [roomExpandInfo]);

  const setRoomExpand = (roomID: string, isExpand: boolean) => {
    setRoomExpandInfo(old => [
      ...old.filter(i => i.roomID !== roomID && displayRooms.some(r => r.room_id === i.roomID)),
      { roomID, isExpand }
    ]);
  };

  const getRoomExpand = (roomID: string) =>
    !!roomExpandInfo.find(i => i.roomID === roomID && displayRooms.some(r => r.room_id === i.roomID))?.isExpand;
  const getRoomExpandByRef = (roomID: string) =>
    !!roomExpandInfoRef.current.find(i => i.roomID === roomID && displayRooms.some(r => r.room_id === i.roomID))
      ?.isExpand;

  return {
    productType,
    bdsProductType,
    /** 卡片信息 */
    chatCards,
    /** 房间列表 */
    rooms,
    innerCards,
    setInnerCards,
    displayRooms,
    headerRooms,
    lastInitElement,
    visibleRoomIds,
    setVisibleRoomIds,
    setFilterText,
    getRoomExpand,
    getRoomExpandByRef,
    setRoomExpand
  };
});

export const RoomCardsProvider = RoomCardsContainer.Provider;
export const useRoomCards = RoomCardsContainer.useContainer;
