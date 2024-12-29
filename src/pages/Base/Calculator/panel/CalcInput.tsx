import { useEffect, useMemo } from 'react';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Radio, RadioGroup } from '@fepkg/components/Radio';
import { PriceGroup } from '@/components/business/PriceGroup';
import { QuoteComponent, VolumeUnit } from '@/components/business/Quote';
import { BondSearch } from '@/components/business/Search/BondSearch';
import { useMulCalculateQuery } from '@/pages/Base/Calculator/hooks/useMulCalculateQuery';
import { BondBasic } from '@/pages/Deal/Market/MarketDealForm/components/BondBasic';
import { BenchmarkRE, NotionalRE } from '../common';
import { useCalcState } from '../providers/CalcProvider';
import { PriceType } from '../types';
import { isPriceTypeInvalid } from '../utils';
import { DatePickerWithParse } from './DatePickerWithParse';

export const CalcInput = () => {
  const {
    bond,
    side,
    panelState,
    updatePanelState,
    setCalcResult,
    unit,
    updateUnit,
    priceInfo,
    benchRateQuery,
    onPriceTypeChange,
    onPriceChange,
    onBondChange
  } = useCalcState();

  const disabled = !bond;
  const unitValue = unit?.[side] ?? VolumeUnit.TenMillion;
  const showCurBenchmark = panelState.benchmarkRate === benchRateQuery.data?.benchmark_rate;

  const { data } = useMulCalculateQuery({
    side,
    priceType: panelState.priceType,
    codeMarket: bond?.code_market,
    priceInfo,
    settlementDate: panelState.settlementDate?.valueOf().toString(),
    benchmarkRate: panelState.benchmarkRate ?? undefined,
    notional: panelState.notional ?? undefined,
    onError: () => setCalcResult(undefined)
  });

  useEffect(() => {
    setCalcResult(data?.[0]);
  }, [data, setCalcResult]);

  const priceOptions = useMemo(() => {
    return [
      {
        label: '净价',
        value: PriceType.CleanPrice,
        disabled: isPriceTypeInvalid(PriceType.CleanPrice, !!priceInfo[side]?.flag_rebate, bond)
      },
      {
        label: '全价',
        value: PriceType.FullPrice,
        disabled: isPriceTypeInvalid(PriceType.FullPrice, !!priceInfo[side]?.flag_rebate, bond)
      },
      {
        label: '收益率(%)',
        value: PriceType.Yield,
        disabled: isPriceTypeInvalid(PriceType.Yield, !!priceInfo[side]?.flag_rebate, bond)
      },
      {
        label: '利差(%)',
        value: PriceType.Spread,
        disabled: isPriceTypeInvalid(PriceType.Spread, !!priceInfo[side]?.flag_rebate, bond)
      },
      {
        label: 'YTC/P(%)',
        value: PriceType.YieldToExecution,
        disabled: isPriceTypeInvalid(PriceType.YieldToExecution, !!priceInfo[side]?.flag_rebate, bond)
      }
    ];
  }, [bond, priceInfo, side]);

  const onBenchmarkRateChange = (val: string) => {
    if (val === '') {
      updatePanelState(draft => {
        draft.benchmarkRate = null;
      });
      return;
    }
    let value: string | null = val;
    if (!BenchmarkRE.test(val)) value = panelState.benchmarkRate;
    updatePanelState(draft => {
      draft.benchmarkRate = value;
    });
  };

  const onNotionalChange = (val: string) => {
    if (val !== '' && !NotionalRE.test(val)) {
      return;
    }
    updatePanelState(draft => {
      draft.notional = val;
    });
  };

  const setCurrentBenchmarkRate = () => {
    updatePanelState(draft => {
      draft.benchmarkRate = benchRateQuery.data?.benchmark_rate ?? null;
    });
  };

  return (
    <div className="flex flex-col flex-1 p-3 select-none">
      <div className="flex flex-col gap-2">
        <BondSearch
          autoFocus
          className="bg-gray-800 h-7"
          dropdownCls="!max-h-[264px]"
          onChange={onBondChange}
        />
        <BondBasic labelWidth={72} />
      </div>

      <div className="component-dashed-x my-2" />

      <RadioGroup
        className="flex items-center gap-3 h-7 px-2 rounded-lg border border-solid border-gray-600"
        value={[panelState.priceType]}
        disabled={disabled}
        onChange={onPriceTypeChange}
      >
        {priceOptions.map(type => (
          <Radio
            tabIndex={-1}
            key={type.value}
            disabled={disabled || type.disabled}
            value={type.value}
          >
            {type.label}
          </Radio>
        ))}
      </RadioGroup>

      <div className="mt-2 flex">
        <PriceGroup
          label="价格"
          size="middle"
          mode="calculator"
          side={side}
          disabled={[disabled, disabled]}
          placeholder="请输入"
          suffixPlaceholder={!priceInfo[side]?.flag_rebate ? '--' : void 0}
          outerClassName="!w-full"
          suffixClassName="w-[120px]"
          onChange={onPriceChange}
        />
      </div>

      <div className="flex justify-between items-center gap-3 h-7 px-px rounded-lg mt-2">
        <Input
          className="h-7 w-[244px] bg-gray-800"
          label="基准利率"
          placeholder="请输入"
          disabled={disabled || !panelState.hasBenchmark}
          value={panelState.benchmarkRate}
          onChange={onBenchmarkRateChange}
        />
        <Button
          disabled={disabled || !panelState.hasBenchmark}
          type={panelState.hasBenchmark && showCurBenchmark ? 'green' : 'gray'}
          plain
          className="h-7 w-7 !p-0 text-xs"
          onClick={setCurrentBenchmarkRate}
        >
          当前
        </Button>
        <Input
          className="flex-shrink-0 w-[120px] h-7 bg-gray-600 rounded-lg child:m-0"
          disabled
          placeholder="年-月-日"
          value={panelState.hasBenchmark && showCurBenchmark ? benchRateQuery.data?.latest_index_date : null}
        />
      </div>

      <DatePickerWithParse />

      <div className="mt-2">
        <QuoteComponent.Notional
          disabled={disabled}
          side={side}
          size="sm"
          notional={panelState.notional}
          unit={unitValue}
          onVolumeChange={(_, val) => onNotionalChange(val ?? '')}
          onUnitChange={val => updateUnit(side, val)}
        />
      </div>
    </div>
  );
};
