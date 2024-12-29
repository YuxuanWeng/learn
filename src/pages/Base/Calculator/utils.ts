import { DateOffsetEnum } from '@fepkg/business/types/date';
import { hasOption } from '@fepkg/business/utils/bond';
import { number2Percent } from '@fepkg/common/utils';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { WindowCategory } from 'app/types/types';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { isFR } from '@/common/utils/bond';
import { PriceType } from './types';

export const getCalculatorWindowConfig = (productType: ProductType) => ({
  name: WindowName.Calculator,
  category: WindowCategory.Basic,
  custom: { route: CommonRoute.Calculator, routePathParams: [productType.toString()] },
  options: { width: 906, height: 392, resizable: false }
});

export const isPriceTypeInvalid = (priceType: PriceType, flag_rebate: boolean, bond?: FiccBondBasic) => {
  switch (priceType) {
    case PriceType.CleanPrice:
    case PriceType.FullPrice:
      return flag_rebate;
    case PriceType.Spread:
      return flag_rebate || (bond && !isFR(bond));
    case PriceType.YieldToExecution:
      return bond && !hasOption(bond);
    default:
      return false;
  }
};

export const toPercent = (n?: number) => {
  if (!n) return void 0;
  return number2Percent(n * 0.01, 4);
};

export const formatResult = (value?: string | number, toFixed = true) => {
  if (!value) return '-';
  if (toFixed && typeof value === 'number') return value.toFixed(4);
  return value;
};

export const getDefaultOffset = (productType: ProductType) => {
  switch (productType) {
    case ProductType.NCD:
      return DateOffsetEnum.PLUS_0;
    case ProductType.BCO:
    case ProductType.BNC:
      return DateOffsetEnum.PLUS_1;
    default:
      return DateOffsetEnum.PLUS_1;
  }
};
