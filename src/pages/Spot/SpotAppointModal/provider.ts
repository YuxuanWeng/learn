import { useEffect, useMemo, useRef, useState } from 'react';
import { getCP } from '@fepkg/business/utils/get-name';
import { SERVER_NIL } from '@fepkg/common/constants';
import { DealType } from '@fepkg/services/types/bds-enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { liquidationDateToTag } from '@packages/utils/liq-speed';
import { isUseLocalServer } from '@/common/ab-rules';
import { useQuoteByIdQuery } from '@/common/services/hooks/local-server/quote/useQuoteByIdQuery';
import { useSingleBondQuoteLiveQuery } from '@/common/services/hooks/useLiveQuery/BondQuote';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { SpotAppointModalProps } from '@/components/IDCSpot/types';
import { miscStorage } from '@/localdb/miscStorage';
import { QuoteState } from './types';

type InitialState = SpotAppointModalProps;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const SpotAppointContainer = createContainer((initialState: InitialState) => {
  const initRef = useRef(false);

  const [submitting, setSubmitting] = useState(false);

  /** 报价量(输入) */
  const [volume, setVolume] = useState(() => {
    if (!initialState.quote?.volume) return '';
    if (initialState.quote.volume % 1000 !== 0) return '';
    return (initialState.quote.volume / 1000).toString();
  });

  /** 价格失效 */
  const [disabled, setDisabled] = useState(!!initialState.disabled);

  const [flagInternal, setFlagInternal] = useState(false);

  const isTkn = initialState.dealType === DealType.TKN;
  const submitLabel = useMemo(() => {
    if (disabled) return '报价失效';
    if (isTkn) return 'TKN';
    return 'GVN';
  }, [disabled, isTkn]);

  /** 第一次点价面板的所有状态值 */
  // 是否返点
  const defaultFlagRebate = initialState.quote?.flag_rebate;
  // cp
  const quote = initialState.quote;
  const defaultCp = getCP({ inst: quote?.inst_info, productType: quote?.product_type, trader: quote?.trader_info });
  // 返点值
  const defaultReturnPoint =
    initialState.quote?.return_point === SERVER_NIL ? undefined : initialState.quote?.return_point;
  // 报价量
  const defaultVolume = initialState.quote?.volume;
  // 是否暗盘
  const defaultFLagInternal = `${initialState.quote?.flag_internal ? '暗盘' : '明盘'}`;
  // 经纪人

  const defaultBroker = initialState.quote?.broker_info;
  // 结算方式
  const defaultLiqSpeed =
    formatLiquidationSpeedListToString(
      liquidationDateToTag(initialState.quote?.liquidation_speed_list || []),
      'MM.DD'
    ) || '--';
  // flag标签
  const defaultFlags = {
    flagStockExchange: !!initialState.quote?.flag_stock_exchange,
    flagIndivisible: !!initialState.quote?.flag_indivisible,
    flagUrgent: !!initialState.quote?.flag_urgent,
    flagStar: initialState.quote?.flag_star,
    flagOco: !!initialState.quote?.flag_oco,
    flagExchange: !!initialState.quote?.flag_exchange,
    flagPackage: !!initialState.quote?.flag_package
  };

  const [quoteState, setQuoteState] = useImmer<QuoteState>(() => {
    return {
      quotePrice: initialState?.quote?.quote_price,
      quoteVolume: initialState?.quote?.volume,
      flagRebate: defaultFlagRebate,
      returnPoint: defaultFlagRebate ? defaultReturnPoint : undefined,
      isExercise: !!initialState.quote?.is_exercise,
      isExerciseManual: !!initialState.quote?.exercise_manual,
      cp: defaultCp,
      flagInternal: !!initialState.quote?.flag_internal,
      broker: defaultBroker,
      liqSpeed: defaultLiqSpeed,
      ...defaultFlags
    };
  });

  const MAX_VOLUME = (quoteState.quoteVolume || 1000) / 1000;

  const isSelf = miscStorage.userInfo?.user_id === quoteState.broker?.broker_id;

  const isLocalServer = isUseLocalServer();

  const { data: localizationData } = useSingleBondQuoteLiveQuery({
    params: { quoteId: initialState.quote?.quote_id },
    enabled: !isLocalServer
  });

  const { data: localServerData } = useQuoteByIdQuery({
    params: { quote_id: initialState.quote?.quote_id ?? '' },
    enabled: isLocalServer
  });

  const data = isLocalServer ? localServerData : localizationData;

  /** 监听数据变化 */
  useEffect(() => {
    if (!initRef.current) {
      // TODO: 后面看useSingleBondQuoteLiveQuery能不能第一次不返回无用的data数据
      // 抛除掉第一次data变化导致的重新渲染，data第一次会返回一个不必要的undefined
      initRef.current = true;
      return;
    }

    // 价格已经失效，不再恢复
    if (disabled) return;

    // 报价失效的场景
    const invalid =
      // 1.refer
      !data ||
      // 2.换边
      data.side !== initialState.quote?.side ||
      // 3.无价
      data.flag_intention === true ||
      !data.quote_price ||
      data.quote_price === SERVER_NIL ||
      // 4.无量
      !data.volume ||
      data.volume === SERVER_NIL ||
      // 5.散量
      data.volume < 1000 ||
      (data.volume >= 1000 && data.volume % 1000 !== 0) ||
      // 6.无返点
      (data.flag_rebate && (!data.return_point || data.return_point === SERVER_NIL));

    setDisabled(invalid);
    if (invalid) return;

    setQuoteState(draft => {
      draft.quotePrice = data?.quote_price;
      draft.flagRebate = data?.flag_rebate;
      draft.quoteVolume = data?.volume;
      draft.returnPoint = data?.return_point === SERVER_NIL ? undefined : data?.return_point;
      draft.isExercise = !!data?.is_exercise;
      draft.isExerciseManual = !!data?.exercise_manual;
      draft.flagInternal = !!data?.flag_internal;
      draft.cp = getCP({ inst: data?.inst_info, productType: data?.product_type, trader: data?.trader_info });
      draft.broker = data?.broker_info;
      draft.liqSpeed =
        formatLiquidationSpeedListToString(liquidationDateToTag(data?.liquidation_speed_list || []), 'MM.DD') || '--';
      draft.flagStockExchange = data?.flag_stock_exchange;
      draft.flagIndivisible = data?.flag_indivisible;
      draft.flagUrgent = data?.flag_urgent;
      draft.flagStar = data?.flag_star;
      draft.flagOco = data?.flag_oco;
      draft.flagExchange = data?.flag_exchange;
      draft.flagPackage = data?.flag_package;
    });
  }, [data, setQuoteState, disabled, initialState.quote?.side]);

  /** 结算方式是否发生变化 */
  const liqSpeedIsChanged = quoteState.liqSpeed !== defaultLiqSpeed;

  /** broker是否发生变化 */
  const brokerIsChanged = quoteState.broker?.broker_id !== initialState.quote?.broker_info?.broker_id;

  /** 报价量是否发生变化 */
  const volumeIsChanged = quoteState.quoteVolume !== initialState.quote?.volume;

  /** 明暗盘是否发生变化 */
  const flagInternalIsChanged = quoteState.flagInternal !== !!initialState.quote?.flag_internal;

  /** cp是否变化 */
  const cpIsChanged = defaultCp !== quoteState.cp;

  /** flag是否发生变化 */
  const flagIsChanged = useMemo(() => {
    if (initialState.quote?.flag_stock_exchange !== quoteState.flagStockExchange) return true;
    if (initialState.quote?.flag_indivisible !== quoteState.flagIndivisible) return true;
    if (initialState.quote?.flag_urgent !== quoteState.flagUrgent) return true;
    if (initialState.quote?.flag_star !== quoteState.flagStar) return true;
    if (initialState.quote?.flag_oco !== quoteState.flagOco) return true;
    if (initialState.quote?.flag_exchange !== quoteState.flagExchange) return true;
    if (initialState.quote?.flag_package !== quoteState.flagPackage) return true;
    return false;
  }, [initialState, quoteState]);

  /** 判断价格是否发生变化 */
  const priceIsChanged = useMemo(() => {
    // 返点是否一致
    if (initialState.quote?.flag_rebate !== quoteState.flagRebate) return true;
    if (defaultReturnPoint !== quoteState.returnPoint) return true;

    // 价格是否一致
    if (initialState?.quote?.quote_price !== quoteState.quotePrice) return true;

    // 行权/到期是否一致
    if (initialState.quote?.is_exercise !== quoteState.isExercise) return true;

    // 是否手动行权是否一致
    if (initialState.quote?.exercise_manual !== quoteState.isExerciseManual) return true;

    return false;
  }, [initialState, quoteState, defaultReturnPoint]);

  return {
    defaultValue: initialState,

    submitting,
    setSubmitting,

    flagInternal,
    setFlagInternal,

    submitLabel,
    disabled,
    isTkn,
    isSelf,
    dealQuote: data,

    quoteState,

    volume,
    MAX_VOLUME,
    setVolume,

    defaultCp,
    defaultFlags,
    defaultBroker,
    defaultVolume,
    defaultLiqSpeed,
    defaultFLagInternal,

    cpIsChanged,
    flagIsChanged,
    priceIsChanged,
    volumeIsChanged,
    brokerIsChanged,
    liqSpeedIsChanged,
    flagInternalIsChanged
  };
});

export const SpotAppointProvider = SpotAppointContainer.Provider;
export const useSpotAppoint = SpotAppointContainer.useContainer;
