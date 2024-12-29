import { RefObject, useEffect, useRef } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { message } from '@fepkg/components/Message';
import { FiccBondBasic, QuoteLite } from '@fepkg/services/types/common';
import { Side, UserHotkeyFunction } from '@fepkg/services/types/enum';
import { useAtomValue } from 'jotai';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { useProductParams } from '@/layouts/Home/hooks';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { Action, ActionValue } from './types';
import { Value } from './useShortcutEvent';

type UseHotkeyRefsParams = {
  selectedQuoteList: QuoteLite[];
  selectedBondList: FiccBondBasic[];
  selectedSide?: Side;
  /** 是否有选择 STC 报价 */
  hasSelectedSTCQuote: boolean;
  onEvent: (action: Action, value: Value) => void;
};

type HotKeyState = UseHotkeyRefsParams;

export const useHotkeyRefs = ({
  selectedQuoteList,
  selectedBondList,
  selectedSide,
  hasSelectedSTCQuote,
  onEvent
}: UseHotkeyRefsParams) => {
  const { panelId } = useProductParams();
  const { activeTableKey } = useProductPanel();

  const quoteRef = useRef<HTMLButtonElement>(null);
  const batchQuoteRef = useRef<HTMLButtonElement>(null);
  const gvnTknRef = useRef<HTMLButtonElement>(null);
  const tradeRef = useRef<HTMLButtonElement>(null);
  const joinRef = useRef<HTMLButtonElement>(null);
  const referRef = useRef<HTMLButtonElement>(null);
  const unreferRef = useRef<HTMLButtonElement>(null);
  const starRef = useRef<HTMLButtonElement>(null);
  const doubleStarRef = useRef<HTMLButtonElement>(null);
  const internalRef = useRef<HTMLButtonElement>(null);
  const externalRef = useRef<HTMLButtonElement>(null);
  const ocoRef = useRef<HTMLButtonElement>(null);
  const packageRef = useRef<HTMLButtonElement>(null);
  const recommendRef = useRef<HTMLButtonElement>(null);
  const refreshRef = useRef<HTMLButtonElement>(null);
  const almostDownRef = useRef<HTMLButtonElement>(null);
  const valuationQuoteRef = useRef<HTMLButtonElement>(null);

  const remark1Ref = useRef<HTMLButtonElement>(null);
  const remark2Ref = useRef<HTMLButtonElement>(null);
  const remark3Ref = useRef<HTMLButtonElement>(null);
  const remark4Ref = useRef<HTMLButtonElement>(null);
  const remark5Ref = useRef<HTMLButtonElement>(null);
  const remark6Ref = useRef<HTMLButtonElement>(null);
  const remark7Ref = useRef<HTMLButtonElement>(null);
  const remark8Ref = useRef<HTMLButtonElement>(null);

  // 保持引用稳定，使用 useRef
  // 目的是避免每次已选项改变时都重新注册 hotkeys
  const selectedQuoteListState = useRef<HotKeyState>({
    selectedQuoteList,
    selectedBondList,
    selectedSide,
    hasSelectedSTCQuote,
    onEvent
  });

  useEffect(() => {
    selectedQuoteListState.current.selectedQuoteList = selectedQuoteList;

    selectedQuoteListState.current.selectedBondList = selectedBondList;

    selectedQuoteListState.current.selectedSide = selectedSide;
    selectedQuoteListState.current.hasSelectedSTCQuote = hasSelectedSTCQuote;
    selectedQuoteListState.current.onEvent = onEvent;
  }, [selectedQuoteList, selectedBondList, selectedSide, hasSelectedSTCQuote, onEvent]);

  useEffect(() => {
    const pairs: [RefObject<HTMLElement>, UserHotkeyFunction][] = [
      [quoteRef, UserHotkeyFunction.UserHotkeyOpenQuoteWindow],
      [gvnTknRef, UserHotkeyFunction.UserHotkeyGVNTKNDeal],
      [tradeRef, UserHotkeyFunction.UserHotkeyTrade],
      [joinRef, UserHotkeyFunction.UserHotkeyQuoteJoin],
      [referRef, UserHotkeyFunction.UserHotkeyQuoteRefer],
      [unreferRef, UserHotkeyFunction.UserHotkeyQuoteUnRefer],
      [starRef, UserHotkeyFunction.UserHotkeyQuoteAddStar],
      [doubleStarRef, UserHotkeyFunction.UserHotkeyQuoteAddDoubleStar],
      [internalRef, UserHotkeyFunction.UserHotkeyInternalConversion],
      [externalRef, UserHotkeyFunction.UserHotkeyInternalConversion],
      [ocoRef, UserHotkeyFunction.UserHotkeyOCO],
      [packageRef, UserHotkeyFunction.UserHotkeyPackageKey],
      [recommendRef, UserHotkeyFunction.UserHotkeyRecommend],
      [refreshRef, UserHotkeyFunction.UserHotkeyRefresh],
      [almostDownRef, UserHotkeyFunction.UserHotkeyAlmostDone],
      [valuationQuoteRef, UserHotkeyFunction.UserHotkeyValuationQuote],
      [remark1Ref, UserHotkeyFunction.UserHotkeyRemarkOne],
      [remark2Ref, UserHotkeyFunction.UserHotkeyRemarkTwo],
      [remark3Ref, UserHotkeyFunction.UserHotkeyRemarkThree],
      [remark4Ref, UserHotkeyFunction.UserHotkeyRemarkFour],
      [remark5Ref, UserHotkeyFunction.UserHotkeyRemarkFive],
      [remark6Ref, UserHotkeyFunction.UserHotkeyRemarkSix],
      [remark7Ref, UserHotkeyFunction.UserHotkeyRemarkSeven],
      [remark8Ref, UserHotkeyFunction.UserHotkeyRemarkEight]
    ];

    // 实时盘口和债券列表应用同一套check规则
    const isOptimalOrBond = [ProductPanelTableKey.Optimal, ProductPanelTableKey.Bond].includes(activeTableKey);

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
          const {
            selectedQuoteList: quotes,
            selectedBondList: bonds,
            selectedSide: side,
            onEvent: onEvt
          } = selectedQuoteListState.current;

          const isEmpty = (!isOptimalOrBond && quotes.length === 0) || (isOptimalOrBond && bonds.length === 0);

          if (
            (func === UserHotkeyFunction.UserHotkeyQuoteJoin.toString() &&
              activeTableKey === ProductPanelTableKey.Referred) ||
            (func === UserHotkeyFunction.UserHotkeyQuoteUnRefer.toString() &&
              activeTableKey !== ProductPanelTableKey.Referred) ||
            (func === UserHotkeyFunction.UserHotkeyQuoteRefer.toString() &&
              activeTableKey === ProductPanelTableKey.Referred) ||
            hasModalVisible()
          ) {
            return;
          }

          const openFuncs = [
            UserHotkeyFunction.UserHotkeyOpenQuoteWindow.toString(),
            UserHotkeyFunction.UserHotkeyTrade.toString()
          ];

          if (!openFuncs.includes(func)) {
            if (isEmpty) {
              message.error('没有选择要操作的数据！');
              return;
            }

            // 选中 STC 报价时，除了 Join、快捷键窗口、打开报价窗口、Show All、债券计算器外均不可用
            if (
              func !== UserHotkeyFunction.UserHotkeyQuoteJoin.toString() &&
              selectedQuoteListState.current.hasSelectedSTCQuote
            ) {
              message.error('修改失败，存在不可被修改的报价！');
              return;
            }

            if (isOptimalOrBond && side == null) {
              message.error('请选择一侧报价进行操作！');
              return;
            }

            if (isOptimalOrBond && quotes.length === 0) {
              message.error('此数据不可操作！');
              return;
            }

            if (quotes.length !== 1 && func === UserHotkeyFunction.UserHotkeyQuoteJoin.toString()) {
              message.error('只能选择一条要操作的数据！');
              return;
            }
          }

          if (
            func === UserHotkeyFunction.UserHotkeyInternalConversion.toString() &&
            !quotes.every(q => q.flag_internal) &&
            !quotes.every(q => !q.flag_internal)
          ) {
            message.error('无法对明暗盘混合报价进行操作');
            return;
          }

          if (
            func === UserHotkeyFunction.UserHotkeyAlmostDone.toString() &&
            activeTableKey !== ProductPanelTableKey.Referred
          ) {
            onEvt(Action.Edit, ActionValue.AlmostDone);
            return;
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
  }, [
    quoteRef,
    batchQuoteRef,
    gvnTknRef,
    tradeRef,
    joinRef,
    referRef,
    unreferRef,
    starRef,
    doubleStarRef,
    internalRef,
    externalRef,
    ocoRef,
    packageRef,
    recommendRef,
    refreshRef,
    valuationQuoteRef,
    almostDownRef,
    remark1Ref,
    remark2Ref,
    remark3Ref,
    remark4Ref,
    remark5Ref,
    remark6Ref,
    remark7Ref,
    remark8Ref,
    activeTableKey,
    panelId
  ]);

  return {
    quoteRef,
    batchQuoteRef,
    gvnTknRef,
    tradeRef,
    joinRef,
    referRef,
    unreferRef,
    starRef,
    doubleStarRef,
    internalRef,
    externalRef,
    ocoRef,
    packageRef,
    recommendRef,
    refreshRef,
    valuationQuoteRef,
    almostDownRef,

    remark1Ref,
    remark2Ref,
    remark3Ref,
    remark4Ref,
    remark5Ref,
    remark6Ref,
    remark7Ref,
    remark8Ref
  };
};
