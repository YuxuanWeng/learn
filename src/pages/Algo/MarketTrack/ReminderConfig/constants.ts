import { FRTypeOptions } from '@fepkg/business/constants/options';
import { CheckboxOption } from '@fepkg/components/Checkbox/types';
import {
  FRType,
  OppositePriceNotifyColor,
  OppositePriceNotifyLogicType,
  OppositePriceNotifyMsgFillType
} from '@fepkg/services/types/enum';
import { GeneralFilterValue } from '@/components/BondFilter/types';
import {
  BCO_BOND_CATEGORY_CONFIG,
  BNC_BOND_CATEGORY_CONFIG,
  BNC_FR_TYPE_CONFIG,
  BOND_NATURE_CONFIG,
  BOND_SHORTNAME_CONFIG,
  LISTED_MARKET_CONFIG,
  MATURITY_CONFIG,
  REMAIN_DAYS_CONFIG
} from '@/components/Filter/constants/configs';
import { CpHandicapEnum, NValueEnum, NotifyLogicState } from './types';

const frTypeSet = new Set([FRType.Shibor, FRType.Depo, FRType.FRD]);

const BOND_CATEGORY_CONFIG = {
  ...BNC_BOND_CATEGORY_CONFIG,
  options: [...BNC_BOND_CATEGORY_CONFIG.options, ...BCO_BOND_CATEGORY_CONFIG.options]
};

const pureNumReg = /^\d{0,3}$/;
const floatNumReg = /^-?(\d{1,4})?(\.|\.(\d{0,2}))?$/;
export const EXPANDED_STATE = 'EXPANDED_STATE';
export const IS_HOLIDAY_ALL = 'is-holiday-all';

export const CONTAINER_CLS = 'flex-1 overflow-y-hidden border border-solid border-gray-500 rounded-lg';
export const CONTENT_CLS = 'rounded-b overflow-hidden';
export const bondGroupDefaultValue: GeneralFilterValue = {
  bond_short_name_list: [],
  fr_type_list: [],
  maturity_is_holiday: [],
  bond_nature_list: [],
  remain_days_list: [],
  bond_category_list: [],
  listed_market_list: []
};

/** 债券类型和交易场所 */
export const bondTypeEtc = [BOND_CATEGORY_CONFIG, LISTED_MARKET_CONFIG];
/** 待偿期 */
export const remainDaysList = [REMAIN_DAYS_CONFIG];
/** 发行机构、利率类型、节假日、地方债类型 */
export const bondShortNameEtc = [
  BOND_SHORTNAME_CONFIG,
  { ...BNC_FR_TYPE_CONFIG, options: FRTypeOptions.filter(i => frTypeSet.has(i.value)) },
  MATURITY_CONFIG,
  BOND_NATURE_CONFIG
];

export const colors = [
  {
    name: 'primary',
    color: 'bg-secondary-100',
    value: OppositePriceNotifyColor.OppositePriceNotifyColorPrimary,
    hoverColor: 'hover:bg-secondary-000'
  },
  {
    name: 'auxiliary',
    color: 'bg-orange-200',
    value: OppositePriceNotifyColor.OppositePriceNotifyColorAuxiliary,
    hoverColor: 'hover:bg-orange-000'
  },
  {
    name: 'ofr',
    color: 'bg-green-100',
    value: OppositePriceNotifyColor.OppositePriceNotifyColorOfr,
    hoverColor: 'hover:bg-green-000'
  },
  {
    name: 'red',
    color: 'bg-danger-100',
    value: OppositePriceNotifyColor.OppositePriceNotifyColorRed,
    hoverColor: 'hover:bg-danger-000'
  },
  {
    name: 'golden',
    color: 'bg-yellow-200',
    value: OppositePriceNotifyColor.OppositePriceNotifyColorGolden,
    hoverColor: 'hover:bg-yellow-000'
  },
  {
    name: 'trd',
    color: 'bg-purple-100',
    value: OppositePriceNotifyColor.OppositePriceNotifyColorTrd,
    hoverColor: 'hover:bg-purple-000'
  }
];

export const baseTableProps = {
  hasColumnSettings: false,
  showHeaderContextMenu: false,
  showHeaderResizer: false,
  showHeaderReorder: false,
  multiSelectEnabled: false
};

export const radioOptions = [
  {
    value: OppositePriceNotifyMsgFillType.OppositePriceNotifyMsgFillTypeAllMsg,
    label: '全部话术',
    tooltipProps: {
      text: '文本框带入所有满足条件的逻辑话术。',
      placement: 'bottom',
      offset: [0, 10]
    }
  },
  {
    value: OppositePriceNotifyMsgFillType.OppositePriceNotifyMsgFillTypeNoMsg,
    label: '无话术',
    tooltipProps: {
      text: '文本框不带入任何逻辑话术。',
      placement: 'bottom',
      offset: [0, 10]
    }
  },
  {
    value: OppositePriceNotifyMsgFillType.OppositePriceNotifyMsgFillTypeExcludeHist,
    label: '除历史成交',
    tooltipProps: {
      text: '除了#有历史成交#逻辑话术外，其他逻辑话术满足默认条件均带入文本框。',
      placement: 'bottom',
      offset: [0, 10]
    }
  },
  {
    value: OppositePriceNotifyMsgFillType.OppositePriceNotifyMsgFillTypeOnlyCurrent,
    label: '仅即时成交',
    tooltipProps: {
      text: '除了#有即时成交#逻辑话术外，其他逻辑话术均不带入文本框。',
      placement: 'bottom-end',
      offset: [20, 10]
    }
  },
  {
    value: OppositePriceNotifyMsgFillType.OppositePriceNotifyMsgFillTypeExcludeDeal,
    label: '除成交话术',
    tooltipProps: {
      text: '除成交相关话术外，其他逻辑话术满足默认条件（优先级最高一条）则带入文本框。',
      placement: 'bottom-end',
      offset: [30, 10]
    }
  }
];

/** 提醒逻辑列详细描述 */
export const notifyLogicState: Record<OppositePriceNotifyLogicType, NotifyLogicState> = {
  [OppositePriceNotifyLogicType.NotifyLogicTypeFirstOppositePrice]: {
    copy: false,
    nValueType: NValueEnum.OnOff,
    detail:
      '交易员账号对该债券有报价，本来对边没有价格，当对边出现第一个报价时，触发提醒。其中，开启N值，此条规则包含意向价；未开启N值，仅考虑实价。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeBetterPriceOnSameSide]: {
    copy: false,
    nValueType: NValueEnum.OnOff,
    detail:
      '若开启N值，交易员账号对该债券有报价，且同一方向上最优报价（非本账号报价）更优，且对边有报价时触发提醒；若未开启N值，则同边更优即触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeBetterPriceOnOppositeSide]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail: '交易员账号对该债券有报价，且对价方向上最优报价更优时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeWorsePriceOnSameSide]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail: '交易员账号对该券有报价，且同一方向上最优价（非本账号报价）变差时且对边报价有并且是实价时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeWorsePriceOnOppositeSide]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail: '交易员账号对该券有报价，且对价方向上最优价变差时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeNoQuoteOnOppositeSide]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail: '交易员账号对该券有报价，且对价方向上报价全部清空时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeNewQuoteWithOppositePrice]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail: '交易员账号对该券新增报价，其对价方向上有报价，且该对价为实价时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeBidPriceOnOppositeSide]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail:
      '1. 交易员账号对该券已有Ofr报价，Bid方从无到有意向价时提醒。  2. 交易员账号对该券新报Ofr报价，Bid方仅有意向价时提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeOfrPriceOnOppositeSide]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail:
      '1. 交易员账号对该券已有Bid报价，Ofr方从无到有意向价时提醒。  2. 交易员账号对该券新报Bid报价，Ofr方仅有意向价时提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeHasCurrentDeal]: {
    copy: false,
    nValueType: NValueEnum.Input,
    rule: pureNumReg,
    detail:
      '1. 交易员账号对该券新增报价，检测到该券今日已有最新一条成交时（且成交时间小于等于N值），触发提醒。  2. 交易员账号在该券已有报价，今日出现成交时提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeHasHistDeal]: {
    copy: false,
    nValueType: NValueEnum.Input,
    rule: pureNumReg,
    detail: '交易员账号对该券新增报价，检测到该券今日已有最新一条成交时（且成交时间大于N值），触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeLessPriceDifference]: {
    copy: true,
    nValueType: NValueEnum.Input,
    rule: floatNumReg,
    detail: '交易员账号对该债券有报价，且债券最优Bid价-最优Ofr价 ≤ Nbp时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeOfrPriceOffset]: {
    copy: true,
    nValueType: NValueEnum.Input,
    rule: floatNumReg,
    detail: '交易员账号对该债券有Bid报价，当前估值-最优Ofr价 ≤ Nbp时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.NotifyLogicTypeBidPriceOffset]: {
    copy: true,
    nValueType: NValueEnum.Input,
    rule: floatNumReg,
    detail: '交易员账号对该债券有Ofr报价，当前最优Bid价-估值 ≤ Nbp时，触发提醒。'
  },
  [OppositePriceNotifyLogicType.OppositePriceNotifyLogicTypeNone]: {
    copy: false,
    nValueType: NValueEnum.None,
    detail: ''
  }
};

export const copyFormatOptions: CheckboxOption[] = [
  {
    label: '含估值',
    value: CpHandicapEnum.valuation
  },
  {
    label: '含发行量',
    value: CpHandicapEnum.issueAmount
  },
  {
    label: '含到期日',
    value: CpHandicapEnum.maturityDate
  }
];

export const remindMaxLengthOptions: CheckboxOption[] = [
  { label: '100', value: 100 },
  { label: '300', value: 300 }
];
