import { useMemo, useRef, useState } from 'react';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { message } from '@fepkg/components/Message';
import type { BondQuoteMulUpdate } from '@fepkg/services/types/bond-quote/mul-update';
import type { LiquidationSpeed, QuoteLite, QuoteUpdate } from '@fepkg/services/types/common';
import {
  BondQuoteType,
  LiquidationSpeedTag,
  OperationType,
  ProductType,
  RefType,
  Side,
  UserSettingFunction
} from '@fepkg/services/types/enum';
import type { MarketDealMulCreate } from '@fepkg/services/types/market-deal/mul-create';
import { useMemoizedFn } from 'ahooks';
import { useSetAtom } from 'jotai';
import { debounce, isNumber, isUndefined } from 'lodash-es';
import moment from 'moment';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { useAccess } from '@/common/providers/AccessProvider';
import { mulDeleteBondQuote } from '@/common/services/api/bond-quote/mul-delete';
import { OptimisticUpdateAction } from '@/common/services/hooks/useBondQuoteQuery';
import { shortcutLogKey } from '@/common/services/hooks/useBondQuoteQuery/useShortcutTimeConsumingLog';
import { Settlement } from '@/common/services/hooks/useSettings/useProductSettlementSettings';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { DateShortcutsEnum } from '@/common/types/liq-speed';
import {
  mulCreateMarketDealWithUndo,
  mulRefBondQuoteWithUndo,
  mulUpdateBondQuoteWithUndo
} from '@/common/undo-services';
import { OperationType as UndoOperationType } from '@/common/undo-services/types';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { copyQuotesByID } from '@/common/utils/copy';
import {
  filterLiquidationSpeedList,
  getDefaultTagsByProduct,
  justifyTradedDateLaterThanDeListing,
  liqSpeedListAddMoments
} from '@/common/utils/liq-speed';
import { transform2MarketDealCreate } from '@/common/utils/market-deal';
import { getEstimation, isPingJiaFan } from '@/common/utils/quote-price';
import { SubSingleQuoteDialog, YieldEnum } from '@/components/Quote/types';
import { CommentInputFlagValue } from '@/components/business/CommentInput';
import { miscStorage } from '@/localdb/miscStorage';
import { useUndoSnapshots } from '@/pages/ProductPanel/atoms/undo';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { getUnreferParamsByQuoteLite, getUpdateCommentFlags, isArrayValueEqual } from '@/pages/ProductPanel/utils';
import { quoteBatchFormOpenAtom } from '@/pages/Quote/BatchForm/atoms';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { MulCreateMarketDealErrorEnum } from './constants';
import { Action, ActionValue, ShortcutSidebarProps, UpdatePrice, UpdateVolume } from './types';
import { quoteBatchFormSelectedListAtom } from './useQuoteBatchFormSubmit';

export type Value = ActionValue | DateShortcutsEnum | number | Settlement | string | UpdatePrice | UpdateVolume;

export type UseShortcutEventParams = ShortcutSidebarProps & {
  /** 产品类型 */
  productType: ProductType;
};

export const MAX_VOLUME = 999000;

const userSettingList = [
  UserSettingFunction.UserSettingQuoteShortcutWaitTime,
  UserSettingFunction.UserSettingAmountShortcutWaitTime,
  UserSettingFunction.UserSettingValuationDecimalDigit
];

const getYieldByBond = (side: Side, value?: number, decimalLimit?: number) => {
  if (!isNumber(value)) return undefined;
  const res = getEstimation(side, value, decimalLimit);
  return Number(res || 0);
};

export const useShortcutEvent = ({
  productType,
  activeTableKey,
  selectedSide,
  selectedBondList,
  selectedQuoteList,
  hasSelectedSTCQuote,
  onEventSuccess,
  onOptimisticUpdate,
  singleQuoteProductType
}: UseShortcutEventParams & SubSingleQuoteDialog) => {
  const { access } = useAccess();
  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);
  const undoSnapshots = useUndoSnapshots();
  const { openDialog } = useDialogWindow();

  const timeInterval = useRef<NodeJS.Timeout>();
  const [timeVisible, setTimeVisible] = useState(false);
  const [percent, setPercent] = useState(100);
  const [lastParams, setLastParams] = useState<BondQuoteMulUpdate.Request>();

  /** 要修改的报价条数 */
  const [quoteCount, setQuoteCount] = useState<number>();

  /** 倒计时弹框中显示的数据 */
  const [displayValue, setDisplayValue] = useState<string>();

  /** 累加的报价价格 */
  const [quotePrice, setQuotePrice] = useState<number>();

  /** 累加的报价量 */
  const [quoteVolume, setQuoteVolume] = useState<number>();

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();

  // bp,vol 更改时，缓存乐观更新数据
  const optimisticUpdateCache = useRef<{ list?: QuoteUpdate[]; side?: Side }>();
  const { getSetting } = useUserSetting(userSettingList);

  const unitSto = getSetting<number>(UserSettingFunction.UserSettingValuationDecimalDigit) ?? 4;
  const openPriceWaitModal = getSetting<boolean>(UserSettingFunction.UserSettingQuoteShortcutWaitTime) ?? false;
  const openVolumeWaitModal = getSetting<boolean>(UserSettingFunction.UserSettingAmountShortcutWaitTime) ?? false;
  const [currentAction, setCurrentAction] = useState<Action>();

  const clearDisplayValue = () => {
    setDisplayValue(void 0);
    setQuoteVolume(void 0);
    setQuotePrice(void 0);
  };

  // TODO 后期看怎么重构这个，感觉可以抽个 context
  const accessCache = {
    quote: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktQuote)),
    colQuote: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.CollaborationMenu)),
    deal: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktDeal)),
    detail: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktBond)),
    log: access.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktLog))
  };

  const operationTypeUpdate =
    activeTableKey === ProductPanelTableKey.Referred
      ? OperationType.BondQuoteUpdateReferredQuote
      : OperationType.BondQuoteUpdateInfo;

  const selectedQuoteIdList = useMemo(
    () => selectedQuoteList.map(item => item.quote_id).filter(Boolean),
    [selectedQuoteList]
  );

  /** 批量修改 */
  const setQuoteBatchFormOpen = useSetAtom(quoteBatchFormOpenAtom);
  const setQuoteBatchFormSelectedList = useSetAtom(quoteBatchFormSelectedListAtom);

  const useValidationCallback =
    <Params>(callback: (args?: Params) => void) =>
    (args?: Params) => {
      if (!selectedBondList.length && !selectedQuoteList?.length) {
        message.error('请至少选中一条要操作的数据');
        return undefined;
      }
      return callback?.(args);
    };

  const updateQuote = useMemoizedFn(
    async (params: BondQuoteMulUpdate.Request, origin: QuoteLite[], type?: UndoOperationType, isUndo = true) => {
      await mulUpdateBondQuoteWithUndo(params, {
        isUndo,
        origin,
        type,
        productType: singleQuoteProductType || productType
      });
      const modifiedQuotes = selectedQuoteList.filter(q =>
        (params.quote_item_list ?? []).some(qu => qu.quote_id === q.quote_id)
      );

      copyQuotesByID(productType, undefined, modifiedQuotes);
    }
  );

  const userId = miscStorage.userInfo?.user_id;
  const today = moment().startOf('day').valueOf();

  const clear = () => {
    clearInterval(timeInterval.current);
    timeInterval.current = undefined;
  };

  const interval = (params: BondQuoteMulUpdate.Request, origin: QuoteLite[]) => {
    timeInterval.current = setInterval(() => {
      setPercent(pre => {
        if (pre > 0) return pre - 4;
        (async () => {
          onOptimisticUpdate?.({
            action: OptimisticUpdateAction.Modify,
            targets: optimisticUpdateCache.current?.list,
            selectedSide: optimisticUpdateCache.current?.side
          });
          await updateQuote(params, origin, undefined, activeTableKey !== ProductPanelTableKey.Referred).finally(
            () => onEventSuccess?.()
          );
          setQuotePrice(undefined);
          setQuoteVolume(undefined);
        })();
        setTimeVisible(false);
        setCurrentAction(undefined);
        clear();
        return 100;
      });
    }, 40);
  };

  const debounceUpdate = useMemo(
    () =>
      debounce(async (params: BondQuoteMulUpdate.Request, origin: QuoteLite[]) => {
        try {
          onOptimisticUpdate?.({
            action: OptimisticUpdateAction.Modify,
            targets: optimisticUpdateCache.current?.list,
            selectedSide: optimisticUpdateCache.current?.side
          });
          setLastParams(params);
          await updateQuote(params, origin, undefined, activeTableKey !== ProductPanelTableKey.Referred).finally(
            () => onEventSuccess?.()
          );
        } finally {
          setQuotePrice(undefined);
          setQuoteVolume(undefined);
        }
      }, 256),
    [activeTableKey]
  );

  const update = async (
    shouldShowModal: boolean,
    value: number,
    params: BondQuoteMulUpdate.Request,
    type: 'price' | 'volume',
    origin: QuoteLite[]
  ) => {
    if (!selectedQuoteList?.length) return;
    if (shouldShowModal) {
      if (selectedQuoteList.length === 1) {
        // 选中单条报价
        let v: string;

        const [quote] = selectedQuoteList;

        if (type === 'price') v = (value / 100 + Math.max(quote.quote_price || 0, 0)).toFixed(4);
        else v = (value + Math.max(quote.volume || 0, 0)).toString();

        setDisplayValue(v);
      }
      if (selectedQuoteList.length > 1) {
        // 选中多条报价
        if (type === 'price') setDisplayValue((value / 100).toFixed(4));
        else setDisplayValue(value.toString());
      }
      setTimeVisible(true);
      // 如果之前存在未走完的定时器，则清除定时器后立即调用接口
      if (timeInterval.current) {
        clear();
        setPercent(100);
      }
      // 记录本次请求的参数
      setLastParams(params);
      interval(params, origin);
    } else {
      debounceUpdate(params, origin);
    }
  };

  const actionDelete = useValidationCallback(async () => {
    onOptimisticUpdate?.({ action: OptimisticUpdateAction.Delete, targets: selectedQuoteIdList, selectedSide });
    await mulDeleteBondQuote({ quote_id_list: selectedQuoteIdList }).finally(() => onEventSuccess?.());
  });

  const actionRefer = useValidationCallback(async () => {
    onOptimisticUpdate?.({ action: OptimisticUpdateAction.Delete, targets: selectedQuoteIdList, selectedSide });
    await mulRefBondQuoteWithUndo(
      {
        stc_force: false,
        quote_id_list: selectedQuoteIdList,
        refer_type: RefType.Manual,
        operation_info: { operation_type: OperationType.BondQuoteRefer }
      },
      { origin: selectedQuoteList, productType: singleQuoteProductType || productType }
    );

    copyQuotesByID(productType, undefined, selectedQuoteList, false).finally(() => onEventSuccess?.());
  });

  const actionUnrefer = useValidationCallback(async () => {
    // 根据选中的报价的结算方式来判断是否可以回到基本报价区及原报价方式是否保留
    const params = await getUnreferParamsByQuoteLite(selectedQuoteList, productType);
    if (!params.quote_item_list?.length) return;
    onOptimisticUpdate?.({
      action: OptimisticUpdateAction.Delete,
      targets: params.quote_item_list?.map(item => item.quote_id),
      selectedSide
    });
    await updateQuote(params, selectedQuoteList, UndoOperationType.Unref).finally(() => onEventSuccess?.());
  });

  const actionJoin = useValidationCallback(() => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    if (selectedQuoteList.length > 1) {
      message.error('只能选中一条要操作的数据');
      return;
    }
    const [quote] = selectedQuoteList;

    const { config, callback } = getSingleQuoteDialogConfig(singleQuoteProductType || productType, {
      defaultValue: quote,
      actionMode: QuoteActionMode.JOIN,
      focusInput: quote.side === Side.SideBid ? QuoteFocusInputType.BID_PRICE : QuoteFocusInputType.OFR_PRICE,
      onSuccess: () => {
        onEventSuccess?.();
      }
    });
    openDialog(config, { ...callback, showOfflineMsg: false });
  });

  /** 不支持批量修改：同券同方向同明暗不同交易员 */
  const actionEditQuote = useMemoizedFn((cb?: () => void) => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    // key是同券同方向同明暗的map
    const set = new Set<string>();
    for (const item of selectedQuoteList) {
      set.add(`${item.bond_id}&${item.side}&${item.flag_internal}`);
    }

    let editQuote: QuoteLite | undefined;
    let focusInput: QuoteFocusInputType | undefined;

    // 当选中了单条报价，但报价信息为空时，打开报价面板，并只填充产品数据
    if (selectedBondList?.length === 1 && !selectedQuoteList?.length) {
      const [bond_basic_info] = selectedBondList;
      editQuote = { bond_basic_info } as QuoteLite;
    } else if (selectedQuoteList?.length === 1) {
      [editQuote] = selectedQuoteList;
    }

    if (editQuote) {
      if (editQuote?.side === Side.SideBid || selectedSide === Side.SideBid) focusInput = QuoteFocusInputType.BID_PRICE;
      if (editQuote?.side === Side.SideOfr || selectedSide === Side.SideOfr) focusInput = QuoteFocusInputType.OFR_PRICE;

      let actionMode = QuoteActionMode.EDIT;
      if (!editQuote.quote_id) actionMode = QuoteActionMode.JOIN;
      if (activeTableKey === ProductPanelTableKey.Referred) actionMode = QuoteActionMode.EDIT_UNREFER;

      const { config, callback } = getSingleQuoteDialogConfig(singleQuoteProductType || productType, {
        defaultValue: editQuote,
        activeTableKey,
        disabled: hasSelectedSTCQuote,
        focusInput,
        actionMode,
        onSuccess: () => {
          onEventSuccess?.();
          cb?.();
        },
        onCancel: () => {
          cb?.();
        }
      });
      openDialog(config, { ...callback, showOfflineMsg: false });
      return;
    }

    setQuoteBatchFormOpen(true);
    setQuoteBatchFormSelectedList(selectedQuoteList);
  });

  const actionEdit = useValidationCallback(async (value?: Value) => {
    const operation_info = { operation_type: operationTypeUpdate };
    const params: BondQuoteMulUpdate.Request = {
      quote_item_list: selectedQuoteList?.map(v => ({
        quote_id: v.quote_id,
        side: v.side,
        quote_type: v.quote_type,
        return_point: v.return_point,
        yield: v.yield,
        clean_price: v.clean_price,
        almost_done: v.almost_done,

        flag_star: v.flag_star,
        flag_package: v.flag_package,
        flag_oco: v.flag_oco,
        is_exercise: v.is_exercise,
        flag_rebate: v.flag_rebate,
        flag_recommend: v.flag_recommend,
        flag_internal: v.flag_internal,
        flag_urgent: v.flag_urgent
      })),
      operation_info
    };
    switch (value) {
      // 意向价
      case ActionValue.BID_OFR:
        params.quote_item_list = params.quote_item_list?.map(v => ({
          quote_id: v.quote_id,
          yield: SERVER_NIL,
          clean_price: SERVER_NIL,
          full_price: SERVER_NIL,
          return_point: SERVER_NIL,
          spread: SERVER_NIL,
          flag_intention: true,
          flag_rebate: false
        }));
        break;
      case ActionValue.UpdateTime:
        params.quote_item_list = params.quote_item_list?.map(v => ({ quote_id: v.quote_id }));
        break;
      // 单星
      case ActionValue.SingleStar: {
        const first = params.quote_item_list?.at(0)?.flag_star;
        const allSame = params.quote_item_list?.every(q => (first === 0 || first === 1) && q.flag_star === first);
        let flag_star = 1;
        if (allSame) flag_star = first ? 0 : 1;

        params.quote_item_list = params.quote_item_list?.map(v => ({ quote_id: v.quote_id, flag_star }));
        break;
      }
      // 双星
      case ActionValue.DoubleStar: {
        const first = params.quote_item_list?.at(0)?.flag_star;
        const allSame = params.quote_item_list?.every(q => (first === 0 || first === 2) && q.flag_star === first);
        let flag_star = 2;
        if (allSame) flag_star = first ? 0 : 2;

        params.quote_item_list = params.quote_item_list?.map(v => ({ quote_id: v.quote_id, flag_star }));
        break;
      }
      // 打包
      case ActionValue.Pack: {
        const first = params.quote_item_list?.at(0)?.flag_package;
        const allSame = params.quote_item_list?.every(q => q.flag_package === first);
        const flag_oco = false;
        let flag_package = true;
        if (allSame) flag_package = !first;

        params.quote_item_list = params.quote_item_list?.map(v => ({ quote_id: v.quote_id, flag_oco, flag_package }));
        break;
      }
      // OCO
      case ActionValue.OCO: {
        const first = params.quote_item_list?.at(0)?.flag_oco;
        const allSame = params.quote_item_list?.every(q => q.flag_oco === first);
        let flag_oco = true;
        const flag_package = false;
        if (allSame) flag_oco = !first;

        params.quote_item_list = params.quote_item_list?.map(v => ({ quote_id: v.quote_id, flag_oco, flag_package }));
        break;
      }
      // 紧急
      case ActionValue.Urgent: {
        const first = params.quote_item_list?.at(0)?.flag_urgent;
        const allSame = params.quote_item_list?.every(q => q.flag_urgent === first);
        let flag_urgent = true;
        if (allSame) flag_urgent = !first;

        params.quote_item_list = params.quote_item_list?.map(v => ({ quote_id: v.quote_id, flag_urgent }));
        break;
      }
      // 转暗盘
      case ActionValue.Internal:
        params.quote_item_list = params.quote_item_list
          ?.filter(v => !v.flag_internal)
          .map(v => ({
            quote_id: v.quote_id,
            flag_internal: true,
            // 明盘转暗盘自动加单星
            flag_star: 1
          }));
        break;
      // 转明盘
      case ActionValue.External:
        params.quote_item_list = params.quote_item_list
          ?.filter(v => !!v.flag_internal)
          .map(v => ({
            quote_id: v.quote_id,
            flag_internal: false
          }));
        break;
      // 债
      case ActionValue.Val:
        // 根据用户设置的小数位，判断为意向价时更新yield的值

        if (params.quote_item_list?.length === 1) {
          const quote = selectedQuoteList[0];
          const val_yield = hasOption(quote?.bond_basic_info)
            ? quote?.bond_basic_info?.[YieldEnum.ExeZhai]
            : quote?.bond_basic_info?.[YieldEnum.MatZhai];
          if (!val_yield || val_yield === SERVER_NIL) {
            message.error('选择的报价不能修改');
            break;
          }
        }

        params.quote_item_list = params.quote_item_list
          ?.map(v => {
            const quote = selectedQuoteList?.find(o => o.quote_id === v.quote_id);
            if (!quote) return { quote_id: v.quote_id };

            const getYield = () => {
              const val_yield = hasOption(quote?.bond_basic_info)
                ? quote?.bond_basic_info?.[YieldEnum.ExeZhai]
                : quote?.bond_basic_info?.[YieldEnum.MatZhai];
              const side = quote?.side;
              if (!val_yield || val_yield === SERVER_NIL) return undefined;
              return getYieldByBond(side, val_yield, unitSto);
            };

            const val_yield = getYield();
            if (!val_yield) return { quote_id: '-1' };
            return {
              quote_id: v.quote_id,
              quote_type: BondQuoteType.Yield,

              /** 计算器参数 */
              flag_rebate: v.flag_rebate,
              return_point: v.return_point,
              is_exercise: v.is_exercise,

              yield: val_yield,
              flag_intention: !(val_yield && val_yield > 0)
            };
          })
          .filter(v => v.quote_id !== '-1');
        break;
      // 荐
      case ActionValue.Recommend:
        params.quote_item_list = params.quote_item_list?.map(v => ({
          quote_id: v.quote_id,
          flag_recommend: !v.flag_recommend
        }));
        break;
      // AlmostDone
      case ActionValue.AlmostDone:
        params.quote_item_list = params.quote_item_list?.map(v => ({
          quote_id: v.quote_id,
          almost_done: !v.almost_done
        }));
        break;

      // 换边
      case ActionValue.ExchangeSide: {
        params.quote_item_list = params.quote_item_list?.map(v => {
          if (v.side === Side.SideBid) return { quote_id: v.quote_id, side: Side.SideOfr };
          return { quote_id: v.quote_id, side: Side.SideBid };
        });
        break;
      }
      default:
        break;
    }
    if (!params.quote_item_list?.length) return void message.error('选择的报价不能修改');

    onOptimisticUpdate?.({ action: OptimisticUpdateAction.Modify, targets: params.quote_item_list, selectedSide });
    return updateQuote(
      params,
      selectedQuoteList,
      undefined,
      value !== ActionValue.UpdateTime && activeTableKey !== ProductPanelTableKey.Referred
    ).finally(() => onEventSuccess?.());
  });

  /** 过滤可以进行修改价格的报价 */
  const intentionReturnFilter = (value: number) => {
    // 过滤掉不含平价返和意向价的数据
    let list = selectedQuoteList.filter(q => !q.flag_intention && !isPingJiaFan(q));
    if (value < 0) {
      // 减价的话 过滤掉返点和无价的情况
      list = list.filter(item => {
        return item.return_point < 0 || (item.quote_price ?? 0) > 0;
      });
    }
    return list;
  };

  /** 修改报价价格 */
  const actionUpdatePrice = useValidationCallback<UpdatePrice>(async args => {
    const { price: value } = args ?? {};
    if (isUndefined(value)) return;
    const filterSelectedQuoteList = intentionReturnFilter(value);
    if (filterSelectedQuoteList.length === 0) {
      message.error('选择的报价不能修改');
      return;
    }

    const newVal = value + (quotePrice || 0);
    setQuotePrice(newVal);

    // 更新yield的值
    const params: BondQuoteMulUpdate.Request = {
      quote_item_list: filterSelectedQuoteList.map(v => {
        const d = Math.max(v.quote_price || 0, 0) + newVal / 100;
        return {
          quote_id: v.quote_id,
          quote_type: v.quote_type,
          quote_price: d <= 0 ? SERVER_NIL : Number(d.toFixed(4) || 0),

          /** 计算器参数 */
          flag_rebate: v.flag_rebate,
          return_point: v.return_point,
          is_exercise: v.is_exercise,

          flag_intention: (() => {
            if (d <= 0 && !v.flag_rebate) {
              return true;
            }
            return v.flag_intention;
          })()
        };
      }),
      operation_info: { operation_type: operationTypeUpdate }
    };

    const quotesLength = params.quote_item_list?.length;
    if (!quotesLength) {
      message.error('选择的报价不能修改');
      return;
    }

    optimisticUpdateCache.current = { list: params.quote_item_list, side: selectedSide };

    if (openPriceWaitModal) setCurrentAction(Action.UpdatePrice);

    let newCount: number | undefined;
    if (selectedQuoteList?.length && selectedQuoteList?.length > 1) newCount = quotesLength;
    else newCount = quotesLength > 1 ? quotesLength : undefined;
    setQuoteCount(newCount);
    await update(openPriceWaitModal, newVal, params, 'price', selectedQuoteList);
  });

  /** 修改报价量 */
  const actionUpdateVol = useValidationCallback<UpdateVolume>(async args => {
    const { volume: value, isBatch = false } = args ?? {};

    if (isUndefined(value)) return;

    if (!isBatch && value <= 0 && (!selectedQuoteList?.[0].volume || selectedQuoteList?.[0].volume <= 0)) {
      message.error('选择的报价不能修改');
      return;
    }

    const newVal = value + (quoteVolume || 0);
    setQuoteVolume(newVal);

    /** 减量时过滤掉原始报价无量的报价 */
    const filterSelectedQuoteList = selectedQuoteList?.filter(v =>
      newVal && newVal > 0 ? true : v.volume && v.volume > 0
    );

    /** 过滤掉总量超过999kw报价 */
    const filterNoMaxVolumeList = filterSelectedQuoteList.filter(v => {
      const vol = Math.max(v.volume || 0, 0) + newVal;
      return vol <= MAX_VOLUME;
    });

    if (filterSelectedQuoteList.length != 0 && filterNoMaxVolumeList.length === 0) {
      message.error('报价量已达上限，不可修改！');
      setQuoteVolume(void 0);
      return;
    }

    const params: BondQuoteMulUpdate.Request = {
      quote_item_list: filterNoMaxVolumeList.map(v => {
        const vol = Math.max(v.volume || 0, 0) + newVal;
        return {
          quote_id: v.quote_id,
          volume: vol <= 0 ? SERVER_NIL : vol
        };
      }),
      operation_info: { operation_type: operationTypeUpdate }
    };

    const quotesLength = params.quote_item_list?.length || 0;
    if (!quotesLength && value <= 0) {
      message.error('选择的报价不能修改！');
      setQuoteVolume(void 0);
      return;
    }

    optimisticUpdateCache.current = { list: params.quote_item_list, side: selectedSide };

    if (openVolumeWaitModal) setCurrentAction(Action.UpdateVol);

    let count: number | undefined;

    if (selectedQuoteList?.length && selectedQuoteList?.length > 1) count = quotesLength;
    else count = quotesLength > 1 ? quotesLength : undefined;

    setQuoteCount(count);
    await update(openVolumeWaitModal, newVal, params, 'volume', selectedQuoteList);
  });

  const handleMulUpsertSettlement = useValidationCallback(async (settlement?: Settlement) => {
    if (!settlement) return;

    const { liqSpeeds, hasDefault } = getDefaultTagsByProduct(settlement.liq_speed_list || [], productType);

    const liqSpeedWithMoments = await liqSpeedListAddMoments(liqSpeeds);
    const liqSpeedList = filterLiquidationSpeedList(liqSpeedWithMoments);
    const invalidIds: number[] = []; // 晚于下市日的报价index
    const params: BondQuoteMulUpdate.Request = {
      // 获取各个标签对应的交易日和交割日
      quote_item_list: selectedQuoteList?.map((v, i) => {
        // 是否存在交易日晚于下市日的标签
        const isDeListed = justifyTradedDateLaterThanDeListing(
          hasDefault,
          liqSpeedWithMoments,
          productType,
          v.bond_basic_info?.delisted_date
        );
        let { comment } = v;
        const flagValue = {
          flag_stock_exchange: v.flag_stock_exchange,
          flag_bilateral: v.flag_bilateral,
          flag_request: v.flag_request,
          flag_indivisible: v.flag_indivisible
        };

        let updateFlags: CommentInputFlagValue | undefined;
        if (settlement.flagValue) {
          updateFlags = getUpdateCommentFlags(flagValue, settlement.flagValue);
        }

        // 判断备注是否已经存在，已经存在则清空，不存在则更新
        if (settlement.comment) {
          if (comment.includes(settlement.comment)) {
            comment = comment.replaceAll(settlement.comment, '');
          } else {
            comment += settlement.comment;
          }
        }

        // 当不存在结算方式或存在交易日晚于下市日的标签时，不更新liqSpeed
        if (!settlement.liq_speed_list?.length || isDeListed) {
          if (isDeListed) invalidIds.push(i + 1);
          return {
            quote_id: v.quote_id,
            comment,
            ...updateFlags
          };
        }

        let updates: LiquidationSpeed[] | undefined;
        const haveMethod = settlement.haveMethod ?? true;
        if (!haveMethod) {
          updates = v.liquidation_speed_list;
        } else if (liqSpeedList.length && !hasDefault) {
          updates = liqSpeedList.map(item => item.liquidationSpeed);

          if (isArrayValueEqual(updates, v.liquidation_speed_list || [])) {
            updates = [{ tag: LiquidationSpeedTag.Default, offset: 0 }];
          }
        } else {
          updates = [{ tag: LiquidationSpeedTag.Default, offset: 0 }];
        }
        return {
          quote_id: v.quote_id,
          comment,
          ...updateFlags,
          liquidation_speed_list: updates
        };
      }),
      operation_info: { operation_type: operationTypeUpdate }
    };
    if (selectedQuoteIdList.length === 1 && invalidIds.length) {
      message.error('交易日不可晚于或等于下市日！');
      return;
    }
    if (selectedQuoteIdList.length > 1 && invalidIds.length) {
      message.warning(`第${invalidIds.join(',')}行，交易日不可晚于或等于下市日！`);
    }
    onOptimisticUpdate?.({ action: OptimisticUpdateAction.Modify, targets: params.quote_item_list, selectedSide });
    await updateQuote(params, selectedQuoteList).finally(() => onEventSuccess?.());
  });

  const actionDeal = useValidationCallback(async () => {
    // 意向价、平价返不可成交
    let targets = selectedQuoteList.filter(q => !q.flag_intention && !isPingJiaFan(q) && (q.quote_price ?? 0) > 0);
    if (targets.length == 0) return void message.error('选择报价无法成交！');

    // NCD中返点为空不可成交
    if (
      productType === ProductType.NCD &&
      targets.some(q => q.flag_rebate && (q.return_point === SERVER_NIL || !q.return_point))
    ) {
      targets = targets.filter(q => !q.flag_rebate || (q.return_point !== SERVER_NIL && q.return_point));
      if (targets.length == 0) return void message.error('选择报价无法成交！');
    }

    const operation_info = { operation_type: OperationType.BondDealGvnTknDeal };
    const isSyncReceiptDeal = productType === ProductType.NCD ? true : undefined; // NCD二级同步成交单
    const list = await Promise.all(
      targets.map(q => transform2MarketDealCreate(q, tradeDateRange, isSyncReceiptDeal, userId))
    );

    const params: MarketDealMulCreate.Request = {
      market_deal_create_list: list,
      operation_info
    };

    /** 部分选中报价因价格特殊未成交 */
    const areQuotesMismatched = targets.length !== selectedQuoteList.length;

    return mulCreateMarketDealWithUndo(params, {
      origin: targets,
      isUndo: true,
      productType
    })
      .then(result => {
        if (
          !areQuotesMismatched &&
          result?.err_record_list?.some(i => i.error_type === MulCreateMarketDealErrorEnum.CalcError)
        ) {
          message.error('计算器异常，点价失败！');
        }
        return result;
      })
      .finally(() => {
        if (areQuotesMismatched) message.error('部分选中报价因价格特殊未成交！');
        onEventSuccess?.();
      });
  });

  const onEvent = (action: Action, value?: Value, cb?: () => void) => {
    if (action !== Action.Join && hasSelectedSTCQuote) return;
    if (action === Action.Deal) {
      if (!accessCache.deal) return;
    } else if (!accessCache.quote) return;

    switch (action) {
      /** 批量删除 */
      case Action.Delete:
        actionDelete();
        break;

      /** 批量refer */
      case Action.Refer:
        actionRefer();
        break;

      /** 批量unrefer */
      case Action.UnRefer:
        actionUnrefer();
        break;

      /** Join */
      case Action.Join:
        actionJoin();
        break;
      case Action.EditQuote:
        actionEditQuote(cb);
        break;
      /** 批量编辑 */
      case Action.Edit:
        actionEdit(value);
        break;

      /** 批量修改BP */
      case Action.UpdatePrice:
        if (value && typeof value === 'object' && 'price' in value) actionUpdatePrice(value);
        break;

      /** 修改Vol */
      case Action.UpdateVol:
        if (value && typeof value === 'object' && 'volume' in value) actionUpdateVol(value);
        break;

      /** 批量修改报价的 Settlement */
      case Action.MulUpsertSettlement:
        handleMulUpsertSettlement(value as Settlement);
        break;

      /** 批量成交 */
      case Action.Deal:
        actionDeal();
        break;
      default:
        break;
    }
    localStorage.setItem(shortcutLogKey, selectedQuoteIdList[0]);
  };

  return {
    clearDisplayValue,
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
    currentAction,
    setCurrentAction,
    openPriceWaitModal,
    openVolumeWaitModal,
    undoSnapshots:
      undoSnapshots?.filter(v => v.userId === userId && v.productType === productType && v.timestamp >= today) ?? []
  };
};
