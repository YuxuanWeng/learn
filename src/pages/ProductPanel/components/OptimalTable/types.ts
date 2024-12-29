import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { GroupRowData, TableMouseEvent } from '@fepkg/components/Table';
import { BondOptimalQuote, QuoteLite } from '@fepkg/services/types/common';
import { CompleteQuoteGroup } from '@fepkg/services/types/enum';
import { DeepQuoteTableColumn } from '@/components/DeepQuote/types';

export type OptimalTableSideInfo = {
  /** 该方向上最优报价 */
  optimalQuote?: QuoteLite;
  /** 该方向最优价格的报价列表 */
  optimalQuoteList?: (DeepQuoteTableColumn | { original: { quote_id: string } })[];
  /** 该方向其他价格的报价列表 */
  otherQuoteList?: (DeepQuoteTableColumn | { original: { quote_id: string } })[];
  /** 明盘最优报价 */
  extOptimalQuote?: QuoteLite;
  /** 暗盘最优报价 */
  intOptimalQuote?: QuoteLite;
  /** 暗盘显示最优(信用债显示最优 true，利率债不显示最优，为 false) */
  intShowOptimal: boolean;
  /** 暗盘劣于明盘 */
  extBatter: boolean;
  /** 暗盘优于明盘 */
  intBatter: boolean;
  /** 暗盘价格等于明盘价格 */
  priceBothEqual: boolean;
  /** 明盘最优报价的价格 */
  extPrice: number;
  /** 暗盘最优报价的价格 */
  intPrice: number;
  /** 明盘最优报价数量 */
  extVolNum: number;
  /** 暗盘最优报价数量 */
  intVolNum: number;
  /** Broker Id */
  brokerId: string;
  /** Broker Name */
  brokerName: string;
  /** 机构 Name */
  instName: string;
  /** Trader Id */
  traderId: string;
  /** Trader Name */
  traderName: string;
  /** CP 处展示的内容，包括 instName 与 traderName */
  cp: string;
  /** 全价处展示的内容 */
  fullPrice: string;
  /** 净价处展示的内容 */
  cleanPrice: string;
  /** 利差处展示的内容 */
  spread: string;
  /** 偏离处展示的内容 */
  offset: string;
  /** 备注 */
  comment: string;
  /** 当前用户或团队协作用户对此债券有报价，但不是最优报价 */
  teamQuote: boolean;
  /** 当前用户或团队协作用户对此债券有报价，且是最优价 */
  teamOptimalQuote: boolean;
  /** CP 高亮样式 */
  cpHighlightCls: string;
  /** 文字高亮样式 */
  textHighlighCls: string;
  /** 该方向上是否存在推荐报价的样式 */
  recommendCls: string;
  /** 是否紧急 */
  isUrgent: boolean;
  /** 是否为 STC 报价 */
  isSTC: boolean;
};

export type OptimalTableColumn = GroupRowData & {
  /** 原始接口数据 */
  original: BondOptimalQuote;
  /** 「休几」的数量 */
  restDayNum?: string;
  /** 是否上市 */
  listed?: boolean;
  /** 周六/周日 */
  weekendDay?: string;
  /** 浮动利率类型 */
  frType?: string;
  /** Time */
  updateTime?: string;
  /** Bid 方向需计算的相关信息 */
  bidInfo: OptimalTableSideInfo;
  /** Ofr 方向需计算的相关信息 */
  ofrInfo: OptimalTableSideInfo;
  /** 含权类型 */
  optionType?: string;
  /** 上市日 */
  listedDate?: string;
  /** 提前还本 */
  repaymentMethod?: string;
  /** 久期 */
  valModifiedDuration?: string;
  /** 到期日 */
  maturityDate?: string;
  /** 质押率 */
  conversionRate?: string;
  /** 是否展示深度报价悬浮窗 */
  showContent?: boolean;
  /** 是否存在推荐报价的样式 */
  recommendCls: string;
  /** 显示市场后缀 */
  bondCode?: string;
  /** 票面利率 */
  couponRateCurrent: string;
  /** PVBP */
  pvbp: string;
  subRows?: OptimalTableColumn[];
  group?: CompleteQuoteGroup;
  length?: number;
  title?: string;
};

export type OptimalTableMouseEvent = TableMouseEvent<OptimalTableColumn, BondQuoteTableColumnKey>;
