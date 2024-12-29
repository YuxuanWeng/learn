import { IssuerLite } from '@fepkg/services/types/common';
import { NcdSubtype, PerpType, ProductType } from '@fepkg/services/types/enum';
import { groupBy, isEqual, uniq } from 'lodash-es';
import moment, { Moment } from 'moment';
import { IssuerCode, IssuerMapToBankType } from '@/common/services/hooks/useIssuerInstQuery';
import { HAS_OPTION_CONFIG } from '@/components/Filter/constants/configs';
import { FilterConfigOption } from '@/components/Filter/types';
import { RangeInputValue } from '@/components/RangeInput';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { DefaultOptionKeys, OptionsKeys } from './QuickFilter/types';
import { GeneralFilterValue } from './types';

type ILevelType = { key: string; label: string; value: 'rangeLevel' | 'fixLevel' }[];
export const LEVEL: ILevelType = [
  { key: '1', label: '评级范围≥', value: 'rangeLevel' },
  { key: '2', label: '固定评级', value: 'fixLevel' }
];
export const LEVEL_SYMBOL = { '+': 'Plus', '-': 'Minus' };
export const LEVEL_VALUE_REG = /^[Aa]{0,3}[+|-]?$/;

export const getPlaceholder = (value?: GeneralFilterValue) => {
  const remain_days_type = value?.remain_days_type ?? 'string';
  const isEmpty = !!((value?.remain_days_range || []) as object[]).filter(item => !!item).length;
  if (remain_days_type === 'string' && !isEmpty) return '数字';
  if (remain_days_type === 'date' && !isEmpty) return '日期';
  return '';
};

export const getRemainDaysValues = <T>(value?: GeneralFilterValue): T => {
  const d = value?.remain_days_range;
  if (value?.remain_days_type === 'date') {
    if (!d?.length) return [null, null] as unknown as T;
    let date1: Moment | null | string = d[0];
    let date2: Moment | null | string = d[1];
    if (!d[0]) date1 = null;
    if (!d[1]) date2 = null;
    if (d[0] && typeof d[0] === 'string') date1 = moment(d[0]).isValid() ? moment(d[0]) : '';
    if (d[1] && typeof d[1] === 'string') date2 = moment(d[1]).isValid() ? moment(d[1]) : '';
    return [date1, date2] as unknown as T;
  }
  if (!d?.length) return ['', ''] as unknown as T;
  return d as unknown as T;
};

/** 特殊处理含权&非含权逻辑 */
export const transformHasOptionConfig = () => {
  const newOptions = { ...HAS_OPTION_CONFIG };
  const options: FilterConfigOption<boolean | PerpType>[] = [];
  for (let i = 0; i < newOptions.options.length; i += 1) {
    options.push(newOptions.options[i] as FilterConfigOption<boolean | PerpType>);

    if (i === 0) options.push({ label: '永续', value: PerpType.PerpSub });
  }
  return { ...newOptions, options };
};

/** 统一格式的筛选日期 */
export const getRemainDaysRange = (data?: GeneralFilterValue): RangeInputValue | undefined => {
  if (data?.remain_days_type === 'string') return data.remain_days_range;
  if (isEqual(data?.remain_days_range, ['', ''])) return [null, null];
  return data?.remain_days_range?.map(v => (v ? moment(v) : v)) as RangeInputValue;
};

export const getQuicklyOptionKeys = (
  productType: ProductType,
  activeTableKey: ProductPanelTableKey,
  isAdvance?: boolean
) => {
  /** 是否展示偏移 */
  const hasOffset = activeTableKey !== ProductPanelTableKey.Deal;
  /** 是否展示对价 */
  const hasConsideration =
    activeTableKey === ProductPanelTableKey.Optimal || activeTableKey === ProductPanelTableKey.Bond;

  // NCD一级
  if (productType === ProductType.NCDP) return new Set([OptionsKeys.IntelligenceSorting, OptionsKeys.Yield]);

  // NCD二级
  if (productType === ProductType.NCD) {
    if (isAdvance) return new Set([OptionsKeys.CustomSorting, OptionsKeys.Offset, OptionsKeys.Yield]);
    const ncdOptionKeys = [
      OptionsKeys.CustomSorting,
      OptionsKeys.Yield,
      OptionsKeys.CouponRate,
      OptionsKeys.NewListed,
      OptionsKeys.ValModifiedDuration
    ];

    if (hasConsideration) ncdOptionKeys.push(OptionsKeys.Consideration);
    if (hasOffset) ncdOptionKeys.push(OptionsKeys.Offset);

    return new Set(ncdOptionKeys);
  }

  // 信用/利率
  const optionKeys = [
    ...DefaultOptionKeys,
    ...(hasOffset ? [OptionsKeys.Offset] : []),
    ...(hasConsideration ? [OptionsKeys.Consideration] : [])
  ];

  return new Set(optionKeys);
};

const getInstBankType = (issuerIds: string[], issuerLiteList: IssuerLite[]) => {
  const instGroup = groupBy(issuerLiteList ?? [], 'inst_code');
  return uniq(
    issuerIds
      .map(v => {
        const bankType = instGroup[v]?.[0]?.bank_type as IssuerCode | undefined;
        return bankType ? IssuerMapToBankType[bankType] : void 0;
      })
      .filter(Boolean)
  );
};

/** 更新发行人信息的时候，获取联动后的generalFilter的银行细分债的值 */
export const getNcdSubtypeList = (
  issuerIdList: string[],
  issuerLiteList: IssuerLite[],
  issuerCodes: Set<IssuerCode>
) => {
  const issuerIds = new Set(issuerIdList ?? []);

  const ncdSubtypeList: NcdSubtype[] = getInstBankType(issuerIdList, issuerLiteList);

  for (const v of issuerCodes) {
    // 选中了某个父级发行人, 则联动银行细分债
    if (issuerIds.has(v)) ncdSubtypeList.push(IssuerMapToBankType[v]);
  }

  return uniq(ncdSubtypeList);
};
