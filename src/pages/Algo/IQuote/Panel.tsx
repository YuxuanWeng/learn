import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { Placeholder } from '@fepkg/components/Placeholder';
import { IconAttentionFilled, IconClose } from '@fepkg/icon-park-react';
import { QuickChatRoomReadType } from '@fepkg/services/types/algo-enum';
import { ErrorBoundary } from '@sentry/react';
import { IMConnection } from 'app/packages/im-helper-core/types';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';
import { updateRoomReadied } from '@/common/services/api/algo/quick-chat-api/update-room-readied';
import { logError } from '@/common/utils/logger/data';
import { DialogLayout } from '@/layouts/Dialog';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { ChatScriptModal } from './components/ChatScriptModal';
import { Header } from './components/Header';
import { ParseContainer } from './components/ParseContainer';
import { TraderConfigModal } from './components/TraderConfigModal';
import { BdsProductTypeMap } from './constants';
import { useIQuoteCardWindows } from './hooks/useIQuoteCardWindows';
import { useIMConnection } from './providers/IMConnectionProvider';
import { useRoomCards } from './providers/RoomCardsProvider';
import { SharedCards } from './types';

const TipsMap = {
  [IMConnection.Lost]: '请检查IM是否在线并开启授权。',
  [IMConnection.BindWrong]: 'IM登录账号与OMS账号不匹配。',
  [IMConnection.NoUsers]: '请在IM开启联系人转发功能。'
};

export const Panel = () => {
  const { cancel } = useDialogLayout();

  const {
    rooms,
    displayRooms,
    lastInitElement,
    visibleRoomIds,
    setVisibleRoomIds,
    getRoomExpand,
    setRoomExpand,
    getRoomExpandByRef
  } = useRoomCards();

  const handleCancel = () => {
    cancel();
  };

  const [messageVisible, setMessageVisible] = useState(true);

  const { imConnection } = useIMConnection();

  /** 记录上一次异常状态 */
  const prevImConnectionStatus = useRef(imConnection !== IMConnection.Connected ? imConnection : null);

  useEffect(() => {
    if (messageVisible) return;
    if (imConnection === IMConnection.Connected) return;

    // 若上次异常于当前异常不一致，则强制提示
    if (prevImConnectionStatus.current && imConnection !== prevImConnectionStatus.current) setMessageVisible(true);
    prevImConnectionStatus.current = imConnection;
  }, [imConnection, messageVisible]);

  const { iquoteCardWindowIds, openIQuoteCardWindow } = useIQuoteCardWindows();

  const key = getLSKeyWithoutProductType(LSKeys.IQuoteRawCards);
  const [, setData] = useLocalStorage<SharedCards>(key, []);

  const innerKey = getLSKeyWithoutProductType(LSKeys.IQuoteInnerCards);

  const [, setInnerData] = useLocalStorage<SharedCards>(innerKey, []);

  useEffect(() => {
    setInnerData([]);
  }, []);

  useEffect(() => {
    setData((rooms ?? []).filter(r => iquoteCardWindowIds.includes(r.room_id) && r.cards.length > 0));
  }, [rooms, iquoteCardWindowIds]);

  const displayRoomsRef = useRef(displayRooms);

  useEffect(() => {
    displayRoomsRef.current = displayRooms;
  }, [displayRooms]);

  const visibleRoomIdsRef = useRef(visibleRoomIds);

  useEffect(() => {
    if (rooms != null && displayRooms.length > 0) {
      setRoomExpand(displayRooms[0].room_id, true);
    }
  }, [rooms == null]);

  useEffect(() => {
    visibleRoomIdsRef.current = visibleRoomIds;
  }, [visibleRoomIds]);

  const observerRef = useRef<IntersectionObserver>();

  const { productType } = useProductParams();

  const initObserver = (element: HTMLDivElement | null) => {
    if (element != null && lastInitElement.current !== element) {
      lastInitElement.current = element;

      const getIndex = (e: IntersectionObserverEntry) =>
        Array.from(lastInitElement.current?.children ?? []).findIndex(i => i === e.target);
      observerRef.current = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.intersectionRatio > 0) {
              const targetRoom = displayRoomsRef.current[getIndex(e)];

              if (targetRoom == null) return;

              if (targetRoom.unread && getRoomExpandByRef(targetRoom.room_id)) {
                updateRoomReadied({
                  room_id: targetRoom.room_id,
                  room_read_type: QuickChatRoomReadType.QuickChatRoomList,
                  product_type: BdsProductTypeMap[productType]
                });
              }
            }
          });

          const roomVisibilityUpdates = entries.map(e => {
            const index = getIndex(e);
            return {
              roomId: displayRoomsRef.current[index]?.room_id,
              visible: e.intersectionRatio > 0
            };
          });

          const newSet = new Set(
            Array.from(visibleRoomIdsRef.current).filter(i => displayRoomsRef.current.some(r => r.room_id === i))
          );

          roomVisibilityUpdates.forEach(i => {
            if (i.visible) {
              newSet.add(i.roomId);
            } else if (i.roomId) {
              newSet.delete(i.roomId);
            }
          });

          setVisibleRoomIds(newSet);
        },
        { root: element }
      );
    }
  };

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = undefined;
    };
  }, []);

  return (
    <ErrorBoundary
      onError={(error, info) => {
        logError({ keyword: 'unexpected_chat_quickly_dialog_error', error, info });
      }}
    >
      <DialogLayout.Header
        controllers={['min', 'close']}
        onCancel={handleCancel}
        keyboard={false}
      >
        <div className="flex items-center">
          <Dialog.Header>iQuote</Dialog.Header>
          {imConnection && imConnection !== IMConnection.Connected && messageVisible && (
            <div className="bg-orange-700 h-7 px-3 flex items-center rounded-lg ml-4 select-none">
              <IconAttentionFilled className="text-orange-100" />
              <span className="ml-2">{TipsMap[imConnection]}</span>
              <Button.Icon
                text
                type="gray"
                plain
                icon={<IconClose />}
                onClick={() => setMessageVisible(false)}
                className="ml-2 hover:!bg-white/10 border-none"
              />
            </div>
          )}
        </div>
      </DialogLayout.Header>

      {/* 头部筛选 */}
      <Header />

      {displayRooms?.length ? (
        <div
          className="flex-1 overflow-y-overlay"
          ref={element => {
            initObserver(element);
          }}
        >
          {displayRooms?.map((room, index) => (
            <ParseContainer
              observerRef={observerRef}
              room={room}
              onOpenCard={roomID => {
                openIQuoteCardWindow(productType.toString(), roomID);
              }}
              isExpand={getRoomExpand(room.room_id)}
              setIsExpand={val => setRoomExpand(room.room_id, val)}
              key={room.room_id}
              floatingIDs={iquoteCardWindowIds}
              isVisible={visibleRoomIds.has(room.room_id)}
              className={index + 1 === displayRooms?.length ? 'mb-2' : ''}
            />
          ))}
        </div>
      ) : (
        <Placeholder
          type="no-data"
          size="sm"
          label="暂无消息"
        />
      )}

      <TraderConfigModal />
      <ChatScriptModal />
    </ErrorBoundary>
  );
};
