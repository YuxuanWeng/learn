import { forwardRef } from 'react';
import { ProductType } from '@fepkg/services/types/enum';
import { DEFAULT_GENERAL_FILTER_VALUE } from '@/common/constants/filter';
import { Filter } from '@/components/Filter';
import {
  CBC_RATING_CONFIG,
  MATURITY_CONFIG,
  NCD_FR_TYPE_CONFIG,
  NCD_ISSUER_RATING_CONFIG,
  NCD_SUBTYPE_CONFIG
} from '@/components/Filter/constants/configs';
import { FilterConfig } from '@/components/Filter/types';
import { GeneralFilterInstance, GeneralFilterProps } from '../types';
import { useFilter } from '../useFilter';

export const NCDGeneralFilter = forwardRef<GeneralFilterInstance, GeneralFilterProps>(({ value, onChange }, ref) => {
  const { remainDayConfig, onFilterChange } = useFilter({ value, onChange }, ref);

  const NCDFilterList: FilterConfig[] = [
    NCD_SUBTYPE_CONFIG,
    remainDayConfig,
    NCD_FR_TYPE_CONFIG,
    NCD_ISSUER_RATING_CONFIG,
    CBC_RATING_CONFIG,
    MATURITY_CONFIG
  ];

  return (
    <Filter
      productType={ProductType.NCD}
      value={value || DEFAULT_GENERAL_FILTER_VALUE}
      configs={NCDFilterList}
      onChange={val => onFilterChange(val, ProductType.NCD)}
    />
  );
});
