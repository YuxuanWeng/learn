/** 单券详情界面表格设置相关默认数据 */
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BondQuoteTableColumnSettingItem } from '@/pages/ProductPanel/types';

/** Bid 基本报价表格默认配置 */
const BID_DEFAULT_QUOTE_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 70, visible: true },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 88, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 56, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true }
];

/** Ofr 基本表格默认配置 */
const OFR_DEFAULT_QUOTE_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 56, visible: true },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 88, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 70, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: true }
];

/** 市场成交单表格默认配置 */
const DEFAULT_DEAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.DealTime, label: '成交日', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Px, label: 'Px', width: 188, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.TradedDate, label: '交易日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.DeliveryDate, label: '交割日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.LiquidationSpeed, label: '清算速度', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false }
];

/** 信用债报价作废区表格默认配置 */
const BCO_DEFAULT_REFERRED_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.ReferTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ReferType, label: '撤销', width: 80, visible: true },

  { key: BondQuoteTableColumnKey.FullPrice, label: '全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPrice, label: '净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Spread, label: '利差', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CreateTime, label: '创建日期', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ConversionRate, label: '质押率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CbcRatingVal, label: '中债资信评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 利率债报价作废区表格默认配置 */
const BNC_DEFAULT_REFERRED_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.ReferTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ReferType, label: '撤销', width: 80, visible: true },

  { key: BondQuoteTableColumnKey.FullPrice, label: '全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPrice, label: '净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Spread, label: '利差', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CreateTime, label: '创建日期', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ConversionRate, label: '质押率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CbcRatingVal, label: '中债资信评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: false },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/**
 * 进行表格设置的4个表格
 */
export enum BondDetailTableType {
  QuoteBid = 'quoteBid',
  QuoteOfr = 'quoteOfr',
  QuoteDeal = 'quoteDeal',
  QuoteReferred = 'quoteReferred'
}

export const getDefaultTableSettingItem = (productType: ProductType, type: BondDetailTableType) => {
  switch (productType) {
    case ProductType.BCO:
    case ProductType.NCD:
      if (type === BondDetailTableType.QuoteBid) return BID_DEFAULT_QUOTE_TABLE_COLUMN;
      if (type === BondDetailTableType.QuoteOfr) return OFR_DEFAULT_QUOTE_TABLE_COLUMN;
      if (type === BondDetailTableType.QuoteDeal) return DEFAULT_DEAL_TABLE_COLUMN;
      if (type === BondDetailTableType.QuoteReferred) return BCO_DEFAULT_REFERRED_TABLE_COLUMN;
      return [];
    case ProductType.BNC:
      if (type === BondDetailTableType.QuoteBid) return BID_DEFAULT_QUOTE_TABLE_COLUMN;
      if (type === BondDetailTableType.QuoteOfr) return OFR_DEFAULT_QUOTE_TABLE_COLUMN;
      if (type === BondDetailTableType.QuoteDeal) return DEFAULT_DEAL_TABLE_COLUMN;
      if (type === BondDetailTableType.QuoteReferred) return BNC_DEFAULT_REFERRED_TABLE_COLUMN;
      return [];
    default:
      return [];
  }
};
