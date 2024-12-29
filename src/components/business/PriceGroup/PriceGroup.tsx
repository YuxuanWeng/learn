import { useMemo, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Combination } from '@fepkg/components/Combination';
import { Size } from '@fepkg/components/types';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { QuoteComponent } from '@/components/business/Quote';
import { usePriceGroup } from './PriceGroupProvider';
import F, { FInstance } from './components/F';
import { QuoteTypeSelector } from './components/QuoteTypeSelector';
import { HandleChangeCategory, PriceGroupProps, PriceState } from './types';

const AntDSizeMap: Record<Exclude<SizeType, undefined>, Size> = { small: 'xs', middle: 'sm', large: 'md' };
const heightMap = {
  large: 'h-8',
  middle: 'h-7',
  small: 'h-6'
};

export const PriceGroup = (props: PriceGroupProps) => {
  const {
    side,
    label = '价格',
    mode = 'quote',
    placeholder,
    suffixPlaceholder,
    onKeyDowns,
    onFocus,
    onBlurs,
    disabled,
    refs,
    size = 'middle',
    onChange,
    intention,
    outerClassName,
    suffixClassName,
    priceClassName,
    priceError,
    returnPointError
  } = props;

  const {
    getPriceRef,
    priceInfo,
    handleInnerFClick,
    handleInnerPriceChange,
    handleInnerQuoteTypeSelected,
    handleInnerReturnPointChange
  } = usePriceGroup();

  const { priceRef, returnPointRef } = getPriceRef(side);

  const mergedPriceRefs = useMemo(() => mergeRefs([refs?.priceRefs ?? null, priceRef]), [refs?.priceRefs, priceRef]);
  const mergedReturnPointRefs = useMemo(
    () => mergeRefs([refs?.returnPointRefs ?? null, returnPointRef]),
    [refs?.returnPointRefs, returnPointRef]
  );

  const { quote_price, flag_rebate, return_point, quote_type } = priceInfo[side] as PriceState;

  const fRef = useRef<FInstance>(null);

  const priceDisabled = disabled?.[0];
  const fDisabled = disabled?.[1] || quote_type !== BondQuoteType.Yield;

  const handlePriceChange = (s: Side, v?: string) => {
    if (priceDisabled) return;
    if (onChange) onChange({ side: s, category: HandleChangeCategory.Price, data: { quote_price: v } });
    else handleInnerPriceChange(s, v, intention);
  };

  const handleQuoteTypeSelected = (quoteType: BondQuoteType) => {
    if (priceDisabled) return;
    if (onChange) onChange({ side, category: HandleChangeCategory.QuoteType, data: { quote_type: quoteType } });
    else handleInnerQuoteTypeSelected(side, quoteType, intention);

    // 切换类型后，聚焦价格输入框
    requestIdleCallback(() => {
      priceRef.current?.select?.();
    });
  };

  const handleReturnPointChange = (s: Side, returnPoint?: string) => {
    if (priceDisabled) return;
    if (onChange) onChange({ side, category: HandleChangeCategory.ReturnPoint, data: { return_point: returnPoint } });
    else handleInnerReturnPointChange(s, returnPoint);
  };

  const handleClickF = (val: boolean) => {
    if (fDisabled) return;
    if (val) {
      requestIdleCallback(() => {
        returnPointRef.current?.focus?.();
      });
    } else {
      priceRef.current?.focus?.();
    }
    if (onChange) onChange({ side, category: HandleChangeCategory.F, data: { flag_rebate: val } });
    else handleInnerFClick(side, val, intention);
  };

  // 这个在计算器里不会用到，不用兼容计算器里的样式
  const selector = (
    <QuoteTypeSelector
      className={cx('w-[98px]', suffixClassName)}
      size={size}
      disabled={priceDisabled}
      value={quote_type}
      onChange={handleQuoteTypeSelected}
    />
  );

  const returnPoint = (
    <QuoteComponent.ReturnPoint
      ref={mergedReturnPointRefs}
      className={cx(
        mode === 'quote' ? 'bg-gray-600 w-[98px]' : 'bg-gray-800',
        mode === 'calculator' && priceDisabled && 'child:text-gray-300',
        heightMap[size],
        suffixClassName
      )}
      side={side}
      error={returnPointError}
      padding={size === 'small' ? [0, 11] : void 0}
      disabled={mode === 'calculator' ? !flag_rebate : priceDisabled}
      placeholder={suffixPlaceholder}
      value={return_point === `${SERVER_NIL}` ? undefined : return_point}
      onChange={handleReturnPointChange}
      onKeyDown={onKeyDowns?.onReturnPointKeyDown}
      onFPress={() => {
        fRef.current?.clickF?.();
      }}
      onFocus={onFocus?.onReturnPointFocus}
      onBlur={onBlurs?.onReturnPointBlur}
    />
  );

  const FButton = (
    <F
      ref={fRef}
      size={size}
      className={cx('flex-shrink-0 !rounded-lg', mode === 'quote' && 'ml-2')}
      disabled={fDisabled}
      checked={!!flag_rebate}
      onClick={handleClickF}
    />
  );

  const Price = (
    <QuoteComponent.Price
      ref={mergedPriceRefs}
      error={priceError}
      className={cx('bg-gray-800', mode === 'quote' ? 'w-[194px]' : 'w-[244px]', heightMap[size], priceClassName)}
      label={label}
      placeholder={placeholder}
      disabled={priceDisabled}
      padding={size === 'small' ? [0, 11] : void 0}
      side={side}
      value={quote_price === `${SERVER_NIL}` ? undefined : quote_price}
      intention={intention}
      onChange={handlePriceChange}
      onKeyDown={onKeyDowns?.onPriceKeyDown}
      onFocus={onFocus?.onPriceFocus}
      onBlur={onBlurs?.onPriceBlur}
      onFPress={() => {
        fRef.current?.clickF?.();
      }}
    />
  );

  if (mode === 'quote') {
    return (
      <>
        <Combination
          containerCls={cx('bg-gray-800', outerClassName)}
          disabled={priceDisabled}
          prefixNode={Price}
          size={AntDSizeMap[size]}
          suffixNode={flag_rebate ? returnPoint : selector}
        />
        {FButton}
      </>
    );
  }

  return (
    <div
      className={cx(
        's-price-group-price-container rounded-lg flex items-center p-px gap-3',
        heightMap[size],
        outerClassName
      )}
    >
      {Price}
      {FButton}
      {returnPoint}
    </div>
  );
};
