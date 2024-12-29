import {
  BondCategoryOptions,
  BondNatureOptions,
  BondSectorOptions,
  BondShortNameOptions,
  CollectionMethodOptions,
  FRTypeOptions,
  InstitutionSubtypeOptions,
  ListedMarketOptions,
  MktTypeOptions,
  NcdSubTypeOptions,
  NcdpSubTypeOptions,
  PerpTypeOptions,
  RatingOptions,
  SubTypeOptions
} from '@fepkg/business/constants/options';
import { ProductType } from '@fepkg/services/types/enum';
import { RemainDaysType } from '@/components/BondFilter/types';
import {
  AREA_LEVEL_CONFIG_OPTIONS,
  AREA_LEVEL_SET,
  BCO_BOND_CATEGORY_SET,
  BNC_BOND_CATEGORY_SET,
  CBC_RATING_SET,
  HAS_OPTION_CONFIG_OPTIONS,
  INST_LISTED_CONFIG_OPTIONS,
  ISSUER_RATING_SET,
  MATURITY_CONFIG_OPTIONS,
  MUNICIPAL_CONFIG_OPTIONS,
  NCDP_FR_TYPE_SET,
  NCDP_REMAIN_DAYS_CONFIG_OPTIONS,
  NCD_FR_TYPE_SET,
  NCD_ISSUER_RATING_SET,
  NCD_REMAIN_DAYS_TERM_CONFIG_OPTIONS,
  PLATFORM_CONFIG_OPTIONS,
  REMAIN_DAYS_CONFIG_OPTIONS,
  WARRANTY_CONFIG_OPTIONS,
  getNCDRemainDaysConfigOptions
} from '@/components/Filter/constants/options';
import { FilterConfig } from '../types';

export enum FilterKey {
  BondCategoryList = 'bond_category_list',
  InstitutionSubtypeList = 'institution_subtype_list',
  ListedMarketList = 'listed_market_list',
  CollectionMethodList = 'collection_method_list',
  InstIsListed = 'inst_is_listed',
  BondSectorList = 'bond_sector_list',
  NcdSubtypeList = 'ncd_subtype_list',
  MktTypeList = 'mkt_type_list',
  IssuerRatingList = 'issuer_rating_list',
  CbcRatingList = 'cbc_rating_list',
  FrTypeList = 'fr_type_list',
  IsMunicipal = 'is_municipal',
  IsPlatformBond = 'is_platform_bond',
  WithWarranty = 'with_warranty',
  AreaLevelList = 'area_level_list',
  HasOption = 'has_option',
  PerpTypeList = 'perp_type_list',
  RemainDaysList = 'remain_days_list',
  MaturityIsHoliday = 'maturity_is_holiday',
  BondShortnameList = 'bond_short_name_list',
  BondNatureList = 'bond_nature_list'
}

/** 注意：为兼容Product，一下ProductTypeNone 代表高级分组中的所在行 */

/** 信用债债券分类 */
export const BCO_BOND_CATEGORY_CONFIG: FilterConfig = {
  key: FilterKey.BondCategoryList,
  title: '债券分类',
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 1, [ProductType.ProductTypeNone]: 1 },
  options: BondCategoryOptions.filter(v => BCO_BOND_CATEGORY_SET.has(v.value))
};

/** 利率债债券分类 */
export const BNC_BOND_CATEGORY_CONFIG: FilterConfig = {
  title: '债券分类',
  key: FilterKey.BondCategoryList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 1 },
  options: BondCategoryOptions.filter(v => BNC_BOND_CATEGORY_SET.has(v.value))
};

/** 主体类型 */
export const INSTITUTION_SUBTYPE_CONFIG: FilterConfig = {
  title: '主体类型',
  key: FilterKey.InstitutionSubtypeList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 1, [ProductType.ProductTypeNone]: 2 },
  options: InstitutionSubtypeOptions
};

/** 流通场所类型 */
export const LISTED_MARKET_CONFIG: FilterConfig = {
  title: '流通场所',
  key: FilterKey.ListedMarketList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 1, [ProductType.ProductTypeNone]: 1 },
  options: ListedMarketOptions
};

/** 发行主体 */
export const BOND_SECTOR_CONFIG: FilterConfig = {
  title: '行业',
  key: FilterKey.BondSectorList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 1, [ProductType.ProductTypeNone]: 2 },
  options: BondSectorOptions
};

/** 银行债细分 */
export const SUBTYPE_CONFIG: FilterConfig = {
  title: '银行债细分',
  key: FilterKey.NcdSubtypeList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 2, [ProductType.ProductTypeNone]: 3 },
  options: SubTypeOptions
};

/** 剩余期限 */
export const REMAIN_DAYS_CONFIG: FilterConfig = {
  title: '剩余期限',
  key: FilterKey.RemainDaysList,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 2 },
  options: REMAIN_DAYS_CONFIG_OPTIONS
};

/** 募集方式 */
export const COLLECTION_METHOD_CONFIG: FilterConfig = {
  title: '募集方式',
  key: FilterKey.CollectionMethodList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 2, [ProductType.ProductTypeNone]: 3 },
  options: CollectionMethodOptions
};

/** 上市类型 */
export const INST_LISTED_CONFIG: FilterConfig = {
  title: '是否上市',
  key: FilterKey.InstIsListed,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 3, [ProductType.ProductTypeNone]: 4 },
  options: INST_LISTED_CONFIG_OPTIONS
};

/** 市场 */
export const MKT_TYPE_CONFIG: FilterConfig = {
  title: '市场',
  key: FilterKey.MktTypeList,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 3, [ProductType.ProductTypeNone]: 4 },
  options: MktTypeOptions
};

/** 主体评级 */
export const ISSUER_RATING_CONFIG: FilterConfig = {
  title: '主体评级：',
  key: FilterKey.IssuerRatingList,
  showTitle: true,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 3, [ProductType.ProductTypeNone]: 7 },
  options: RatingOptions.filter(v => ISSUER_RATING_SET.has(v.value))
};

/** 中债资信评级 */
export const CBC_RATING_CONFIG: FilterConfig = {
  title: '中债资信：',
  key: FilterKey.CbcRatingList,
  showTitle: true,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 3, [ProductType.NCD]: 2, [ProductType.ProductTypeNone]: 8 },
  options: RatingOptions.filter(v => CBC_RATING_SET.has(v.value))
};

/** 高级分组 中债资信评级 */
export const GROUP_CBC_RATING_CONFIG: FilterConfig = {
  title: '中债资信：',
  key: FilterKey.CbcRatingList,
  showTitle: true,
  row: { [ProductType.ProductTypeNone]: 4 },
  options: RatingOptions.filter(v => CBC_RATING_SET.has(v.value)).map(v => ({ ...v, className: '!w-[64px]' }))
};

/** 担保类型 */
export const WARRANTY_CONFIG: FilterConfig = {
  title: '担保类型',
  key: FilterKey.WithWarranty,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 4, [ProductType.ProductTypeNone]: 6 },
  options: WARRANTY_CONFIG_OPTIONS
};

/** 利率债计息基准 */
export const BCO_FR_TYPE_CONFIG: FilterConfig = {
  title: '计息基准',
  key: FilterKey.FrTypeList,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 4, [ProductType.ProductTypeNone]: 6 },
  options: FRTypeOptions
};

/** 利率债计息基准 */
export const BNC_FR_TYPE_CONFIG: FilterConfig = {
  title: '计息基准',
  key: FilterKey.FrTypeList,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 0 },
  options: FRTypeOptions
};

/** 城投债 */
export const MUNICIPAL_CONFIG: FilterConfig = {
  title: '城投债',
  showTitle: false,
  key: FilterKey.IsMunicipal,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 4, [ProductType.ProductTypeNone]: 3 },
  options: MUNICIPAL_CONFIG_OPTIONS
};

/** 含权类型 */
export const HAS_OPTION_CONFIG: FilterConfig = {
  title: '含权类型',
  key: FilterKey.HasOption,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 4, [ProductType.ProductTypeNone]: 9 },
  options: HAS_OPTION_CONFIG_OPTIONS
};

/** 永续债类型 */
export const PERP_TYPE_CONFIG: FilterConfig = {
  title: '永续债类型',
  key: FilterKey.PerpTypeList,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 4, [ProductType.ProductTypeNone]: 8 },
  options: PerpTypeOptions
};

/** 平台债类型 */
export const PLATFORM_CONFIG: FilterConfig = {
  title: '平台债类型',
  key: FilterKey.IsPlatformBond,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 4, [ProductType.ProductTypeNone]: 6 },
  options: PLATFORM_CONFIG_OPTIONS
};

/** 发行人行政级别 */
export const AREA_LEVEL_CONFIG: FilterConfig = {
  title: '发行人行政级别',
  key: FilterKey.AreaLevelList,
  showTitle: false,
  row: { [ProductType.BNC]: 2, [ProductType.BCO]: 2, [ProductType.ProductTypeNone]: 4 },
  options: AREA_LEVEL_CONFIG_OPTIONS.filter(v => !AREA_LEVEL_SET.has(v.value))
};

/** 到期日类型 */
export const MATURITY_CONFIG: FilterConfig = {
  title: '到期日类型',
  key: FilterKey.MaturityIsHoliday,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 1, [ProductType.NCD]: 2, [ProductType.ProductTypeNone]: 3 },
  options: MATURITY_CONFIG_OPTIONS
};

/** 债券子类型（政策性金融债） */
export const BOND_SHORTNAME_CONFIG: FilterConfig = {
  title: '债券子类型（政策性金融债）',
  key: FilterKey.BondShortnameList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 0 },
  options: BondShortNameOptions
};

/** 债券子类型（地方政府债） */
export const BOND_NATURE_CONFIG: FilterConfig = {
  title: '债券子类型（地方政府债）',
  key: FilterKey.BondNatureList,
  showTitle: false,
  row: { [ProductType.BNC]: 1, [ProductType.BCO]: 0 },
  options: BondNatureOptions
};

/** NCD银行债细分 */
export const NCD_SUBTYPE_CONFIG: FilterConfig = {
  title: '银行债细分',
  key: FilterKey.NcdSubtypeList,
  showTitle: false,
  row: { [ProductType.NCD]: 1, [ProductType.ProductTypeNone]: 1 },
  options: NcdSubTypeOptions
};

/** NCD(一级)银行债细分 */
export const NCDP_SUBTYPE_CONFIG: FilterConfig = {
  title: '银行债细分',
  key: FilterKey.NcdSubtypeList,
  showTitle: false,
  row: { [ProductType.NCDP]: 1 },
  options: NcdpSubTypeOptions
};

/** NCD（一级）剩余期限 */
export const NCDP_REMAIN_DAYS_CONFIG: FilterConfig = {
  title: '剩余期限',
  key: FilterKey.RemainDaysList,
  showTitle: false,
  row: { [ProductType.NCDP]: 1 },
  options: NCDP_REMAIN_DAYS_CONFIG_OPTIONS
};

/** NCD主体评级 */
export const NCD_ISSUER_RATING_CONFIG: FilterConfig = {
  title: '主体评级：',
  key: FilterKey.IssuerRatingList,
  showTitle: true,
  row: { [ProductType.NCD]: 2 },
  options: RatingOptions.filter(v => NCD_ISSUER_RATING_SET.has(v.value))
};

/** 高级筛选 NCD主体评级 */
export const GROUP_NCD_ISSUER_RATING_CONFIG: FilterConfig = {
  title: '主体评级：',
  key: FilterKey.IssuerRatingList,
  showTitle: true,
  row: { [ProductType.ProductTypeNone]: 3 },
  options: RatingOptions.filter(v => NCD_ISSUER_RATING_SET.has(v.value))
};

/** NCD（一级）主体评级 */
export const NCDP_ISSUER_RATING_CONFIG: FilterConfig = {
  title: '主体评级：',
  key: FilterKey.IssuerRatingList,
  showTitle: false,
  row: { [ProductType.NCDP]: 1 },
  options: RatingOptions.filter(v => NCD_ISSUER_RATING_SET.has(v.value))
};

/** NCD利率债计息基准 */
export const NCD_FR_TYPE_CONFIG: FilterConfig = {
  title: '计息基准',
  key: FilterKey.FrTypeList,
  showTitle: false,
  row: { [ProductType.NCD]: 1, [ProductType.NCDP]: 1, [ProductType.ProductTypeNone]: 1 },
  options: FRTypeOptions.filter(v => NCD_FR_TYPE_SET.has(v.value))
};

/** NCD（一级）利率债计息基准 */
export const NCDP_FR_TYPE_CONFIG: FilterConfig = {
  title: '计息基准',
  key: FilterKey.FrTypeList,
  showTitle: false,
  row: { [ProductType.NCDP]: 1 },
  options: FRTypeOptions.filter(v => NCDP_FR_TYPE_SET.has(v.value))
};

/** NCD剩余期限 */
export const NCD_REMAIN_DAYS_CONFIG: FilterConfig = {
  title: '剩余期限',
  key: FilterKey.RemainDaysList,
  showTitle: false,
  row: { [ProductType.NCD]: 1, [ProductType.ProductTypeNone]: 2 },
  options: NCD_REMAIN_DAYS_TERM_CONFIG_OPTIONS
};

export const REMAIN_DAYS_CONFIG_MAP = {
  [ProductType.BCO]: REMAIN_DAYS_CONFIG,
  [ProductType.BNC]: REMAIN_DAYS_CONFIG,
  [ProductType.NCD]: NCD_REMAIN_DAYS_CONFIG,
  [ProductType.NCDP]: NCDP_REMAIN_DAYS_CONFIG
};

export const getNCDRemainDaysConfig = (type: RemainDaysType) => {
  return {
    title: '剩余期限',
    key: FilterKey.RemainDaysList,
    showTitle: false,
    row: { [ProductType.NCD]: 1, [ProductType.ProductTypeNone]: 2 },
    options: getNCDRemainDaysConfigOptions(type)
  };
};
