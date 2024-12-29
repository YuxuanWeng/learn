import { FC, KeyboardEvent, useLayoutEffect, useMemo } from 'react';
import cx from 'classnames';
import { SideMap } from '@fepkg/business/constants/map';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Combination } from '@fepkg/components/Combination';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { HandleChangeCategory, HandleChangeValType, PriceGroup, usePriceGroup } from '@/components/business/PriceGroup';
import { QuoteComponent, VolumeUnit } from '@/components/business/Quote';
import { IntentionIconMap } from '../constants';
import { useFocus } from '../providers/FocusProvider';
import { QuoteOperInputCategory } from '../types';
import Flags from './Flags';
import { LiqSpeedGroup } from './LiqSpeedGroup';
import { useQuoteOper } from './QuoteOperProvider';
import styles from './index.module.less';

const QuoteOper: FC<{ side: Side; disabled?: boolean }> = props => {
  const { side, disabled: panelDisabled } = props;
  const {
    unit,
    volume,
    disabled,
    showParseLiqSpeed,
    patchCalc,
    updateUnit,
    updateVolume,
    handlePriceChange,
    updateQuoteFlags,
    setCurrentOpenCalcSide,
    setGetSideIsFocusingFn
  } = useQuoteOper();

  const { priceInfo, handleInnerChange } = usePriceGroup();

  const {
    getPriceRef,
    getVolumeRef,
    getReturnPointRef,
    updateQuoteInputCurrentRef,
    clearCurrentFocusRef,
    getPriceRefs,
    getVolumeRefs,
    getReturnPointRefs,
    updatePrevFocusRef
  } = useFocus();

  const handleUnitChange = (val: VolumeUnit) => {
    updateUnit(side, val);
  };

  let unitValue = side === Side.SideBid ? unit?.[Side.SideBid] : unit?.[Side.SideOfr];
  if (unitValue == void 0) unitValue = VolumeUnit.TenMillion;

  const fDisabled = !priceInfo[side]?.quote_type ? false : priceInfo[side]?.quote_type !== BondQuoteType.Yield;
  const quoteOperDisabled = panelDisabled || disabled[side];

  const priceRef = getPriceRef(side);
  const volumeRef = getVolumeRef(side);
  const returnPointRef = getReturnPointRef(side);

  const priceRefs = getPriceRefs(side);
  const volumeRefs = getVolumeRefs(side);
  const returnPointRefs = getReturnPointRefs(side);

  const getIsFocusing = useMemoizedFn(() => {
    return (
      !!priceRef.current?.isFocusing?.() ||
      !!returnPointRef.current?.isFocusing?.() ||
      !!volumeRef.current?.isFocusing?.()
    );
  });

  useLayoutEffect(() => {
    // 注册获取焦点的函数
    setGetSideIsFocusingFn(draft => {
      draft[side] = getIsFocusing;
    });
  }, [side, getIsFocusing, setGetSideIsFocusingFn]);

  /** 打开备注面板 */
  const openCalc = () => {
    if (panelDisabled) return;
    setCurrentOpenCalcSide(side);
    updatePrevFocusRef();
  };

  const handleQuoteTypeSelected = (s: Side, val: BondQuoteType) => {
    priceRef.current?.focus?.();
    if (val !== BondQuoteType.Yield) updateQuoteFlags(s, { flag_intention: false });
    if (val === BondQuoteType.CleanPrice) patchCalc(s, { is_exercise: false, exercise_manual: false });
  };

  const handleFClick = (s: Side, flag_rebate?: boolean) => {
    if (flag_rebate) updateQuoteFlags(s, { flag_intention: false });
  };

  const handleChange = (val: HandleChangeValType) => {
    /** 修改价格 */
    if (val.category === HandleChangeCategory.Price) handlePriceChange(val.side, val.data.quote_price);

    /** 修改报价类型 */
    if (val.category === HandleChangeCategory.QuoteType)
      handleQuoteTypeSelected(val.side, val.data.quote_type || BondQuoteType.Yield);

    /** F点击 */
    if (val.category === HandleChangeCategory.F) handleFClick(val.side, val.data.flag_rebate);

    handleInnerChange({ ...val, data: { ...val.data, intention: IntentionIconMap[side] } });
  };

  const getFocusFns = () => {
    return {
      onPriceFocus: () => {
        updateQuoteInputCurrentRef(
          side === Side.SideBid ? QuoteOperInputCategory.BirPrice : QuoteOperInputCategory.OfrPrice
        );
      },
      onReturnPointFocus: () => {
        updateQuoteInputCurrentRef(
          side === Side.SideBid ? QuoteOperInputCategory.BidReturnPoint : QuoteOperInputCategory.OfrReturnPoint
        );
      }
    };
  };

  const handleInputKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === KeyboardKeys.Space) openCalc();
  };

  const refs = { priceRefs, returnPointRefs };

  const intention = useMemo(() => {
    if (side === Side.SideBid) return 'BID';
    if (side === Side.SideOfr) return 'OFR';
    return undefined;
  }, [side]);

  return (
    <div className={cx('flex flex-col gap-2 flex-1', styles['quote-oper'])}>
      <Flags
        disabled={quoteOperDisabled}
        side={side}
      />
      <div className="component-dashed-x" />

      <div className="flex flex-col gap-1">
        <div className="flex">
          {/* 价格 */}
          <PriceGroup
            side={side}
            outerClassName="!w-[276px]"
            suffixClassName="!w-[92px] flex-shrink-0"
            label={SideMap[side].upperCase}
            refs={refs}
            onBlurs={{
              onPriceBlur: clearCurrentFocusRef,
              onReturnPointBlur: clearCurrentFocusRef
            }}
            onChange={handleChange}
            onFocus={getFocusFns()}
            onKeyDowns={{
              onPriceKeyDown: handleInputKeyDown,
              onReturnPointKeyDown: handleInputKeyDown
            }}
            disabled={[quoteOperDisabled, fDisabled || quoteOperDisabled]}
            intention={intention}
          />
        </div>

        <div className="flex">
          {/* 报价量 */}
          <Combination
            size="sm"
            disabled={quoteOperDisabled}
            containerCls="!w-[276px]"
            prefixNode={
              <QuoteComponent.Volume
                ref={volumeRefs}
                className="bg-gray-800 rounded-r-none !w-[184px]"
                side={side}
                defaultUnit={unitValue}
                disabled={quoteOperDisabled}
                value={volume[side]}
                onChange={updateVolume}
                onKeyDown={handleInputKeyDown}
                onFocus={() => {
                  updateQuoteInputCurrentRef(
                    side === Side.SideBid ? QuoteOperInputCategory.BidVolume : QuoteOperInputCategory.OfrVolume
                  );
                }}
                onBlur={clearCurrentFocusRef}
              />
            }
            suffixNode={
              <QuoteComponent.Unit
                disabled={quoteOperDisabled}
                size="sm"
                label=""
                value={unitValue}
                onChange={handleUnitChange}
                className="!w-[92px]"
              />
            }
          />
        </div>

        {/* 结算方式识别 */}
        {showParseLiqSpeed && (
          <LiqSpeedGroup
            disabled={quoteOperDisabled}
            side={side}
          />
        )}
      </div>
    </div>
  );
};

export default QuoteOper;
