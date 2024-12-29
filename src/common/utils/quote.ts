import { SERVER_NIL } from '@fepkg/common/constants';
import { noNil, normalizeTimestamp, parseJSON } from '@fepkg/common/utils';
import { TableSorter, TableSorterOrder } from '@fepkg/components/Table';
import {
  GeneralFilter,
  InputFilter,
  OptionPerpFilter,
  QuoteLite,
  QuoteUpdate,
  RangeInteger,
  SortingMethod
} from '@fepkg/services/types/common';
import {
  BondCategory,
  BondQuoteType,
  CollectionMethod,
  FRType,
  MaturityDateType,
  NcdSubtype,
  PerpType,
  ProductType,
  QuoteSortedField,
  Rating,
  Side
} from '@fepkg/services/types/enum';
import { cloneDeep, isEmpty, isEqual, isNil, isString, uniq } from 'lodash-es';
import moment from 'moment';
import { CustomSortFieldOptions } from '@/components/BondFilter/CustomSorting/types';
import { BondIssueInfoFilterValue, GeneralFilterValue } from '@/components/BondFilter/types';
import { transformCheckboxValue } from '@/pages/ProductPanel/utils';
import { transformDaysWithDate, transformRemainDaysConfig } from './date';

export const MaturityDateTypeMapToStr: { [key: string]: MaturityDateType } = {
  '1M': MaturityDateType.OneMonth,
  '3M': MaturityDateType.ThreeMonth,
  '6M': MaturityDateType.SixMonth,
  '9M': MaturityDateType.NineMonth,
  '1Y': MaturityDateType.OneYear
};

export const isNumberNil = (price?: number | string): price is undefined =>
  isNil(price) || price === '' || price === SERVER_NIL;

export const isQuoteUpdateArray = (arr: (string | QuoteUpdate)[]): arr is QuoteUpdate[] => {
  if (!Array.isArray(arr)) return false;
  return arr.length > 0 && arr.every(val => typeof val !== 'string');
};

export const getInputFilter = (searchValue?: InputFilter) => {
  if (!searchValue) return {};
  const inputFilter = { ...searchValue };
  if (
    inputFilter?.bond_id_list ||
    inputFilter?.bond_key_list ||
    inputFilter?.inst_id_list ||
    inputFilter?.broker_id_list ||
    inputFilter?.trader_id_list
  ) {
    inputFilter.user_input = undefined;
  }
  return noNil(inputFilter) ?? {};
};

export const getSorterMethod = (sorter?: TableSorter<QuoteSortedField>) => {
  return sorter?.order && sorter?.sortedField
    ? { is_desc: sorter.order === TableSorterOrder.DESC, sorted_field: sorter.sortedField }
    : undefined;
};

export const getSorterMethodList = (
  queryType: 'Bond' | 'Optimal' | 'Market',
  customSorting?: boolean,
  customSortingValue?: CustomSortFieldOptions
): SortingMethod[] | undefined => {
  if (!customSorting) return void 0;
  const format = customSortingValue
    ?.filter(v => !!v.order && !!v.sortedField)
    .map(v => ({ is_desc: v.order === TableSorterOrder.DESC, sorted_field: v.sortedField })) as
    | SortingMethod[]
    | undefined;

  /**
   * 1. 实时报价,作废区
   *  价格: QuoteSortedField.FieldPrice = 57
   *  净价: QuoteSortedField.FieldCleanPrice = 18
   *
   * 2. 实时盘口,债券列表
   *  方向: 未选中方向时，默认OFR
   *  价格:
   *    bid: QuoteSortedField.FieldBid = 4
   *    ofr: QuoteSortedField.FieldOfr = 5
   *  净价:
   *    bid: QuoteSortedField.FieldCleanPriceBid = 44
   *    ofr: QuoteSortedField.FieldCleanPriceOfr = 47
   *
   * 3. 市场成交
   *  价格: QuoteSortedField.FieldDealPrice = 51
   *  净价/方向: 忽略
   * */

  let result: SortingMethod[] | undefined;

  const sideRecord = format?.find(v => v.sorted_field === QuoteSortedField.FieldSide);
  const priceRecord = format?.find(v => v.sorted_field === QuoteSortedField.FieldPrice);
  const clearPriceRecord = format?.find(v => v.sorted_field === QuoteSortedField.FieldCleanPrice);

  let side = Side.SideOfr;

  let priceField: QuoteSortedField = QuoteSortedField.FieldNone;
  let clearPriceField: QuoteSortedField = QuoteSortedField.FieldNone;

  switch (queryType) {
    case 'Bond':
      result = format ? [...format] : void 0;
      break;
    case 'Optimal':
      if (!priceRecord && !clearPriceRecord) {
        result = format ? [...format] : void 0;
        break;
      }

      if (sideRecord?.is_desc === false) side = Side.SideBid;

      if (side === Side.SideBid) {
        priceField = QuoteSortedField.FieldBid;
        clearPriceField = QuoteSortedField.FieldCleanPriceBid;
      }

      if (side === Side.SideOfr) {
        priceField = QuoteSortedField.FieldOfr;
        clearPriceField = QuoteSortedField.FieldCleanPriceOfr;
      }

      result = format
        ?.filter(v => v.sorted_field !== QuoteSortedField.FieldSide)
        ?.map(v => {
          const item = { ...v };
          if (v.sorted_field === QuoteSortedField.FieldPrice) {
            item.sorted_field = priceField;
          }

          if (v.sorted_field === QuoteSortedField.FieldCleanPrice) {
            item.sorted_field = clearPriceField;
          }
          return item;
        });

      break;
    case 'Market':
      if (priceRecord) priceField = QuoteSortedField.FieldDealPrice;

      result = format
        ?.filter(
          v => v.sorted_field !== QuoteSortedField.FieldSide && v.sorted_field !== QuoteSortedField.FieldCleanPrice
        )
        ?.map(v => {
          const item = { ...v };
          if (v.sorted_field === QuoteSortedField.FieldPrice) {
            item.sorted_field = priceField;
          }
          return item;
        });

      break;

    default:
      break;
  }

  return result;
};

export const getExtraKeyMarketList = (extraKeyMarketList: string[]) => {
  return !extraKeyMarketList?.length ? undefined : extraKeyMarketList;
};

export const getHasSTCQuote = (list?: QuoteLite[]) => !!list?.some(item => !!item?.flag_stc);

/** 处理 含权类型 筛选项交互与ui表现不同的情况 */
const getHasOption = (generalFilter: GeneralFilterValue) => {
  // BNC特殊处理含权/永续/非含权
  const options = generalFilter?.has_option?.filter((v: boolean | PerpType) => v !== PerpType.PerpSub);

  // [true, false]
  if (options?.length === 2) return null;

  // [true] | [false]
  if (options?.length === 1) return options[0];

  return undefined;
};

/** 处理 永续债类型 筛选项交互与ui表现不同的情况 */
const getPerpTypeList = (generalFilter: GeneralFilterValue) => {
  const hasPerpType = generalFilter?.has_option?.some((v: boolean | PerpType) => v === PerpType.PerpSub);
  if (!hasPerpType) return generalFilter?.perp_type_list;
  return generalFilter?.perp_type_list?.concat([PerpType.PerpSub, PerpType.PerpNotSub]);
};

/** 处理 剩余期限 筛选项交互与ui表现不同的情况 */
const getRemainDaysList = (generalFilter: GeneralFilterValue) => {
  const d = generalFilter?.remain_days_range;
  const remainDaysType = generalFilter?.remain_days_type ?? 'string';
  if (d?.length && (!isEmpty(d[0]) || !isEmpty(d[1]))) {
    const { min, max } = transformDaysWithDate(d, remainDaysType);
    const params: { min?: number; max?: number } = {};
    if (min !== undefined) params.min = min;
    if (max !== undefined) params.max = max;
    return [params];
  }
  return generalFilter?.remain_days_list
    ?.map(v => transformRemainDaysConfig(v as string, generalFilter.remain_days_options_type))
    ?.map(v => (typeof v === 'string' ? parseJSON<RangeInteger>(v) : v))
    ?.filter(item => item != undefined) as RangeInteger[] | undefined;
};

const getMaturityDateTypeList = (generalFilter: GeneralFilterValue) => {
  return generalFilter.remain_days_list?.map(v => MaturityDateTypeMapToStr[v as string]);
};

/** 处理 债券分类 筛选项交互与ui表现不同的情况 */
const handleBondCategoryList = (generalFilter: GeneralFilterValue) => {
  if (generalFilter?.bond_category_list?.includes(BondCategory.OBC)) {
    generalFilter.bond_category_list = generalFilter?.bond_category_list?.concat([
      BondCategory.GB,
      BondCategory.CBB,
      BondCategory.FB,
      BondCategory.LGB
    ]);
  }
};

/** 处理 计息基准 筛选项交互与ui表现不同的情况 */
const handleCbcRatingList = (generalFilter: GeneralFilterValue) => {
  // 如果筛选的评级中包含了<其他>，则传入除选项外的其他值
  if (generalFilter?.cbc_rating_list?.includes(Rating.OtherIssuerRating)) {
    generalFilter.cbc_rating_list = [
      ...generalFilter.cbc_rating_list,
      Rating.AAMinus,
      Rating.APlus,
      Rating.A,
      Rating.AMinus
    ];
  }
};

/** 处理 计息基准 筛选项交互与ui表现不同的情况 */
const handleFrTypeList = (generalFilter: GeneralFilterValue) => {
  // 当选中<固息>时，增加[0]
  if (generalFilter?.fr_type_list?.includes(FRType.FRD)) {
    generalFilter.fr_type_list = generalFilter.fr_type_list?.concat([0]);
  }
};

/** 处理 银行债细分 筛选项交互与ui表现不同的情况 */
const handleNcdSubtypeList = (productType: ProductType, generalFilter: GeneralFilterValue) => {
  switch (productType) {
    case ProductType.NCD:
      break;
    default:
      // 银行债细分  如果筛选中包含了<大行>，则传入除选项外的其他大行SPB
      if (generalFilter?.ncd_subtype_list?.includes(NcdSubtype.NcdSubtypeMCB)) {
        generalFilter.ncd_subtype_list = generalFilter.ncd_subtype_list.concat([NcdSubtype.NcdSubtypeSPB]);
      }

      // 银行债细分  如果筛选中包含了<其他>，则传入除选项外的其他值
      if (generalFilter?.ncd_subtype_list?.includes(NcdSubtype.NcdSubtypeOTB)) {
        generalFilter.ncd_subtype_list = generalFilter.ncd_subtype_list.concat([
          NcdSubtype.NcdSubtypeFRB,
          NcdSubtype.NcdSubtypeRRB,
          NcdSubtype.NcdSubtypeCCB,
          NcdSubtype.NcdSubtypeRTB
        ]);
      }
  }
};

/** 处理 主体识别 筛选项交互与ui表现不同的情况 */
const handleIssuerRatingList = (productType: ProductType, generalFilter: GeneralFilterValue) => {
  const { issuer_rating_list, collection_method_list } = generalFilter;
  // 主体评级  如果筛选的评级中包含了<其他>，则传入除选项外的其他值
  if (issuer_rating_list?.includes(Rating.OtherIssuerRating)) {
    generalFilter.issuer_rating_list = issuer_rating_list.concat([
      Rating.AAAPlus,
      Rating.AAAMinus,
      Rating.A,
      Rating.AMinus,
      Rating.BBBPlus,
      Rating.BBB
    ]);
  }

  switch (productType) {
    case ProductType.NCD:
      break;
    default:
      // 主体评级  如果筛选的评级中包含了<超AAA>，则改为传入CollectionMethod的SAAA
      if (issuer_rating_list?.includes(Rating.AAAPlus)) {
        generalFilter.issuer_rating_list =
          issuer_rating_list.length > 1 ? issuer_rating_list.filter(item => item !== Rating.AAAPlus) : undefined;
        generalFilter.collection_method_list = (collection_method_list ?? []).concat([CollectionMethod.SAAA]);
      }
  }
};

/** 处理含权/永续交互与ui表现不同的情况 */
const getOptionPerpFilterList = (props: {
  productType: ProductType;
  has_option?: boolean | null;
  perp_type_list?: PerpType[];
}): OptionPerpFilter[] | undefined => {
  const { productType, has_option, perp_type_list } = props;

  // 参考飞书文档: https://shihetech.feishu.cn/docx/ZfifdI2CfowT9GxSeuCcs196nZd

  /**
   * 利率 (并集)
   * 1. 含权: [{ hasOption: true, PerpType:[3] }]
   * 2. 非含权: [{ hasOption: false}]
   * 3. 含权 + 永续: [{ hasOption: true, PerpType: [3] }, { PerpType: [1, 2] }]
   * 4. 含权 + 非含权: [{ hasOption: true, PerpType: [3] }, { hasOption: false }]
   * 5. 含权 + 非含权 + 永续: [{ hasOption : true, PerpType:[3] }, { hasOption: false }, { PerpType: [1, 2] }]
   * 6. 非含权 + 永续: [{ hasOption: false }, { PerpType: [1, 2] }]
   * 7. 永续: [{ PerpType: [1, 2] }]
   */

  // <永续> 业务意义
  const perpFormatted = [PerpType.PerpSub, PerpType.PerpNotSub];

  // <非永续> 业务意义
  const nonePerpFormatted = [PerpType.NotPerp];

  // <含权> 业务意义
  const hasOptionFormatted = { has_option: true, perp_type_list: nonePerpFormatted };

  // <非含权> 业务意义
  const noneHasOptionFormatted = { has_option: false };

  // case 1: 含权
  if (has_option === true && !perp_type_list?.length) return [hasOptionFormatted];

  // case 2: 非含权
  if (has_option === false && !perp_type_list?.length) return [noneHasOptionFormatted];

  // case 3: 含权 + 非含权
  if (has_option === null && !perp_type_list?.length) return [hasOptionFormatted, { has_option: false }];

  if (productType === ProductType.BNC) {
    // case 1 含权 + 永续
    if (has_option === true && isEqual(perp_type_list, perpFormatted)) {
      return [hasOptionFormatted, { perp_type_list: perpFormatted }];
    }

    // case 2: 含权 + 非含权 + 永续
    if (has_option === null && isEqual(perp_type_list, perpFormatted)) {
      return [hasOptionFormatted, noneHasOptionFormatted, { perp_type_list: perpFormatted }];
    }

    // case 3: 非含权 + 永续
    if (has_option === false && isEqual(perp_type_list, perpFormatted)) {
      return [noneHasOptionFormatted, { perp_type_list: perpFormatted }];
    }

    // case 4: 永续
    if (has_option === undefined && isEqual(perp_type_list, perpFormatted)) {
      return [{ perp_type_list: perpFormatted }];
    }

    return [];
  }

  /** 信用 (交集) */
  if (productType === ProductType.BCO) {
    if (!perp_type_list?.length) return undefined;
    if (has_option === true) return [{ has_option: true, perp_type_list: uniq([PerpType.NotPerp, ...perp_type_list]) }];
    if (has_option === false) return [{ has_option: false, perp_type_list }];
    if (has_option === undefined) return [{ perp_type_list }];
    if (has_option === null) {
      return [
        { has_option: true, perp_type_list: uniq([PerpType.NotPerp, ...perp_type_list]) },
        { has_option: false, perp_type_list }
      ];
    }
  }

  return [];
};

/** 处理generalFilter中一些参数与ui对应不上的情况 */
export const handleGeneralFilterValue = (
  productType: ProductType,
  generalFilterValue: GeneralFilterValue,
  bondIssueInfoFilterValue?: BondIssueInfoFilterValue
): GeneralFilter => {
  const generalFilter = cloneDeep(generalFilterValue);

  handleFrTypeList(generalFilter);
  handleBondCategoryList(generalFilter);
  handleIssuerRatingList(productType, generalFilter);
  handleNcdSubtypeList(productType, generalFilter);
  handleCbcRatingList(generalFilter);

  return (
    noNil(
      {
        ...generalFilter,
        bond_issue_info_filter: bondIssueInfoFilterValue ?? generalFilter.bond_issue_info_filter,
        inst_is_listed: transformCheckboxValue(generalFilter?.inst_is_listed),
        with_warranty: transformCheckboxValue(generalFilter?.with_warranty),
        is_municipal: transformCheckboxValue(generalFilter?.is_municipal),
        is_platform_bond: transformCheckboxValue(generalFilter?.is_platform_bond),
        maturity_is_holiday: transformCheckboxValue(generalFilter?.maturity_is_holiday),
        is_abs: transformCheckboxValue(generalFilter?.is_abs),

        // TODO: 这个参数没有意义了，这里不删除的原因是: 前端复选框生成的 has_option是 boolean[]类型，idl为 boolean类型。
        has_option: undefined,

        remain_days_list: productType !== ProductType.NCDP ? getRemainDaysList(generalFilter) : void 0,
        maturity_date_type_list: productType === ProductType.NCDP ? getMaturityDateTypeList(generalFilter) : void 0,
        option_perp_filter_list: getOptionPerpFilterList({
          productType,
          has_option: getHasOption(generalFilter),
          perp_type_list: getPerpTypeList(generalFilter)
        }),
        remain_days_range: undefined,
        remain_days_type: undefined,
        issuer_rating_val: undefined,
        rating_type: undefined
      },
      { keepFalse: true, keepZero: true }
    ) ?? {}
  );
};

/**
 * 是否为散量
 * @description 【非散量】：报价量为1000的整数倍
 */
export const isScattered = (volume?: number) => {
  if (isNumberNil(volume)) return false;
  return volume % 1000 > 0;
};

/** 是否已上市 */
export const isListed = (listed_date: string) => {
  if (!listed_date) return true;
  if (isString(listed_date) && listed_date.startsWith('-')) return false;
  const date = moment(normalizeTimestamp(listed_date));
  if (!date.isValid()) return false;
  const today = moment();
  return date.isSameOrBefore(today);
};

/** 根据报价类型，确定价格字段 */
export const getPriceFiledWithQuoteType = (quote_type: BondQuoteType): string => {
  return {
    [BondQuoteType.CleanPrice]: 'clean_price',
    [BondQuoteType.FullPrice]: 'full_price',
    [BondQuoteType.Yield]: 'yield',
    [BondQuoteType.Spread]: 'spread'
  }[quote_type] as string;
};
