import { ContextMenu, MenuItem, SubMenu } from '@fepkg/components/ContextMenu';
import { message } from '@fepkg/components/Message';
import { QuoteLite } from '@fepkg/services/types/common';
import { useAtom, useAtomValue } from 'jotai';
import { pick } from 'lodash-es';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { useProductSettlementSettings } from '@/common/services/hooks/useSettings/useProductSettlementSettings';
import { trackPoint } from '@/common/utils/logger/point';
import { QuoteTrigger, SubSingleQuoteDialog } from '@/components/Quote/types';
import { tableCtxMenuOpenAtom, tableCtxMenuPositionAtom } from '@/pages/ProductPanel/atoms/table';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { getCommentLabel } from '@/pages/ProductPanel/utils';
import { getQuoteLogDialogConfig } from '@/pages/Quote/QuoteLog/dialog';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { UPDATE_PRICE_LIST, UPDATE_VOL_LIST } from '../ShortcutSidebar/constants';
import { Action, ActionValue } from '../ShortcutSidebar/types';
import { useShortcutEvent } from '../ShortcutSidebar/useShortcutEvent';
import { TCellContextMenuProps } from './types';

export const TCellContextMenu = ({
  productType,
  activeTableKey,
  selectedSide,
  selectedBondList,
  selectedQuoteList,
  hasSelectedSTCQuote,
  onEventSuccess,
  keyPrefix,
  onOptimisticUpdate
}: TCellContextMenuProps & SubSingleQuoteDialog) => {
  const { settlementSettings } = useProductSettlementSettings(productType);

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  const { accessCache, onEvent } = useShortcutEvent({
    productType,
    activeTableKey,
    selectedBondList,
    selectedQuoteList,
    hasSelectedSTCQuote,
    selectedSide,
    onEventSuccess,
    onOptimisticUpdate,
    singleQuoteProductType: productType
  });

  const [open, setOpen] = useAtom(tableCtxMenuOpenAtom);
  const position = useAtomValue(tableCtxMenuPositionAtom);

  const noSelectedQuote = !accessCache.quote || !selectedQuoteList?.length;

  /** 当选中多条债券，但所有报价的信息都为空时，禁用「新报价」、「编辑」功能 */
  const editDisabled = !accessCache.quote || (selectedBondList?.length > 1 && noSelectedQuote);

  const useValidationCallback = (callback: () => void) => () => {
    if (!selectedBondList?.length && !selectedQuoteList?.length) {
      message.error('请至少选中一条要操作的数据');
    } else {
      callback?.();
    }
  };

  const handleCreateQuote = useValidationCallback(() => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    if (selectedQuoteList.length > 1) {
      message.error('只能选中一条要操作的数据');
      return;
    }

    let editQuote: QuoteLite | undefined;

    // 当选中了单条报价，但报价信息为空时，打开报价面板，并只填充产品数据
    if (selectedBondList?.length === 1 && !selectedQuoteList?.length) {
      const [bond_basic_info] = selectedBondList;
      editQuote = { bond_basic_info } as QuoteLite;
    } else if (selectedQuoteList?.length === 1) {
      [editQuote] = selectedQuoteList.map(q => pick(q, ['bond_basic_info', 'broker'])) as QuoteLite[];
    }

    if (!editQuote) return;

    trackPoint(QuoteTrigger.TABLE_CTXMENU);

    const { config, callback } = getSingleQuoteDialogConfig(productType, {
      defaultValue: editQuote,
      actionMode: QuoteActionMode.CTX_MENU_JOIN,
      focusInput: QuoteFocusInputType.BID_PRICE,
      onSuccess: () => {
        onEventSuccess?.();
      }
    });
    openDialog(config, { ...callback, showOfflineMsg: false });
  });

  const handleQuoteLog = useValidationCallback(() => {
    if (!beforeOpenDialogWindow()) return;

    if (selectedQuoteList.length > 1 || selectedBondList.length > 1) {
      message.error('只能选中一条要操作的数据');
      return;
    }

    const config = getQuoteLogDialogConfig(productType, {
      quoteId: activeTableKey === ProductPanelTableKey.Basic ? selectedQuoteList[0].quote_id : undefined,
      keyMarket:
        activeTableKey === ProductPanelTableKey.Optimal || activeTableKey === ProductPanelTableKey.Bond
          ? selectedBondList[0].key_market
          : undefined
    });
    openDialog(config, { showOfflineMsg: false });
  });

  return (
    <ContextMenu
      open={open}
      position={position}
      onOpenChange={setOpen}
      className="!w-[160px] flex flex-col gap-0.5 !p-1"
    >
      <MenuItem
        disabled={editDisabled}
        onClick={handleCreateQuote}
      >
        新报价
      </MenuItem>

      {!hasSelectedSTCQuote && (
        <>
          <MenuItem
            disabled={editDisabled}
            onClick={() => {
              trackPoint(QuoteTrigger.TABLE_CTXMENU);
              onEvent(Action.EditQuote);
            }}
          >
            编辑
          </MenuItem>

          <MenuItem
            disabled={noSelectedQuote}
            onClick={() => {
              trackPoint(QuoteTrigger.TABLE_CTXMENU);
              onEvent(Action.Join);
            }}
          >
            join
          </MenuItem>

          <MenuItem
            disabled={noSelectedQuote}
            onClick={() => {
              trackPoint(QuoteTrigger.TABLE_CTXMENU);
              onEvent(Action.Refer);
            }}
          >
            refer
          </MenuItem>

          <MenuItem
            disabled={noSelectedQuote}
            onClick={() => {
              trackPoint(QuoteTrigger.TABLE_CTXMENU);
              onEvent(Action.Edit, ActionValue.External);
            }}
          >
            内部转外部报价
          </MenuItem>

          <MenuItem
            disabled={noSelectedQuote}
            onClick={() => {
              trackPoint(QuoteTrigger.TABLE_CTXMENU);
              onEvent(Action.Edit, ActionValue.Internal);
            }}
          >
            外部转内部报价
          </MenuItem>

          <SubMenu
            label="修改价格"
            disabled={noSelectedQuote}
          >
            {UPDATE_PRICE_LIST.map(p => (
              <MenuItem
                key={String(p)}
                disabled={noSelectedQuote}
                onClick={() => {
                  trackPoint(QuoteTrigger.TABLE_CTXMENU);
                  onEvent(Action.UpdatePrice, { price: p, isBatch: true });
                }}
              >
                {p >= 0 ? `+${p}` : p}
              </MenuItem>
            ))}
          </SubMenu>

          <SubMenu
            label="修改数量"
            disabled={noSelectedQuote}
          >
            {UPDATE_VOL_LIST.map(v => (
              <MenuItem
                key={String(v)}
                disabled={noSelectedQuote}
                onClick={() => {
                  trackPoint(QuoteTrigger.TABLE_CTXMENU);
                  onEvent(Action.UpdateVol, { volume: v, isBatch: true });
                }}
              >
                {v >= 0 ? `+${v}` : v}
              </MenuItem>
            ))}
          </SubMenu>

          <SubMenu
            label="修改交割备注"
            disabled={noSelectedQuote}
          >
            {settlementSettings?.map(settlement => {
              return (
                <MenuItem
                  key={`${keyPrefix || ''}${settlement.key}`}
                  disabled={noSelectedQuote}
                  onClick={() => {
                    trackPoint(QuoteTrigger.TABLE_CTXMENU);
                    onEvent(Action.MulUpsertSettlement, settlement);
                  }}
                >
                  {getCommentLabel(settlement)}
                </MenuItem>
              );
            })}
          </SubMenu>

          {(
            [
              ['OCO', Action.Edit, ActionValue.OCO],
              ['打包', Action.Edit, ActionValue.Pack],
              ['换方向', Action.Edit, ActionValue.ExchangeSide],
              ['更新报价时间', Action.Edit, ActionValue.UpdateTime],
              ['标记意向价', Action.Edit, ActionValue.BID_OFR],
              ['标记可议价(*)', Action.Edit, ActionValue.SingleStar],
              ['标记可议价(**)', Action.Edit, ActionValue.DoubleStar]
            ] as [string, Action, ActionValue?][]
          ).map(([label, act, avlu]) => (
            <MenuItem
              key={label}
              disabled={noSelectedQuote}
              onClick={() => {
                trackPoint(QuoteTrigger.TABLE_CTXMENU);
                onEvent(act, avlu);
              }}
            >
              {label}
            </MenuItem>
          ))}
        </>
      )}

      <MenuItem
        disabled={!accessCache.log}
        onClick={handleQuoteLog}
      >
        报价日志
      </MenuItem>

      {!hasSelectedSTCQuote && (
        <MenuItem
          disabled={noSelectedQuote}
          onClick={() => {
            trackPoint(QuoteTrigger.TABLE_CTXMENU);
            onEvent(Action.Edit, ActionValue.AlmostDone);
          }}
        >
          Almost Done
        </MenuItem>
      )}
    </ContextMenu>
  );
};
