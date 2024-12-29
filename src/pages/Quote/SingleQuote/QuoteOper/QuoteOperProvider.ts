import { useCallback, useMemo, useState } from 'react';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { SideMap } from '@fepkg/business/constants/map';
import { SERVER_NIL } from '@fepkg/common/constants';
import { formatDate } from '@fepkg/common/utils/date';
import type { QuoteInsert, QuoteLite, QuoteParsing } from '@fepkg/services/types/common';
import { BondQuoteType, ProductType, Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { isEqual, isNumber, pick } from 'lodash-es';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { quoteSetting, useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { getPriceFiledWithQuoteType } from '@/common/utils/quote';
import { getEstimation, transformPrice } from '@/common/utils/quote-price';
import { QuoteSettingsType } from '@/components/Quote/types';
import { CalcType } from '@/components/business/Calc';
import { usePriceGroup as usePriceGroupFromQuote } from '@/components/business/PriceGroup';
import { PriceState } from '@/components/business/PriceGroup/types';
import { getIsIntention } from '@/components/business/PriceGroup/utils';
import { formatQuoteAmount } from '@/pages/Base/SystemSetting/components/QuoteSettings/components/QuotePanelSettings';
import {
  IntentionIconMap,
  QuoteCalcYield,
  QuoteFlagsYield,
  QuoteFooterFlagsYield,
  QuotePriceYield,
  default_valuation_status
} from '../constants';
import useAutoAddStar from '../hooks/useAutoAddStar';
import { useDefaultQuoteOper } from '../hooks/useDefaultQuoteOper';
import useUnit from '../hooks/useUnit';
import useValuation from '../hooks/useValuation';
import { useFlagValue } from '../providers/FlagProvider';
import { useFocus } from '../providers/FocusProvider';
import { QuoteActionMode } from '../types';
import { exchangeFn, formatFlagIntention, transformQuoteType, transformStrToNum } from '../utils';
import { BondValuation, QuoteFlagValue, QuoteFlags } from './types';

export type QuoteOperImmerType<T> = { [Side.SideBid]?: T; [Side.SideOfr]?: T };

// 这里剔除的类型是报价面板QuoteOper之外的数据
export type QuoteParamsType = Omit<QuoteInsert, 'bond_key_market' | 'broker_id' | 'trader_id'>;

export const checkQuoteSideParams = (side: Side, quoteParams: QuoteOperImmerType<QuoteParamsType>, price?: number) => {
  const insertParams = quoteParams[side] as QuoteParamsType | undefined;
  if (!insertParams) return false;

  const modifiedPrice = price ?? insertParams.quote_price;
  if (
    (!insertParams.volume || insertParams.volume === SERVER_NIL) && // 报价量为空
    !insertParams.flag_intention && // 不是意向价
    !insertParams.flag_rebate && // 未点亮返点
    (modifiedPrice === undefined || modifiedPrice === SERVER_NIL) // 报价为空
  ) {
    // 未填写价格和量
    return false;
  }
  return true;
};

type InitialState = {
  /** 原始报价信息 */
  quote?: Partial<QuoteLite>;
  /** 报价模式 */
  mode?: QuoteActionMode;
  /** 是否展示结算方式识别组件 */
  showParseLiqSpeed?: boolean;
};

const QuoteOperContainer = createContainer((initialState?: InitialState) => {
  const { defaultQuoteFlags, defaultVolume, defaultCalc } = useDefaultQuoteOper(
    initialState?.quote,
    initialState?.mode
  );

  const showParseLiqSpeed = initialState?.showParseLiqSpeed;

  const [quoteFlags, setQuoteFlags] = useImmer<QuoteOperImmerType<QuoteFlags>>(defaultQuoteFlags);
  const [calc, setCalc] = useImmer<QuoteOperImmerType<CalcType>>(defaultCalc);
  const [volume, setVolume] = useImmer<QuoteOperImmerType<number | undefined>>(defaultVolume); // 报价量
  const { unit, updateUnit, exchange: exchangeUnit } = useUnit(); // 报价量单位

  const { focusPrice } = useFocus();

  const [disabled, setDisabled] = useImmer<QuoteOperImmerType<boolean>>({
    [Side.SideOfr]: initialState?.quote?.side === Side.SideBid,
    [Side.SideBid]: initialState?.quote?.side === Side.SideOfr
  });

  const [currentOpenCalcSide, setCurrentOpenCalcSide] = useState<Side | undefined>(); // 当前打开的备注面板
  const [getSideIsFocusingFn, setGetSideIsFocusingFn] = useImmer<QuoteOperImmerType<() => boolean>>({}); // 获取单方向input是否获取焦点

  const { bondSearchState } = useBondSearch();
  const { priceInfo, setPriceInfo, updatePriceInfo, handleInnerPriceChange } = usePriceGroupFromQuote();
  const bond = bondSearchState?.selected?.original;

  const { updateFlagValue } = useFlagValue();
  const { userSetting: setting, getSetting } = useUserSetting<QuoteSettingsType>(quoteSetting);

  const {
    zhaiValue,
    zhengValue,
    checkedZhai,
    checkedZheng,
    clear: clearValuationStatus,
    clearChecked: clearValuationChecked,
    updateZhaiStatus,
    updateZhengStatus,
    exchange: exchangeValuationStatus
  } = useValuation(); // 处理债/证

  /** 报价自动加星逻辑 */
  useAutoAddStar(setting, initialState?.mode, setQuoteFlags, initialState?.quote?.flag_star, disabled);

  /** 报价自动填充报价量 */
  const autoFillVolume = (side: Side) => {
    const userSettingVolume = getSetting(UserSettingFunction.UserSettingQuoteAmount);
    const quoteAmount = formatQuoteAmount(userSettingVolume)?.value;

    // 若 用户设置的默认报价量为空或0 || 当前报价操作类型处于编辑类型，则不走自动填充逻辑
    if (!quoteAmount || quoteAmount === '0' || volume[side] || initialState?.mode === QuoteActionMode.EDIT) {
      return;
    }
    setVolume(draft => {
      draft[side] = quoteAmount;
    });
  };

  /** 获取单边报价数据 */
  const getSideParams = useCallback(
    (side: Side) => {
      const flag_intention = formatFlagIntention(priceInfo[side], volume[side], quoteFlags[side]?.flag_intention);
      const quote_type = transformQuoteType(flag_intention, priceInfo[side]?.quote_type) || BondQuoteType.Yield;

      const params = {
        side,
        ...quoteFlags[side],
        ...priceInfo[side],
        ...calc[side],
        ...transformPrice(priceInfo[side]?.quote_price),
        quote_type,
        volume: transformStrToNum(volume[side]),
        return_point: transformStrToNum(priceInfo[side]?.return_point),
        flag_intention
      } as QuoteParamsType;

      // 如果报价类型为收益率，并且为含权债，并且是否含权没赋值
      // TODO 看看后面要不要和计算器 is_exercise 默认值赋值逻辑合并
      if (quote_type === BondQuoteType.Yield && bond?.has_option && params?.is_exercise === undefined) {
        // 判断行权日是否在当天之后，如果是，需要根据债券台子选择默认值
        const isAfterOptionDay = moment(formatDate(bond?.option_date)).isAfter(Date.now(), 'day');
        if (isAfterOptionDay) {
          params.is_exercise = bond.product_type === ProductType.BCO;
        }
      }

      return params;
    },
    [bond, calc, priceInfo, quoteFlags, volume]
  );

  /** 构造一个最终提交的数据结构 */
  const quoteParams: QuoteOperImmerType<QuoteParamsType> = useMemo(
    () => ({
      [Side.SideBid]: getSideParams(Side.SideBid),
      [Side.SideOfr]: getSideParams(Side.SideOfr)
    }),
    [getSideParams]
  );

  const bidInsert = quoteParams[Side.SideBid]; // bid方向的报价信息
  const ofrInsert = quoteParams[Side.SideOfr]; // ofr方向的报价信息

  /** bid方向是否存在合法报价 */
  const bidIsValid = Boolean(!disabled[Side.SideBid] && checkQuoteSideParams(Side.SideBid, quoteParams) && bidInsert);
  /** ofr方向是否存在合法报价 */
  const ofrIsValid = Boolean(!disabled[Side.SideOfr] && checkQuoteSideParams(Side.SideOfr, quoteParams) && ofrInsert);

  /**
   * 更新报价flag相关
   * @param side 报价方向
   * @param flags 跟新报价flag字段
   * @param isParsing 更新是否由报价识别产生。若由报价识别产生，则flags和price的联动逻辑简化
   */
  const updateQuoteFlags = (side: Side, flags?: QuoteFlags, isParsing = false) => {
    /** 更新price为意向价标签 */
    if (flags?.flag_intention === true && !isParsing) {
      clearValuationChecked(side);
      updatePriceInfo(side, {
        // quote_price: side === Side.SideBid ?'BID' : 'OFR',
        quote_price: SideMap[side].upperCase,
        flag_rebate: false,
        quote_type: BondQuoteType.Yield,
        return_point: undefined
      });
      autoFillVolume(side);
    }

    /** 意向价从有(意向价字符串)到无，清空价格 */

    // const isIntention = getIsIntention(priceInfo[side]?.price, side === Side.SideBid ?'BID' : 'OFR');
    const isIntention = getIsIntention(priceInfo[side]?.quote_price, SideMap[side].upperCase);
    if (isIntention && flags?.flag_intention === false && !isParsing) {
      updatePriceInfo(side, { quote_price: '' });
    }

    setQuoteFlags(draft => {
      if (isParsing) draft[side] = { ...flags };
      else draft[side] = { ...quoteFlags[side], ...flags };
    });
  };

  /**
   * 处理价格和标签的联动逻辑
   * @param side 报价方向
   * @param price 价格
   */
  const handlePriceChange = (side: Side, price = '') => {
    clearValuationChecked(side);
    /** 输入特殊字符，视为意向价 */
    // const isIntention = getIsIntention(price, side === Side.SideBid ?'BID' : 'OFR');
    const isIntention = getIsIntention(price, SideMap[side].upperCase);

    setQuoteFlags(draft => {
      draft[side] = { ...quoteFlags[side], flag_intention: isIntention };
    });

    /** 取消意向价标签 */
    if (!price && quoteFlags[side]?.flag_intention) {
      setQuoteFlags(draft => {
        draft[side] = { ...quoteFlags[side], flag_intention: false };
      });
    }

    if (price) autoFillVolume(side);

    handleInnerPriceChange(side, price, IntentionIconMap[side]);
  };

  /**
   * 更新报价量
   * @param side 报价方向
   * @param val 报价量
   * @param isParsing 更新是否由报价识别产生。若由报价识别产生，则flags和price的联动逻辑简化
   */
  const updateVolume = (side: Side, val?: string, isParsing = false) => {
    /** 有量无价(包括返点)，视为意向价 */
    if (val !== undefined && !priceInfo[side]?.quote_price && !priceInfo[side]?.flag_rebate && !isParsing) {
      setQuoteFlags(draft => {
        draft[side] = { ...quoteFlags[side], flag_intention: true };
      });

      updatePriceInfo(side, {
        // quote_price: side === Side.SideBid ?'BID' : 'OFR',
        quote_price: SideMap[side].upperCase,
        flag_rebate: false,
        quote_type: BondQuoteType.Yield
      });
    }

    setVolume(draft => {
      draft[side] = val;
    });
  };

  /**
   * 更新计算备注面板值
   * @param side 报价方向
   * @param val 更新备注计算面板字段值
   */
  const updateCalc = (side: Side, val?: CalcType) => {
    setCalc(draft => {
      draft[side] = val;
    });
  };

  const patchCalc = (side: Side, val: CalcType) => {
    setCalc(draft => {
      draft[side] = { ...calc[side], ...val };
    });
  };

  const formatEstimation = (side: Side, value?: number) => {
    const decimalLimit = Number(setting.get(UserSettingFunction.UserSettingValuationDecimalDigit) || 4);

    const estimation = getEstimation(side, value, decimalLimit);
    return estimation;
  };

  /**
   * 债估值更新价格
   * @param side 报价方向
   * @param type 估值类型
   * @returns
   */
  const updatePriceWithBond = (side: Side, type: BondValuation) => {
    if (type === BondValuation.Zhai) {
      /** 计算债估值 */
      const formatValue = formatEstimation(side, zhaiValue);
      if (!formatValue) return;

      // 更新当前方向的债为选中态
      updateZhaiStatus(side, true);

      updatePriceInfo(side, { quote_price: formatValue, quote_type: BondQuoteType.Yield });

      autoFillVolume(side);

      setQuoteFlags(draft => {
        draft[side] = { ...quoteFlags[side], flag_intention: false };
      });
    }

    if (type === BondValuation.Zheng) {
      /** 计算证估值 */
      const formatValue = formatEstimation(side, zhengValue);
      if (!formatValue) return;

      // 更新当前方向的债为选中态
      updateZhengStatus(side, true);

      updatePriceInfo(side, { quote_price: formatValue, quote_type: BondQuoteType.Yield });

      autoFillVolume(side);

      setQuoteFlags(draft => {
        draft[side] = { ...quoteFlags[side], flag_intention: false };
      });
    }
  };

  /** 清除单方向上的quoteOper值 */
  const clearOper = (side: Side) => {
    setPriceInfo(draft => {
      draft[side] = { quote_type: BondQuoteType.Yield };
    });
    setCalc(draft => {
      draft[side] = {};
    });
    setQuoteFlags(draft => {
      draft[side] = {};
    });
    setVolume(draft => {
      draft[side] = void 0;
    });
  };

  /** 交换债/证对应的值 */
  const getPriceWithValuation = () => {
    let bidPrice = '';
    let ofrPrice = '';

    // case 1: 如果双方向均为点亮债/证，则交换无意义
    if (isEqual(checkedZhai, default_valuation_status) && isEqual(checkedZheng, default_valuation_status)) {
      return { bidPrice, ofrPrice };
    }

    // case 2: 如果当前bid方向<债>被选中, 则计算对侧的债估值
    if (checkedZhai[Side.SideBid]) {
      ofrPrice = formatEstimation(Side.SideOfr, zhaiValue);
    }

    // case 3: 如果当前bid方向<证>被选中, 则计算对侧的证估值
    if (checkedZheng[Side.SideBid]) {
      ofrPrice = formatEstimation(Side.SideOfr, zhengValue);
    }

    // case 4: 如果当前ofr方向<债>被选中, 则计算对侧的债估值
    if (checkedZhai[Side.SideOfr]) {
      bidPrice = formatEstimation(Side.SideBid, zhaiValue);
    }

    // case 5: 如果当前ofr方向<证>被选中, 则计算对侧的证估值
    if (checkedZheng[Side.SideOfr]) {
      bidPrice = formatEstimation(Side.SideBid, zhengValue);
    }
    return { bidPrice, ofrPrice };
  };

  /** 交换价格 */
  const exchangePrice = () => {
    const { bidPrice, ofrPrice } = getPriceWithValuation();

    // 若对侧价格是由债/证填充，则取计算后的债/证。否则正常交换
    const bidValue =
      bidPrice || (quoteFlags[Side.SideOfr]?.flag_intention ? 'BID' : priceInfo[Side.SideOfr]?.quote_price);
    const ofrValue =
      ofrPrice || (quoteFlags[Side.SideBid]?.flag_intention ? 'OFR' : priceInfo[Side.SideBid]?.quote_price);

    setPriceInfo(draft => {
      const bid = draft[Side.SideBid];
      const ofr = draft[Side.SideOfr];
      // 若为意向价，则更新文案
      draft[Side.SideBid] = { ...ofr, quote_price: bidValue };
      draft[Side.SideOfr] = { ...bid, quote_price: ofrValue };
    });
  };

  /** 报价识别后，填充价相关数据 */
  const updateQuoteAfterParsing = (parsing: QuoteParsing) => {
    const { side, volume: vol } = parsing;

    setDisabled(draft => {
      draft[side] = false;
    });

    requestIdleCallback(() => {
      focusPrice(side);
    });

    const pricePart = pick<PriceState>(
      { ...parsing, return_point: (parsing.return_point || '').toString() },
      QuotePriceYield
    );
    const flags = pick<QuoteFlags>(parsing, QuoteFlagsYield);
    const calcData = pick<CalcType>(parsing, QuoteCalcYield);
    const footerFlags = pick<QuoteFlagValue>(parsing, QuoteFooterFlagsYield);

    const priceFiled = getPriceFiledWithQuoteType(parsing.quote_type);

    let defaultPrice = '';
    if (side === Side.SideBid && parsing.flag_intention) defaultPrice = 'BID';
    if (side === Side.SideOfr && parsing.flag_intention) defaultPrice = 'OFR';

    updatePriceInfo(side, { ...pricePart, quote_price: defaultPrice || (parsing[priceFiled] || '').toString() });
    updateQuoteFlags(side, flags, true);
    updateCalc(side, calcData);
    updateVolume(side, isNumber(vol) ? String(vol) : void 0, true);
    updateFlagValue(footerFlags);

    clearValuationStatus();
  };

  /** 换边操作 */
  const exchange = () => {
    /* 交换单位 */
    exchangeUnit();
    /* 交换报价标签 */
    setQuoteFlags(exchangeFn);
    /* 交换报价量 */
    setVolume(exchangeFn);
    /* 交换禁用态 */
    setDisabled(exchangeFn);
    /* 交换计算面板 */
    setCalc(exchangeFn);
    /* 交换价格 */
    exchangePrice();
    /* 交换债/证选中态 */
    exchangeValuationStatus();
  };

  /** 关闭备注计算面板 */
  const closeCalcModal = () => {
    setCurrentOpenCalcSide(undefined);
  };

  const currentSide = useMemo(() => {
    if (disabled[Side.SideBid]) return Side.SideOfr;
    if (disabled[Side.SideOfr]) return Side.SideBid;
    return Side.SideNone;
  }, [disabled]);

  return {
    side: currentSide,
    /* 双边报价信息 */
    quoteParams,
    /* 当前打开的备注计算面板 */
    currentOpenCalcSide,
    /* 报价单位 */
    unit,
    /* 备注计算数据 */
    calc,
    /** 报价标签 */
    quoteFlags,
    /* 价格部分数据 */
    priceInfo,
    /* 报价量 */
    volume,
    /* 禁用状态 */
    disabled,
    /* 获取当前方向报价是否获取焦点 */
    getSideIsFocusingFn,
    /* 当前债选中态 */
    checkedZhai,
    /* 当前证选中态 */
    checkedZheng,
    updatePriceInfo,
    setQuoteFlags,
    setVolume,
    clearValuationStatus,
    clearValuationChecked,
    /* 根据识别结果，批量跟新价格和flags */
    setGetSideIsFocusingFn,
    updateCalc,
    patchCalc,
    updateUnit,
    updateQuoteFlags,
    handlePriceChange,
    updateVolume,
    exchange,
    updatePriceWithBond,
    setCurrentOpenCalcSide,
    closeCalcModal,
    updateQuoteAfterParsing,

    bidInsert,
    ofrInsert,
    bidIsValid,
    ofrIsValid,

    showParseLiqSpeed,
    clearOper
  };
});

export const QuoteOperProvider = QuoteOperContainer.Provider;
export const useQuoteOper = QuoteOperContainer.useContainer;
