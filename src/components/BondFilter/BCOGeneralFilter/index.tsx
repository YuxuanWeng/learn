import { forwardRef, useRef } from 'react';
import { Combination } from '@fepkg/components/Combination';
import { Input } from '@fepkg/components/Input';
import { Select } from '@fepkg/components/Select';
import { ProductType, Rating } from '@fepkg/services/types/enum';
import { DEFAULT_GENERAL_FILTER_VALUE } from '@/common/constants/filter';
import { Filter } from '@/components/Filter';
import {
  AREA_LEVEL_CONFIG,
  BCO_BOND_CATEGORY_CONFIG,
  BCO_FR_TYPE_CONFIG,
  BOND_SECTOR_CONFIG,
  CBC_RATING_CONFIG,
  COLLECTION_METHOD_CONFIG,
  HAS_OPTION_CONFIG,
  INSTITUTION_SUBTYPE_CONFIG,
  INST_LISTED_CONFIG,
  ISSUER_RATING_CONFIG,
  LISTED_MARKET_CONFIG,
  MATURITY_CONFIG,
  MKT_TYPE_CONFIG,
  MUNICIPAL_CONFIG,
  PERP_TYPE_CONFIG,
  PLATFORM_CONFIG,
  SUBTYPE_CONFIG,
  WARRANTY_CONFIG
} from '@/components/Filter/constants/configs';
import { FilterConfig } from '@/components/Filter/types';
import { GeneralFilterInstance, GeneralFilterProps } from '../types';
import { useFilter } from '../useFilter';
import { LEVEL, LEVEL_SYMBOL, LEVEL_VALUE_REG } from '../utils';

export const BCOGeneralFilter = forwardRef<GeneralFilterInstance, GeneralFilterProps>(({ value, onChange }, ref) => {
  const { remainDayConfig, onFilterChange } = useFilter({ value, onChange }, ref);

  const inputRef = useRef<HTMLInputElement>(null);

  const BCOFilterList: FilterConfig[] = [
    BCO_BOND_CATEGORY_CONFIG,
    INSTITUTION_SUBTYPE_CONFIG,
    LISTED_MARKET_CONFIG,
    MATURITY_CONFIG,
    BOND_SECTOR_CONFIG,
    SUBTYPE_CONFIG,
    { ...remainDayConfig },
    COLLECTION_METHOD_CONFIG,
    AREA_LEVEL_CONFIG,
    INST_LISTED_CONFIG,
    {
      ...ISSUER_RATING_CONFIG,
      suffix: {
        key: 'subjectRatingQuery',
        render: (
          <Combination
            size="sm"
            containerCls="flex-row-reverse"
            background="prefix700-suffix600"
            prefixNode={
              <Input
                key="subjectRatingQueryInput"
                ref={inputRef}
                className="w-[118px]"
                placeholder="输入评级"
                value={value?.issuer_rating_val}
                onChange={val => {
                  if (!LEVEL_VALUE_REG.test(val)) return;
                  const transformInputValue = val
                    .toUpperCase()
                    .replace('+', LEVEL_SYMBOL['+'])
                    .replace('-', LEVEL_SYMBOL['-']);

                  let impliedRatingList: Rating[];
                  if (value?.rating_type === 'fixLevel') impliedRatingList = [Rating[transformInputValue]];
                  else {
                    const index = Rating[transformInputValue];
                    impliedRatingList = new Array(index).fill(0).map((v, i) => i + 1);
                  }
                  if (!val) impliedRatingList = [];
                  onChange?.({ ...value, implied_rating_list: impliedRatingList, issuer_rating_val: val });
                }}
              />
            }
            suffixNode={
              <Select<'rangeLevel' | 'fixLevel'>
                placement="bottom-start"
                className="flex-shrink-0 w-[118px] rounded-l-sm text-white"
                // dropdownClassName="text-white"
                clearIcon={null}
                destroyOnClose
                value={value?.rating_type}
                onChange={v => {
                  onChange?.({ ...value, issuer_rating_val: '', rating_type: v, implied_rating_list: [] });
                  inputRef.current?.focus();
                }}
                options={LEVEL}
              />
            }
          />
        )
      }
    },
    CBC_RATING_CONFIG,
    MKT_TYPE_CONFIG,
    WARRANTY_CONFIG,
    BCO_FR_TYPE_CONFIG,
    MUNICIPAL_CONFIG,
    HAS_OPTION_CONFIG,
    PERP_TYPE_CONFIG,
    PLATFORM_CONFIG
  ];

  return (
    <Filter
      productType={ProductType.BCO}
      value={value || DEFAULT_GENERAL_FILTER_VALUE}
      configs={BCOFilterList}
      onChange={val => onFilterChange(val, ProductType.BCO)}
    />
  );
});
