import { MaturityDateType, Rating } from '@fepkg/services/types/bds-enum';
import { DEFAULT_QUICK_FILTER_VALUE } from '@/common/constants/filter';
import { DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE } from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import { TableRow, TableType } from './type';

export const DEFAULT_PARAMS = {
  quick_filter: DEFAULT_QUICK_FILTER_VALUE,
  table_related_filter: DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE,
  offset: 0,
  // 这里需要拿全量的数据，暂时传一个较大的数字，如果能够拿到页面上的total最好
  count: 500,
  input_filter: {
    bond_id_list: undefined,
    inst_id_list: undefined,
    trader_id_list: undefined,
    broker_id_list: undefined,
    user_input: undefined,
    key_market_list: undefined,
    bond_key_list: undefined
  },
  general_filter: {
    bond_category_list: undefined,
    institution_subtype_list: undefined,
    listed_market_list: undefined,
    collection_method_list: undefined,
    inst_is_listed: undefined,
    bond_sector_list: undefined,
    remain_days_list: undefined,
    mkt_type_list: undefined,
    issuer_rating_list: undefined,
    implied_rating_list: undefined,
    cbc_rating_list: undefined,
    with_warranty: undefined,
    fr_type_list: undefined,
    is_municipal: undefined,
    is_platform_bond: undefined,
    area_level_list: undefined,
    has_option: undefined,
    perp_type_list: undefined,
    bond_issue_info_filter: undefined,
    maturity_is_holiday: undefined,
    bond_short_name_list: undefined,
    bond_nature_list: undefined,
    is_abs: undefined,
    bank_type_list: undefined,
    ncd_subtype_list: undefined,
    option_perp_filter_list: undefined
  },
  // 是否删除
  is_deleted: false
};

export const REPORT_FORM_ID = 'report-form-id';

export const BankRowMap: Record<string, TableRow> = {
  SCB: TableRow.SCB,
  JCB: TableRow.JCB
};

/** 评级对应的列 */
export const RatingColMap: Record<Rating, number> = {
  // 这几个是NCDP中没有的评级，这里不考虑
  [Rating.RatingNone]: TableRow.None,
  [Rating.AAAPlus]: TableRow.None,
  [Rating.AAAMinus]: TableRow.None,
  [Rating.AAA]: TableRow.AAA,
  [Rating.AAPlus]: TableRow.AAPlus,
  [Rating.AA]: TableRow.AA,
  [Rating.AAMinus]: TableRow.AAMinus,
  [Rating.APlus]: TableRow.APlus,
  [Rating.A]: TableRow.Other,
  [Rating.AMinus]: TableRow.Other,
  [Rating.OtherIssuerRating]: TableRow.Other,
  [Rating.BBBPlus]: TableRow.Other,
  [Rating.BBB]: TableRow.Other
};

/** 报价信息纵向列名 */
export const FirstCol: TableType[] = [
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: '期限-评级' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: '国有大行' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: '国有股份制' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: '其他AAA' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: 'AA+' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: 'AA' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: 'AA-' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: 'A+' },
  { colType: MaturityDateType.MaturityDateTypeNone, dataType: 'str', label: 'A及以下' }
];
