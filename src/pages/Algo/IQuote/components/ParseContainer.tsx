import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Tooltip } from '@fepkg/components/Tooltip';
import {
  IconClose,
  IconDelete,
  IconDownDouble,
  IconInfo,
  IconMinus,
  IconNewWindow,
  IconUpDouble
} from '@fepkg/icon-park-react';
import { QuickChatCardInfo } from '@fepkg/services/types/algo-common';
import {
  AlgoDirection,
  InstUsageStatus,
  QuickChatAlgoOperationType,
  QuickChatCardsOperation,
  QuickChatRoomReadType,
  TraderJobStatus
} from '@fepkg/services/types/algo-enum';
import { InstStatus, TraderUsageStatus } from '@fepkg/services/types/bdm-enum';
import { DefaultResponse } from '@fepkg/services/types/common';
import IPCEventEnum, { DialogEvent } from 'app/types/IPCEvents';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';
import { doCardOperation } from '@/common/services/api/algo/quick-chat-api/cards-operation';
import { doCardOperationAll } from '@/common/services/api/algo/quick-chat-api/cards-operation-all';
import { updateRoomReadied } from '@/common/services/api/algo/quick-chat-api/update-room-readied';
import { sendIMMsg } from '@/common/utils/im-helper';
import { DraggableHeader } from '@/components/HeaderBar';
import { useProductParams } from '@/layouts/Home/hooks';
import { BdsProductTypeMap } from '../constants';
import { useChatScriptData } from '../queries/useChatScriptData';
import { OperationCardProp, RoomWithCards, SharedCards } from '../types';
import { getCardForPayload, getDefaultChatScript } from '../utils';
import { OperationCard } from './OperationCard';

const getCardError = (card: OperationCardProp) => {
  const isGVNTKN = [QuickChatAlgoOperationType.QuickChatGVN, QuickChatAlgoOperationType.QuickChatTKN].includes(
    card.operation_type
  );

  if (isGVNTKN) {
    if (card.price == null || card.price === 0) {
      return {
        offer_id: card.offer_id,
        sendError: '价格不能为空，点价失败！'
      };
    }

    if (card.amount == null || card.amount === 0) {
      return {
        offer_id: card.offer_id,
        sendError: '量不能为空，点价失败！'
      };
    }

    if (card.amount != null && card.amount % 1000 !== 0) {
      return {
        offer_id: card.offer_id,
        sendError: '不可散量点价，点价失败！'
      };
    }
  }

  return undefined;
};

export const ParseContainer = ({
  room,
  observerRef,
  onOpenCard,
  isFloating,
  floatingIDs,
  isVisible,
  isExpand,
  setIsExpand,
  className
}: {
  room: RoomWithCards;
  observerRef?: MutableRefObject<IntersectionObserver | undefined>;
  onOpenCard?: (roomId: string) => void;
  isFloating?: boolean;
  floatingIDs?: string[];
  isVisible?: boolean;
  isExpand?: boolean;
  setIsExpand?: (val: boolean) => void;
  className?: string;
}) => {
  const key = getLSKeyWithoutProductType(LSKeys.IQuoteInnerCards);

  const [data, setData] = useLocalStorage<SharedCards>(key, []);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      observerRef?.current?.observe(containerRef.current);
    }
  }, []);

  // 该组件需要用作单独弹窗，不使用useRoomCards
  const { productType } = useProductParams();
  const bdsProductType = BdsProductTypeMap[productType];

  useEffect(() => {
    if (isVisible && isExpand && !isFloating && room.unread) {
      updateRoomReadied({
        room_id: room.room_id,
        room_read_type: QuickChatRoomReadType.QuickChatRoomList,
        product_type: bdsProductType
      });
    }

    if (room.unread && isFloating) {
      window.Main.invoke(DialogEvent.GetIQuoteCardFocusStatus).then(isFocused => {
        if (isFocused) {
          updateRoomReadied({
            room_id: room.room_id,
            room_read_type: QuickChatRoomReadType.QuickChatRoomList,
            product_type: bdsProductType
          });
        }
      });
    }
  }, [isVisible, room.unread, isFloating, isExpand]);

  useEffect(() => {
    window.Main.on(IPCEventEnum.WindowFocus, () => {
      if (isFloating && room.unread) {
        updateRoomReadied({
          room_id: room.room_id,
          room_read_type: QuickChatRoomReadType.QuickChatRoomList,
          product_type: bdsProductType
        });
      }
    });
  }, [isFloating, room.unread]);

  const stored = data.find(i => i.room_id === room.room_id);

  const [innerCardsState, setInnerCardsState] = useState<OperationCardProp[]>(() =>
    !isFloating ? stored?.cards ?? room.cards : room.cards
  );

  const innerCards = (isFloating ? (stored?.cards as OperationCardProp[]) : innerCardsState) ?? [];

  const setInnerCards = isFloating
    ? (val: OperationCardProp[]) => {
        setData(old => {
          return [...old.filter(i => i.room_id !== room.room_id), { ...room, cards: val }];
        });
      }
    : setInnerCardsState;

  const setCardsLoading = (cards: OperationCardProp[], loading: boolean) => {
    setInnerCards(
      innerCards.map(card => {
        if (cards.some(c => c.offer_id === card.offer_id)) {
          return { ...card, loading };
        }

        return card;
      })
    );
  };

  const deleteCards = async ({ card }: { card?: QuickChatCardInfo }) => {
    if (card?.room_id == null) return;

    setCardsLoading([card], true);

    if (card != null) {
      await doCardOperation({
        operation_type: QuickChatCardsOperation.QuickChatCardsDelete,
        card_info: getCardForPayload(card),
        room_id: card.room_id,
        product_type: bdsProductType
      });
    }

    setCardsLoading([card], false);
  };

  const deleteRoom = async (roomToDelete: RoomWithCards) => {
    setCardsLoading(roomToDelete.cards, true);

    await doCardOperationAll({
      operation_type: QuickChatCardsOperation.QuickChatCardsDelete,
      card_info_list: roomToDelete.cards.map(getCardForPayload),
      room_id: roomToDelete.room_id,
      product_type: bdsProductType
    });

    setCardsLoading(roomToDelete.cards, false);
  };

  const updateCardSendErrors = (errors: { offer_id: string; sendError?: string }[]) => {
    setInnerCards(
      innerCards.map(c => {
        const target = errors.find(e => e.offer_id === c.offer_id);

        return {
          ...c,
          sendError: target?.sendError
        };
      })
    );
  };

  const { chatScriptListFromStorage } = useChatScriptData();

  const sendCardsMsg = async (card: OperationCardProp) => {
    const targetQQ = room?.trader_qq;

    const script = getDefaultChatScript(card.operation_type, chatScriptListFromStorage);

    if (script == null || script === '') return;

    try {
      await sendIMMsg({
        messages: [{ recv_qq: targetQQ, msg: script }],
        singleMode: true,
        imErrorHints: {
          imNotEnabled: 'IM不在线或未开启授权状态，发送失败！',
          accountNotBind: 'IM登录账号与OMS账号不匹配，发送失败！',
          senderNoQQ: 'IM登录账号与OMS账号不匹配，发送失败！',
          receiverNotInList: '交易员不在联系人列表中，发送失败！',
          otherError: '操作成功！发送超时失败！'
        }
      });
    } catch (e: any) {
      if (e?.message && typeof e.message === 'string') {
        message.error(e.message);
      }
    }
  };

  const confirmCards = async ({ card }: { card?: OperationCardProp }) => {
    if (card?.room_id == null) return;

    const onConfirm = async () => {
      if (card?.room_id == null) return;

      const preSendErr = getCardError(card);

      if (preSendErr != null) {
        updateCardSendErrors([preSendErr]);
      } else {
        setCardsLoading([card], true);
        try {
          await doCardOperation(
            {
              operation_type: QuickChatCardsOperation.QuickChatCardsConfirm,
              card_info: getCardForPayload(card),
              room_id: card.room_id,
              product_type: bdsProductType
            },
            {
              hideErrorMessage: true
            }
          );

          sendCardsMsg(card);

          setCardsLoading([card], false);
        } catch (e: any) {
          if (e.data != null) {
            const requestError = e.data as DefaultResponse;

            updateCardSendErrors([{ offer_id: card.offer_id, sendError: requestError.base_response?.msg }]);
          }
        }
      }
    };

    // const cardsForAlert = [card];

    // if (cardsForAlert.length !== 0) {
    //   const cardsWithDeviation = cardsForAlert.filter(c => getCardOutOfDeviation({ card: c, handicaps, deviation }));
    //   if (cardsWithDeviation.length !== 0) {
    //     ModalUtils.confirm({
    //       showIcon: false,
    //       showTitle: false,
    //       icon: undefined,
    //       centered: true,
    //       content: (
    //         <div>
    //           <div>
    //             {cardsWithDeviation.map(c => {
    //               const currentHandicap = handicaps?.find(h => h.bond_info.code_market === c.code_market);

    //               const isBID = c.direction === AlgoDirection.AlgoDirectionBID;

    //               return (
    //                 <div
    //                   key={c.offer_id}
    //                   className="flex items-center justify-center text-sm text-white"
    //                 >
    //                   <span>{c.code_market}</span>
    //                   <span className={cx(isBID ? 'text-orange-100' : 'text-secondary-100', 'ml-2')}>{c.price}</span>
    //                   <span>（估值：{currentHandicap?.bond_info.val_yield_mat}）</span>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //           <div className="component-dashed-x h-px mt-3" />
    //           <div className="flex items-center justify-center mt-2">
    //             <i className="w-4 h-4 icon-state_3 bg-orange-100 mr-2" />
    //             偏离估值区间，是否继续？
    //           </div>
    //         </div>
    //       ),
    //       onOk: async () => {
    //         await onConfirm();
    //       }
    //     });
    //   } else {
    //   }
    // }
    await onConfirm();
  };

  useEffect(() => {
    const newCards = [...room.cards];
    const result: QuickChatCardInfo[] = [];

    (newCards ?? []).forEach(c => {
      const old = innerCards
        .filter(i => !result.some(r => r.offer_id === i.offer_id))
        .find(oldCard => oldCard.offer_id === c.offer_id);

      // quote不能本地编辑，始终更新
      result.push(old == null ? c : { ...old, quote: c?.quote });
    });

    setInnerCards(result);
  }, [room.cards]);

  const updateCard = (newCard: OperationCardProp) => {
    const result = innerCards.map(card => {
      // 仅更新目标卡片
      if (card.offer_id !== newCard.offer_id) return card;

      // rawCard: server数据
      // card: 前端维护的旧数据
      // newCard: 前端维护的新数据
      const rawCard = room.cards?.find(c => c.offer_id === newCard.offer_id);
      const isUpdBondChanged =
        newCard.key_market !== rawCard?.key_market &&
        newCard.operation_type === QuickChatAlgoOperationType.QuickChatUPD;

      const newOperationType = isUpdBondChanged ? QuickChatAlgoOperationType.QuickChatADD : newCard.operation_type;

      // 若操作类型未改变，直接更新
      if (newCard.operation_type === card.operation_type)
        return { ...newCard, isUpdBondChanged, operation_type: newOperationType };

      // 若修改操作类型后，目标的操作类型是识别出的“原操作类型”，则将识别出的字段填入
      if (rawCard != null && rawCard.operation_type === newCard.operation_type)
        return {
          ...newCard,
          direction: rawCard.direction,
          trust_degree: rawCard.trust_degree,
          flag_oco: rawCard.flag_oco,
          flag_stock_exchange: rawCard.flag_stock_exchange,
          flag_bilateral: rawCard.flag_bilateral,
          flag_request: rawCard.flag_request,
          flag_indivisible: rawCard.flag_indivisible,
          comment: rawCard.comment,
          sendError: undefined,
          isUpdBondChanged,
          operation_type: newOperationType
        };

      // 其余情况
      return {
        ...newCard,
        direction: AlgoDirection.AlgoDirectionBID,
        trust_degree: undefined,
        flag_oco: false,
        flag_stock_exchange: false,
        flag_bilateral: false,
        flag_request: false,
        flag_indivisible: false,
        comment: '',
        sendError: undefined,
        isUpdBondChanged,
        operation_type: newOperationType
      };
    });

    setInnerCards(result);
  };

  const isTraderInvalid =
    room.trader_job_status === TraderJobStatus.Quit || room.trader_usage_status === TraderUsageStatus.TraderDisable;

  const isInstInvalid =
    room.inst_status === InstStatus.StopBiz || room.inst_usage_status === InstUsageStatus.Deactivate;

  const header = (
    <div className={cx('flex items-center', isFloating && 'bg-gray-800 h-12 -mx-2 -mt-2 px-3 rounded-t-lg')}>
      <img
        className="rounded-full w-6 h-6 mr-2"
        src={room.trader_avatar}
        alt={room.trader_name}
      />
      <div className="font-bold text-gray-000 text-sm mr-1 truncate">{room.trader_name}</div>
      {(isTraderInvalid || isInstInvalid) && (
        <Tooltip content={`${isTraderInvalid ? '交易员' : '机构'}失效，无法参与点价/报价`}>
          <IconInfo
            size={12}
            className="mr-1 text-orange-100"
          />
        </Tooltip>
      )}
      <Tooltip
        truncate
        content={room.inst_name}
      >
        <div className="truncate text-gray-100 text-xs mr-2 font-[400] max-w-[180px]">{room.inst_name}</div>
      </Tooltip>

      <div className="w-5 h-5 rounded bg-gray-500 flex-center text-gray-100 text-xs mr-2 flex-shrink-0">
        {room.cards.length}
      </div>
      {!isFloating &&
        (isExpand ? (
          <Button.Icon
            onClick={() => setIsExpand?.(false)}
            icon={<IconUpDouble className="w-4 h-4 cursor-pointer" />}
          />
        ) : (
          <Button.Icon
            onClick={() => setIsExpand?.(true)}
            icon={<IconDownDouble className="w-4 h-4 cursor-pointer" />}
          />
        ))}
      {!isFloating && (
        <Tooltip content="独立窗口打开">
          <Button.Icon
            onClick={() => {
              if (room.room_id) {
                setData(old => {
                  return [...old.filter(i => floatingIDs?.includes(i.room_id)), { ...room, cards: innerCards }];
                });
                onOpenCard?.(room.room_id ?? '');
              }
            }}
            className="ml-auto"
            text
            icon={<IconNewWindow />}
          />
        </Tooltip>
      )}
      <Popconfirm
        type="danger"
        content="确定清空交易员卡片吗？"
        confirmBtnProps={{ label: '删除' }}
        onConfirm={() => deleteRoom(room)}
      >
        <div className={isFloating ? 'ml-auto' : ''}>
          <Tooltip content="清空卡片">
            <Button.Icon
              text
              icon={<IconDelete />}
            />
          </Tooltip>
        </div>
      </Popconfirm>

      {isFloating && (
        <>
          <Button.Icon
            className="ml-3"
            text
            icon={<IconMinus />}
            onClick={e => {
              e.stopPropagation();
              window.Main.minimize();
            }}
          />
          <Button.Icon
            className="ml-3"
            text
            icon={<IconClose />}
            onClick={() => {
              window.Main.close();
            }}
          />
        </>
      )}
    </div>
  );

  return (
    <div
      className={cx(
        'bg-gray-600 rounded-lg p-[7px]',
        className,
        isFloating ? 'h-full flex flex-col' : 'mt-3 mx-[10px] border border-solid border-gray-500'
      )}
      ref={containerRef}
    >
      {!isFloating && header}
      {isFloating && <DraggableHeader>{header}</DraggableHeader>}
      <div className="flex-1 overflow-y-overlay">
        {(isExpand || isFloating) &&
          (innerCards ?? []).map(c => {
            return (
              <OperationCard
                innerCard={c}
                key={c.offer_id}
                sendError={c.sendError}
                setInnerCard={updateCard}
                onConfirm={card => confirmCards({ card })}
                onDelete={() => deleteCards({ card: c })}
              />
            );
          })}
      </div>
    </div>
  );
};
