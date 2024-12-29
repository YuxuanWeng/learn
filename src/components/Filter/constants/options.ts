import { AreaLevel, BondCategory, FRType, Rating } from '@fepkg/services/types/enum';
import { RemainDaysMonthLabel, RemainDaysSeasonLabel, RemainDaysTermLabel } from '@/common/types/remain-days';
import { RemainDaysType } from '@/components/BondFilter/types';
import { FilterConfigOption } from '../types';

export const CONFIG_QUERY_STALE_TIME = 60 * 1000 * 60 * 24;

export const BCO_BOND_CATEGORY_SET = new Set([
  BondCategory.SCP,
  BondCategory.CP,
  BondCategory.MTN,
  BondCategory.CB,
  BondCategory.EB,
  BondCategory.SD,
  BondCategory.PPN,
  BondCategory.OBC
]);

export const BNC_BOND_CATEGORY_SET = new Set([BondCategory.GB, BondCategory.CBB, BondCategory.FB, BondCategory.LGB]);

/** 剩余期限 */
export const REMAIN_DAYS_CONFIG_OPTIONS: FilterConfigOption<RemainDaysTermLabel>[] = [
  { label: RemainDaysTermLabel.M_0_3, value: RemainDaysTermLabel.M_0_3 },
  { label: RemainDaysTermLabel.M_3_6, value: RemainDaysTermLabel.M_3_6 },
  { label: RemainDaysTermLabel.M_6_9, value: RemainDaysTermLabel.M_6_9 },
  { label: RemainDaysTermLabel.M_9_12, value: RemainDaysTermLabel.M_9_12 },
  { label: RemainDaysTermLabel.Y_1_2, value: RemainDaysTermLabel.Y_1_2 },
  { label: RemainDaysTermLabel.Y_2_3, value: RemainDaysTermLabel.Y_2_3 },
  { label: RemainDaysTermLabel.Y_3_4, value: RemainDaysTermLabel.Y_3_4 },
  { label: RemainDaysTermLabel.Y_4_5, value: RemainDaysTermLabel.Y_4_5 },
  { label: RemainDaysTermLabel.Y_5_10, value: RemainDaysTermLabel.Y_5_10 },
  { label: RemainDaysTermLabel.Y_10_E, value: RemainDaysTermLabel.Y_10_E }
];

/** NCD剩余期限（期限） */
export const NCD_REMAIN_DAYS_TERM_CONFIG_OPTIONS: FilterConfigOption<RemainDaysTermLabel>[] = [
  { label: RemainDaysTermLabel.M_0_3, value: RemainDaysTermLabel.M_0_3 },
  { label: RemainDaysTermLabel.M_3_6, value: RemainDaysTermLabel.M_3_6 },
  { label: RemainDaysTermLabel.M_6_9, value: RemainDaysTermLabel.M_6_9 },
  { label: RemainDaysTermLabel.M_9_12, value: RemainDaysTermLabel.M_9_12 },
  { label: RemainDaysTermLabel.Y_1_2, value: RemainDaysTermLabel.Y_1_2 },
  { label: RemainDaysTermLabel.Y_2_E, value: RemainDaysTermLabel.Y_2_E }
];

/** NCD剩余期限（月份） */
export const NCD_REMAIN_DAYS_MONTH_CONFIG_OPTIONS: FilterConfigOption<RemainDaysMonthLabel>[] = [
  { label: RemainDaysMonthLabel.month_1, value: RemainDaysMonthLabel.month_1 },
  { label: RemainDaysMonthLabel.month_2, value: RemainDaysMonthLabel.month_2 },
  { label: RemainDaysMonthLabel.month_3, value: RemainDaysMonthLabel.month_3 },
  { label: RemainDaysMonthLabel.month_4, value: RemainDaysMonthLabel.month_4 },
  { label: RemainDaysMonthLabel.month_5, value: RemainDaysMonthLabel.month_5 },
  { label: RemainDaysMonthLabel.month_6, value: RemainDaysMonthLabel.month_6 },
  { label: RemainDaysMonthLabel.month_7, value: RemainDaysMonthLabel.month_7 },
  { label: RemainDaysMonthLabel.month_8, value: RemainDaysMonthLabel.month_8 },
  { label: RemainDaysMonthLabel.month_9, value: RemainDaysMonthLabel.month_9 },
  { label: RemainDaysMonthLabel.month_10, value: RemainDaysMonthLabel.month_10 },
  { label: RemainDaysMonthLabel.month_11, value: RemainDaysMonthLabel.month_11 },
  { label: RemainDaysMonthLabel.month_12, value: RemainDaysMonthLabel.month_12 }
];

/** NCD剩余期限（季度） */
export const NCD_REMAIN_DAYS_SEASON_CONFIG_OPTIONS: (FilterConfigOption<RemainDaysSeasonLabel> & {
  season: number;
})[] = [
  { label: RemainDaysSeasonLabel.Season_1, value: RemainDaysSeasonLabel.Season_1, season: 1 },
  { label: RemainDaysSeasonLabel.Season_2, value: RemainDaysSeasonLabel.Season_2, season: 2 },
  { label: RemainDaysSeasonLabel.Season_3, value: RemainDaysSeasonLabel.Season_3, season: 3 },
  { label: RemainDaysSeasonLabel.Season_4, value: RemainDaysSeasonLabel.Season_4, season: 4 }
];

const REMAIN_DAYS_CONFIG_OPTIONS_MAP: { [key in RemainDaysType]: FilterConfigOption<string>[] } = {
  [RemainDaysType.Term]: NCD_REMAIN_DAYS_TERM_CONFIG_OPTIONS,
  [RemainDaysType.Month]: NCD_REMAIN_DAYS_MONTH_CONFIG_OPTIONS,
  [RemainDaysType.Season]: NCD_REMAIN_DAYS_SEASON_CONFIG_OPTIONS
};

export const getNCDRemainDaysConfigOptions = (type: RemainDaysType) => REMAIN_DAYS_CONFIG_OPTIONS_MAP[type];

/** NCD（一级）剩余期限 */
export const NCDP_REMAIN_DAYS_CONFIG_OPTIONS: FilterConfigOption<RemainDaysTermLabel>[] = [
  { label: RemainDaysTermLabel.M_1, value: RemainDaysTermLabel.M_1 },
  { label: RemainDaysTermLabel.M_3, value: RemainDaysTermLabel.M_3 },
  { label: RemainDaysTermLabel.M_6, value: RemainDaysTermLabel.M_6 },
  { label: RemainDaysTermLabel.M_9, value: RemainDaysTermLabel.M_9 },
  { label: RemainDaysTermLabel.Y_1, value: RemainDaysTermLabel.Y_1 }
];

/** 上市 */
export const INST_LISTED_CONFIG_OPTIONS: FilterConfigOption<boolean>[] = [
  { label: '上市', value: true },
  { label: '非上市', value: false }
];

export const ISSUER_RATING_SET = new Set([
  Rating.AAAPlus,
  Rating.AAA,
  Rating.AAPlus,
  Rating.AA,
  Rating.AAMinus,
  Rating.APlus,
  Rating.OtherIssuerRating
]);

export const NCD_ISSUER_RATING_SET = new Set([
  Rating.AAA,
  Rating.AAPlus,
  Rating.AA,
  Rating.AAMinus,
  Rating.APlus,
  Rating.OtherIssuerRating
]);

export const NCD_FR_TYPE_SET = new Set([FRType.Shibor, FRType.LPR, FRType.FRD]);
export const NCDP_FR_TYPE_SET = new Set([FRType.Shibor, FRType.FRD]);

export const CBC_RATING_SET = new Set([
  Rating.AAAPlus,
  Rating.AAA,
  Rating.AAAMinus,
  Rating.AAPlus,
  Rating.AA,
  Rating.OtherIssuerRating
]);

/** 担保类型 */
export const WARRANTY_CONFIG_OPTIONS: FilterConfigOption<boolean>[] = [
  { label: '有担保', value: true },
  { label: '无担保', value: false }
];

/** 城投债 */
export const MUNICIPAL_CONFIG_OPTIONS: FilterConfigOption<boolean>[] = [
  { label: '城投债', value: true },
  { label: '非城投', value: false }
];

/** 含权类型 */
export const HAS_OPTION_CONFIG_OPTIONS: FilterConfigOption<boolean>[] = [
  { label: '含权', value: true },
  { label: '非含权', value: false }
];

/** 平台债 */
export const PLATFORM_CONFIG_OPTIONS: FilterConfigOption<boolean>[] = [
  { label: '平台债', value: true },
  { label: '非平台债', value: false }
];

/** 发行人行政级别 */
export const AREA_LEVEL_CONFIG_OPTIONS: FilterConfigOption<AreaLevel>[] = [
  { label: '省级', value: AreaLevel.PRN },
  { label: '市级', value: AreaLevel.CTY },
  { label: '区县级', value: AreaLevel.TWN },
  { label: '其他', value: AreaLevel.OTH },
  { label: '开发区', value: AreaLevel.ARE },
  { label: '工业园区', value: AreaLevel.IND },
  { label: '镇', value: AreaLevel.VIL }
];

export const AREA_LEVEL_SET = new Set([AreaLevel.ARE, AreaLevel.IND, AreaLevel.VIL]);

/** 到期日类型 */
export const MATURITY_CONFIG_OPTIONS: FilterConfigOption<boolean>[] = [
  { label: '工作日', value: false },
  { label: '节假日', value: true }
];
