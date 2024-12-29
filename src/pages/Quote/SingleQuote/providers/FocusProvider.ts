import { RefObject, useCallback, useMemo, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { QuoteComponentRef } from '@/components/business/Quote';
import { useBrokerSearch } from '@/components/business/Search/BrokerSearch';
import { useInstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { QuoteFocusInputType, QuoteOperInputCategory, SearchInputCategory } from '../types';

const FocusContainer = createContainer((initialState?: { focusInput?: QuoteFocusInputType }) => {
  const currentFocusRef = useRef<QuoteComponentRef | null>(null); // 当前正在获取焦点的ref
  const prevFocusRef = useRef<QuoteComponentRef | null>(null); // 上一个获取焦点的ref
  /** 是否首次聚焦已完成 */
  const isFirstFocusingFinished = useRef(false);

  const { bondSearchRef } = useBondSearch();
  const { instTraderSearchRef } = useInstTraderSearch();
  const { brokerSearchRef } = useBrokerSearch();

  const createElCbRefGetter = useCallback(() => {
    return (type: QuoteFocusInputType, ref?: RefObject<QuoteComponentRef>) => (instance: QuoteComponentRef | null) => {
      if (instance && type === initialState?.focusInput && !isFirstFocusingFinished.current) {
        /** div标签聚焦使用focus */
        requestAnimationFrame(() => {
          if (type === QuoteFocusInputType.LIQ_SPEED) instance.focus?.();
          else instance.select?.();
          currentFocusRef.current = ref?.current || null;
          isFirstFocusingFinished.current = true;
        });
      }
    };
  }, [initialState?.focusInput]);

  const bondSearchCbRef = useMemoizedFn((node: HTMLInputElement | null) => {
    if (node && QuoteFocusInputType.BOND === initialState?.focusInput && !isFirstFocusingFinished.current) {
      requestAnimationFrame(() => {
        node.focus();
        node.select();
        isFirstFocusingFinished.current = true;
      });
    }
  });

  const getElCbRef = useMemo(() => createElCbRefGetter(), [createElCbRefGetter]);

  const bidPriceRef = useRef<QuoteComponentRef>(null); // bid方向价格inputRef
  const bidPriceMergedRefs = useMemo(
    () => mergeRefs([bidPriceRef, getElCbRef(QuoteFocusInputType.BID_PRICE, bidPriceRef)]),
    [getElCbRef]
  );

  const ofrPriceRef = useRef<QuoteComponentRef>(null); // ofr方向价格inputRef
  const ofrPriceMergedRefs = useMemo(
    () => mergeRefs([ofrPriceRef, getElCbRef(QuoteFocusInputType.OFR_PRICE, ofrPriceRef)]),
    [getElCbRef]
  );

  const bidVolumeRef = useRef<QuoteComponentRef>(null); // bid方向报价量inputRef
  const bidVolumeMergedRefs = useMemo(
    () => mergeRefs([bidVolumeRef, getElCbRef(QuoteFocusInputType.BID_VOL, bidVolumeRef)]),
    [getElCbRef]
  );

  const ofrVolumeRef = useRef<QuoteComponentRef>(null); // ofr方向报价量inputRef
  const ofrVolumeMergedRefs = useMemo(
    () => mergeRefs([ofrVolumeRef, getElCbRef(QuoteFocusInputType.OFR_VOL, ofrVolumeRef)]),
    [getElCbRef]
  );

  const bidReturnPointRef = useRef<QuoteComponentRef>(null); // bid方向返点值inputRef
  const bidReturnPointMergedRefs = useMemo(
    () => mergeRefs([bidReturnPointRef, getElCbRef(QuoteFocusInputType.BID_RETURN_POINT)]),
    [getElCbRef]
  );

  const ofrReturnPointRef = useRef<QuoteComponentRef>(null); // ofr方向返点值inputRef
  const ofrReturnPointMergedRefs = useMemo(
    () => mergeRefs([ofrReturnPointRef, getElCbRef(QuoteFocusInputType.OFR_RETURN_POINT)]),
    [getElCbRef]
  );

  const calcBodyRef = useRef<HTMLDivElement>(null);
  const calcBodyMergedRefs = useMemo(
    () => mergeRefs([calcBodyRef, getElCbRef(QuoteFocusInputType.LIQ_SPEED, calcBodyRef)]),
    [getElCbRef]
  );

  const calcFooterRef = useRef<HTMLInputElement>(null);
  const calcFooterMergedRefs = useMemo(
    () => mergeRefs([calcFooterRef, getElCbRef(QuoteFocusInputType.COMMENT, calcFooterRef)]),
    [getElCbRef]
  );

  const bidLiqSpeedRef = useRef<HTMLInputElement>(null); // bid方向结算方式inputRef
  const bidLiqSpeedRefs = useMemo(
    () => mergeRefs([bidLiqSpeedRef, getElCbRef(QuoteFocusInputType.BID_LIQ_SPEED, bidLiqSpeedRef)]),
    [getElCbRef]
  );

  const ofrLiqSpeedRef = useRef<HTMLInputElement>(null); // ofr方向结算方式inputRef
  const ofrLiqSpeedRefs = useMemo(
    () => mergeRefs([ofrLiqSpeedRef, getElCbRef(QuoteFocusInputType.OFR_LIQ_SPEED, ofrLiqSpeedRef)]),
    [getElCbRef]
  );

  const clearCurrentFocusRef = () => {
    currentFocusRef.current = null;
  };

  const clearPrevFocusRef = () => {
    prevFocusRef.current = null;
  };

  const updatePrevFocusRef = () => {
    prevFocusRef.current = currentFocusRef.current;
  };

  const getPriceRef = (side: Side) => {
    if (side === Side.SideBid) return bidPriceRef;
    return ofrPriceRef;
  };

  const getPriceRefs = (side: Side) => {
    if (side === Side.SideBid) return bidPriceMergedRefs;
    return ofrPriceMergedRefs;
  };

  const getVolumeRef = (side: Side) => {
    if (side === Side.SideBid) return bidVolumeRef;
    return ofrVolumeRef;
  };

  const getVolumeRefs = (side: Side) => {
    if (side === Side.SideBid) return bidVolumeMergedRefs;
    return ofrVolumeMergedRefs;
  };

  const getReturnPointRef = (side: Side) => {
    if (side === Side.SideBid) return bidReturnPointRef;
    return ofrReturnPointRef;
  };

  const getReturnPointRefs = (side: Side) => {
    if (side === Side.SideBid) return bidReturnPointMergedRefs;
    return ofrReturnPointMergedRefs;
  };

  const getLiqSpeedRefs = (side: Side) => {
    if (side === Side.SideBid) return bidLiqSpeedRefs;
    return ofrLiqSpeedRefs;
  };

  const getLiqSpeedRef = (side: Side) => {
    if (side === Side.SideBid) return bidLiqSpeedRef;
    return ofrLiqSpeedRef;
  };

  /** 光标聚焦到对应的价格处 */
  const focusPrice = (side: Side) => {
    if (side === Side.SideBid) {
      bidPriceRef.current?.select?.();
      currentFocusRef.current = bidPriceRef.current;
    } else {
      ofrPriceRef.current?.select?.();
      currentFocusRef.current = ofrPriceRef.current;
    }
  };

  /** 光标聚焦到对应的报价量处 */
  const focusVolume = (side: Side) => {
    if (side === Side.SideBid) {
      bidVolumeRef.current?.focus?.();
      currentFocusRef.current = bidVolumeRef.current;
    } else {
      ofrVolumeRef.current?.focus?.();
      currentFocusRef.current = ofrVolumeRef.current;
    }
  };

  const focus = (side?: Side) => {
    // 若当前光标已经聚焦到某处
    if (prevFocusRef?.current) {
      prevFocusRef.current.focus?.();
      currentFocusRef.current = prevFocusRef.current;
    }
    // 否则光标聚焦到价格处
    else if (side) focusPrice(side);
    clearPrevFocusRef();
  };

  const updateSearchInputRef = (type: SearchInputCategory) => {
    switch (type) {
      case SearchInputCategory.Bond:
        currentFocusRef.current = bondSearchRef.current;
        break;
      case SearchInputCategory.InstTrader:
        currentFocusRef.current = instTraderSearchRef.current;
        break;
      case SearchInputCategory.Broker:
        currentFocusRef.current = brokerSearchRef.current;
        break;
      default:
        break;
    }
  };

  const updateQuoteInputCurrentRef = (type: QuoteOperInputCategory) => {
    switch (type) {
      case QuoteOperInputCategory.BirPrice:
        currentFocusRef.current = bidPriceRef.current;
        break;
      case QuoteOperInputCategory.OfrPrice:
        currentFocusRef.current = ofrPriceRef.current;
        break;
      case QuoteOperInputCategory.BidVolume:
        currentFocusRef.current = bidVolumeRef.current;
        break;
      case QuoteOperInputCategory.OfrVolume:
        currentFocusRef.current = ofrVolumeRef.current;
        break;
      case QuoteOperInputCategory.BidReturnPoint:
        currentFocusRef.current = bidReturnPointRef.current;
        break;
      case QuoteOperInputCategory.OfrReturnPoint:
        currentFocusRef.current = ofrReturnPointRef.current;
        break;
      case QuoteOperInputCategory.BidLiqSpeed:
        currentFocusRef.current = bidLiqSpeedRef.current;
        break;
      case QuoteOperInputCategory.OfrLiqSpeed:
        currentFocusRef.current = ofrLiqSpeedRef.current;
        break;
      default:
        break;
    }
  };

  return {
    currentFocusRef,
    prevFocusRef,

    calcBodyMergedRefs,
    calcFooterMergedRefs,

    updatePrevFocusRef,

    clearCurrentFocusRef,

    focus,
    focusPrice,
    focusVolume,

    updateSearchInputRef,
    updateQuoteInputCurrentRef,

    getPriceRef,
    getVolumeRef,
    getReturnPointRef,

    getPriceRefs,
    getVolumeRefs,
    getReturnPointRefs,
    getLiqSpeedRefs,
    getLiqSpeedRef,

    bondSearchCbRef
  };
});

export const FocusProvider = FocusContainer.Provider;
export const useFocus = FocusContainer.useContainer;
