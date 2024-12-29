import { useRef } from 'react';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { QuoteComponentRef } from '../Quote';
import { DefaultPriceGroup } from './constants';
import { HandleChangeCategory, HandleChangeValType, PriceImmerWrapper, PriceState } from './types';
import { getIsIntention } from './utils';

export type InitialState = {
  /** 报价方向 */
  side?: Side;
  /** 默认价格值 */
  defaultValue?: PriceState;
};

const PriceGroupContainer = createContainer((initialState?: InitialState) => {
  const [priceInfo, setPriceInfo] = useImmer<PriceImmerWrapper<PriceState>>(() => {
    if (initialState?.side === undefined) return DefaultPriceGroup;
    const { side, defaultValue } = initialState;
    let { quote_price } = defaultValue ?? {};
    if (defaultValue?.flag_intention) {
      if (side === Side.SideBid) quote_price = 'BID';
      if (side === Side.SideOfr) quote_price = 'OFR';
    }
    return { ...DefaultPriceGroup, [side]: { ...defaultValue, quote_price } };
  });

  const bidPriceRef = useRef<QuoteComponentRef>(null);
  const bidReturnPointRef = useRef<QuoteComponentRef>(null);

  const ofrPriceRef = useRef<QuoteComponentRef>(null);
  const ofrReturnPointRef = useRef<QuoteComponentRef>(null);

  const nonePriceRef = useRef<QuoteComponentRef>(null);
  const noneReturnPointRef = useRef<QuoteComponentRef>(null);

  const getPriceRef = (side?: Side) => {
    if (side === Side.SideBid) return { priceRef: bidPriceRef, returnPointRef: bidReturnPointRef };
    if (side === Side.SideOfr) return { priceRef: ofrPriceRef, returnPointRef: ofrReturnPointRef };
    return { priceRef: nonePriceRef, returnPointRef: noneReturnPointRef };
  };

  /**
   * 更新价格信息
   * @param side 报价方向
   * @param data 更新价格对象
   */
  const updatePriceInfo = (side: Side, data: PriceState) => {
    setPriceInfo(draft => {
      draft[side] = { ...draft[side], ...data };
    });
  };

  /**
   * 更新价格
   * @param side 报价方向
   * @param price 价格
   * @param intention 意向价字符串
   * @param ignoreThreshold 是否在超出阈值后改变价格类型
   */
  const handleInnerPriceChange = (side: Side, quote_price?: string, intention?: string, ignoreThreshold?: boolean) => {
    const updatePatch: PriceState = { quote_price };

    /** 输入特殊字符，视为意向价 */
    const isIntention = getIsIntention(quote_price, intention);
    if (isIntention) {
      updatePatch.flag_rebate = false; // 意向价与返点互斥
      updatePatch.flag_intention = true;
      updatePatch.quote_type = BondQuoteType.Yield; // 意向价时报价类型为收益率
    } else {
      updatePatch.flag_intention = false;
    }

    if (!ignoreThreshold) {
      /** 价格超出阈值后，视为净价 */
      if (!isIntention && Number(updatePatch.quote_price) > 30) {
        updatePatch.quote_type = BondQuoteType.CleanPrice;
        updatePatch.flag_rebate = false;
        updatePatch.return_point = undefined;
      } else if (Number(updatePatch.quote_price) <= 30) {
        updatePatch.quote_type = BondQuoteType.Yield;
      }
    }

    updatePriceInfo(side, updatePatch);
  };

  /**
   * 选中报价类型
   * @param side 报价方向
   * @param quote_type 报价类型
   * @param intention 意向价字符串
   */
  const handleInnerQuoteTypeSelected = (side: Side, quote_type: BondQuoteType, intention?: string) => {
    const updatePatch: PriceState = { quote_type };
    if (quote_type === BondQuoteType.CleanPrice) {
      updatePatch.return_point = undefined;
      updatePatch.flag_rebate = false;
      updatePatch.flag_intention = false;

      const isIntention = getIsIntention(priceInfo[side]?.quote_price, intention);
      if (isIntention) updatePatch.quote_price = '';
    }
    updatePriceInfo(side, updatePatch);
  };

  /**
   *  返点值改变后的回调函数
   * @param side 报价方向
   * @param return_point 返点值
   */
  const handleInnerReturnPointChange = (side: Side, return_point?: string) => {
    updatePriceInfo(side, { return_point });
  };

  /**
   * 点击F后的回调函数
   * @param side 报价方向
   * @param flag_rebate 返点标志
   * @param intention 意向价字符串
   */
  const handleInnerFClick = (side: Side, flag_rebate?: boolean, intention?: string) => {
    const updatePatch: PriceState = { flag_rebate };

    const isIntention = getIsIntention(priceInfo[side]?.quote_price, intention);

    if (flag_rebate) updatePatch.flag_intention = false; // 意向与反点互斥
    else updatePatch.return_point = undefined;

    if (isIntention && flag_rebate) updatePatch.quote_price = ''; // 清空意向价字符串

    updatePriceInfo(side, updatePatch);
  };

  const handleInnerChange = (val: HandleChangeValType) => {
    if (val.category === HandleChangeCategory.Price) {
      handleInnerPriceChange(val.side, val.data.quote_price, val.data.intention, val.ignoreThreshold);
    }
    if (val.category === HandleChangeCategory.QuoteType) {
      handleInnerQuoteTypeSelected(val.side, val.data.quote_type || BondQuoteType.Yield, val.data.intention);
    }

    if (val.category === HandleChangeCategory.ReturnPoint) {
      handleInnerReturnPointChange(val.side, val.data.return_point);
    }

    if (val.category === HandleChangeCategory.F) {
      handleInnerFClick(val.side, val.data.flag_rebate, val.data.intention);
    }
  };

  return {
    /** 获取价格框的ref */
    getPriceRef,

    /** 价格相关的状态 */
    priceInfo,
    setPriceInfo,

    /** 更新价格状态 */
    updatePriceInfo,

    /** 以下暴露的函数用于改变组件内部的值 */

    /** 根据不同的category，更新对应的状态 */
    handleInnerChange,
    /** 更新价格  */
    handleInnerPriceChange,
    /** 更新报价类型 */
    handleInnerQuoteTypeSelected,
    /** 更新返点值 */
    handleInnerReturnPointChange,
    /** F的点击事件处理 */
    handleInnerFClick
  };
});

export const PriceGroupProvider = PriceGroupContainer.Provider;
export const usePriceGroup = PriceGroupContainer.useContainer;
