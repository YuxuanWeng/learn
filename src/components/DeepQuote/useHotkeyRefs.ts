import { useEffect, useRef } from 'react';
import { message } from '@fepkg/components/Message';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { flatten } from 'lodash-es';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { useProductParams } from '@/layouts/Home/hooks';

type UseHotkeyRefsParams = {
  countSelectedLength: string[];
  selectedBidRowKeys: Set<string>;
  selectedOfrRowKeys: Set<string>;
  hasCheckedModal: boolean;
  /** 是否有选择 STC 报价 */
  hasSelectedSTCQuote?: boolean;
  /** 快捷键disable状态 */
  shortcutDisabled?: boolean;
};

type HotkeyState = Omit<UseHotkeyRefsParams, 'hasCheckedModal'>;

export const useHotkeyRefs = ({
  countSelectedLength,
  selectedBidRowKeys,
  selectedOfrRowKeys,
  hasSelectedSTCQuote,
  hasCheckedModal,
  shortcutDisabled
}: UseHotkeyRefsParams) => {
  const { panelId } = useProductParams();

  const gvnTknRef = useRef<HTMLButtonElement>(null);
  const tradeRef = useRef<HTMLButtonElement>(null);
  const referRef = useRef<HTMLButtonElement>(null);
  const joinRef = useRef<HTMLButtonElement>(null);

  const hotkeyState = useRef<HotkeyState>({
    countSelectedLength,
    selectedBidRowKeys,
    selectedOfrRowKeys,
    hasSelectedSTCQuote
  });

  useEffect(() => {
    if (shortcutDisabled) {
      return;
    }

    hotkeyState.current.countSelectedLength = countSelectedLength;
    hotkeyState.current.selectedBidRowKeys = selectedBidRowKeys;
    hotkeyState.current.selectedOfrRowKeys = selectedOfrRowKeys;
    hotkeyState.current.hasSelectedSTCQuote = hasSelectedSTCQuote;
  }, [countSelectedLength, selectedBidRowKeys, selectedOfrRowKeys, hasSelectedSTCQuote, shortcutDisabled]);

  useEffect(() => {
    if (shortcutDisabled) {
      return void 0;
    }

    const functionsToDisable = [
      UserHotkeyFunction.UserHotkeyQuoteUnRefer,
      UserHotkeyFunction.UserHotkeyQuoteAddStar,
      UserHotkeyFunction.UserHotkeyQuoteAddDoubleStar,
      UserHotkeyFunction.UserHotkeyInternalConversion,
      UserHotkeyFunction.UserHotkeyInternalConversion,
      UserHotkeyFunction.UserHotkeyOCO,
      UserHotkeyFunction.UserHotkeyPackageKey,
      UserHotkeyFunction.UserHotkeyRecommend,
      UserHotkeyFunction.UserHotkeyRefresh,
      UserHotkeyFunction.UserHotkeyAlmostDone,
      UserHotkeyFunction.UserHotkeyValuationQuote,
      UserHotkeyFunction.UserHotkeyRemarkOne,
      UserHotkeyFunction.UserHotkeyRemarkTwo,
      UserHotkeyFunction.UserHotkeyRemarkThree,
      UserHotkeyFunction.UserHotkeyRemarkFour,
      UserHotkeyFunction.UserHotkeyRemarkFive,
      UserHotkeyFunction.UserHotkeyRemarkSix,
      UserHotkeyFunction.UserHotkeyRemarkSeven,
      UserHotkeyFunction.UserHotkeyRemarkEight
    ];

    const priority = 2;

    if (hasCheckedModal) {
      userHotkeyManager.registerInTab(
        UserHotkeyFunction.UserHotkeyGVNTKNDeal,
        () => {
          if (hotkeyState.current.countSelectedLength.length > 1) {
            message.error('请选择一条报价进行成交！');
            return;
          }

          if (
            hotkeyState.current.countSelectedLength.length === 0 &&
            (hotkeyState.current.selectedBidRowKeys.size !== 0 || hotkeyState.current.selectedOfrRowKeys.size !== 0)
          ) {
            message.error('此数据不可操作！');
            return;
          }

          if (hotkeyState.current.countSelectedLength.length === 0) {
            message.error('没有选择要操作的数据！');
            return;
          }

          gvnTknRef.current?.click();
        },
        panelId,
        priority
      );

      userHotkeyManager.registerInTab(
        UserHotkeyFunction.UserHotkeyTrade,
        () => {
          tradeRef.current?.click();
        },
        panelId,
        priority
      );

      userHotkeyManager.registerInTab(
        UserHotkeyFunction.UserHotkeyQuoteRefer,
        () => {
          if (hotkeyState.current.hasSelectedSTCQuote) {
            message.error('修改失败，存在不可被修改的报价！');
            return;
          }

          if (
            hotkeyState.current.countSelectedLength.length === 0 &&
            (hotkeyState.current.selectedBidRowKeys.size !== 0 || hotkeyState.current.selectedOfrRowKeys.size !== 0)
          ) {
            message.error('此数据不可操作!');
            return;
          }

          if (hotkeyState.current.countSelectedLength.length === 0) {
            message.error('没有选择要操作的数据！');
            return;
          }

          referRef.current?.click();
        },
        panelId,
        priority
      );

      userHotkeyManager.registerInTab(
        UserHotkeyFunction.UserHotkeyQuoteJoin,
        () => {
          if (
            hotkeyState.current.countSelectedLength.length > 1 ||
            flatten([...hotkeyState.current.selectedBidRowKeys, ...hotkeyState.current.selectedOfrRowKeys]).length > 1
          ) {
            message.error('只能选择一条要操作的数据！');
            return;
          }

          if (
            hotkeyState.current.countSelectedLength.length === 0 &&
            (hotkeyState.current.selectedBidRowKeys.size !== 0 || hotkeyState.current.selectedOfrRowKeys.size !== 0)
          ) {
            message.error('此数据不可操作!');
            return;
          }

          if (hotkeyState.current.countSelectedLength.length <= 0) {
            message.error('没有选择要操作的数据！');
            return;
          }

          joinRef.current?.click();
        },
        panelId,
        priority
      );

      functionsToDisable.forEach(func => {
        userHotkeyManager.registerInTab(func, () => {}, panelId, priority);
      });
    }

    return () => {
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyGVNTKNDeal, panelId, priority);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyTrade, panelId, priority);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyQuoteRefer, panelId, priority);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyQuoteJoin, panelId, priority);

      functionsToDisable.forEach(func => {
        userHotkeyManager.unRegister(func, panelId, priority);
      });
    };
  }, [referRef, joinRef, panelId, hotkeyState, hasCheckedModal, shortcutDisabled]);

  return { gvnTknRef, tradeRef, referRef, joinRef };
};
