import { message } from '@fepkg/components/Message';
import { MarketDeal } from '@fepkg/services/types/common';
import { OperationType } from '@fepkg/services/types/enum';
import type { MarketDealMulUpdateByIds } from '@fepkg/services/types/market-deal/mul-update-by-ids';
import { useSetAtom } from 'jotai';
import moment from 'moment';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { shortcutLogKey } from '@/common/services/hooks/useBondQuoteQuery/useShortcutTimeConsumingLog';
import { mulUpdateMarketDealByIdsWithUndo } from '@/common/undo-services';
import { OperationType as UndoOperationType } from '@/common/undo-services/types';
import { copyMarketDealsByID } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import { useUndoSnapshots } from '@/pages/ProductPanel/atoms/undo';
import { joinMdlOpenAtom } from '@/pages/ProductPanel/components/DealTable/JoinModal';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { Action, ActionValue, DealShortcutSidebarProps } from './types';

export type UseShortcutEventParams = DealShortcutSidebarProps;
export type Value = ActionValue | string;

const operationTypeUpdate = OperationType.BondDealUpdateDealInfo;
const today = moment().startOf('day').valueOf();

export enum DealTrace {
  /** 侧边栏 Trade/TRD 按钮 */
  SidebarTrd = 'market-deal-trigger-sidebar-trd',
  /** 侧边栏 Join 按钮 */
  SidebarJoin = 'market-deal-trigger-sidebar-join',
  /** 侧边栏 Edit 按钮 */
  SidebarEdit = 'market-deal-trigger-sidebar-edit',
  /** 侧边栏剩余快捷操作 */
  SidebarShortcut = 'market-deal-trigger-sidebar-shortcut',
  /** 市场成交表格双击按钮 */
  TableDblClick = 'market-deal-trigger-table-dbl-click',
  /** 市场成交表格右键菜单 */
  TableCtxMenu = 'market-deal-trigger-table-menu',
  /** 最优报价悬浮框Trade/TRD 按钮 */
  DeepQuoteTrd = 'market-deal-trigger-deep-quote-trd',
  /** 单券详情 Trade/TRD 按钮 */
  SingleBondDetail = 'market-deal-trigger-single-bond-detail-trd'
}

export const useDealShortcutEvent = ({ selectedMarketDealList, onEventSuccess }: UseShortcutEventParams) => {
  const { productType } = useProductParams();
  const { accessCache } = useProductPanel();
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const undoSnapshots = useUndoSnapshots();

  const userId = miscStorage.userInfo?.user_id;

  const setJoinMdlOpen = useSetAtom(joinMdlOpenAtom);

  const useValidationCallback =
    <Params>(callback: (args?: Params) => void) =>
    (args?: Params) => {
      if (!selectedMarketDealList.length && !selectedMarketDealList?.length) {
        message.error('请至少选中一条要操作的数据');
        return undefined;
      }
      return callback?.(args);
    };

  const onUpdateMarketDeal = async (
    params: MarketDealMulUpdateByIds.Request,
    origin: MarketDeal[],
    type?: UndoOperationType,
    isUndo = true
  ) => {
    await mulUpdateMarketDealByIdsWithUndo(params, {
      isUndo,
      origin,
      type,
      productType
    });
    const modifiedMarketDeals = selectedMarketDealList.filter(q =>
      (params.market_deal_id_list ?? []).includes(q.deal_id)
    );

    copyMarketDealsByID(modifiedMarketDeals);
  };

  const actionEdit = useValidationCallback(async (value?: Value) => {
    const operation_info = { operation_type: operationTypeUpdate };
    const params: MarketDealMulUpdateByIds.Request = {
      market_deal_id_list: undefined,
      flag_internal: undefined,
      operation_info
    };
    let origins: MarketDeal[] = [];
    switch (value) {
      case ActionValue.Internal:
        params.flag_internal = true;
        origins = selectedMarketDealList?.filter(v => !v.flag_internal && !v.nothing_done) ?? [];
        params.market_deal_id_list = origins.map(v => v.deal_id);
        break;
      case ActionValue.External:
        params.flag_internal = false;
        origins = selectedMarketDealList?.filter(v => v.flag_internal && !v.nothing_done) ?? [];
        params.market_deal_id_list = origins.map(v => v.deal_id);
        break;
      default:
        break;
    }
    if (!params.market_deal_id_list?.length) return void message.error('选择的数据不能修改');
    return onUpdateMarketDeal(params, origins, undefined, value !== ActionValue.UpdateTime).finally(
      () => onEventSuccess?.()
    );
  });

  const actionJoin = useValidationCallback(() => {
    if (!accessCache.deal) return;

    setJoinMdlOpen(true);
  });

  const handleDealEdit = useValidationCallback(() => {
    if (!accessCache.deal) return;

    if (selectedMarketDealList.length > 1) {
      message.error('只能选择一条要操作的数据！');
    } else {
      if (!beforeOpenDialogWindow()) return;

      trackPoint(DealTrace.SidebarEdit);

      const config = getMarketDealDialogConfig(productType, {
        defaultValue: selectedMarketDealList[0],
        defaultBondReadOnly: true,
        defaultFocused: 'price'
      });
      openDialog(config, { showOfflineMsg: false, onSuccess: onEventSuccess });
    }
  });

  const onEvent = (action: Action, value?: Value, cb?: () => void) => {
    switch (action) {
      /** Join */
      case Action.Join:
        actionJoin();
        break;
      /** 批量编辑 */
      case Action.Edit:
        actionEdit(value);
        break;
      case Action.EditDeal:
        cb?.();
        handleDealEdit();
        break;
      default:
        break;
    }
    localStorage.setItem(shortcutLogKey, selectedMarketDealList[0].deal_id);
  };

  return {
    onEvent,
    undoSnapshots:
      undoSnapshots?.filter(v => v.userId === userId && v.productType === productType && v.timestamp >= today) ?? []
  };
};
