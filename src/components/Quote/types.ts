import type { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { LiquidationSpeed, QuoteInsert, QuoteLite } from '@fepkg/services/types/common';
import { BondQuoteType, ProductType, Side } from '@fepkg/services/types/enum';
import '@/pages/Base/SystemSetting/components/QuoteSettings/constants';
import {
  CommonTypeValue,
  EnumQuoteDisplaySettings,
  EnumQuotePanelSettings
} from '@/pages/Base/SystemSetting/components/QuoteSettings/types';

export enum QuoteTrigger {
  ENTRY_BUTTON = 'quote-trigger1', // 侧边栏/报价详情/完整报价 - Quote 按钮
  SIDEBAR_BUTTON = 'quote-trigger2', // 侧边栏(也包括报价详情弹窗refer等)按钮中需要唤起单条报价弹窗的操作
  SIDEBAR_SHORTCUT = 'quote-trigger3', // 侧边栏备注结算加减等快捷操作
  TABLE_DBLCLICK = 'quote-trigger4',
  TABLE_CTXMENU = 'quote-trigger5'
}

export type SubSingleQuoteDialog = {
  singleQuoteProductType?: ProductType;
};

export interface IQuoteDialogOption {
  onSuccess?: (data?: unknown) => void;
  onCancel?: (data?: unknown) => void;
}

export interface ISettleDialogOption extends IQuoteDialogOption {
  key: string;
  liq_speed_list?: LiquidationSpeed[];
  comment?: string;
  height?: number;
  haveMethod?: boolean;
  productType?: ProductType;
}

export type QuoteSettingsType = Map<EnumQuotePanelSettings | EnumQuoteDisplaySettings, CommonTypeValue>;

export enum QuoteTypeKeyEnum {
  Yield = 'yield',
  CleanPrice = 'clean_price',
  FullPrice = 'full_price',
  Spread = 'spread',
  ReturnPoint = 'return_point'
}
export const priceTypes = [
  { key: QuoteTypeKeyEnum.Yield, value: BondQuoteType.Yield, label: '收益率' },
  { key: QuoteTypeKeyEnum.CleanPrice, value: BondQuoteType.CleanPrice, label: '净价' }
] as const;

export const allPriceTypes = [
  ...priceTypes,
  { key: QuoteTypeKeyEnum.FullPrice, value: BondQuoteType.FullPrice, label: '全价' },
  { key: QuoteTypeKeyEnum.Spread, value: BondQuoteType.Spread, label: '利差' }
] as const;

export const AllPriceTypeProps = allPriceTypes.map(t => t.key);

export const PriceTypeProps = priceTypes.map(t => t.key);

export const PriceMateProps = ['flag_intention', 'flag_rebate', 'return_point', 'quote_type'];

export const CommentFlagKeys = ['flag_stock_exchange', 'flag_bilateral', 'flag_request', 'flag_indivisible'] as const;

export const CommentTagKeys = ['flag_oco', 'flag_package'];

export const CommentTagStrOptions = [
  { value: 'flag_oco', label: 'OCO' },
  { value: 'flag_package', label: '打包' }
];

export const QUOTE_PROPS = {
  PRICE: [...PriceTypeProps, ...PriceMateProps],
  PRICE_ALL: [...AllPriceTypeProps, ...PriceMateProps],
  OPER: [...PriceTypeProps, ...PriceMateProps, 'flag_exchange', 'flag_oco', 'flag_package', 'flag_star', 'volume'],
  CALC: [
    'comment',
    'liquidation_speed_list',
    'is_exercise',
    'traded_date',
    'settlement_date',
    'delivery_date',
    'exercise_manual',
    ...CommentFlagKeys
  ]
} as const;

export const Exercise = { label: '行权', value: 0 };
export const Maturity = { label: '到期', value: 1 };

export type OperType = 'bid' | 'ofr';

export enum EditModeEnum {
  ADD = 1,
  EDIT = 2,
  JOIN = 3,
  UNREFER = 4,
  /** 右键新报价 */
  CTX_MENU_JOIN = 5
}

export type PriceInputType = number | Uppercase<OperType> | 'B' | 'BI' | 'OF' | 'O' | '' | undefined;
export type ReturnPointType = string | number | undefined;
// https://bobbyhadz.com/blog/typescript-convert-enum-to-union
export type QuotePriceType = Partial<
  Omit<QuoteInsert, `${QuoteTypeKeyEnum}` | 'quote_type'> & { [key in QuoteTypeKeyEnum]: PriceInputType } & {
    quote_type: BondQuoteType;
    [QuoteTypeKeyEnum.ReturnPoint]: ReturnPointType;
  }
>;

export type ComparableQuote = {
  side?: Side;
  quote_type?: BondQuoteType;
  flag_intention?: boolean;
  flag_rebate?: boolean;
  yield?: number;
  clean_price?: number;
  quote_price?: number;
  return_point?: number;
};

export type QuoteCalcType = Pick<QuoteInsert, (typeof QUOTE_PROPS.CALC)[number]>;

export type TraderRender = {
  label: string;
  value: string;
  original: TraderWithPref;
  disabled: false;
};

export enum YieldEnum {
  ExeZhai = 'val_yield_exe',
  MatZhai = 'val_yield_mat',
  ExeZheng = 'csi_yield_exe',
  MatZheng = 'csi_yield_mat'
}
