import { ColumnFieldsEnum } from '../types/column-fields-enum';

/** 外发给山西证券的字段 */
export const MarketNotifySorTags = [
  ColumnFieldsEnum.TradeRequestID,
  ColumnFieldsEnum.TradeID,
  ColumnFieldsEnum.SecondaryTradeID,
  ColumnFieldsEnum.TradeRequestType,
  ColumnFieldsEnum.MsgType,
  ColumnFieldsEnum.SenderCompID,
  ColumnFieldsEnum.TargetCompID,
  ColumnFieldsEnum.OnBehalfOfCompID,
  ColumnFieldsEnum.TradeMatchTimestamp,
  ColumnFieldsEnum.OrdStatus,
  ColumnFieldsEnum.TrdType,
  ColumnFieldsEnum.TrdSubType,
  ColumnFieldsEnum.MarketIndicator,
  ColumnFieldsEnum.SecurityType,
  ColumnFieldsEnum.SecurityID,
  ColumnFieldsEnum.Symbol,
  ColumnFieldsEnum.MaturityDate,
  ColumnFieldsEnum.YieldType,
  ColumnFieldsEnum.Yield,
  ColumnFieldsEnum.NoStipulations,
  // ColumnFieldsEnum.StipulationType,
  // ColumnFieldsEnum.StipulationValue,
  ColumnFieldsEnum.LastQty,
  ColumnFieldsEnum.CleanPrice,
  ColumnFieldsEnum.DirtyPrice,
  ColumnFieldsEnum.SettleCurrAmt,
  ColumnFieldsEnum.Side,
  ColumnFieldsEnum.SettleType,
  ColumnFieldsEnum.SettleDate,
  ColumnFieldsEnum.DeliveryType,
  ColumnFieldsEnum.TradeDate,
  ColumnFieldsEnum.NoAllocs,
  // ColumnFieldsEnum.AllocAccount,
  // ColumnFieldsEnum.IndividualAllocID,
  // ColumnFieldsEnum.AllocText,
  ColumnFieldsEnum.Text,
  ColumnFieldsEnum.TrdMatchID,
  ColumnFieldsEnum.TransactTime,
  ColumnFieldsEnum.NoPayments,
  // ColumnFieldsEnum.PaymentType,
  // ColumnFieldsEnum.PaymentFixedRate,
  // ColumnFieldsEnum.PaymentAmount,
  ColumnFieldsEnum.NoPartyIDs,
  // ColumnFieldsEnum.PartyID,
  // ColumnFieldsEnum.PartyRole,
  // ColumnFieldsEnum.NoPartySubID,
  // ColumnFieldsEnum.PartySubID,
  // ColumnFieldsEnum.PartySubIDType,
  ColumnFieldsEnum.SorVersion
];

/** 通用 系统内部提供字段——默认字段 */
export const MarketNotifyBasicTags = [
  ColumnFieldsEnum.BeginString,
  ColumnFieldsEnum.TargetCompID,
  ColumnFieldsEnum.SenderCompID,
  ColumnFieldsEnum.MsgType,
  ColumnFieldsEnum.BondMsgType,
  ColumnFieldsEnum.BondMsgMethod,
  ColumnFieldsEnum.Version,
  ColumnFieldsEnum.PushMessageCompanyId,
  ColumnFieldsEnum.PushMessageCompanyName,
  ColumnFieldsEnum.CreateTime,
  ColumnFieldsEnum.DelFlag
];

/** 二级市场 系统内部提供字段——债券基础信息 */
export const MarketNotifyBondTags = [
  ColumnFieldsEnum.BondCode,
  ColumnFieldsEnum.BondKey,
  ColumnFieldsEnum.BondKeyListedMarket,
  ColumnFieldsEnum.BondShortName,
  ColumnFieldsEnum.CouponRate,
  ColumnFieldsEnum.Id,
  ColumnFieldsEnum.ListedMarket,
  ColumnFieldsEnum.RateType,
  ColumnFieldsEnum.AcrossMarket,
  ColumnFieldsEnum.AcrossMarketBondCodes,
  ColumnFieldsEnum.BondCategory,
  ColumnFieldsEnum.BondRating,
  ColumnFieldsEnum.BondRatingOrder,
  ColumnFieldsEnum.BondType,
  ColumnFieldsEnum.CompanyBond,
  ColumnFieldsEnum.EnterpriseType,
  ColumnFieldsEnum.FilterMaturity,
  ColumnFieldsEnum.FinancingPlatform,
  ColumnFieldsEnum.GuaranteeType,
  ColumnFieldsEnum.Guarenteed,
  ColumnFieldsEnum.HasOption,
  ColumnFieldsEnum.IssueInstitution,
  ColumnFieldsEnum.IssueProvinceCode,
  ColumnFieldsEnum.IssueYear,
  ColumnFieldsEnum.IssuerRatingFilter,
  ColumnFieldsEnum.IssuerRatingOrder,
  ColumnFieldsEnum.ListedDate,
  ColumnFieldsEnum.MarketType,
  ColumnFieldsEnum.Maturity,
  ColumnFieldsEnum.MaturityDateType,
  ColumnFieldsEnum.MaturityHolidays,
  ColumnFieldsEnum.Municipal,
  ColumnFieldsEnum.OnTheRun,
  ColumnFieldsEnum.Pledged,
  ColumnFieldsEnum.RateIndex,
  ColumnFieldsEnum.RatingInstitution,
  ColumnFieldsEnum.SwSectorCode,
  ColumnFieldsEnum.SwSectorUpperCode,
  ColumnFieldsEnum.TimeToMaturity,
  ColumnFieldsEnum.TimeToMaturityReal,
  ColumnFieldsEnum.CompletedBondType
];

/** 二级市场 系统内部提供字段——最优报价信息 */
export const MarketNotifyQuoteTags = [
  ColumnFieldsEnum.QuoteSide,
  ColumnFieldsEnum.BestBidCleanPrice,
  ColumnFieldsEnum.BestBidDirtyPrice,
  ColumnFieldsEnum.BestBidQuoteCount,
  ColumnFieldsEnum.BestBidVolume,
  ColumnFieldsEnum.BestBidVolumeClient,
  ColumnFieldsEnum.BestOfrCleanPrice,
  ColumnFieldsEnum.BestOfrDirtyPrice,
  ColumnFieldsEnum.BestOfrQuoteCount,
  ColumnFieldsEnum.BestOfrVolume,
  ColumnFieldsEnum.BestOfrVolumeClient,
  ColumnFieldsEnum.BidBadFlag,
  ColumnFieldsEnum.BidBargainFlag,
  ColumnFieldsEnum.BidDescription,
  ColumnFieldsEnum.BidFanDian,
  ColumnFieldsEnum.BidFanDianFlag,
  ColumnFieldsEnum.BidFanDianString,
  ColumnFieldsEnum.BidInternalFlag,
  ColumnFieldsEnum.BidOcoFlag,
  ColumnFieldsEnum.BidOfrSpread,
  ColumnFieldsEnum.BidPrice,
  ColumnFieldsEnum.BidPriceString,
  ColumnFieldsEnum.BidQuoteCount,
  ColumnFieldsEnum.BidQuoteId,
  ColumnFieldsEnum.BidQuoteType,
  ColumnFieldsEnum.BidYieldType,
  ColumnFieldsEnum.HavingBidQuote,
  ColumnFieldsEnum.HavingOfrQuote,
  ColumnFieldsEnum.HavingQuote,
  ColumnFieldsEnum.OfrBadFlag,
  ColumnFieldsEnum.OfrBargainFlag,
  ColumnFieldsEnum.OfrDescription,
  ColumnFieldsEnum.OfrFanDian,
  ColumnFieldsEnum.OfrFanDianFlag,
  ColumnFieldsEnum.OfrFanDianString,
  ColumnFieldsEnum.OfrInternalFlag,
  ColumnFieldsEnum.OfrOcoFlag,
  ColumnFieldsEnum.OfrPrice,
  ColumnFieldsEnum.OfrPriceString,
  ColumnFieldsEnum.OfrQuoteCount,
  ColumnFieldsEnum.OfrQuoteId,
  ColumnFieldsEnum.OfrQuoteType,
  ColumnFieldsEnum.OfrYieldType,
  ColumnFieldsEnum.TwoSided,
  ColumnFieldsEnum.BidYield,
  ColumnFieldsEnum.OfrYield,
  ColumnFieldsEnum.BestBidVolumeTotal,
  ColumnFieldsEnum.BestOfrVolumeTotal,
  ColumnFieldsEnum.BestBidDescription,
  ColumnFieldsEnum.BestOfrDescription,
  ColumnFieldsEnum.OfrBrokerDepartmentName,
  ColumnFieldsEnum.BidBrokerDepartmentName
];

/** 二级市场 系统内部提供字段——成交信息 */
export const MarketNotifyDealTags = [
  ColumnFieldsEnum.DealCleanPrice,
  ColumnFieldsEnum.DealBondVolumeUnit,
  ColumnFieldsEnum.DealInternal,
  ColumnFieldsEnum.DealTime,
  ColumnFieldsEnum.DealDescription,
  ColumnFieldsEnum.DealDirection,
  ColumnFieldsEnum.DealDirtyPrice,
  ColumnFieldsEnum.DealFanDian,
  ColumnFieldsEnum.DealFanDianFlag,
  ColumnFieldsEnum.DealPrice,
  ColumnFieldsEnum.DealPriceType,
  ColumnFieldsEnum.DealSettlementAmount,
  ColumnFieldsEnum.DealDeliveryTime,
  ColumnFieldsEnum.DealSettlementMode,
  ColumnFieldsEnum.DealLiquidationSpeed,
  ColumnFieldsEnum.DealVolume,
  ColumnFieldsEnum.DealYield,
  ColumnFieldsEnum.DealTimeStr,
  ColumnFieldsEnum.DealOperatorDepartmentName
];

/** 一级市场 系统内部提供字段——报价信息 */
export const PrimaryMarketNotifyTags = [
  ColumnFieldsEnum.IssueInstitution,
  ColumnFieldsEnum.IssuerRatingFilter,
  ColumnFieldsEnum.IssueDate,
  ColumnFieldsEnum.TimeToMaturity,
  ColumnFieldsEnum.NCDPPrice,
  ColumnFieldsEnum.NCDPVolume,
  ColumnFieldsEnum.NCDPFlagFull,
  ColumnFieldsEnum.NCDPPriceChange,
  ColumnFieldsEnum.AllocText
];

/** 系统内部提供字段——默认字段 */
export const MarketNotifyFields = [
  // 目的是为了去重，一级市场和二级市场可配置的的字段是不一样的，但有少部分字段相同
  // 表格中需要展示包含一级和二级的所有字段
  ...new Set([
    // 二级市场
    ...MarketNotifyBasicTags,
    ...MarketNotifyBondTags,
    ...MarketNotifyQuoteTags,
    ...MarketNotifyDealTags,
    // 一级市场
    ...PrimaryMarketNotifyTags
  ])
];
