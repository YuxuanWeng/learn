import { useMemo, useRef, useState } from 'react';
import { Dropdown } from 'antd';
import { Button } from '@fepkg/components/Button';
import { DEFAULT_ICON_CONFIG, IconCopy, IconDown, IconEdit, IconProvider, IconUndo } from '@fepkg/icon-park-react';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import {
  shortcutLogClickTime,
  shortcutLogType
} from '@/common/services/hooks/useBondQuoteQuery/useShortcutTimeConsumingLog';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { trackPoint } from '@/common/utils/logger/point';
import { logUndo, recoverUndoSnapshot } from '@/common/utils/undo';
import { QuoteTrigger } from '@/components/Quote/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import { useGlobalSearchingBond } from '@/pages/ProductPanel/hooks/useGlobalSearchingBond';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { getCollaborativeQuoteDialogConfig } from '@/pages/Quote/Collaborative/utils';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { LogFlowPhase } from '@/types/log';
import { UndoList } from './UndoList';
import { OTHER_SHORTCUT_BUTTON_LIST, UPDATE_PRICE_LIST, UPDATE_VOL_LIST } from './constants';
import { Action, ActionValue, DealShortcutSidebarProps, InternalEnum } from './types';
import { useDealHotkeyRefs } from './useDealHotkeyRefs';
import { DealTrace, useDealShortcutEvent } from './useDealShortcutEvent';

const iconBtnCls = '!h-8';
const iconConfig = { ...DEFAULT_ICON_CONFIG, size: 20 };

export const DealShortcutSidebar = ({ selectedMarketDealList, onEventSuccess }: DealShortcutSidebarProps) => {
  const { productType, panelId } = useProductParams();
  const { accessCache, activeTableKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();
  const { getSearchingBond } = useGlobalSearchingBond();

  const [selectUndoRecords, setSelectUndoRecords] = useState<number[]>([]);

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  const { onEvent, undoSnapshots } = useDealShortcutEvent({
    selectedMarketDealList,
    onEventSuccess
  });

  const { quoteRef, batchQuoteRef, tradeRef, joinRef, internalRef, externalRef } = useDealHotkeyRefs({
    selectedMarketDealList,
    onEvent
  });

  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingInitSearchBond]);
  const searchWithBond = getSetting<boolean>(UserSettingFunction.UserSettingInitSearchBond) ?? false;

  const otherShortcutButtonMap = {
    [ActionValue.Internal]: internalRef,
    [ActionValue.External]: externalRef
  };

  const editQuoteRef = useRef<HTMLButtonElement>(null);

  const editDisabled = !accessCache.deal || selectedMarketDealList.length !== 1;

  const selectedNNDDeal = useMemo(
    () => selectedMarketDealList?.filter(deal => !deal.nothing_done),
    [selectedMarketDealList]
  );

  const getExtVisible = useMemo(() => {
    const status = selectedNNDDeal?.map(deal => deal.flag_internal);
    const counts = status?.filter(Boolean);
    // 选中的全是暗盘
    if (!counts?.length) return InternalEnum.External;
    // 选中的全是明盘
    if (counts.length === status?.length) return InternalEnum.Internal;
    // 选中的有明盘有暗盘
    return undefined;
  }, [selectedNNDDeal]);

  const handleTrd = () => {
    if (!beforeOpenDialogWindow()) return;
    trackPoint(DealTrace.SidebarTrd);
    const config = getMarketDealDialogConfig(productType, { defaultFocused: 'bond' });
    openDialog(config, { onSuccess: onEventSuccess, showOfflineMsg: false });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button
          tabIndex={-1}
          ref={quoteRef}
          type="secondary"
          className="!font-heavy"
          ghost
          disabled={!accessCache.quote}
          // 窗口关闭事件有可能发生在onSuccess和onCancel之前，导致Quote按钮还没有blur时，用户再次点击回车，又打开了报价窗口
          // 故使用e.preventDefault()来阻止按钮的默认回车事件
          onKeyDown={preventEnterDefault}
          onClick={() => {
            if (!beforeOpenDialogWindow()) return;

            let searchBond: FiccBondBasic | undefined;
            if (searchWithBond) searchBond = getSearchingBond(activeGroup?.groupId);

            trackPoint(QuoteTrigger.ENTRY_BUTTON);
            const { config, callback } = getSingleQuoteDialogConfig(productType, {
              activeTableKey,
              focusInput: searchWithBond && searchBond ? QuoteFocusInputType.BID_PRICE : QuoteFocusInputType.BOND,
              actionMode: QuoteActionMode.ADD,
              defaultValue: { bond_basic_info: searchBond },
              onSuccess: () => {
                quoteRef.current?.blur();
              },
              onCancel: () => {
                quoteRef.current?.blur();
              }
            });
            openDialog(config, { ...callback, showOfflineMsg: false });
          }}
        >
          Quote
        </Button>
        <Button
          tabIndex={-1}
          ref={batchQuoteRef}
          type="secondary"
          className="!font-heavy"
          ghost
          disabled={!accessCache.quote || !accessCache.colQuote}
          onKeyDown={preventEnterDefault}
          onClick={() => {
            openDialog(getCollaborativeQuoteDialogConfig(productType, panelId));
          }}
        >
          Quote+
        </Button>

        <Button
          tabIndex={-1}
          ref={tradeRef}
          type="green"
          className="col-span-2 !font-heavy"
          disabled={!accessCache.deal}
          onKeyDown={preventEnterDefault}
          onClick={handleTrd}
        >
          Trade
        </Button>
      </div>

      {/* 成交相关 */}
      <IconProvider value={iconConfig}>
        <div className="grid grid-cols-2 gap-x-3 py-2 px-3 bg-white/4 rounded-lg">
          <Button.Icon
            ref={editQuoteRef}
            text
            icon={<IconEdit />}
            className={iconBtnCls}
            disabled={editDisabled}
            tooltip={{ content: 'Edit' }}
            onKeyDown={preventEnterDefault}
            onClick={() => {
              trackPoint(DealTrace.SidebarEdit);
              onEvent(Action.EditDeal, undefined, () => {
                editQuoteRef.current?.blur();
              });
            }}
          />

          <Button.Icon
            ref={joinRef}
            text
            icon={<IconCopy />}
            className={iconBtnCls}
            disabled={editDisabled}
            tooltip={{ content: 'Join' }}
            onKeyDown={preventEnterDefault}
            onClick={() => {
              trackPoint(DealTrace.SidebarJoin);
              onEvent(Action.Join);
            }}
          />

          <Button.Icon
            icon={<IconUndo />}
            text
            className={iconBtnCls}
            disabled={!undoSnapshots?.length}
            tooltip={{ content: 'Undo' }}
            onClick={async () => {
              const min = undoSnapshots?.sort((a, b) => b.idx - a.idx)[0];
              if (!min) return;

              logUndo({ phase: LogFlowPhase.Enter, undo: min });
              await recoverUndoSnapshot(min.idx, productType);
              onEventSuccess?.();
              logUndo({ phase: LogFlowPhase.Submit, undo: min });
            }}
          />

          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            disabled={!undoSnapshots?.length}
            overlay={
              <UndoList
                productType={productType}
                undoSnapshots={undoSnapshots}
                selectUndoRecords={selectUndoRecords}
                setSelectUndoRecords={setSelectUndoRecords}
                recoverUndoSnapshot={recoverUndoSnapshot}
                onEventSuccess={onEventSuccess}
              />
            }
            onVisibleChange={() => {
              setSelectUndoRecords([]);
            }}
          >
            <Button.Icon
              text
              icon={<IconDown />}
              className={iconBtnCls}
              disabled={!undoSnapshots?.length}
              tooltip={{ content: 'Record' }}
            />
          </Dropdown>
        </div>
      </IconProvider>

      {/* 其余报价快捷键 */}
      <div className="flex flex-col gap-3 overflow-y-overlay">
        <div className="grid grid-cols-2 gap-x-3 py-2 px-3 bg-white/4 rounded-lg">
          <IconProvider value={iconConfig}>
            {OTHER_SHORTCUT_BUTTON_LIST.map(button => {
              let disabled = true;

              if (accessCache.deal && button.actionValue === ActionValue.Internal) {
                // 转暗盘
                disabled = !selectedNNDDeal.length || getExtVisible === InternalEnum.Internal;
              } else if (button.actionValue === ActionValue.External) {
                disabled = !selectedNNDDeal.length || getExtVisible === InternalEnum.External;
              }

              return (
                <Button.Icon
                  ref={otherShortcutButtonMap[button.actionValue]}
                  key={`other_shortcut_button_${button.title}`}
                  text
                  className={iconBtnCls}
                  tooltip={{ content: button.title }}
                  icon={button.icon}
                  disabled={disabled}
                  onClick={() => {
                    trackPoint(DealTrace.SidebarShortcut);
                    localStorage.setItem(shortcutLogType, button.title);
                    localStorage.setItem(shortcutLogClickTime, String(Date.now()));
                    onEvent(Action.Edit, button.actionValue);
                  }}
                />
              );
            })}
          </IconProvider>

          {UPDATE_PRICE_LIST.map(price => {
            let text = `${price}`;
            if (price > 0) text = `+${price}`;
            return (
              <Button.Icon
                key={`update_vol_shortcut_button_${price}`}
                text
                className={iconBtnCls}
                disabled
              >
                {text}
              </Button.Icon>
            );
          })}

          {UPDATE_VOL_LIST.map(vol => {
            let text = `${vol}`;
            if (vol > 0) text = `+${vol}`;
            return (
              <Button.Icon
                key={`update_price_shortcut_button_${vol}`}
                text
                className={iconBtnCls}
                disabled
              >
                {text}
              </Button.Icon>
            );
          })}
        </div>
      </div>
    </>
  );
};
