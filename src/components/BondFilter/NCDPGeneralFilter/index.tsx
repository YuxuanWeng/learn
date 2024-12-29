import { forwardRef } from 'react';
import { ProductType } from '@fepkg/services/types/enum';
import { DEFAULT_GENERAL_FILTER_VALUE } from '@/common/constants/filter';
import { Filter } from '@/components/Filter';
import {
  NCDP_FR_TYPE_CONFIG,
  NCDP_ISSUER_RATING_CONFIG,
  NCDP_SUBTYPE_CONFIG,
  REMAIN_DAYS_CONFIG_MAP
} from '@/components/Filter/constants/configs';
import { FilterConfig } from '@/components/Filter/types';
import { GeneralFilterInstance, GeneralFilterProps } from '../types';
import { useFilter } from '../useFilter';

export const NCDPGeneralFilter = forwardRef<GeneralFilterInstance, GeneralFilterProps>(({ value, onChange }, ref) => {
  const { onFilterChange } = useFilter({ value, onChange }, ref);

  const NCDFilterList: FilterConfig[] = [
    NCDP_SUBTYPE_CONFIG,
    REMAIN_DAYS_CONFIG_MAP[ProductType.NCDP],
    NCDP_ISSUER_RATING_CONFIG,
    NCDP_FR_TYPE_CONFIG
  ];

  return (
    <Filter
      productType={ProductType.NCDP}
      value={value || DEFAULT_GENERAL_FILTER_VALUE}
      configs={NCDFilterList}
      onChange={val => onFilterChange(val, ProductType.NCDP)}
    />
  );
});
