import { forwardRef, useRef } from 'react';
import cx from 'classnames';
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
  GROUP_CBC_RATING_CONFIG,
  GROUP_NCD_ISSUER_RATING_CONFIG,
  HAS_OPTION_CONFIG,
  INSTITUTION_SUBTYPE_CONFIG,
  INST_LISTED_CONFIG,
  ISSUER_RATING_CONFIG,
  LISTED_MARKET_CONFIG,
  MATURITY_CONFIG,
  MKT_TYPE_CONFIG,
  MUNICIPAL_CONFIG,
  NCD_FR_TYPE_CONFIG,
  NCD_SUBTYPE_CONFIG,
  PERP_TYPE_CONFIG,
  PLATFORM_CONFIG,
  SUBTYPE_CONFIG,
  WARRANTY_CONFIG
} from '@/components/Filter/constants/configs';
import { FilterConfig } from '@/components/Filter/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { GeneralFilterInstance, GeneralFilterProps, RemainDaysType } from '../types';
import { useFilter } from '../useFilter';
import { LEVEL, LEVEL_SYMBOL, LEVEL_VALUE_REG } from '../utils';

const remainDaysOptionsCls = {
  [RemainDaysType.Season]: '!w-[240px]',
  [RemainDaysType.Month]: '!w-[210px]',
  [RemainDaysType.Term]: '!w-[204px]'
};

export const GroupGeneralFilter = forwardRef<GeneralFilterInstance, GeneralFilterProps>(({ value, onChange }, ref) => {
  const { productType } = useProductParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const inputCls = cx(
    '!h-7 flex-shrink-0',
    remainDaysOptionsCls[value?.remain_days_options_type ?? RemainDaysType.Season]
  );
  const { remainDayConfig, onFilterChange } = useFilter({ value, onChange, inputCls, isAdvanceGroup: true }, ref);

  const NCDFilterList: FilterConfig[] = [
    {
      ...NCD_SUBTYPE_CONFIG,
      clearInnerPadding: true,
      indeterminateProps: { className: '!w-[40px]' },
      options: NCD_SUBTYPE_CONFIG.options.map(v => ({ ...v, className: '!w-[48px] !px-0' }))
    },

    {
      ...NCD_FR_TYPE_CONFIG,
      clearInnerPadding: true,
      indeterminateProps: { className: '!w-[40px]' },
      options: NCD_FR_TYPE_CONFIG.options.map(v => ({ ...v, className: '!w-[50px] !px-0' }))
    },

    remainDayConfig,
    {
      ...GROUP_NCD_ISSUER_RATING_CONFIG,
      options: GROUP_NCD_ISSUER_RATING_CONFIG.options.map(v => ({ ...v, className: '!w-[55px] !px-0' }))
    },
    {
      ...MATURITY_CONFIG,
      clearInnerPadding: true,
      indeterminateProps: { className: '!w-[41px]' },
      options: MATURITY_CONFIG.options.map(v => ({ ...v, className: '!w-[61px] !px-0' }))
    },

    {
      ...GROUP_CBC_RATING_CONFIG,
      options: GROUP_CBC_RATING_CONFIG.options.map(v => ({ ...v, className: '!w-[55px] !px-0' }))
    }
  ];

  const BCOFilterList: FilterConfig[] = [
    {
      ...BCO_BOND_CATEGORY_CONFIG,
      options: BCO_BOND_CATEGORY_CONFIG.options.map(v => ({ ...v, className: '!px-1' }))
    },
    {
      ...LISTED_MARKET_CONFIG,
      options: LISTED_MARKET_CONFIG.options.map(v => ({ ...v, className: '!w-[58px] !px-0' }))
    },
    {
      ...INSTITUTION_SUBTYPE_CONFIG,
      options: INSTITUTION_SUBTYPE_CONFIG.options.map(v => ({ ...v, className: '!px-[6.5px]' }))
    },
    { ...MATURITY_CONFIG, row: { ...MATURITY_CONFIG.row, [ProductType.ProductTypeNone]: 2 } },
    BOND_SECTOR_CONFIG,
    MUNICIPAL_CONFIG,
    SUBTYPE_CONFIG,
    COLLECTION_METHOD_CONFIG,
    AREA_LEVEL_CONFIG,
    INST_LISTED_CONFIG,
    MKT_TYPE_CONFIG,
    {
      ...remainDayConfig,
      row: { ...MATURITY_CONFIG.row, [ProductType.ProductTypeNone]: 5 },
      options: remainDayConfig.options.map(v => ({ ...v, className: '!w-[51px] !px-0' }))
    },
    WARRANTY_CONFIG,
    PLATFORM_CONFIG,
    {
      ...BCO_FR_TYPE_CONFIG,
      options: BCO_FR_TYPE_CONFIG.options.map(v => ({ ...v, className: '!px-[6px]' }))
    },

    {
      ...ISSUER_RATING_CONFIG,
      options: ISSUER_RATING_CONFIG.options.map(v => ({ ...v, className: '!px-[5px]' })),
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
                className="w-[110px]"
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

    { ...CBC_RATING_CONFIG, options: CBC_RATING_CONFIG.options.map(v => ({ ...v, className: '!px-[6px]' })) },

    { ...PERP_TYPE_CONFIG, options: PERP_TYPE_CONFIG.options.map(v => ({ ...v, className: '!px-[6px]' })) },
    { ...HAS_OPTION_CONFIG, options: HAS_OPTION_CONFIG.options.map(v => ({ ...v, className: '!px-1' })) }
  ];

  const getConfigs = () => {
    switch (productType) {
      case ProductType.BCO:
        return BCOFilterList;
      case ProductType.NCD:
        return NCDFilterList;
      default:
        return [];
    }
  };

  const configs = getConfigs();
  return (
    <Filter
      className={productType === ProductType.BCO ? '!h-6' : ''}
      productType={ProductType.ProductTypeNone}
      value={value || DEFAULT_GENERAL_FILTER_VALUE}
      configs={configs}
      onChange={val => onFilterChange(val, ProductType.ProductTypeNone)}
    />
  );
});
