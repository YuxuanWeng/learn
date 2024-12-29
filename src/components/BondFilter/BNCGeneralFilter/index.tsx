import { forwardRef } from 'react';
import { ProductType } from '@fepkg/services/types/enum';
import { DEFAULT_GENERAL_FILTER_VALUE } from '@/common/constants/filter';
import { Filter } from '@/components/Filter';
import {
  BNC_BOND_CATEGORY_CONFIG,
  BNC_FR_TYPE_CONFIG,
  BOND_NATURE_CONFIG,
  BOND_SHORTNAME_CONFIG,
  LISTED_MARKET_CONFIG,
  MATURITY_CONFIG,
  MKT_TYPE_CONFIG
} from '@/components/Filter/constants/configs';
import { FilterConfig } from '@/components/Filter/types';
import { GeneralFilterInstance, GeneralFilterProps } from '../types';
import { useFilter } from '../useFilter';
import { transformHasOptionConfig } from '../utils';

export const BNCGeneralFilter = forwardRef<GeneralFilterInstance, GeneralFilterProps>(({ value, onChange }, ref) => {
  const { remainDayConfig, onFilterChange } = useFilter({ value, onChange }, ref);

  const BNCFilterList: FilterConfig[] = [
    BNC_BOND_CATEGORY_CONFIG,
    BOND_SHORTNAME_CONFIG,
    LISTED_MARKET_CONFIG,
    BOND_NATURE_CONFIG,
    MATURITY_CONFIG,
    remainDayConfig,
    BNC_FR_TYPE_CONFIG,
    { ...transformHasOptionConfig() },
    MKT_TYPE_CONFIG
  ];

  return (
    <Filter
      productType={ProductType.BNC}
      value={value || DEFAULT_GENERAL_FILTER_VALUE}
      configs={BNCFilterList}
      onChange={val => onFilterChange(val, ProductType.BNC)}
    />
  );
});
