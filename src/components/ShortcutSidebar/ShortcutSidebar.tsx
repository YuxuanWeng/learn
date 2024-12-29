import { MouseEvent, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Dropdown } from 'antd';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { Button } from '@fepkg/components/Button';
import {
  IconAddCircle,
  IconCopy,
  IconDelete,
  IconDown,
  IconEdit,
  IconProvider,
  IconRefer,
  IconUndo,
  IconUnrefer
} from '@fepkg/icon-park-react';
import { FiccBondBasic, MarketDeal, QuoteLite } from '@fepkg/services/types/common';
import { LiquidationSpeedTag, UserSettingFunction } from '@fepkg/services/types/enum';
import { FloatingPortal } from '@floating-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import {
  shortcutLogClickTime,
  shortcutLogType
} from '@/common/services/hooks/useBondQuoteQuery/useShortcutTimeConsumingLog';
import {
  Settlement,
  useProductSettlementSettings
} from '@/common/services/hooks/useSettings/useProductSettlementSettings';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { trackPoint } from '@/common/utils/logger/point';
import { transform2MarketDeal } from '@/common/utils/market-deal';
import { logUndo, recoverUndoSnapshot } from '@/common/utils/undo';
import { Source } from '@/components/Quote/Dates';
import QuoteSettleDlg from '@/components/Quote/Settle';
import { QuoteTrigger } from '@/components/Quote/types';
import { useQuoteBatchFormSubmit } from '@/components/ShortcutSidebar/useQuoteBatchFormSubmit';
import { useProductParams } from '@/layouts/Home/hooks';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import { useGlobalSearchingBond } from '@/pages/ProductPanel/hooks/useGlobalSearchingBond';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { getCommentLabel, preventEnterDefault } from '@/pages/ProductPanel/utils';
import { QuoteBatchForm } from '@/pages/Quote/BatchForm';
import { getCollaborativeQuoteDialogConfig } from '@/pages/Quote/Collaborative/utils';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { LogFlowPhase } from '@/types/log';
import { GTButton } from './GTButton';
import { useShortcutSidebarProps } from './PropsProvider';
import { SettlementButton } from './SettlementButton';
import { UndoList } from './UndoList';
import {
  CAN_DELETE_SETTLEMENT_LENGTH_MIN,
  OTHER_SHORTCUT_BUTTON_LIST,
  QUOTE_BATCH_FORM_LOGGER_FLOW_NAME,
  QUOTE_BATCH_FORM_LOGGER_TRACE_FIELD,
  SETTLEMENT_LENGTH_MAX,
  UPDATE_PRICE_LIST,
  UPDATE_VOL_LIST
} from './constants';
import { Action, ActionValue, InternalEnum } from './types';
import { DealTrace } from './useDealShortcutEvent';
import { useHotkeyRefs } from './useHotkeyRefs';
import { Value, useShortcutEvent } from './useShortcutEvent';

const iconBtnCls = '!h-7';

export const ShortcutSidebar = () => {
  const { selectedSide, selectedBondList, selectedQuoteList, hasSelectedSTCQuote, onOptimisticUpdate, onEventSuccess } =
    useShortcutSidebarProps();
  const { productType, panelId } = useProductParams();
  const { activeTableKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();
  const { getSearchingBond } = useGlobalSearchingBond();

  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const { settlementSettings = [], updateSettlementSettings } = useProductSettlementSettings(productType);

  const [selectUndoRecords, setSelectUndoRecords] = useState<number[]>([]);
  const [currentSettlement, setCurrentSettlement] = useState<Settlement>();
  const [settlementVisible, setSettlementVisible] = useState(false);

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);

  const {
    accessCache,
    onEvent,
    quoteCount,
    displayValue,
    timeVisible,
    setTimeVisible,
    percent,
    setPercent,
    lastParams,
    interval,
    clear,
    clearDisplayValue,
    currentAction,
    setCurrentAction,
    openPriceWaitModal,
    openVolumeWaitModal,
    undoSnapshots
  } = useShortcutEvent({
    productType,
    activeTableKey,
    selectedSide,
    selectedBondList,
    selectedQuoteList,
    hasSelectedSTCQuote,
    onEventSuccess,
    onOptimisticUpdate
  });

  const {
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
  } = useHotkeyRefs({ selectedQuoteList, selectedBondList, selectedSide, hasSelectedSTCQuote, onEvent });

  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingInitSearchBond]);
  const searchWithBond = getSetting<boolean>(UserSettingFunction.UserSettingInitSearchBond) ?? false;

  const otherShortcutButtonMap = {
    [ActionValue.SingleStar]: starRef,
    [ActionValue.DoubleStar]: doubleStarRef,
    [ActionValue.Internal]: internalRef,
    [ActionValue.External]: externalRef,
    [ActionValue.Pack]: packageRef,
    [ActionValue.OCO]: ocoRef,
    [ActionValue.Val]: valuationQuoteRef,
    [ActionValue.Recommend]: recommendRef,
    [ActionValue.UpdateTime]: refreshRef,
    [ActionValue.AlmostDone]: almostDownRef
  };

  const settlementDateButtonRefs = [
    remark1Ref,
    remark2Ref,
    remark3Ref,
    remark4Ref,
    remark5Ref,
    remark6Ref,
    remark7Ref,
    remark8Ref
  ];

  const hasSelectedQuote = !!selectedQuoteList?.length;
  const showSettlementSetting = activeTableKey !== ProductPanelTableKey.Referred;
  const showGTButton =
    ![ProductPanelTableKey.Referred, ProductPanelTableKey.Deal].includes(activeTableKey) && hasSelectedQuote;

  const editQuoteRef = useRef<HTMLButtonElement>(null);

  const editDisabled = useMemo(() => {
    if (!accessCache.quote) return true;
    if (hasSelectedSTCQuote) return true;
    // 最优报价表格处
    if (activeTableKey === ProductPanelTableKey.Optimal) {
      if (selectedBondList.length === 0) return true;
      if (!selectedSide) return true;
      if (selectedBondList.length === 1) return false;
      // 如果有选中方向，但选中的多条债券的所有报价信息都为空时，禁用「新报价」、「编辑」功能
      if (selectedBondList.length > 1 && !hasSelectedQuote) return true;
      if (selectedBondList.length > 1 && hasSelectedQuote) return false;
      return true;
    }
    if (activeTableKey === ProductPanelTableKey.Deal) {
      if (selectedBondList.length === 1) return false;
      return true;
    }
    // 其他表格处，没有选择报价时则禁用
    return !hasSelectedQuote;
  }, [accessCache.quote, hasSelectedSTCQuote, activeTableKey, hasSelectedQuote, selectedBondList.length, selectedSide]);

  const showJoinBtn = activeTableKey !== ProductPanelTableKey.Referred;
  const showDeleteBtn = activeTableKey === ProductPanelTableKey.Referred;
  const showReferBtn = ![ProductPanelTableKey.Deal, ProductPanelTableKey.Referred].includes(activeTableKey);

  const updateQuote = (action: Action, value: Value, evt?: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    onEvent(action, value);
    setPosition([evt?.clientX || 0, evt?.clientY || 0]);
  };

  const getExtVisible = useMemo(() => {
    const status = selectedQuoteList?.map(quote => quote.flag_internal);
    const counts = status?.filter(Boolean);
    // 选中的全是暗盘
    if (!counts?.length) return InternalEnum.External;
    // 选中的全是明盘
    if (counts.length === status?.length) return InternalEnum.Internal;
    // 选中的有明盘有暗盘
    return undefined;
  }, [selectedQuoteList]);

  const settlementDisable = !accessCache.quote || !hasSelectedQuote || hasSelectedSTCQuote;

  const handleTrd = async () => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.deal) return;

    trackPoint(DealTrace.SidebarTrd);
    let defaultValue: Partial<MarketDeal> | undefined;
    let defaultQuote: QuoteLite | undefined;

    if (activeTableKey !== ProductPanelTableKey.Referred) {
      // 如果当前选中的债券为 1 条，报价为 1 条，需要带入默认债券信息与默认报价 Id
      if (selectedQuoteList.length === 1 && selectedBondList.length === 1) {
        defaultValue = await transform2MarketDeal(tradeDateRange, selectedBondList[0], selectedQuoteList[0]);
        [defaultQuote] = selectedQuoteList;
      }
    }

    const config = getMarketDealDialogConfig(productType, {
      defaultValue,
      defaultQuote,
      defaultFocused: defaultQuote?.quote_id ? 'price' : 'bond'
    });

    openDialog(config, { showOfflineMsg: false });
  };

  const getDisplayValue = () => {
    if (quoteCount) {
      return displayValue && Number(displayValue) > 0 ? `+${displayValue}` : displayValue;
    }
    return Number(displayValue) > 0 ? displayValue : 0;
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
              focusInput: searchBond ? QuoteFocusInputType.BID_PRICE : QuoteFocusInputType.BOND,
              actionMode: QuoteActionMode.ADD,
              defaultValue: { bond_basic_info: searchBond },
              onSuccess: () => {
                onEventSuccess?.();
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

        {showGTButton && (
          <GTButton
            tabIndex={-1}
            ref={gvnTknRef}
            disabled={!accessCache.deal}
            onClick={() => onEvent(Action.Deal)}
            onKeyDown={preventEnterDefault}
          />
        )}

        <Button
          tabIndex={-1}
          ref={tradeRef}
          type="green"
          className={cx('!font-heavy', !showGTButton && 'col-span-2')}
          disabled={!accessCache.deal}
          onKeyDown={preventEnterDefault}
          onClick={handleTrd}
        >
          Trade
        </Button>
      </div>

      {/* 报价相关 */}
      <IconProvider value={{ size: 20 }}>
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
              trackPoint(QuoteTrigger.SIDEBAR_BUTTON);
              onEvent(Action.EditQuote, undefined, editQuoteRef.current?.blur);
            }}
          />

          {showJoinBtn ? (
            <Button.Icon
              ref={joinRef}
              text
              icon={<IconCopy />}
              className={iconBtnCls}
              disabled={!accessCache.quote || selectedQuoteList?.length !== 1}
              tooltip={{ content: 'Join' }}
              onKeyDown={preventEnterDefault}
              onClick={() => {
                trackPoint(QuoteTrigger.SIDEBAR_BUTTON);
                onEvent(Action.Join);
              }}
            />
          ) : (
            // 样式占位用
            <div />
          )}

          {showDeleteBtn && (
            <Button.Icon
              icon={<IconDelete />}
              text
              className={iconBtnCls}
              disabled={
                !accessCache.quote ||
                !hasSelectedQuote ||
                hasSelectedSTCQuote ||
                [ProductPanelTableKey.Basic, ProductPanelTableKey.Optimal].includes(activeTableKey)
              }
              tooltip={{ content: 'Delete' }}
              onClick={() => onEvent(Action.Delete)}
            />
          )}

          {showReferBtn && (
            <Button.Icon
              ref={referRef}
              text
              icon={<IconRefer />}
              className={iconBtnCls}
              disabled={
                !accessCache.quote ||
                !hasSelectedQuote ||
                activeTableKey === ProductPanelTableKey.Referred ||
                hasSelectedSTCQuote
              }
              tooltip={{ content: 'Refer' }}
              onClick={() => {
                trackPoint(QuoteTrigger.SIDEBAR_SHORTCUT);
                onEvent(Action.Refer);
              }}
            />
          )}

          <Button.Icon
            ref={unreferRef}
            text
            icon={<IconUnrefer />}
            className={iconBtnCls}
            disabled={
              !accessCache.quote ||
              !hasSelectedQuote ||
              activeTableKey !== ProductPanelTableKey.Referred ||
              hasSelectedSTCQuote
            }
            tooltip={{ content: 'Unrefer' }}
            onClick={() => onEvent(Action.UnRefer)}
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

      <div className="flex flex-col gap-3 -mr-2 pr-2 overflow-y-overlay">
        {/* Settlement 相关 */}
        {![ProductPanelTableKey.Referred, ProductPanelTableKey.Deal].includes(activeTableKey) ? (
          <div className="flex flex-col gap-1 p-2 bg-white/4 rounded-lg">
            {settlementSettings?.map((settlement, index) => {
              return (
                <SettlementButton
                  key={settlement.key}
                  ref={settlementDateButtonRefs[index]}
                  label={getCommentLabel(settlement)}
                  disabled={settlementDisable}
                  showDelete={settlementSettings.length >= CAN_DELETE_SETTLEMENT_LENGTH_MIN}
                  onClick={() => {
                    trackPoint(QuoteTrigger.SIDEBAR_SHORTCUT);
                    onEvent(Action.MulUpsertSettlement, settlement);
                  }}
                  onEdit={() => {
                    setCurrentSettlement(settlement);
                    setSettlementVisible(true);
                  }}
                  onDelete={() => {
                    updateSettlementSettings({ settlement, isDelete: true, settlementSettings });
                  }}
                />
              );
            })}

            {(settlementSettings?.length ?? 0) < SETTLEMENT_LENGTH_MAX && showSettlementSetting && (
              <Button.Icon
                className="h-7 bg-gray-800 border-gray-800 hover:bg-gray-500 hover:border-gray-500 active:bg-gray-600 active:border-gray-600"
                icon={<IconAddCircle />}
                disabled={!accessCache.quote}
                onClick={() => {
                  setCurrentSettlement({
                    key: uuidv4(),
                    label: '',
                    liq_speed_list: [{ tag: LiquidationSpeedTag.Default, offset: 0 }]
                  });
                  setSettlementVisible(true);
                }}
              />
            )}
          </div>
        ) : null}

        {/* 其余快捷键 */}
        <div className="grid grid-cols-2 gap-x-3 py-2 px-3 bg-white/4 rounded-lg">
          <IconProvider value={{ size: 20 }}>
            {OTHER_SHORTCUT_BUTTON_LIST.map(button => {
              let disabled = !hasSelectedQuote;
              if (
                activeTableKey === ProductPanelTableKey.Deal &&
                ![ActionValue.Internal, ActionValue.External].includes(button.actionValue)
              ) {
                disabled = true;
              }
              if (button.actionValue === ActionValue.Internal) {
                // 转暗盘
                disabled = !hasSelectedQuote || getExtVisible === InternalEnum.Internal;
              } else if (button.actionValue === ActionValue.External) {
                disabled = !hasSelectedQuote || getExtVisible === InternalEnum.External;
              }
              if (activeTableKey === ProductPanelTableKey.Referred && button.actionValue === ActionValue.UpdateTime) {
                disabled = true;
              }

              if (!accessCache.quote) disabled = true;

              return (
                <Button.Icon
                  ref={otherShortcutButtonMap[button.actionValue]}
                  key={`other_shortcut_button_${button.title}`}
                  text
                  className={iconBtnCls}
                  tooltip={{ content: button.title }}
                  icon={button.icon}
                  disabled={disabled || hasSelectedSTCQuote}
                  onClick={() => {
                    trackPoint(QuoteTrigger.SIDEBAR_SHORTCUT);
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

            let disabled =
              !hasSelectedQuote || (currentAction === Action.UpdateVol && openVolumeWaitModal) || hasSelectedSTCQuote;

            if (!accessCache.quote) disabled = true;

            return (
              <Button.Icon
                key={`update_vol_shortcut_button_${price}`}
                text
                className={iconBtnCls}
                disabled={disabled}
                onClick={e => {
                  trackPoint(QuoteTrigger.SIDEBAR_SHORTCUT);
                  localStorage.setItem(shortcutLogType, text);
                  localStorage.setItem(shortcutLogClickTime, String(Date.now()));
                  updateQuote(Action.UpdatePrice, { price, isBatch: selectedQuoteList.length > 1 }, e);
                }}
              >
                {text}
              </Button.Icon>
            );
          })}

          {UPDATE_VOL_LIST.map(vol => {
            let text = `${vol}`;
            if (vol > 0) text = `+${vol}`;

            let disabled =
              !hasSelectedQuote || (currentAction === Action.UpdatePrice && openPriceWaitModal) || hasSelectedSTCQuote;

            if (!accessCache.quote) disabled = true;

            return (
              <Button.Icon
                key={`update_price_shortcut_button_${vol}`}
                text
                className={iconBtnCls}
                disabled={disabled}
                onClick={e => {
                  trackPoint(QuoteTrigger.SIDEBAR_SHORTCUT);
                  localStorage.setItem(shortcutLogType, text);
                  localStorage.setItem(shortcutLogClickTime, String(Date.now()));
                  updateQuote(Action.UpdateVol, { volume: vol, isBatch: selectedQuoteList.length > 1 }, e);
                }}
              >
                {text}
              </Button.Icon>
            );
          })}
        </div>
      </div>

      <FloatingPortal id="floating-container">
        <div
          className="time z-50 absolute flex flex-col justify-center pt-4 bg-gray-700 border border-solid border-gray-600 rounded-lg drop-shadow-dropdown"
          style={{
            display: timeVisible ? 'block' : 'none',
            top: position[1] - 110,
            right: 153,
            width: 144
          }}
          onMouseEnter={clear}
          onMouseLeave={e => {
            clear();
            const { target } = e;
            if (target) {
              let tmp = target as HTMLElement;
              if (!(target as HTMLElement).matches('.time')) {
                tmp = (target as HTMLElement).closest('.time') as HTMLElement;
              }
              if (tmp && tmp.style.display === 'none') return;
            }
            if (lastParams) interval(lastParams, selectedQuoteList);
          }}
        >
          <div className="text-center font-extrabold mt-1 text-md text-secondary-100">{getDisplayValue()}</div>
          {quoteCount && <div className="text-center text-gray-200 mt-2">{quoteCount}行数据可更改</div>}
          <div className="flex justify-center mt-4">
            <Button
              type="primary"
              onClick={e => {
                e.preventDefault();
                clearDisplayValue();
                clear();
                setTimeVisible(false);
                setCurrentAction(undefined);
                setPercent(100);
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="flex h-0.5 w-full rounded-bg overflow-hidden mt-6 mx-px bg-gradient-to-r from-white via-52% via-primary-100 to-blue-600">
            <div className="flex-1 h-full bg-transparent" />
            <div
              className="bg-gray-700"
              style={{ width: `${(100 - percent).toFixed(1)}%` }}
            />
          </div>
        </div>
      </FloatingPortal>

      {accessCache.quote && (
        <QuoteBatchForm
          useSubmit={useQuoteBatchFormSubmit}
          showFlags={false}
          showCpb
          loggerInfo={{
            traceField: QUOTE_BATCH_FORM_LOGGER_TRACE_FIELD,
            flowName: QUOTE_BATCH_FORM_LOGGER_FLOW_NAME
          }}
          //     onEventSuccess?.();
        />
      )}

      {accessCache.quote && currentSettlement && (
        <QuoteSettleDlg
          source={Source.Sidebar}
          visible={settlementVisible}
          productType={productType}
          uuid={currentSettlement?.key ?? uuidv4()}
          defaultLiqSpeedList={currentSettlement?.liq_speed_list}
          defaultComment={currentSettlement?.comment}
          defaultFlagValue={currentSettlement?.flagValue}
          defaultChecked={currentSettlement?.haveMethod}
          onSuccess={(value: Settlement) => {
            updateSettlementSettings({ settlement: value, settlementSettings });
          }}
          onCancel={() => {
            setSettlementVisible(false);
            setCurrentSettlement(undefined);
          }}
        />
      )}
    </>
  );
};
