import { ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import {
  BondAssetOptions,
  BondFinancialCategoryTypeOptions,
  BondInstOptions,
  BondPeriodTypeOptions,
  BondPerpetualTypeOptions,
  InstRatingTypeOptions,
  IsMunicipalTypeOptions,
  IsPlatformTypeOptions,
  IssuerRatingTypeOptions,
  WithWarranterTypeOptions
} from '@fepkg/business/constants/options';
import { Button } from '@fepkg/components/Button';
import { BasicCheckbox, Checkbox } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { Placeholder } from '@fepkg/components/Placeholder';
import { RadioButton, RadioButtonProps } from '@fepkg/components/Radio';
import { radioBtnThemeClsMap } from '@fepkg/components/Radio/constants';
import { Select } from '@fepkg/components/Select';
import { BondRecommendConfig } from '@fepkg/services/types/algo-common';
import {
  BondFinancialCategoryType,
  BondPeriodType,
  RecommendRuleType,
  TimeToMaturityUnit
} from '@fepkg/services/types/algo-enum';
import { isEqual } from 'lodash-es';
import { getYearConfig } from '@/common/utils/date';
import RangeInput from '@/components/RangeInput';
import {
  BondAssetAllOption,
  BondGoodsAllOption,
  BondInstAllOption,
  BondMarketTypeAllOption,
  BondPeriodTypeAllOption,
  BondPerpetualTypeAllOption,
  InstRatingTypeAllOption,
  IsMunicipalTypeAllOption,
  IsPlatformTypeAllOption,
  IssuerRatingTypeAllOption,
  WithWarranterTypeAllOption,
  distrctOptions,
  getBondGoodsOptions,
  getBondMarketTypeOption,
  getEmptyTraderConfig
} from './TraderManagementOptions';
import { getConfigForCheck, useTraderEditingConfig } from './useTraderEditingConfig';

export type TraderManagementConfigProp = {
  savedConfig?: BondRecommendConfig;
  traderID?: string;
  onSaved: VoidFunction;
  onCancel: VoidFunction;
};

type EnumItem<EnumType> = {
  label: string;
  value: EnumType;
  disabled?: boolean;
};

export const OptionTag = forwardRef<HTMLInputElement, RadioButtonProps>(({ disabled, ...restProps }, ref) => {
  const themeCls = radioBtnThemeClsMap.ghost;
  const containerThemeCls = disabled ? themeCls.disabled : themeCls.default;

  return (
    <BasicCheckbox
      type="checkbox"
      ref={ref}
      wrapperCls={(_, checked, indeterminate) =>
        cx(
          'relative h-6 w-18 border border-solid flex-shrink-0',
          checked ? [indeterminate ? `indeterminate` : containerThemeCls.checked] : containerThemeCls.unchecked,
          'rounded-full'
        )
      }
      disabled={disabled}
      {...restProps}
    />
  );
});

// id = -1为全部
// selected为空数组即为“全部”
function RadioGroupByEnum<EnumType extends number>(props: {
  options: EnumItem<EnumType>[];
  selected: EnumType[];
  onChange: (items: EnumType[]) => void;
  allItem: EnumItem<EnumType>;
  isSingle?: boolean;
  disabled?: boolean;
}) {
  const { options, selected, onChange, allItem, isSingle = false, disabled = false } = props;

  const hasOptionDisabled = options.some(o => o.disabled);

  return (
    <div className="flex gap-x-2 gap-y-4">
      {[allItem, ...options].map(o => {
        const isSelected = selected.includes(o.value);

        return (
          <OptionTag
            key={o.value}
            checked={isSelected}
            indeterminate={o === allItem}
            onChange={() => {
              if (o === allItem || isSingle) {
                onChange([o.value]);
                return;
              }

              let result = selected;
              if (isSelected) {
                result = selected.filter(option => option !== o.value);
              } else {
                result = [...selected, o.value];
              }

              const emptyOptions = hasOptionDisabled ? [] : [allItem.value];

              onChange(
                result.length === 0 || (result.length === 1 && result[0] === allItem.value)
                  ? emptyOptions
                  : result.filter(i => i !== allItem.value)
              );
            }}
            disabled={disabled || o.disabled || (o === allItem && options.some(opt => opt.disabled))}
          >
            {o.label}
          </OptionTag>
        );
      })}
    </div>
  );
}

const numReg = /^\d*$/;
const numRegWithDot = /^\d{0,5}(\.\d{0,4})?$/;

const parsePriceToInputText = (price?: number) => {
  if (price == null || price === 0) return '';

  return (price / 10000).toString();
};

const checkRangeNum = (range: [string, string]) => {
  const num1 = Number(range[0]);
  const num2 = Number(range[1]);

  return range[0] === '' || range[1] === '' || (!Number.isNaN(num1) && !Number.isNaN(num2) && num1 < num2);
};

export const TraderManagementConfig = ({ savedConfig, traderID, onSaved, onCancel }: TraderManagementConfigProp) => {
  const [isDeviatePositive, setIsDeviatePositive] = useState(true);

  const [priceRange, setPriceRange] = useState(
    () =>
      [parsePriceToInputText(savedConfig?.min_price), parsePriceToInputText(savedConfig?.max_price)] as [string, string]
  );

  const [periodRange, setPeriodRange] = useState(
    () => [(savedConfig?.min_period || '').toString(), (savedConfig?.max_period || '').toString()] as [string, string]
  );

  const { innerConfig, onSave, setInnerConfig } = useTraderEditingConfig({ savedConfig, traderID, onSaved, onCancel });

  const yearConfig = useMemo(() => getYearConfig(2016), []);

  useEffect(() => {
    setInnerConfig(savedConfig == null ? undefined : { ...savedConfig });
    setIsDeviatePositive(savedConfig?.deviate_price == null ? true : savedConfig?.deviate_price >= 0);
    setPriceRange([parsePriceToInputText(savedConfig?.min_price), parsePriceToInputText(savedConfig?.max_price)]);
    setPeriodRange([(savedConfig?.min_period || '').toString(), (savedConfig?.max_period || '').toString()]);
  }, [savedConfig]);

  const isSaveDisabled = useMemo(() => {
    const innerConfigForCheck = getConfigForCheck(innerConfig);

    return (
      isEqual(getConfigForCheck(savedConfig), innerConfigForCheck) ||
      isEqual(
        innerConfigForCheck,
        getConfigForCheck(getEmptyTraderConfig(innerConfig?.rule_type ?? RecommendRuleType.H))
      )
    );
  }, [savedConfig, innerConfig]);

  const renderLine = (left: string, configComponent: ReactNode, className?: string) => {
    return (
      <div className={cx('flex h-8 mt-2 ml-4 items-center', className)}>
        <div className="w-[100px] text-gray-300 text-[13px]">{left}</div>
        <div className="flex-1 h-auto overflow-hidden">{configComponent}</div>
      </div>
    );
  };

  const isGroupH = !(
    innerConfig?.bond_financial_category_type != null && innerConfig.bond_financial_category_type.length > 0
  );

  const usePeriodEnum =
    innerConfig?.period_type != null &&
    innerConfig?.period_type?.length !== 0 &&
    innerConfig?.period_type[0] !== BondPeriodType.PeriodALL;

  const BondGoodsOptions = getBondGoodsOptions(innerConfig?.is_mortgage === true);
  const BondMarketTypeOption = getBondMarketTypeOption(innerConfig?.is_mortgage === true);

  if (innerConfig == null || traderID == null) return <Placeholder type="no-setting" />;

  return (
    <>
      <div className="pb-4 flex-1 overflow-auto">
        {renderLine(
          '收益率',
          <RangeInput
            className="h-8"
            value={priceRange}
            centerElement="≤ Ofr ≤"
            placeholder1="数值"
            placeholder2="数值"
            onBlur1={() => {
              if (!checkRangeNum(priceRange)) {
                setPriceRange(['', priceRange[1]]);

                setInnerConfig({
                  ...innerConfig,
                  min_price: undefined,
                  max_price: innerConfig.max_price
                });
              }
            }}
            onBlur2={() => {
              if (!checkRangeNum(priceRange)) {
                setPriceRange([priceRange[0], '']);

                setInnerConfig({
                  ...innerConfig,
                  min_price: innerConfig.min_price,
                  max_price: undefined
                });
              }
            }}
            onChange={val => {
              const min = val[0] as string;
              const max = val[1] as string;

              if (numRegWithDot.test(min) && numRegWithDot.test(max)) {
                const minResult =
                  min == null || min === '' || Number.isNaN(Number(min)) ? undefined : Number(min) * 10000;

                const maxResult =
                  max == null || max === '' || Number.isNaN(Number(max)) ? undefined : Number(max) * 10000;

                setPriceRange([min ?? '', max ?? '']);

                setInnerConfig({
                  ...innerConfig,
                  min_price: minResult,
                  max_price: maxResult
                });
              }
            }}
          />
        )}
        {renderLine(
          '偏移估值',
          <div className="h-full bg-gray-750 inline-flex items-center">
            <div className="ml-3 mr-[17px]">Ofr ≥ 估值</div>
            <div className="rounded-full border border-solid border-gray-400 inline-flex">
              <RadioButton
                checked={isDeviatePositive}
                onChange={() => {
                  setIsDeviatePositive(true);

                  if (innerConfig.deviate_price != null && innerConfig.deviate_price < 0) {
                    setInnerConfig({ ...innerConfig, deviate_price: Math.abs(innerConfig.deviate_price) });
                  }
                }}
              >
                +
              </RadioButton>
              <RadioButton
                checked={!isDeviatePositive}
                onChange={() => {
                  setIsDeviatePositive(false);

                  if (innerConfig.deviate_price != null && innerConfig.deviate_price > 0) {
                    setInnerConfig({ ...innerConfig, deviate_price: -Math.abs(innerConfig.deviate_price) });
                  }
                }}
              >
                -
              </RadioButton>
            </div>
            <Input
              className="!w-[120px] ml-3"
              value={(Math.abs(innerConfig.deviate_price ?? 0) || '').toString()}
              onChange={v => {
                if (numReg.test(v)) {
                  setInnerConfig({
                    ...innerConfig,
                    deviate_price: v === '' ? 0 : Math.abs(Number(v)) * (isDeviatePositive ? 1 : -1)
                  });
                }
              }}
            />
            <div className="px-2 flex items-center bg-gray-600 text-gray-300 h-8">BP</div>
          </div>
        )}
        {isGroupH && (
          <>
            {renderLine(
              '产品',
              <RadioGroupByEnum
                options={BondGoodsOptions}
                selected={innerConfig.bond_goods_type ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, bond_goods_type: v });
                }}
                allItem={BondGoodsAllOption}
              />
            )}
            {renderLine(
              '发行',
              <RadioGroupByEnum
                options={BondAssetOptions}
                selected={innerConfig.bond_asset_type ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, bond_asset_type: v });
                }}
                allItem={BondAssetAllOption}
              />
            )}
            {renderLine(
              '企业',
              <RadioGroupByEnum
                options={BondInstOptions}
                selected={innerConfig.bond_inst_type ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, bond_inst_type: v });
                }}
                allItem={BondInstAllOption}
              />
            )}
            {renderLine(
              '交易所',
              <RadioGroupByEnum
                options={BondMarketTypeOption}
                selected={innerConfig.bond_market_type ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, bond_market_type: v });
                }}
                allItem={BondMarketTypeAllOption}
              />
            )}
          </>
        )}
        {renderLine(
          '期限',
          <RadioGroupByEnum
            options={BondPeriodTypeOptions}
            selected={innerConfig.period_type ?? []}
            onChange={v => {
              setInnerConfig({
                ...innerConfig,
                period_type: v,
                min_period: undefined,
                max_period: undefined,
                time_to_maturity_unit: undefined
              });
            }}
            allItem={BondPeriodTypeAllOption}
            disabled={innerConfig.min_period != null || innerConfig.max_period != null}
          />
        )}
        {renderLine(
          '',
          <div className="inline-flex items-center">
            <RangeInput
              disabled={usePeriodEnum}
              value={periodRange}
              centerElement="≤ 自定义 ≤"
              placeholder1="期限"
              placeholder2="期限"
              onBlur1={() => {
                if (!checkRangeNum(periodRange)) {
                  setPeriodRange(['', periodRange[1]]);

                  setInnerConfig({
                    ...innerConfig,
                    min_period: innerConfig.min_period,
                    max_period: undefined
                  });
                }
              }}
              onBlur2={() => {
                if (!checkRangeNum(periodRange)) {
                  setPeriodRange([periodRange[0], '']);

                  setInnerConfig({
                    ...innerConfig,
                    min_period: undefined,
                    max_period: innerConfig.max_period
                  });
                }
              }}
              onChange={val => {
                const min = val[0] as string;
                const max = val[1] as string;

                const reg =
                  innerConfig.time_to_maturity_unit === TimeToMaturityUnit.TimeToMaturityUnitYear ||
                  innerConfig.time_to_maturity_unit == null
                    ? /^\d{0,5}(\.\d{0,1})?$/
                    : /^\d*$/;

                if (reg.test(min) && reg.test(max)) {
                  const minResult = min == null || min === '' || Number.isNaN(Number(min)) ? undefined : Number(min);
                  const maxResult = max == null || max === '' || Number.isNaN(Number(max)) ? undefined : Number(max);

                  setPeriodRange([min ?? '', max ?? '']);

                  setInnerConfig({
                    ...innerConfig,
                    min_period: minResult,
                    max_period: maxResult,
                    period_type: minResult == null && maxResult == null ? [BondPeriodTypeAllOption.value] : []
                  });
                }
              }}
            />
            <div className="rounded-full border border-solid border-gray-400 inline-flex ml-3">
              <RadioButton
                disabled={usePeriodEnum}
                checked={
                  innerConfig.time_to_maturity_unit === TimeToMaturityUnit.TimeToMaturityUnitYear ||
                  innerConfig.time_to_maturity_unit == null
                }
                onChange={() => {
                  const newPeriod = periodRange.map(i => {
                    const num = Number(i);
                    if (i === '' || Number.isNaN(num)) return undefined;

                    return Math.round((num / 365) * 10) / 10;
                  });

                  setInnerConfig({
                    ...innerConfig,
                    time_to_maturity_unit: TimeToMaturityUnit.TimeToMaturityUnitYear,
                    min_period: newPeriod[0],
                    max_period: newPeriod[1]
                  });

                  setPeriodRange(newPeriod.map(p => (p ?? '').toString()) as [string, string]);
                }}
              >
                Y
              </RadioButton>
              <RadioButton
                disabled={usePeriodEnum}
                checked={innerConfig.time_to_maturity_unit === TimeToMaturityUnit.TimeToMaturityUnitDay}
                onChange={() => {
                  const newPeriod = periodRange.map(i => {
                    const num = Number(i);
                    if (i === '' || Number.isNaN(num)) return undefined;

                    return Math.round(num * 365);
                  });

                  setInnerConfig({
                    ...innerConfig,
                    time_to_maturity_unit: TimeToMaturityUnit.TimeToMaturityUnitDay,
                    min_period: newPeriod[0],
                    max_period: newPeriod[1]
                  });

                  setPeriodRange(newPeriod.map(p => (p ?? '').toString()) as [string, string]);
                }}
              >
                D
              </RadioButton>
            </div>
          </div>,
          '!mt-1'
        )}
        {isGroupH && (
          <>
            {renderLine(
              '主体',
              <RadioGroupByEnum
                options={IssuerRatingTypeOptions}
                selected={innerConfig.issuer_rating_type ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, issuer_rating_type: v });
                }}
                allItem={IssuerRatingTypeAllOption}
              />
            )}
            {renderLine(
              '中债资信',
              <RadioGroupByEnum
                options={InstRatingTypeOptions}
                selected={innerConfig.inst_rating_type ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, inst_rating_type: v });
                }}
                allItem={InstRatingTypeAllOption}
              />
            )}
            {renderLine(
              '城投',
              <RadioGroupByEnum
                options={IsMunicipalTypeOptions}
                selected={innerConfig.is_municipal == null ? [] : [innerConfig.is_municipal]}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, is_municipal: v[0] });
                }}
                allItem={IsMunicipalTypeAllOption}
                isSingle
              />
            )}
            {renderLine(
              '平台债',
              <RadioGroupByEnum
                options={IsPlatformTypeOptions}
                selected={
                  innerConfig.is_financing_platform_bond == null ? [] : [innerConfig.is_financing_platform_bond]
                }
                onChange={v => {
                  setInnerConfig({ ...innerConfig, is_financing_platform_bond: v[0] });
                }}
                allItem={IsPlatformTypeAllOption}
                isSingle
              />
            )}
            {renderLine(
              '担保',
              <RadioGroupByEnum
                options={WithWarranterTypeOptions}
                selected={innerConfig.with_warranter == null ? [] : [innerConfig.with_warranter]}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, with_warranter: v[0] });
                }}
                allItem={WithWarranterTypeAllOption}
                isSingle
              />
            )}
            {renderLine(
              '永续债',
              <RadioGroupByEnum
                options={BondPerpetualTypeOptions}
                selected={innerConfig.is_perpetual_bond ?? []}
                onChange={v => {
                  setInnerConfig({ ...innerConfig, is_perpetual_bond: v });
                }}
                allItem={BondPerpetualTypeAllOption}
              />
            )}
            {renderLine(
              '',
              <div>
                <Checkbox
                  className="mr-3"
                  checked={innerConfig.is_gn === true}
                  onChange={v => setInnerConfig({ ...innerConfig, is_gn: v })}
                >
                  GN
                </Checkbox>
                <Checkbox
                  className="mr-3"
                  checked={innerConfig.is_not_option === true}
                  onChange={v => setInnerConfig({ ...innerConfig, is_not_option: v })}
                >
                  非含权
                </Checkbox>
                <Checkbox
                  checked={innerConfig.is_mortgage === true}
                  onChange={v => {
                    const resetBondGoods =
                      innerConfig.bond_goods_type == null || innerConfig.bond_goods_type.length === 0
                        ? [BondGoodsAllOption.value]
                        : innerConfig.bond_goods_type;

                    const resetBondMarket =
                      innerConfig.bond_market_type == null || innerConfig.bond_market_type.length === 0
                        ? [BondMarketTypeAllOption.value]
                        : innerConfig.bond_market_type;

                    setInnerConfig({
                      ...innerConfig,
                      is_mortgage: v,
                      bond_goods_type: v
                        ? innerConfig.bond_goods_type?.filter(
                            t =>
                              getBondGoodsOptions(v).some(o => o.value === t && !o.disabled) &&
                              t !== BondGoodsAllOption.value
                          )
                        : resetBondGoods,
                      bond_market_type: v
                        ? innerConfig.bond_market_type?.filter(
                            t =>
                              getBondMarketTypeOption(v).some(o => o.value === t && !o.disabled) &&
                              t !== BondMarketTypeAllOption.value
                          )
                        : resetBondMarket
                    });
                  }}
                >
                  可质押
                </Checkbox>
              </div>
            )}
            {renderLine(
              '年份',
              <Select
                className="w-[240px]"
                multiple
                value={innerConfig.issue_year ?? []}
                onChange={v =>
                  setInnerConfig({
                    ...innerConfig,
                    issue_year: v
                  })
                }
                options={yearConfig}
              />
            )}
            {renderLine(
              '地区',
              <Select
                className="w-[240px]"
                multiple
                value={
                  innerConfig.province_code_list == null ||
                  (innerConfig.province_code_list.length === 1 && innerConfig.province_code_list[0] === '全部')
                    ? []
                    : innerConfig.province_code_list
                }
                onChange={v =>
                  setInnerConfig({
                    ...innerConfig,
                    province_code_list: v.length === 0 ? ['全部'] : v
                  })
                }
                options={distrctOptions}
              />
            )}
          </>
        )}
        {!isGroupH &&
          renderLine(
            '分类',
            <Select
              className="w-[240px]"
              multiple
              value={
                innerConfig.bond_financial_category_type == null ||
                (innerConfig.bond_financial_category_type.length === 1 &&
                  innerConfig.bond_financial_category_type[0] === BondFinancialCategoryType.BondFinancialCategoryAll)
                  ? []
                  : innerConfig.bond_financial_category_type
              }
              onChange={v =>
                setInnerConfig({
                  ...innerConfig,
                  bond_financial_category_type:
                    v.length === 0 ? [BondFinancialCategoryType.BondFinancialCategoryAll] : v
                })
              }
              options={BondFinancialCategoryTypeOptions}
            />
          )}
      </div>
      <div className="bg-gray-800 flex justify-end h-14 items-center px-6">
        <Button
          type="primary"
          onClick={onSave}
          disabled={isSaveDisabled}
        >
          保存
        </Button>
        <Button
          className="ml-3"
          onClick={() => {
            setInnerConfig(
              savedConfig == null
                ? undefined
                : {
                    ...getEmptyTraderConfig(savedConfig.rule_type ?? RecommendRuleType.H),
                    id: savedConfig.id,
                    name: savedConfig.name
                  }
            );

            setIsDeviatePositive(true);
            setPriceRange(['', '']);
            setPeriodRange(['', '']);
          }}
        >
          重置
        </Button>
      </div>
    </>
  );
};
