import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import { APIs } from '@fepkg/services/apis';
import { ErrorBoundary } from '@sentry/react';
import { useQuery } from '@tanstack/react-query';
import IPCEventEnum, { SpotPricingHintEnum } from 'app/types/IPCEvents';
import { Size } from 'electron';
import { setOnRequestError } from '@/common/request';
import { dealNotifyMarkRead } from '@/common/services/api/deal/notify-mark-read';
import SpotPricingCard, { OfflineSpotPricingCard } from '@/components/IDCSpot/SpotPricingCard';
import { getIsInvisible } from '@/components/IDCSpot/SpotPricingCard/util';
import { SpotPricingCardType } from '@/components/IDCSpot/types';
import { SpotPricingDisplayRecord } from './types';
import { getRecordsByContractID, isMessageRelated, isSameSpotPricingHintCard } from './utils';

const SpotPricingHintCardWithBoundary = (props: SpotPricingCardType) => {
  const [hasError, setHasError] = useState(false);

  const result = props.card.isOffline ? <OfflineSpotPricingCard {...props} /> : <SpotPricingCard {...props} />;

  return <ErrorBoundary onError={() => setHasError(true)}>{hasError ? '点价提示渲染错误' : result}</ErrorBoundary>;
};

const SCROLL_TOP_POSITION = -10000;

const scrollToTop = () => {
  const parent = document.getElementById('hint-container');
  if (parent?.children?.length === 0) {
    return;
  }
  requestIdleCallback(() => {
    parent?.scrollTo(0, SCROLL_TOP_POSITION);
  });
};

const SpotPricingHint: FC = () => {
  const canClickThrough = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const [windowHeight, setWindowHeight] = useState(1);
  const [cards, setCards] = useState<SpotPricingDisplayRecord[]>([]);
  const prevWindowHeight = usePrevious(windowHeight);
  const prevCards = usePrevious(cards);

  const updateHeight = useCallback(async () => {
    if (isDragging.current) return;
    const size: Size | undefined = await window.Main.invoke(SpotPricingHintEnum.GetScreenSize);
    if (size == null) return;
    setWindowHeight(size.height);
  }, []);

  const onUpdateCards: Dispatch<SetStateAction<SpotPricingDisplayRecord[]>> = useCallback(
    param => {
      setCards(param);
      updateHeight();
    },
    [updateHeight]
  );

  const checkAndSendResizeMessage = async () => {
    const parent = document.getElementById('hint-container');
    const nodes = parent?.children;
    if (parent == null || nodes == null || nodes.length === 0) {
      await window.Main.invoke<any>(SpotPricingHintEnum.Resize, 1, 1, true);
      return;
    }
    await window.Main.invoke<any>(
      SpotPricingHintEnum.Resize,
      456,
      // -1时代表高度撑满当前屏幕
      window.System.isWin7 ? parent.offsetHeight : -1,
      prevCards == null || prevCards.length === 0
    );
    window.Main.sendMessage(SpotPricingHintEnum.Focus);
    scrollToTop();
  };

  // 当 windowHeight 或 cards 发生变化且渲染完毕后，更新一次点价提示窗口的尺寸
  // 不将 checkAndSendResizeMessage 加入依赖，也不对其进行useCallback保证其始终是最新
  // 特别地，对于窗口轮询更新卡片状态的场合，不更新尺寸
  useEffect(() => {
    if (prevWindowHeight !== windowHeight) {
      checkAndSendResizeMessage();
    }

    if (
      cards.length !== prevCards?.length ||
      (cards.length !== 0 &&
        !cards.every((c, index) => {
          let isSameCard = false;

          const oldCard: SpotPricingDisplayRecord = prevCards[index];

          if (oldCard == null) {
            isSameCard = false;
          } else {
            isSameCard = isSameSpotPricingHintCard(c, oldCard, true);
          }

          return isSameCard && (c.isOffline || c.isManualRefresh);
        }))
    ) {
      checkAndSendResizeMessage();
    }
  }, [windowHeight, cards]);

  useEffect(() => {
    const idList = cards
      .filter(card => !card.isManualRefresh && card.dealID != null)
      .reduce((current, next) => {
        return [...current, ...(next.notifyIDs ?? [])];
      }, [] as string[]);

    if (idList.length === 0) return;
    dealNotifyMarkRead({
      notify_id_list: idList
    });
  }, [cards]);

  const onUpdateMessages = useCallback(
    (
      newMessages: SpotPricingDisplayRecord[],
      forceVisible,
      isManualRefresh = false,
      // refreshingCards 为“轮询时已有的条目”，用于对比是否某条记录被删除
      refreshingCards?: SpotPricingDisplayRecord[]
    ) => {
      if ((newMessages == null || newMessages.length === 0) && refreshingCards == null) return;

      onUpdateCards(oldCards => {
        const updatedCards = [...oldCards];

        // 若 refreshingCards 不为null则将“更新的条目”视为原条目及其被更新后的部分
        // 不然，则直接为轮询结果
        // outDatedContractIDs用于标记每条数据内哪些成交记录已被删除
        (refreshingCards == null
          ? newMessages
          : refreshingCards.map(c => {
              const target = newMessages.find(m => isSameSpotPricingHintCard(c, m));

              if (target == null) {
                return {
                  ...c,
                  outDatedContractIDs: c.deal_list?.map(d => d.deal_id)
                };
              }

              return {
                ...target,
                outDatedContractIDs: c.deal_list
                  ?.filter(d => !target.deal_list?.some(newDeal => newDeal.deal_id === d.deal_id))
                  ?.map(d => d.deal_id),
                deal_list: c.deal_list?.map(deal => {
                  const newDeal = target.deal_list?.find(d => d.deal_id === deal.deal_id);

                  return newDeal ?? deal;
                })
              };
            })
        )
          .filter(
            card =>
              card.deal_list == null ||
              card.deal_list.length === 0 ||
              card.deal_list.some(m => isMessageRelated(m, card.receiverSide))
          )
          .map(card => ({ ...card, deal_list: card.deal_list?.filter(m => isMessageRelated(m, card.receiverSide)) }))
          .forEach(record => {
            const index = updatedCards.findIndex(um => isSameSpotPricingHintCard(um, record));

            if (index !== -1) {
              const oldCard = updatedCards[index];

              const needUseOldCardForceVisible = getIsInvisible(oldCard) && isManualRefresh;

              updatedCards[index] = {
                ...record,
                forceVisible: needUseOldCardForceVisible ? oldCard.forceVisible : forceVisible,
                isManualRefresh,
                notifyIDs: record.dealID
                  ? [...(updatedCards[index].notifyIDs ?? []), record.dealID]
                  : updatedCards[index].notifyIDs
              };
            } else if (!isManualRefresh) {
              updatedCards.push({
                ...record,
                forceVisible,
                isManualRefresh,
                notifyIDs: record.dealID ? [record.dealID] : undefined
              });
            }
          });

        return updatedCards;
      });
    },
    [onUpdateCards]
  );

  // 初始化背景的透明以及不可点击
  // 绑定document鼠标事件和主进程通信
  // 尽管有dependency但其实不会改变
  useEffect(() => {
    setOnRequestError(err => {
      window.Main.sendMessage(SpotPricingHintEnum.ShowErrorInParent, err);
    });

    document.body.setAttribute('style', 'pointer-events: none');
    document.getElementById('root')?.setAttribute('style', 'pointer-events: none; background: none; border: none;');

    const onSetClickThrough = (e: MouseEvent) => {
      if (isDragging.current) return;
      const isClickThrough = e.target === document.documentElement;
      if (canClickThrough.current !== isClickThrough) {
        window.Main.sendMessage(SpotPricingHintEnum.ToggleClickThrough, isClickThrough);
      }
      canClickThrough.current = isClickThrough;
    };

    document.addEventListener('mousemove', onSetClickThrough);
    document.addEventListener('mouseenter', onSetClickThrough);

    window.Main.on(
      SpotPricingHintEnum.NewMessage,
      (data?: { recordList: SpotPricingDisplayRecord[]; forceVisible: boolean }) => {
        if (data == null) return;

        const { recordList: newMessages, forceVisible } = data;

        onUpdateMessages(newMessages, forceVisible);
      }
    );

    return () => {
      window.Main.remove(SpotPricingHintEnum.NewMessage);
      window.Main.remove(SpotPricingHintEnum.UpdateRendererSize);

      document.removeEventListener('mousemove', onSetClickThrough);
      document.removeEventListener('mouseenter', onSetClickThrough);
    };
  }, [onUpdateMessages]);

  const refreshRecord = async (oldCard?: SpotPricingDisplayRecord, recordIds?: string[]) => {
    if (recordIds == null || recordIds.length === 0) return;

    const records = (await getRecordsByContractID(recordIds, false, true)) ?? [];

    onUpdateMessages(
      oldCard == null ? records : records.filter(r => isSameSpotPricingHintCard(r, oldCard)),
      false,
      true,
      oldCard == null ? cards : undefined
    );
  };

  const recordIdsForReferesh = useMemo(() => {
    const recordIDSet = new Set<string>();

    cards
      .filter(c => !c.isOffline)
      .forEach(c => {
        if (c.deal_list?.[0]?.deal_id) {
          recordIDSet.add(c.deal_list[0].deal_id);
        }
      });

    return Array.from(recordIDSet);
  }, [cards]);

  // 点价提示窗口自行轮询现有的卡片并更新其数据
  useQuery({
    queryKey: [APIs.deal.spotPricingDetailGet, recordIdsForReferesh] as const,
    queryFn: async () => {
      await refreshRecord(undefined, recordIdsForReferesh);
      return [];
    },
    refetchInterval: 500
  });

  return (
    <div
      className="fixed bottom-0 left-0"
      onKeyDown={e => {
        if (e.code === 'Escape') {
          if (isDragging.current) return;
          onUpdateCards(oldCards => {
            if (oldCards.length === 0) return [];

            return oldCards.slice(0, -1);
          });
        }
      }}
      tabIndex={-1}
    >
      <div
        style={{
          maxHeight: windowHeight,
          pointerEvents: 'auto'
        }}
        id="hint-container"
        className="flex flex-col-reverse overflow-y-overlay place-content-end"
      >
        {windowHeight !== 1 &&
          cards.map((card, index) => (
            <div
              className="pointer-events-auto"
              onFocus={() => {}}
              onMouseOver={() => {
                window.Main.sendMessage(SpotPricingHintEnum.Focus);
              }}
              key={`${card.spot_pricing_record?.spot_record_id ?? card.deal_list?.[0]?.deal_id}_${card.receiverSide}`}
            >
              <SpotPricingHintCardWithBoundary
                className={index === 0 ? '' : '-mb-px'}
                card={card}
                forceVisible={card.forceVisible}
                isManualRefresh={card.isManualRefresh}
                onDragStart={() => {
                  isDragging.current = true;
                  window.Main.sendMessage(SpotPricingHintEnum.ToggleClickThrough, false);
                }}
                onDragEnd={() => {
                  isDragging.current = false;
                  window.Main.sendMessage(SpotPricingHintEnum.ToggleClickThrough, false);
                  updateHeight();
                }}
                onClose={() => {
                  const newCards = [...cards];
                  newCards.splice(index, 1);

                  onUpdateCards(newCards);
                  window.Main.sendMessage(IPCEventEnum.WindowMoveEnd);
                }}
                onRefresh={async () => {
                  if (card.isOffline) return;

                  await refreshRecord(card, recordIdsForReferesh);
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpotPricingHint;
