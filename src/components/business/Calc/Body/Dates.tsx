import { forwardRef } from 'react';
import { SizeProps } from '@fepkg/components/types';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { DatesFnParams, QuoteDates, Source } from '@/components/Quote/Dates';
import { useCalcBody } from './CalcBodyProvider';

type DatesProps = SizeProps & {
  /** 触发来源 */
  source?: Source;
  /** 否默认选中 checkbox */
  defaultChecked?: boolean;
  /** 交易日/交割日/结算日变换的回调函数 */
  onDeliveryDateChange?: (v: DatesFnParams) => void;
  settlementBtnCls?: [string, string];
  settlementContainerCls?: string;
  offsetCls?: string;
};
export const Dates = forwardRef<HTMLDivElement, DatesProps>(
  (
    { source, settlementContainerCls, settlementBtnCls, offsetCls, defaultChecked = true, size, onDeliveryDateChange },
    ref
  ) => {
    const { productType, calc, bond, setCalc, handleInnerDeliveryDateChange } = useCalcBody();

    const handleLiqSpeedListChange = useMemoizedFn((val: LiquidationSpeed[]) => {
      setCalc(draft => {
        draft.liquidation_speed_list = val;
      });
    });

    return (
      <QuoteDates
        containerRef={ref}
        size={size}
        source={source}
        defaultChecked={defaultChecked}
        settlementContainerCls={settlementContainerCls}
        settlementBtnCls={settlementBtnCls}
        offsetCls={offsetCls}
        productType={productType}
        defaultLiqSpeedList={calc?.liquidation_speed_list}
        onLiqSpeedListChange={handleLiqSpeedListChange}
        onDeliveryDateChange={val => {
          if (onDeliveryDateChange) onDeliveryDateChange(val);
          else handleInnerDeliveryDateChange(val);
        }}
        delistedDate={bond?.delisted_date}
        listedDate={bond?.listed_date}
      />
    );
  }
);
