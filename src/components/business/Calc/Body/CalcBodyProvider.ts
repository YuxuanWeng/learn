import { DateOffsetEnum } from '@fepkg/business/types/date';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { LiquidationSpeedTag, ProductType } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { DatesFnParams } from '@/components/Quote/Dates';
import { CalcType } from '../types';

type CalcBodyYield = 'liquidation_speed_list' | 'traded_date' | 'settlement_date' | 'delivery_date';

type InitialState = {
  /** 产品类型 */
  productType: ProductType;
  /** 备注计算面板默认值 */
  defaultValue?: Pick<CalcType, CalcBodyYield>;
  /** 债券信息 */
  bond?: FiccBondBasic;
};

const defaultValue = {
  liquidation_speed_list: [{ tag: LiquidationSpeedTag.Default, offset: DateOffsetEnum.PLUS_0 }],
  traded_date: '',
  settlement_date: '',
  delivery_date: ''
};

const CalcBodyContainer = createContainer((initialState?: InitialState) => {
  const [calc, setCalc] = useImmer<CalcType>(initialState?.defaultValue || defaultValue);

  const handleInnerDeliveryDateChange = (v: DatesFnParams) => {
    setCalc(draft => {
      draft.delivery_date = v.delivery_date;
      draft.settlement_date = v.settlement_date;
      draft.traded_date = v.traded_date;
    });
  };

  return {
    productType: initialState?.productType || ProductType.BCO,
    calc,
    setCalc,
    bond: initialState?.bond,
    handleInnerDeliveryDateChange
  };
});

export const CalcBodyProvider = CalcBodyContainer.Provider;
export const useCalcBody = CalcBodyContainer.useContainer;
