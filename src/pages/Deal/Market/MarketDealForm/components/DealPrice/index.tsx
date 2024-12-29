import { DateOffsetEnum } from '@fepkg/business/types/date';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { Direction, Side } from '@fepkg/services/types/enum';
import { isPriceEqual } from '@/common/utils/quote-price';
import { HandleChangeValType, PriceGroup, PriceState, usePriceGroup } from '@/components/business/PriceGroup';
import { QuoteComponent, VolumeUnit } from '@/components/business/Quote';
import { checkVolumeValid } from '@/components/business/Quote/utils';
import { useMarketDealFormParams } from '../../hooks/useParams';
import { useFocus } from '../../providers/FocusProvider';
import { useMarketDealForm } from '../../providers/FormProvider';

export const DealPrice = () => {
  const { defaultValue, defaultQuote, copyCount } = useMarketDealFormParams();
  const {
    formState,
    updateFormState,
    defaultPrice,
    unit,
    updateUnit,
    disabledDate,
    dealDateState,
    mutateDealDateState
  } = useMarketDealForm();
  const { priceInfo, handleInnerChange } = usePriceGroup();

  const { priceCbRef } = useFocus();

  const unitValue = unit?.[Side.SideNone] ?? VolumeUnit.TenMillion;

  const handlePriceChange = (val: PriceState) => {
    updateFormState(draft => {
      const newPrice = { ...priceInfo[Side.SideNone], ...val };
      // 如果没有成交单，或没有默认带入的报价 Id，或没有拷贝数量，改变价格不需要有方向改动的逻辑
      if (!(defaultValue?.deal_id || defaultQuote?.quote_id || copyCount)) return;
      // 如果用户手动改价，使价格等于成交价格，则使用默认成交方向
      if (isPriceEqual(newPrice, defaultPrice)) {
        if (draft.direction !== defaultValue?.direction) {
          draft.direction = defaultValue?.direction ?? Direction.DirectionTrd;
        }
      } else if (draft.direction !== Direction.DirectionTrd) {
        // 如果用户手动改价，使价格不等于成交价格，则自动重置成交方向为 TRD
        draft.direction = Direction.DirectionTrd;
      }
    });
  };

  const handleVolumeChange = (val: string) => {
    const [valid, volume] = checkVolumeValid(val);

    if (valid) {
      updateFormState(draft => {
        draft.volume = volume;
      });
    }
  };

  const handleChange = (val: HandleChangeValType) => {
    handleInnerChange(val);
    handlePriceChange(val.data);
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="flex flex-1">
          <PriceGroup
            label="价格"
            size="middle"
            priceClassName="w-[208px]"
            refs={{ priceRefs: priceCbRef }}
            side={Side.SideNone}
            placeholder="请输入"
            onChange={handleChange}
          />
        </div>

        <SettlementDatePicker
          size="sm"
          prefix="交易日"
          className="flex-1"
          offsetClassName="flex-none"
          pickerProps={{ className: 'before:!ml-0' }}
          pickerValue={dealDateState.tradedDate}
          allowClear={false}
          offsetMode="radio-square"
          offsetOptions={[
            { label: '今天', value: DateOffsetEnum.PLUS_0 },
            { label: '明天', value: DateOffsetEnum.PLUS_1 }
          ]}
          offsetValue={dealDateState?.tradedDateOffset}
          disabledDate={disabledDate}
          onPickerChange={date => mutateDealDateState({ type: 'traded-date', date })}
          onOffsetChange={offset => mutateDealDateState({ type: 'traded-date-offset', offset })}
        />
      </div>

      <div className="flex gap-4">
        <QuoteComponent.Notional
          size="sm"
          className="flex-1 !justify-start"
          volumeCls="w-[208px]"
          unitCls="!w-[98px]"
          side={Side.SideNone}
          notional={formState?.volume}
          unit={unitValue}
          onVolumeChange={(_, val) => handleVolumeChange(val ?? '')}
          onUnitChange={val => updateUnit(Side.SideNone, val)}
        />
        <SettlementDatePicker
          size="sm"
          prefix="交割日"
          className="flex-1"
          pickerProps={{ className: 'before:!ml-0' }}
          pickerValue={dealDateState.deliveryDate}
          allowClear={false}
          offsetMode="radio-square"
          offsetOptions={[
            { label: '+0', value: DateOffsetEnum.PLUS_0 },
            { label: '+1', value: DateOffsetEnum.PLUS_1 }
          ]}
          offsetValue={dealDateState?.deliveryDateOffset}
          disabledDate={disabledDate}
          onPickerChange={date => mutateDealDateState({ type: 'delivery-date', date })}
          onOffsetChange={offset => mutateDealDateState({ type: 'delivery-date-offset', offset })}
        />
      </div>
    </>
  );
};
