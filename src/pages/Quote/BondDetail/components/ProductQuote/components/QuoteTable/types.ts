import { QuoteLite } from '@fepkg/services/types/common';
import { BasicTableColumn } from '@/pages/ProductPanel/components/BasicTable/types';

type PickBasicTableColumnKey =
  | 'original'
  | 'recommendCls'
  | 'volume'
  | 'comment'
  | 'brokerName'
  | 'instName'
  | 'traderName'
  | 'cp'
  | 'updateTime';

export type QuoteTableColumn = Pick<BasicTableColumn, PickBasicTableColumnKey>;

export type QuoteFetchType = {
  list: QuoteTableColumn[];
  total: number;
};

export type QuoteTableTableSideInfo = {
  /** 该方向上最优报价 */
  optimalQuote?: QuoteLite;
  /** 该方向最优价格的报价列表 */
  optimalQuoteList?: QuoteTableColumn[];
  /** 该方向其他价格的报价列表 */
  otherQuoteList?: QuoteTableColumn[];
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
  /** Broker Name */
  brokerName: string;
  /** 机构 Name */
  instName: string;
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
};
