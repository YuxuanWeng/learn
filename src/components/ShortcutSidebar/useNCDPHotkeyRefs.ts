import { RefObject, useEffect, useRef } from 'react';
import { message } from '@fepkg/components/Message';
import { NCDPInfo } from '@fepkg/services/types/common';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { useProductParams } from '@/layouts/Home/hooks';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';

type UseNCDPHotkeyRefsParams = {
  selectedNCDPList: NCDPInfo[];
  /** 是否有选择 NCD 存单 */
  hasSelectedNCDP: boolean;
};

type HotKeyState = UseNCDPHotkeyRefsParams;

export const useNCDPHotkeyRefs = ({ selectedNCDPList, hasSelectedNCDP }: UseNCDPHotkeyRefsParams) => {
  const { panelId } = useProductParams();
  const { activeTableKey } = useProductPanel();

  const quoteRef = useRef<HTMLButtonElement>(null);
  const internalRef = useRef<HTMLButtonElement>(null);
  const externalRef = useRef<HTMLButtonElement>(null);

  // 保持引用稳定，使用 useRef
  // 目的是避免每次已选项改变时都重新注册 hotkeys
  const selectedQuoteListState = useRef<HotKeyState>({
    selectedNCDPList,
    hasSelectedNCDP
  });

  useEffect(() => {
    selectedQuoteListState.current.selectedNCDPList = selectedNCDPList;

    selectedQuoteListState.current.hasSelectedNCDP = hasSelectedNCDP;
  }, [selectedNCDPList, hasSelectedNCDP]);

  useEffect(() => {
    const pairs: [RefObject<HTMLElement>, UserHotkeyFunction][] = [
      [quoteRef, UserHotkeyFunction.UserHotkeyOpenQuoteWindow],
      [internalRef, UserHotkeyFunction.UserHotkeyInternalConversion],
      [externalRef, UserHotkeyFunction.UserHotkeyInternalConversion]
    ];

    const refFunc: Record<number, RefObject<HTMLElement>[]> = {};

    for (const [ref, func] of pairs) {
      if (refFunc[func] == null) {
        refFunc[func] = [];
      }
      refFunc[func].push(ref);
    }

    for (const func of Object.keys(refFunc)) {
      const refs = refFunc[func];
      userHotkeyManager.registerInTab(
        Number(func),
        () => {
          const { selectedNCDPList: selectedList } = selectedQuoteListState.current;

          if (
            func === UserHotkeyFunction.UserHotkeyInternalConversion.toString() &&
            !selectedList.every(q => q.flag_internal) &&
            !selectedList.every(q => !q.flag_internal)
          ) {
            message.error('无法对明暗盘混合报价进行操作');
            return;
          }

          for (const ref of refs) {
            ref.current?.click();
          }
        },
        panelId,
        undefined
      );
    }

    return () => {
      for (const [, func] of pairs) {
        userHotkeyManager.unRegister(func, panelId);
      }
    };
  }, [internalRef, externalRef, activeTableKey, panelId]);

  return {
    quoteRef,
    internalRef,
    externalRef
  };
};
