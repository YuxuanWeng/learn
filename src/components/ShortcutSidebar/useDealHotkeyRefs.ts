import { RefObject, useEffect, useRef } from 'react';
import { message } from '@fepkg/components/Message';
import { MarketDeal } from '@fepkg/services/types/common';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { useProductParams } from '@/layouts/Home/hooks';
import { Action } from './types';
import { Value } from './useDealShortcutEvent';

type UseDealHotkeyRefsParams = {
  selectedMarketDealList: MarketDeal[];
  onEvent: (action: Action, value: Value, cb?: () => void) => void;
};

type HotKeyState = UseDealHotkeyRefsParams;

export const useDealHotkeyRefs = ({ selectedMarketDealList, onEvent }: UseDealHotkeyRefsParams) => {
  const { panelId } = useProductParams();

  const quoteRef = useRef<HTMLButtonElement>(null);
  const batchQuoteRef = useRef<HTMLButtonElement>(null);
  const tradeRef = useRef<HTMLButtonElement>(null);
  const joinRef = useRef<HTMLButtonElement>(null);
  const internalRef = useRef<HTMLButtonElement>(null);
  const externalRef = useRef<HTMLButtonElement>(null);

  // 保持引用稳定，使用 useRef
  // 目的是避免每次已选项改变时都重新注册 hotkeys
  const selectedQuoteListState = useRef<HotKeyState>({
    selectedMarketDealList,
    onEvent
  });

  useEffect(() => {
    selectedQuoteListState.current.selectedMarketDealList = selectedMarketDealList;
    selectedQuoteListState.current.onEvent = onEvent;
  }, [onEvent, selectedMarketDealList]);

  useEffect(() => {
    const pairs: [RefObject<HTMLElement>, UserHotkeyFunction][] = [
      [quoteRef, UserHotkeyFunction.UserHotkeyOpenQuoteWindow],
      [tradeRef, UserHotkeyFunction.UserHotkeyTrade],
      [joinRef, UserHotkeyFunction.UserHotkeyQuoteJoin],
      [internalRef, UserHotkeyFunction.UserHotkeyInternalConversion],
      [externalRef, UserHotkeyFunction.UserHotkeyInternalConversion]
    ];

    const refFunc: Record<number, RefObject<HTMLElement>[]> = {};

    pairs.forEach(([ref, func]) => {
      if (refFunc[func] == null) {
        refFunc[func] = [];
      }
      refFunc[func].push(ref);
    });

    Object.keys(refFunc).forEach(func => {
      const refs = refFunc[func];
      userHotkeyManager.registerInTab(
        Number(func),
        () => {
          const { selectedMarketDealList: deals } = selectedQuoteListState.current;

          const isEmpty = deals.length === 0;

          const openFuncs = [
            UserHotkeyFunction.UserHotkeyOpenQuoteWindow.toString(),
            UserHotkeyFunction.UserHotkeyTrade.toString()
          ];

          if (!openFuncs.includes(func)) {
            if (isEmpty) {
              message.error('没有选择要操作的数据！');
              return;
            }

            if (deals.length !== 1 && func === UserHotkeyFunction.UserHotkeyQuoteJoin.toString()) {
              message.error('只能选择一条要操作的数据！');
              return;
            }

            if (
              func === UserHotkeyFunction.UserHotkeyInternalConversion.toString() &&
              deals.every(d => d.nothing_done)
            ) {
              message.error('选择的数据不能修改！');
              return;
            }
          }

          refs.forEach(ref => {
            ref.current?.click();
          });
        },
        panelId,
        undefined
      );
    });

    return () => {
      pairs.forEach(([, func]) => {
        userHotkeyManager.unRegister(func, panelId);
      });
    };
  }, [quoteRef, batchQuoteRef, tradeRef, joinRef, internalRef, externalRef, panelId]);

  return {
    quoteRef,
    batchQuoteRef,
    tradeRef,
    joinRef,
    internalRef,
    externalRef
  };
};
