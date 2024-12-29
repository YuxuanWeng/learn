import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { ColumnSettingDef } from '@fepkg/components/Table';
import { ProductType } from '@fepkg/services/types/enum';
import { cloneDeep } from 'lodash-es';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '@/pages/ProductPanel/types';

/** 信用债基本报价表格默认配置 */
export const BCO_DEFAULT_BASIC_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: true },

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
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 信用债最优报价表格默认配置 */
export const BCO_DEFAULT_OPTIMAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.VolumeBid, label: 'Vol.Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.NBid, label: 'N.Bid', width: 72, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.NOfr, label: 'N.Ofr', width: 72, visible: true },
  { key: BondQuoteTableColumnKey.VolumeOfr, label: 'Vol.Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.CouponRateCurrent, label: '票面利率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OffsetBid, label: '偏离.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OffsetOfr, label: '偏离.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.FullPriceBid, label: '全价.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPriceBid, label: '净价.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.SpreadBid, label: '利差.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.FullPriceOfr, label: '全价.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPriceOfr, label: '净价.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.SpreadOfr, label: '利差.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ConversionRate, label: '质押率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CbcRatingVal, label: '中债资信评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 信用债市场成交表格默认配置 */
export const BCO_DEFAULT_DEAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Px, label: 'Px', width: 188, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.TradedDate, label: '交易日', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.DeliveryDate, label: '交割日', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.DealTime, label: '成交日', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.LiquidationSpeed, label: '清算速度', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false }
];

/** 信用债作废区表格默认配置 */
export const BCO_DEFAULT_REFERRED_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ReferType, label: '撤销', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ReferTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: true },

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
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 利率债基本报价表格默认配置 */
export const BNC_DEFAULT_BASIC_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.FullPrice, label: '全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPrice, label: '净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Spread, label: '利差', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ConversionRate, label: '质押率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CreateTime, label: '创建日期', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CbcRatingVal, label: '中债资信评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 利率债最优报价表格默认配置 */
export const BNC_DEFAULT_OPTIMAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.VolumeBid, label: 'Vol.Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.VolumeOfr, label: 'Vol.Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CouponRateCurrent, label: '票面利率', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.FullPriceBid, label: '全价.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPriceBid, label: '净价.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.SpreadBid, label: '利差.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.FullPriceOfr, label: '全价.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPriceOfr, label: '净价.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.SpreadOfr, label: '利差.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ConversionRate, label: '质押率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CbcRatingVal, label: '中债资信评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.NBid, label: 'N.Bid', width: 72, visible: false },
  { key: BondQuoteTableColumnKey.NOfr, label: 'N.Ofr', width: 72, visible: false },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.OffsetBid, label: '偏离.Bid', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OffsetOfr, label: '偏离.Ofr', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 利率债市场成交表格默认配置 */
export const BNC_DEFAULT_DEAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Px, label: 'Px', width: 188, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.TradedDate, label: '交易日', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.DeliveryDate, label: '交割日', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.DealTime, label: '成交日', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.LiquidationSpeed, label: '清算速度', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ImpliedRating, label: '隐含评级', width: 96, visible: false }
];

/** 利率债作废区表格默认配置 */
export const BNC_DEFAULT_REFERRED_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ReferType, label: '撤销', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.ReferTime, label: 'Time', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiCleanPrice, label: '中证净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiYield, label: '中证YTM（%）', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CsiFullPrice, label: '中证全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.FullPrice, label: '全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPrice, label: '净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Spread, label: '利差', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CreateTime, label: '创建日期', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '到期日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ConversionRate, label: '质押率', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.CbcRatingVal, label: '中债资信评级', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValBasisPointValue, label: 'PVBP', width: 96, visible: false }
];

/** 存单一级表格默认配置 */
export const NCDP_DEFAULT_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.IssuerInst, label: '发行机构', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '评级', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerDate, label: '发行日期', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '期限', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Price, label: '价格', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.PriceChange, label: '变动', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: '数量(亿)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.UpdateTime, label: '最后更新', width: 160, visible: true }
];

/** 存单二级基本报价表格默认配置 */
export const NCD_DEFAULT_BASIC_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = BCO_DEFAULT_BASIC_TABLE_COLUMN.filter(
  c => c.key !== BondQuoteTableColumnKey.OptionType
);

/** 存单二级最优报价表格默认配置 */
export const NCD_DEFAULT_OPTIMAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] =
  BCO_DEFAULT_OPTIMAL_TABLE_COLUMN.filter(c => c.key !== BondQuoteTableColumnKey.OptionType);

/** 存单二级市场成交表格默认配置 */
export const NCD_DEFAULT_DEAL_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = BCO_DEFAULT_DEAL_TABLE_COLUMN.filter(
  c => c.key !== BondQuoteTableColumnKey.OptionType
);

/** 存单二级作废区表格默认配置 */
export const NCD_DEFAULT_REFERRED_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] =
  BCO_DEFAULT_REFERRED_TABLE_COLUMN.filter(c => c.key !== BondQuoteTableColumnKey.OptionType);

export const getDefaultQuoteTableColumnSettings = (productType: ProductType, tableKey: ProductPanelTableKey) => {
  switch (productType) {
    case ProductType.BCO:
      if (tableKey === ProductPanelTableKey.Basic) return cloneDeep(BCO_DEFAULT_BASIC_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Optimal) return cloneDeep(BCO_DEFAULT_OPTIMAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Bond) return cloneDeep(BCO_DEFAULT_OPTIMAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Deal) return cloneDeep(BCO_DEFAULT_DEAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Referred) return cloneDeep(BCO_DEFAULT_REFERRED_TABLE_COLUMN);
      return [];
    case ProductType.BNC:
      if (tableKey === ProductPanelTableKey.Basic) return cloneDeep(BNC_DEFAULT_BASIC_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Optimal) return cloneDeep(BNC_DEFAULT_OPTIMAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Bond) return cloneDeep(BNC_DEFAULT_OPTIMAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Deal) return cloneDeep(BNC_DEFAULT_DEAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Referred) return cloneDeep(BNC_DEFAULT_REFERRED_TABLE_COLUMN);
      return [];
    case ProductType.NCDP:
      return cloneDeep(NCDP_DEFAULT_TABLE_COLUMN);
    case ProductType.NCD:
      if (tableKey === ProductPanelTableKey.Basic) return cloneDeep(NCD_DEFAULT_BASIC_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Optimal) return cloneDeep(NCD_DEFAULT_OPTIMAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Bond) return cloneDeep(NCD_DEFAULT_OPTIMAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Deal) return cloneDeep(NCD_DEFAULT_DEAL_TABLE_COLUMN);
      if (tableKey === ProductPanelTableKey.Referred) return cloneDeep(NCD_DEFAULT_REFERRED_TABLE_COLUMN);
      return [];
    default:
      return [];
  }
};

/** 深度报价BID方向表格 */
export const DEEP_QUOTE_BID_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.Broker, label: '', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: '', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: '', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: '', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Comment, label: '', width: 80, visible: true }
];

/** 深度报价OFR方向表格 */
export const DEEP_QUOTE_OFR_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.Comment, label: '', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: '', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: '', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Cp, label: '', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: '', width: 80, visible: true }
];

/** 操作日志表格 */
export const OPERATION_LOG_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.CreateTime, label: '操作时间', width: 200, visible: true },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.OperationType, label: '操作类型', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.OperationSource, label: '操作源', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ReferType, label: '撤销', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.Bid, label: 'Bid', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Ofr, label: 'Ofr', width: 144, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.Broker, label: 'Broker', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.UpdateTime, label: 'Time', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.Cp, label: 'CP', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.FullPrice, label: '全价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.CleanPrice, label: '净价', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.Spread, label: '利差', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false }
];

/** ncdp操作日志表格 */
export const NCDP_OPERATION_LOG_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.CreateTime, label: '操作时间', width: 200, visible: true },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.OperationType, label: '操作类型', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.IssuerInst, label: '发行机构', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.IssuerDate, label: '发行日期', width: 176, visible: true },
  { key: BondQuoteTableColumnKey.MaturityDate, label: '期限', width: 120, visible: true },
  {
    key: BondQuoteTableColumnKey.Price,
    label: '价格',
    width: 144,
    visible: true
  },
  { key: BondQuoteTableColumnKey.PriceChange, label: '变动', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 160, visible: true }
];

/** 市场成交日志表格默认配置 */
export const MARKET_LOG_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.CreateTime, label: '操作时间', width: 200, visible: true },
  { key: BondQuoteTableColumnKey.Operator, label: '操作人', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.OperationSource, label: '操作源', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.OperationType, label: '操作类型', width: 240, visible: true },
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BondCode, label: '代码', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Px, label: 'Px', width: 188, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.IssuerRatingVal, label: '主体评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.DealTime, label: '成交日', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.BondRatingVal, label: '债券评级', width: 96, visible: true },
  { key: BondQuoteTableColumnKey.ValCleanPrice, label: '中债净价', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.ValYield, label: '中债YTM（%)', width: 120, visible: true },

  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 176, visible: false },
  { key: BondQuoteTableColumnKey.OptionType, label: '含权类型', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.ListedDate, label: '上市日', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.RepaymentMethod, label: '提前还本', width: 120, visible: false },
  { key: BondQuoteTableColumnKey.ValModifiedDuration, label: '久期', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.Comment, label: '备注', width: 96, visible: false },
  { key: BondQuoteTableColumnKey.DealStatus, label: '成交状态', width: 104, visible: false }
];

/** 市场成交推荐弹窗默认配置 */
export const MARKET_RECOMMEND_TABLE_COLUMN: BondQuoteTableColumnSettingItem[] = [
  { key: BondQuoteTableColumnKey.FirstMaturityDate, label: '剩余期限', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.ShortName, label: '简称', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.Px, label: 'Px', width: 180, visible: true },
  { key: BondQuoteTableColumnKey.Volume, label: 'Vol', width: 80, visible: true },
  { key: BondQuoteTableColumnKey.CpBid, label: 'CP.Bid', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BrokerB, label: 'Broker(B)', width: 120, visible: true },
  { key: BondQuoteTableColumnKey.CpOfr, label: 'CP.Ofr', width: 160, visible: true },
  { key: BondQuoteTableColumnKey.BrokerO, label: 'Broker(O)', width: 120, visible: true }
];

/** 从缓存中恢复列设置，并与代码中默认值diff，展示最新的列设置 */
export const getInitTableColumnsSettings = (
  defaultSettings: ColumnSettingDef[],
  cacheSettings?: ColumnSettingDef[]
) => {
  if (!cacheSettings) return defaultSettings;
  const mergeKeys: string[] = [];
  // 从缓存中恢复的可用列设置
  const mergeSettings = cacheSettings.filter(setting => {
    const isMerge = defaultSettings.some(s => s.key === setting.key);
    if (isMerge) mergeKeys.push(setting.key);
    return isMerge;
  });
  // 代码中新增的列设置
  const newSettings = defaultSettings.filter(setting => !mergeKeys.includes(setting.key));
  return [...mergeSettings, ...newSettings];
};
