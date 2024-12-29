import { useEffect, useRef } from 'react';
import { message } from '@fepkg/components/Message';
import type { BondQuoteMulUpdate } from '@fepkg/services/types/bond-quote/mul-update';
import { QuoteLite } from '@fepkg/services/types/common';
import { OperationType, ProductType, Side, UserHotkeyFunction } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { mulUpdateBondQuoteWithUndo } from '@/common/undo-services';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { useDetailPanel } from '@/pages/Quote/BondDetail/providers/DetailPanelProvider';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';

export const useHotkeys = (selectedQuoteList: QuoteLite[], productType: ProductType, hasSelectedSTCQuote: boolean) => {
  const { accessCache } = useDetailPanel();

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const gvnTknRef = useRef<HTMLButtonElement>(null);
  const tradeRef = useRef<HTMLButtonElement>(null);
  const referRef = useRef<HTMLButtonElement>(null);
  const quoteRef = useRef<HTMLButtonElement>(null);

  const actionJoin = useMemoizedFn(() => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    if (selectedQuoteList.length === 0) {
      message.error('没有选择要操作的数据！');
      return;
    }
    if (selectedQuoteList.length !== 1) {
      message.error('只能选择一条要操作的数据！');
      return;
    }

    const [quote] = selectedQuoteList;

    const { config } = getSingleQuoteDialogConfig(productType, {
      defaultValue: quote,
      actionMode: QuoteActionMode.JOIN,
      focusInput: quote.side === Side.SideBid ? QuoteFocusInputType.BID_PRICE : QuoteFocusInputType.OFR_PRICE
    });
    openDialog(config, { showOfflineMsg: false });
  });

  const actionAlmostDone = useMemoizedFn(async () => {
    if (selectedQuoteList.length === 0) {
      message.error('没有选择要操作的数据！');
      return;
    }
    if (hasSelectedSTCQuote) {
      message.error('修改失败，存在不可被修改的报价！');
      return;
    }

    const params: BondQuoteMulUpdate.Request = {
      quote_item_list: selectedQuoteList?.map(v => ({
        quote_id: v.quote_id,
        flag_package: v.flag_package,
        flag_oco: v.flag_oco,
        yield: v.yield,
        flag_recommend: v.flag_recommend,
        flag_urgent: v.flag_urgent,
        almost_done: v.almost_done,
        flag_star: v.flag_star,
        side: v.side
      })),
      operation_info: { operation_type: OperationType.BondQuoteUpdateInfo }
    };

    params.quote_item_list = params.quote_item_list?.map(v => ({
      quote_id: v.quote_id,
      almost_done: !v.almost_done
    }));

    await mulUpdateBondQuoteWithUndo(params, { origin: selectedQuoteList, productType });
  });

  const actionRefer = useMemoizedFn(() => {
    if (selectedQuoteList.length === 0) {
      message.error('没有选择要操作的数据！');
      return;
    }
    if (hasSelectedSTCQuote) {
      message.error('修改失败，存在不可被修改的报价！');
      return;
    }

    referRef.current?.click();
  });

  useEffect(() => {
    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyGVNTKNDeal, () => {
      if (selectedQuoteList.length < 1) {
        message.error('没有选择要操作的数据！');
        return;
      }
      gvnTknRef.current?.click();
    });

    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyTrade, () => {
      tradeRef.current?.click();
    });
    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyQuoteRefer, actionRefer);

    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyOpenQuoteWindow, () => {
      quoteRef.current?.click();
    });

    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyQuoteJoin, actionJoin);

    userHotkeyManager.register(UserHotkeyFunction.UserHotkeyAlmostDone, actionAlmostDone);

    return () => {
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyGVNTKNDeal);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyTrade);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyQuoteRefer);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyOpenQuoteWindow);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyQuoteJoin);
      userHotkeyManager.unRegister(UserHotkeyFunction.UserHotkeyAlmostDone);
    };
  }, [actionAlmostDone, actionJoin, actionRefer, selectedQuoteList.length]);

  return { gvnTknRef, tradeRef, referRef, quoteRef };
};
