import { useEffect } from 'react';
import cx from 'classnames';
import { useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { Input } from '@fepkg/components/Input';
import { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useBondQuery } from '@/common/services/hooks/useBondQuery';
import { ExerciseGroup } from '@/components/business/ExerciseGroup';
import { useExercise } from '@/components/business/ExerciseGroup/provider';
import { getPriceType } from '@/components/business/ExerciseGroup/utils';
import { HandleChangeCategory, HandleChangeValType, PriceGroup, usePriceGroup } from '@/components/business/PriceGroup';
import { QuoteComponent, VolumeUnit } from '@/components/business/Quote';
import { checkPriceValid, checkSpreadValid, checkVolumeValid } from '@/components/business/Quote/utils';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMulCalculateQuery } from '@/pages/Base/Calculator/hooks/useMulCalculateQuery';
import { PriceType } from '@/pages/Base/Calculator/types';
import { noExerciseSettlementProductTypeSet } from '../../constants';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealDate } from '../../providers/DateProvider';
import { useFocus } from '../../providers/FocusProvider';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { getPopupContainer } from '../../utils';
import { DiffSettlement } from './DiffSettlement';

const inputProps = {
  className: 'h-7 bg-gray-800'
};

export const DealPrice = () => {
  const { productType } = useProductParams();

  const {
    formDisabled,
    formState,
    formError,
    updateFormState,
    changeFormState,
    calcDisabled,
    setCalcDisabled,
    fullPriceEditing,
    setFullPriceEditing,
    highlyAccurateData,
    updateFormError
  } = useReceiptDealForm();

  const { disabledDate, sideMutation, mutateSideDateState } = useReceiptDealDate();
  const { hasBridge } = useReceiptDealBridge();
  const { bondSearchState } = useBondSearch();
  const { priceInfo } = usePriceGroup();
  const { handleInnerChange } = usePriceGroup();
  const { priceRef } = useFocus();

  const bond = bondSearchState.selected?.original;
  const bondQuery = useBondQuery({ key_market_list: bond?.key_market ? [bond.key_market] : [] });
  const [related] = bondQuery?.data?.related_info_list ?? [];

  const [bidDealDateState] = sideMutation[Side.SideBid];

  const { exerciseBoolean } = useExercise();

  const priceType = getPriceType(exerciseBoolean, priceInfo[Side.SideNone]?.quote_type);

  const handleCalcChange = useMemoizedFn((val?: BaseDataMulCalculate.CalculateResult[]) => {
    const [res] = val ?? [];

    updateFormState(draft => {
      // 如果不是改全价的话，联动修改其他内容
      if (!fullPriceEditing) {
        draft.yield = res?.yield?.toFixed(4) ?? '';
        draft.yieldToExecution = res?.yield_to_execution?.toFixed(4) ?? '';
        draft.spread = res?.spread?.toFixed(4) ?? '';
        draft.cleanPrice = res?.clean_price?.toFixed(4) ?? '';
        draft.fullPrice = res?.full_price?.toFixed(4) ?? '';
      }

      draft.settlementAmount = res?.settlement_amount?.toFixed(4) ?? '';
    });

    highlyAccurateData.current = res;
  });

  const { data } = useMulCalculateQuery({
    disabled: calcDisabled,
    side: Side.SideNone,
    codeMarket: bond?.code_market,
    priceType: fullPriceEditing ? PriceType.FullPrice : priceType,
    priceInfo: fullPriceEditing ? { [Side.SideNone]: { quote_price: formState.fullPrice } } : priceInfo,
    settlementDate: bidDealDateState.deliveryDate,
    benchmarkRate: String(related?.benchmark_rate?.value ?? ''),
    notional: formState.volume,
    onError: () => handleCalcChange(undefined)
  });

  // 计算器内容变动后，更新表单内价格的值，不在 query 的 onSuccess 里是 query 有缓存时，会直接拿缓存里的值，此时不会触发 onSuccess
  useEffect(() => {
    if (!calcDisabled && data) handleCalcChange(data);
  }, [calcDisabled, data, handleCalcChange]);

  const handlePriceChange = (val: HandleChangeValType) => {
    handleInnerChange(val);
    setCalcDisabled(false);
    setFullPriceEditing(false);

    // 如果清空价格，需要一并清空实时计算数值
    if (val.category === HandleChangeCategory.Price && !val.data.quote_price) {
      updateFormState(draft => {
        draft.yield = '';
        draft.spread = '';
        draft.cleanPrice = '';
        draft.fullPrice = '';
        draft.settlementAmount = '';
      });
    }
    updateFormError(draft => {
      draft.quote_price = false;
      draft.return_point = false;
    });
  };

  const handleVolumeChange = (val: string) => {
    const [valid, volume] = checkVolumeValid(val);

    if (valid) {
      updateFormState(draft => {
        draft.volume = volume;
        if (!volume) draft.settlementAmount = '';
      });
      updateFormError(draft => {
        draft.volume = false;
      });
      setCalcDisabled(false);
      setFullPriceEditing(false);
    }
  };

  const handleExerciseChange = () => {
    setCalcDisabled(false);
    setFullPriceEditing(false);
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3 border border-solid border-gray-600 rounded-lg">
      <div className="flex gap-x-6">
        <div className="flex w-[360px] justify-between [&_.s-price-group-price-container]:w-full [&_.s-icon-btn]:!ml-0">
          <PriceGroup
            refs={{ priceRefs: priceRef }}
            label="价格"
            size="middle"
            priceError={formError.quote_price}
            returnPointError={formError.return_point}
            suffixClassName="!w-[118px] [&.s-input-container]:!w-[118px]"
            outerClassName="first:[&_.s-input-container]:!w-[204px]"
            side={Side.SideNone}
            placeholder="请输入"
            disabled={[!!formDisabled, !!formDisabled]}
            onChange={handlePriceChange}
          />
        </div>

        <QuoteComponent.Notional
          className="w-[360px] h-7"
          size="sm"
          side={Side.SideNone}
          error={formError.volume}
          disabled={formDisabled}
          notional={formState.volume}
          unit={VolumeUnit.TenThousand}
          unitRender={
            <Input
              className={cx(
                'flex-shrink-0 w-[100px] ',
                formDisabled ? '!bg-gray-700 !border-gray-600' : '!border-gray-800'
              )}
              padding={[1, 12]}
              value="CNY"
              disabled
            />
          }
          onVolumeChange={(_, val) => handleVolumeChange(val ?? '')}
        />

        {/* 行权/到期 */}
        {!noExerciseSettlementProductTypeSet.has(productType) && (
          <ExerciseGroup
            itemClassName="[&.s-checkbox-wrapper]:!h-7"
            onChange={handleExerciseChange}
          />
        )}

        {/* 错期 */}
        <DiffSettlement />
      </div>

      {!hasBridge && (
        <div className="flex gap-x-6">
          <SettlementDatePicker
            prefix="交易日"
            className="w-[360px]"
            size="sm"
            allowClear={false}
            disabled={formDisabled}
            pickerProps={{ getPopupContainer }}
            pickerValue={bidDealDateState.tradedDate}
            offsetMode="radio-square"
            offsetOptions={[
              { label: '今天', value: DateOffsetEnum.PLUS_0 },
              { label: '明天', value: DateOffsetEnum.PLUS_1 }
            ]}
            offsetValue={bidDealDateState?.tradedDateOffset}
            disabledDate={disabledDate}
            onPickerChange={date => mutateSideDateState(Side.SideBid, { type: 'traded-date', date })}
            onOffsetChange={offset => mutateSideDateState(Side.SideBid, { type: 'traded-date-offset', offset })}
          />

          <SettlementDatePicker
            prefix="交割日"
            className="w-[360px]"
            size="sm"
            allowClear={false}
            disabled={formDisabled}
            pickerProps={{ getPopupContainer }}
            pickerValue={bidDealDateState.deliveryDate}
            offsetMode="radio-square"
            offsetOptions={[
              { label: '+0', value: DateOffsetEnum.PLUS_0 },
              { label: '+1', value: DateOffsetEnum.PLUS_1 }
            ]}
            offsetValue={bidDealDateState?.deliveryDateOffset}
            disabledDate={disabledDate}
            onPickerChange={date => mutateSideDateState(Side.SideBid, { type: 'delivery-date', date })}
            onOffsetChange={offset => mutateSideDateState(Side.SideBid, { type: 'delivery-date-offset', offset })}
          />
        </div>
      )}

      <div className="component-dashed-x h-px" />

      <div className="grid grid-cols-5 gap-6 h-7">
        <Input
          label="到期收益率"
          {...inputProps}
          disabled={formDisabled}
          value={formState.yield}
          onChange={val => {
            const [valid, newPrice] = checkPriceValid(val);
            if (valid) changeFormState('yield', newPrice);
          }}
        />
        <Input
          label="行权收益率"
          {...inputProps}
          disabled={formDisabled}
          value={formState.yieldToExecution}
          onChange={val => {
            const [valid, newPrice] = checkPriceValid(val);
            if (valid) changeFormState('yieldToExecution', newPrice);
          }}
        />
        <Input
          label="利差"
          {...inputProps}
          disabled={formDisabled}
          value={formState.spread}
          onChange={val => {
            const [valid, newPrice] = checkSpreadValid(val);
            if (valid) changeFormState('spread', newPrice);
          }}
        />
        <Input
          label="全价"
          {...inputProps}
          disabled={formDisabled}
          value={formState.fullPrice}
          onChange={val => {
            const [valid, newPrice] = checkPriceValid(val);
            if (valid) {
              setCalcDisabled(false);
              setFullPriceEditing(true);
              updateFormState(draft => {
                draft.fullPrice = newPrice;
                if (!newPrice) draft.settlementAmount = '';
              });
            }

            // 全价为 0 时不进行计算
            if (!parseFloat(val)) setCalcDisabled(true);
          }}
        />
        <Input
          label="净价"
          {...inputProps}
          disabled={formDisabled}
          value={formState.cleanPrice}
          onChange={val => {
            const [valid, newPrice] = checkPriceValid(val);
            if (valid) changeFormState('cleanPrice', newPrice);
          }}
        />
      </div>
    </div>
  );
};
