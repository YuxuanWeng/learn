import { ColumnFieldsEnum } from '../types/column-fields-enum';

export type TypeColumnFields = {
  id: ColumnFieldsEnum;
  name_cn: string;
  name_en: string;
};

/** 外发字段中英文名映射 */
export const ColumnFieldMap: Record<ColumnFieldsEnum, TypeColumnFields> = {
  [ColumnFieldsEnum.BeginString]: { id: ColumnFieldsEnum.BeginString, name_cn: '协议版本', name_en: 'BeginString' },
  [ColumnFieldsEnum.MsgType]: { id: ColumnFieldsEnum.MsgType, name_cn: '消息类型', name_en: 'MsgType' },
  [ColumnFieldsEnum.SenderCompID]: { id: ColumnFieldsEnum.SenderCompID, name_cn: '发送方id', name_en: 'SenderCompID' },
  [ColumnFieldsEnum.TargetCompID]: { id: ColumnFieldsEnum.TargetCompID, name_cn: '接收方id', name_en: 'TargetCompID' },
  [ColumnFieldsEnum.BondMsgType]: { id: ColumnFieldsEnum.BondMsgType, name_cn: '数据类型', name_en: 'BondMsgType' },
  [ColumnFieldsEnum.BondMsgMethod]: {
    id: ColumnFieldsEnum.BondMsgMethod,
    name_cn: '操作类型',
    name_en: 'BondMsgMethod'
  },
  [ColumnFieldsEnum.Version]: { id: ColumnFieldsEnum.Version, name_cn: '当前版本号', name_en: 'Version' },
  [ColumnFieldsEnum.BondCode]: { id: ColumnFieldsEnum.BondCode, name_cn: '债券code', name_en: 'BondCode' },
  [ColumnFieldsEnum.BondKey]: { id: ColumnFieldsEnum.BondKey, name_cn: '债券key', name_en: 'BondKey' },
  [ColumnFieldsEnum.BondKeyListedMarket]: {
    id: ColumnFieldsEnum.BondKeyListedMarket,
    name_cn: '债券唯一标识',
    name_en: 'BondKeyListedMarket'
  },
  [ColumnFieldsEnum.BondShortName]: {
    id: ColumnFieldsEnum.BondShortName,
    name_cn: '债券简称',
    name_en: 'BondShortName'
  },
  [ColumnFieldsEnum.DealCleanPrice]: {
    id: ColumnFieldsEnum.DealCleanPrice,
    name_cn: '成交净价',
    name_en: 'DealCleanPrice'
  },
  [ColumnFieldsEnum.CouponRate]: { id: ColumnFieldsEnum.CouponRate, name_cn: '票面利率', name_en: 'CouponRate' },
  [ColumnFieldsEnum.CreateTime]: { id: ColumnFieldsEnum.CreateTime, name_cn: '创建时间', name_en: 'CreateTime' },
  [ColumnFieldsEnum.DealBondVolumeUnit]: {
    id: ColumnFieldsEnum.DealBondVolumeUnit,
    name_cn: '成交券面总额单位',
    name_en: 'DealBondVolumeUnit'
  },
  [ColumnFieldsEnum.DealInternal]: {
    id: ColumnFieldsEnum.DealInternal,
    name_cn: '成交内部标识',
    name_en: 'DealInternal'
  },
  [ColumnFieldsEnum.DealTime]: { id: ColumnFieldsEnum.DealTime, name_cn: '成交时间戳', name_en: 'DealTime' },
  [ColumnFieldsEnum.DelFlag]: { id: ColumnFieldsEnum.DelFlag, name_cn: '删除标记', name_en: 'DelFlag' },
  [ColumnFieldsEnum.DealDescription]: {
    id: ColumnFieldsEnum.DealDescription,
    name_cn: '成交备注',
    name_en: 'DealDescription'
  },
  [ColumnFieldsEnum.DealDirection]: {
    id: ColumnFieldsEnum.DealDirection,
    name_cn: '成交方向',
    name_en: 'DealDirection'
  },
  [ColumnFieldsEnum.DealDirtyPrice]: {
    id: ColumnFieldsEnum.DealDirtyPrice,
    name_cn: '成交全价',
    name_en: 'DealDirtyPrice'
  },
  [ColumnFieldsEnum.DealFanDian]: { id: ColumnFieldsEnum.DealFanDian, name_cn: '成交返点值', name_en: 'DealFanDian' },
  [ColumnFieldsEnum.DealFanDianFlag]: {
    id: ColumnFieldsEnum.DealFanDianFlag,
    name_cn: '成交返点标识',
    name_en: 'DealFanDianFlag'
  },
  [ColumnFieldsEnum.Id]: { id: ColumnFieldsEnum.Id, name_cn: '产品ID', name_en: 'Id' },
  [ColumnFieldsEnum.ListedMarket]: { id: ColumnFieldsEnum.ListedMarket, name_cn: '交易市场', name_en: 'ListedMarket' },
  [ColumnFieldsEnum.DealPrice]: { id: ColumnFieldsEnum.DealPrice, name_cn: '成交价', name_en: 'DealPrice' },
  [ColumnFieldsEnum.PushMessageCompanyId]: {
    id: ColumnFieldsEnum.PushMessageCompanyId,
    name_cn: '货币经纪公司ID',
    name_en: 'PushMessageCompanyId'
  },
  [ColumnFieldsEnum.PushMessageCompanyName]: {
    id: ColumnFieldsEnum.PushMessageCompanyName,
    name_cn: '货币经纪公司名称',
    name_en: 'PushMessageCompanyName'
  },
  [ColumnFieldsEnum.QuoteSide]: { id: ColumnFieldsEnum.QuoteSide, name_cn: '报价方向', name_en: 'QuoteSide' },
  [ColumnFieldsEnum.DealPriceType]: {
    id: ColumnFieldsEnum.DealPriceType,
    name_cn: '成交价格类型',
    name_en: 'DealPriceType'
  },
  [ColumnFieldsEnum.RateType]: { id: ColumnFieldsEnum.RateType, name_cn: '利率类型', name_en: 'RateType' },
  [ColumnFieldsEnum.DealSettlementAmount]: {
    id: ColumnFieldsEnum.DealSettlementAmount,
    name_cn: '成交结算金额',
    name_en: 'DealSettlementAmount'
  },
  [ColumnFieldsEnum.DealDeliveryTime]: {
    id: ColumnFieldsEnum.DealDeliveryTime,
    name_cn: '成交交割时间',
    name_en: 'DealDeliveryTime'
  },
  [ColumnFieldsEnum.DealSettlementMode]: {
    id: ColumnFieldsEnum.DealSettlementMode,
    name_cn: '成交结算模式',
    name_en: 'DealSettlementMode'
  },
  [ColumnFieldsEnum.DealLiquidationSpeed]: {
    id: ColumnFieldsEnum.DealLiquidationSpeed,
    name_cn: '成交清算速度',
    name_en: 'DealLiquidationSpeed'
  },
  [ColumnFieldsEnum.DealVolume]: { id: ColumnFieldsEnum.DealVolume, name_cn: '成交券面总额', name_en: 'DealVolume' },
  [ColumnFieldsEnum.DealYield]: { id: ColumnFieldsEnum.DealYield, name_cn: '成交收益率', name_en: 'DealYield' },
  [ColumnFieldsEnum.AcrossMarket]: {
    id: ColumnFieldsEnum.AcrossMarket,
    name_cn: '是否跨市场',
    name_en: 'AcrossMarket'
  },
  [ColumnFieldsEnum.AcrossMarketBondCodes]: {
    id: ColumnFieldsEnum.AcrossMarketBondCodes,
    name_cn: '相关跨市场债券',
    name_en: 'AcrossMarketBondCodes'
  },
  [ColumnFieldsEnum.BestBidCleanPrice]: {
    id: ColumnFieldsEnum.BestBidCleanPrice,
    name_cn: 'Bid最优净价',
    name_en: 'BestBidCleanPrice'
  },
  [ColumnFieldsEnum.BestBidDirtyPrice]: {
    id: ColumnFieldsEnum.BestBidDirtyPrice,
    name_cn: 'Bid最优全价',
    name_en: 'BestBidDirtyPrice'
  },
  [ColumnFieldsEnum.BestBidQuoteCount]: {
    id: ColumnFieldsEnum.BestBidQuoteCount,
    name_cn: 'Bid最优报价个数',
    name_en: 'BestBidQuoteCount'
  },
  [ColumnFieldsEnum.BestBidVolume]: {
    id: ColumnFieldsEnum.BestBidVolume,
    name_cn: 'Bid最优报价量',
    name_en: 'BestBidVolume'
  },
  [ColumnFieldsEnum.BestBidVolumeClient]: {
    id: ColumnFieldsEnum.BestBidVolumeClient,
    name_cn: 'Bid最优总量',
    name_en: 'BestBidVolumeClient'
  },
  [ColumnFieldsEnum.BestOfrCleanPrice]: {
    id: ColumnFieldsEnum.BestOfrCleanPrice,
    name_cn: 'Ofr最优净价',
    name_en: 'BestOfrCleanPrice'
  },
  [ColumnFieldsEnum.BestOfrDirtyPrice]: {
    id: ColumnFieldsEnum.BestOfrDirtyPrice,
    name_cn: 'Ofr最优全价',
    name_en: 'BestOfrDirtyPrice'
  },
  [ColumnFieldsEnum.BestOfrQuoteCount]: {
    id: ColumnFieldsEnum.BestOfrQuoteCount,
    name_cn: 'Ofr最优报价个数',
    name_en: 'BestOfrQuoteCount'
  },
  [ColumnFieldsEnum.BestOfrVolume]: {
    id: ColumnFieldsEnum.BestOfrVolume,
    name_cn: 'Ofr最优报价量',
    name_en: 'BestOfrVolume'
  },
  [ColumnFieldsEnum.BestOfrVolumeClient]: {
    id: ColumnFieldsEnum.BestOfrVolumeClient,
    name_cn: 'Ofr最优总量',
    name_en: 'BestOfrVolumeClient'
  },
  [ColumnFieldsEnum.BidBadFlag]: { id: ColumnFieldsEnum.BidBadFlag, name_cn: 'Bid方Bad标识', name_en: 'BidBadFlag' },
  [ColumnFieldsEnum.BidBargainFlag]: {
    id: ColumnFieldsEnum.BidBargainFlag,
    name_cn: 'Bid议价标识',
    name_en: 'BidBargainFlag'
  },
  [ColumnFieldsEnum.BidDescription]: {
    id: ColumnFieldsEnum.BidDescription,
    name_cn: 'Bid报价描述',
    name_en: 'BidDescription'
  },
  [ColumnFieldsEnum.BidFanDian]: { id: ColumnFieldsEnum.BidFanDian, name_cn: 'Bid返点数', name_en: 'BidFanDian' },
  [ColumnFieldsEnum.BidFanDianFlag]: {
    id: ColumnFieldsEnum.BidFanDianFlag,
    name_cn: 'Bid返点标识',
    name_en: 'BidFanDianFlag'
  },
  [ColumnFieldsEnum.BidFanDianString]: {
    id: ColumnFieldsEnum.BidFanDianString,
    name_cn: 'Bid返点描述',
    name_en: 'BidFanDianString'
  },
  [ColumnFieldsEnum.BidInternalFlag]: {
    id: ColumnFieldsEnum.BidInternalFlag,
    name_cn: 'Bid内部标识',
    name_en: 'BidInternalFlag'
  },
  [ColumnFieldsEnum.BidOcoFlag]: { id: ColumnFieldsEnum.BidOcoFlag, name_cn: 'BidOCO标识', name_en: 'BidOcoFlag' },
  [ColumnFieldsEnum.BidOfrSpread]: { id: ColumnFieldsEnum.BidOfrSpread, name_cn: '价差', name_en: 'BidOfrSpread' },
  [ColumnFieldsEnum.BidPrice]: { id: ColumnFieldsEnum.BidPrice, name_cn: 'Bid价格', name_en: 'BidPrice' },
  [ColumnFieldsEnum.BidPriceString]: {
    id: ColumnFieldsEnum.BidPriceString,
    name_cn: 'Bid价格描述',
    name_en: 'BidPriceString'
  },
  [ColumnFieldsEnum.BidQuoteCount]: {
    id: ColumnFieldsEnum.BidQuoteCount,
    name_cn: 'Bid报价个数',
    name_en: 'BidQuoteCount'
  },
  [ColumnFieldsEnum.BidQuoteId]: { id: ColumnFieldsEnum.BidQuoteId, name_cn: 'Bid报价ID', name_en: 'BidQuoteId' },
  [ColumnFieldsEnum.BidQuoteType]: {
    id: ColumnFieldsEnum.BidQuoteType,
    name_cn: 'Bid报价类型',
    name_en: 'BidQuoteType'
  },
  [ColumnFieldsEnum.BidYieldType]: {
    id: ColumnFieldsEnum.BidYieldType,
    name_cn: 'Bid收益率类型',
    name_en: 'BidYieldType'
  },
  [ColumnFieldsEnum.BondCategory]: { id: ColumnFieldsEnum.BondCategory, name_cn: '债券种类', name_en: 'BondCategory' },
  [ColumnFieldsEnum.BondRating]: { id: ColumnFieldsEnum.BondRating, name_cn: '债券评级', name_en: 'BondRating' },
  [ColumnFieldsEnum.BondRatingOrder]: {
    id: ColumnFieldsEnum.BondRatingOrder,
    name_cn: '债券评级权值',
    name_en: 'BondRatingOrder'
  },
  [ColumnFieldsEnum.BondType]: { id: ColumnFieldsEnum.BondType, name_cn: '债券类型', name_en: 'BondType' },
  [ColumnFieldsEnum.CompanyBond]: { id: ColumnFieldsEnum.CompanyBond, name_cn: '公司债', name_en: 'CompanyBond' },
  [ColumnFieldsEnum.CompletedBondType]: {
    id: ColumnFieldsEnum.CompletedBondType,
    name_cn: '完整报价中债券类型',
    name_en: 'CompletedBondType'
  },
  [ColumnFieldsEnum.EnterpriseType]: {
    id: ColumnFieldsEnum.EnterpriseType,
    name_cn: '机构类型',
    name_en: 'EnterpriseType'
  },
  [ColumnFieldsEnum.FilterMaturity]: {
    id: ColumnFieldsEnum.FilterMaturity,
    name_cn: '行权/到期日',
    name_en: 'FilterMaturity'
  },
  [ColumnFieldsEnum.FinancingPlatform]: {
    id: ColumnFieldsEnum.FinancingPlatform,
    name_cn: '平台债',
    name_en: 'FinancingPlatform'
  },
  [ColumnFieldsEnum.GuaranteeType]: {
    id: ColumnFieldsEnum.GuaranteeType,
    name_cn: '担保方式',
    name_en: 'GuaranteeType'
  },
  [ColumnFieldsEnum.Guarenteed]: { id: ColumnFieldsEnum.Guarenteed, name_cn: '有无担保', name_en: 'Guarenteed' },
  [ColumnFieldsEnum.HasOption]: { id: ColumnFieldsEnum.HasOption, name_cn: '是否含权', name_en: 'HasOption' },
  [ColumnFieldsEnum.HavingBidQuote]: {
    id: ColumnFieldsEnum.HavingBidQuote,
    name_cn: '是否有Bid方报价',
    name_en: 'HavingBidQuote'
  },
  [ColumnFieldsEnum.HavingOfrQuote]: {
    id: ColumnFieldsEnum.HavingOfrQuote,
    name_cn: '是否有Ofr方报价',
    name_en: 'HavingOfrQuote'
  },
  [ColumnFieldsEnum.HavingQuote]: { id: ColumnFieldsEnum.HavingQuote, name_cn: '是否有报价', name_en: 'HavingQuote' },
  [ColumnFieldsEnum.IssueInstitution]: {
    id: ColumnFieldsEnum.IssueInstitution,
    name_cn: '发行机构（发行人）',
    name_en: 'IssueInstitution'
  },
  [ColumnFieldsEnum.IssueProvinceCode]: {
    id: ColumnFieldsEnum.IssueProvinceCode,
    name_cn: '发行省份代码',
    name_en: 'IssueProvinceCode'
  },
  [ColumnFieldsEnum.IssueYear]: { id: ColumnFieldsEnum.IssueYear, name_cn: '发行年份', name_en: 'IssueYear' },
  [ColumnFieldsEnum.IssuerRatingFilter]: {
    id: ColumnFieldsEnum.IssuerRatingFilter,
    name_cn: '主体评级',
    name_en: 'IssuerRatingFilter'
  },
  [ColumnFieldsEnum.IssuerRatingOrder]: {
    id: ColumnFieldsEnum.IssuerRatingOrder,
    name_cn: '主体评级权值',
    name_en: 'IssuerRatingOrder'
  },
  [ColumnFieldsEnum.ListedDate]: { id: ColumnFieldsEnum.ListedDate, name_cn: '上市日', name_en: 'ListedDate' },
  [ColumnFieldsEnum.MarketType]: { id: ColumnFieldsEnum.MarketType, name_cn: '市场类型', name_en: 'MarketType' },
  [ColumnFieldsEnum.Maturity]: { id: ColumnFieldsEnum.Maturity, name_cn: '到期日', name_en: 'Maturity' },
  [ColumnFieldsEnum.MaturityDateType]: {
    id: ColumnFieldsEnum.MaturityDateType,
    name_cn: '到期日是否节假日',
    name_en: 'MaturityDateType'
  },
  [ColumnFieldsEnum.MaturityHolidays]: {
    id: ColumnFieldsEnum.MaturityHolidays,
    name_cn: '到期日距工作日日期',
    name_en: 'MaturityHolidays'
  },
  [ColumnFieldsEnum.Municipal]: { id: ColumnFieldsEnum.Municipal, name_cn: '是否城投债', name_en: 'Municipal' },
  [ColumnFieldsEnum.OfrBadFlag]: { id: ColumnFieldsEnum.OfrBadFlag, name_cn: 'Ofr方Bad标识', name_en: 'OfrBadFlag' },
  [ColumnFieldsEnum.OfrBargainFlag]: {
    id: ColumnFieldsEnum.OfrBargainFlag,
    name_cn: 'Ofr议价标识',
    name_en: 'OfrBargainFlag'
  },
  [ColumnFieldsEnum.OfrDescription]: {
    id: ColumnFieldsEnum.OfrDescription,
    name_cn: 'Ofr报价描述',
    name_en: 'OfrDescription'
  },
  [ColumnFieldsEnum.OfrFanDian]: { id: ColumnFieldsEnum.OfrFanDian, name_cn: 'Ofr返点数', name_en: 'OfrFanDian' },
  [ColumnFieldsEnum.OfrFanDianFlag]: {
    id: ColumnFieldsEnum.OfrFanDianFlag,
    name_cn: 'Ofr返点标识',
    name_en: 'OfrFanDianFlag'
  },
  [ColumnFieldsEnum.OfrFanDianString]: {
    id: ColumnFieldsEnum.OfrFanDianString,
    name_cn: 'Ofr返点描述',
    name_en: 'OfrFanDianString'
  },
  [ColumnFieldsEnum.OfrInternalFlag]: {
    id: ColumnFieldsEnum.OfrInternalFlag,
    name_cn: 'Ofr内部标识',
    name_en: 'OfrInternalFlag'
  },
  [ColumnFieldsEnum.OfrOcoFlag]: { id: ColumnFieldsEnum.OfrOcoFlag, name_cn: 'OfrOCO标识', name_en: 'OfrOcoFlag' },
  [ColumnFieldsEnum.OfrPrice]: { id: ColumnFieldsEnum.OfrPrice, name_cn: 'Ofr价格', name_en: 'OfrPrice' },
  [ColumnFieldsEnum.OfrPriceString]: {
    id: ColumnFieldsEnum.OfrPriceString,
    name_cn: 'Ofr价格描述',
    name_en: 'OfrPriceString'
  },
  [ColumnFieldsEnum.OfrQuoteCount]: {
    id: ColumnFieldsEnum.OfrQuoteCount,
    name_cn: 'Ofr报价个数',
    name_en: 'OfrQuoteCount'
  },
  [ColumnFieldsEnum.OfrQuoteId]: { id: ColumnFieldsEnum.OfrQuoteId, name_cn: 'Ofr报价ID', name_en: 'OfrQuoteId' },
  [ColumnFieldsEnum.OfrQuoteType]: {
    id: ColumnFieldsEnum.OfrQuoteType,
    name_cn: 'Ofr报价类型',
    name_en: 'OfrQuoteType'
  },
  [ColumnFieldsEnum.OfrYieldType]: {
    id: ColumnFieldsEnum.OfrYieldType,
    name_cn: 'Ofr收益率类型',
    name_en: 'OfrYieldType'
  },
  [ColumnFieldsEnum.OnTheRun]: { id: ColumnFieldsEnum.OnTheRun, name_cn: '新上市', name_en: 'OnTheRun' },
  [ColumnFieldsEnum.Pledged]: { id: ColumnFieldsEnum.Pledged, name_cn: '是否可质押', name_en: 'Pledged' },
  [ColumnFieldsEnum.RateIndex]: { id: ColumnFieldsEnum.RateIndex, name_cn: '利率方式', name_en: 'RateIndex' },
  [ColumnFieldsEnum.RatingInstitution]: {
    id: ColumnFieldsEnum.RatingInstitution,
    name_cn: '债券评级机构',
    name_en: 'RatingInstitution'
  },
  [ColumnFieldsEnum.SwSectorCode]: { id: ColumnFieldsEnum.SwSectorCode, name_cn: '行业代码', name_en: 'SwSectorCode' },
  [ColumnFieldsEnum.SwSectorUpperCode]: {
    id: ColumnFieldsEnum.SwSectorUpperCode,
    name_cn: '上级行业代码',
    name_en: 'SwSectorUpperCode'
  },
  [ColumnFieldsEnum.TimeToMaturity]: {
    id: ColumnFieldsEnum.TimeToMaturity,
    name_cn: '剩余期限',
    name_en: 'TimeToMaturity'
  },
  [ColumnFieldsEnum.TimeToMaturityReal]: {
    id: ColumnFieldsEnum.TimeToMaturityReal,
    name_cn: '剩余期限（精确）',
    name_en: 'TimeToMaturityReal'
  },
  [ColumnFieldsEnum.TwoSided]: { id: ColumnFieldsEnum.TwoSided, name_cn: '是否双边', name_en: 'TwoSided' },
  [ColumnFieldsEnum.BidYield]: { id: ColumnFieldsEnum.BidYield, name_cn: 'Bid收益率', name_en: 'BidYield' },
  [ColumnFieldsEnum.OfrYield]: { id: ColumnFieldsEnum.OfrYield, name_cn: 'Ofr收益率', name_en: 'OfrYield' },
  [ColumnFieldsEnum.BestBidVolumeTotal]: {
    id: ColumnFieldsEnum.BestBidVolumeTotal,
    name_cn: 'Bid最优总量',
    name_en: 'BestBidVolumeTotal'
  },
  [ColumnFieldsEnum.BestOfrVolumeTotal]: {
    id: ColumnFieldsEnum.BestOfrVolumeTotal,
    name_cn: 'Ofr最优总量',
    name_en: 'BestOfrVolumeTotal'
  },
  [ColumnFieldsEnum.BestBidDescription]: {
    id: ColumnFieldsEnum.BestBidDescription,
    name_cn: 'Bid最优备注',
    name_en: 'BestBidDescription'
  },
  [ColumnFieldsEnum.BestOfrDescription]: {
    id: ColumnFieldsEnum.BestOfrDescription,
    name_cn: 'Ofr最优备注',
    name_en: 'BestOfrDescription'
  },
  [ColumnFieldsEnum.DealTimeStr]: { id: ColumnFieldsEnum.DealTimeStr, name_cn: '成交时间', name_en: 'DealTimeStr' },
  [ColumnFieldsEnum.OfrBrokerDepartmentName]: {
    id: ColumnFieldsEnum.OfrBrokerDepartmentName,
    name_cn: 'Ofr方经纪人部门',
    name_en: 'OfrBrokerDepartmentName'
  },
  [ColumnFieldsEnum.BidBrokerDepartmentName]: {
    id: ColumnFieldsEnum.BidBrokerDepartmentName,
    name_cn: 'Bid方经纪人部门',
    name_en: 'BidBrokerDepartmentName'
  },
  [ColumnFieldsEnum.DealOperatorDepartmentName]: {
    id: ColumnFieldsEnum.DealOperatorDepartmentName,
    name_cn: '成交操作人部门',
    name_en: 'DealOperatorDepartmentName'
  },
  [ColumnFieldsEnum.TradeRequestID]: {
    id: ColumnFieldsEnum.TradeRequestID,
    name_cn: '交易明细唯一ID',
    name_en: 'TradeRequestID'
  },
  [ColumnFieldsEnum.TradeID]: { id: ColumnFieldsEnum.TradeID, name_cn: '交易组合编号', name_en: 'TradeID' },
  [ColumnFieldsEnum.SecondaryTradeID]: {
    id: ColumnFieldsEnum.SecondaryTradeID,
    name_cn: '交易子单号',
    name_en: 'SecondaryTradeID'
  },
  [ColumnFieldsEnum.TradeRequestType]: {
    id: ColumnFieldsEnum.TradeRequestType,
    name_cn: '交易请求类型',
    name_en: 'TradeRequestType'
  },
  [ColumnFieldsEnum.TradeMatchTimestamp]: {
    id: ColumnFieldsEnum.TradeMatchTimestamp,
    name_cn: '填加时间',
    name_en: 'TradeMatchTimestamp'
  },
  [ColumnFieldsEnum.OrdStatus]: { id: ColumnFieldsEnum.OrdStatus, name_cn: '订单状态', name_en: 'OrdStatus' },
  [ColumnFieldsEnum.TrdType]: { id: ColumnFieldsEnum.TrdType, name_cn: '交易方式', name_en: 'TrdType' },
  [ColumnFieldsEnum.TrdSubType]: { id: ColumnFieldsEnum.TrdSubType, name_cn: '发起方类型', name_en: 'TrdSubType' },
  [ColumnFieldsEnum.MarketIndicator]: {
    id: ColumnFieldsEnum.MarketIndicator,
    name_cn: '市场',
    name_en: 'MarketIndicator'
  },
  [ColumnFieldsEnum.SecurityType]: { id: ColumnFieldsEnum.SecurityType, name_cn: '债券类型', name_en: 'SecurityType' },
  [ColumnFieldsEnum.SecurityID]: { id: ColumnFieldsEnum.SecurityID, name_cn: '债券代码', name_en: 'SecurityID' },
  [ColumnFieldsEnum.Symbol]: { id: ColumnFieldsEnum.Symbol, name_cn: '债券简称', name_en: 'Symbol' },
  [ColumnFieldsEnum.MaturityDate]: {
    id: ColumnFieldsEnum.MaturityDate,
    name_cn: '到期日格式',
    name_en: 'MaturityDate'
  },
  [ColumnFieldsEnum.YieldType]: { id: ColumnFieldsEnum.YieldType, name_cn: '收益率类型', name_en: 'YieldType' },
  [ColumnFieldsEnum.Yield]: { id: ColumnFieldsEnum.Yield, name_cn: '到期收益率', name_en: 'Yield' },
  [ColumnFieldsEnum.NoStipulations]: {
    id: ColumnFieldsEnum.NoStipulations,
    name_cn: '约定组',
    name_en: 'NoStipulations'
  },
  [ColumnFieldsEnum.StipulationType]: {
    id: ColumnFieldsEnum.StipulationType,
    name_cn: '约定类型',
    name_en: 'StipulationType'
  },
  [ColumnFieldsEnum.StipulationValue]: {
    id: ColumnFieldsEnum.StipulationValue,
    name_cn: '行权收益率',
    name_en: 'StipulationValue'
  },
  [ColumnFieldsEnum.LastQty]: { id: ColumnFieldsEnum.LastQty, name_cn: '票面总额', name_en: 'LastQty' },
  [ColumnFieldsEnum.CleanPrice]: { id: ColumnFieldsEnum.CleanPrice, name_cn: '净价', name_en: 'CleanPrice' },
  [ColumnFieldsEnum.DirtyPrice]: { id: ColumnFieldsEnum.DirtyPrice, name_cn: '全价', name_en: 'DirtyPrice' },
  [ColumnFieldsEnum.SettleCurrAmt]: {
    id: ColumnFieldsEnum.SettleCurrAmt,
    name_cn: '结算金额',
    name_en: 'SettleCurrAmt'
  },
  [ColumnFieldsEnum.Side]: { id: ColumnFieldsEnum.Side, name_cn: '报文接收方的交易方向', name_en: 'Side' },
  [ColumnFieldsEnum.SettleType]: { id: ColumnFieldsEnum.SettleType, name_cn: '清算速度', name_en: 'SettleType' },
  [ColumnFieldsEnum.SettleDate]: { id: ColumnFieldsEnum.SettleDate, name_cn: '清算日期格式', name_en: 'SettleDate' },
  [ColumnFieldsEnum.DeliveryType]: { id: ColumnFieldsEnum.DeliveryType, name_cn: '清算方式', name_en: 'DeliveryType' },
  [ColumnFieldsEnum.TradeDate]: { id: ColumnFieldsEnum.TradeDate, name_cn: '交易日期', name_en: 'TradeDate' },
  [ColumnFieldsEnum.NoAllocs]: {
    id: ColumnFieldsEnum.NoAllocs,
    name_cn: '交易发送信息循环组的个数',
    name_en: 'NoAllocs'
  },
  [ColumnFieldsEnum.AllocAccount]: {
    id: ColumnFieldsEnum.AllocAccount,
    name_cn: '交易发送至（机构）',
    name_en: 'AllocAccount'
  },
  [ColumnFieldsEnum.IndividualAllocID]: {
    id: ColumnFieldsEnum.IndividualAllocID,
    name_cn: '交易发送至（交易员）',
    name_en: 'IndividualAllocID'
  },
  [ColumnFieldsEnum.AllocText]: { id: ColumnFieldsEnum.AllocText, name_cn: '交易备注', name_en: 'AllocText' },
  [ColumnFieldsEnum.Text]: { id: ColumnFieldsEnum.Text, name_cn: '内码', name_en: 'Text' },
  [ColumnFieldsEnum.TrdMatchID]: { id: ColumnFieldsEnum.TrdMatchID, name_cn: '约定号', name_en: 'TrdMatchID' },
  [ColumnFieldsEnum.TransactTime]: {
    id: ColumnFieldsEnum.TransactTime,
    name_cn: '成交明细的创建时间',
    name_en: 'TransactTime'
  },
  [ColumnFieldsEnum.NoPayments]: { id: ColumnFieldsEnum.NoPayments, name_cn: '几个费用循环组', name_en: 'NoPayments' },
  [ColumnFieldsEnum.PaymentType]: { id: ColumnFieldsEnum.PaymentType, name_cn: '费用类型', name_en: 'PaymentType' },
  [ColumnFieldsEnum.PaymentFixedRate]: {
    id: ColumnFieldsEnum.PaymentFixedRate,
    name_cn: '费率',
    name_en: 'PaymentFixedRate'
  },
  [ColumnFieldsEnum.PaymentAmount]: { id: ColumnFieldsEnum.PaymentAmount, name_cn: '费用', name_en: 'PaymentAmount' },
  [ColumnFieldsEnum.NoPartyIDs]: { id: ColumnFieldsEnum.NoPartyIDs, name_cn: '循环组个数', name_en: 'NoPartyIDs' },
  [ColumnFieldsEnum.PartyID]: { id: ColumnFieldsEnum.PartyID, name_cn: '交易id', name_en: 'PartyID' },
  [ColumnFieldsEnum.PartyRole]: { id: ColumnFieldsEnum.PartyRole, name_cn: '交易角色', name_en: 'PartyRole' },
  [ColumnFieldsEnum.NoPartySubID]: {
    id: ColumnFieldsEnum.NoPartySubID,
    name_cn: '交易方信息组',
    name_en: 'NoPartySubID'
  },
  [ColumnFieldsEnum.PartySubID]: { id: ColumnFieldsEnum.PartySubID, name_cn: '信息类型', name_en: 'PartySubID' },
  [ColumnFieldsEnum.PartySubIDType]: {
    id: ColumnFieldsEnum.PartySubIDType,
    name_cn: '信息内容',
    name_en: 'PartySubIDType'
  },
  [ColumnFieldsEnum.SorVersion]: { id: ColumnFieldsEnum.SorVersion, name_cn: '补差校验版本号', name_en: 'SorVersion' },
  [ColumnFieldsEnum.OnBehalfOfCompID]: {
    id: ColumnFieldsEnum.OnBehalfOfCompID,
    name_cn: '货币经济公司',
    name_en: 'OnBehalfOfCompID'
  },

  [ColumnFieldsEnum.IssueDate]: {
    id: ColumnFieldsEnum.IssueDate,
    name_cn: '发行日期',
    name_en: 'IssueDate'
  },
  [ColumnFieldsEnum.NCDPPrice]: { id: ColumnFieldsEnum.NCDPPrice, name_cn: '价格', name_en: 'NCDPPrice' },
  [ColumnFieldsEnum.NCDPVolume]: { id: ColumnFieldsEnum.NCDPVolume, name_cn: '数量', name_en: 'NCDPVolume' },
  [ColumnFieldsEnum.NCDPFlagFull]: {
    id: ColumnFieldsEnum.NCDPFlagFull,
    name_cn: '是否询满',
    name_en: 'NCDPFlagFull'
  },
  [ColumnFieldsEnum.NCDPPriceChange]: {
    id: ColumnFieldsEnum.NCDPPriceChange,
    name_cn: '价格变动',
    name_en: 'NCDPPriceChange'
  },

  // 下面几项是无需展示的字段
  [ColumnFieldsEnum.BodyLength]: { id: ColumnFieldsEnum.BodyLength, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.CheckSum]: { id: ColumnFieldsEnum.CheckSum, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.MsgSeqNum]: { id: ColumnFieldsEnum.MsgSeqNum, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.SendingTime]: { id: ColumnFieldsEnum.SendingTime, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.TradeReportID]: { id: ColumnFieldsEnum.TradeReportID, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.TradeRptStat]: { id: ColumnFieldsEnum.TradeRptStat, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.SettleStatus]: { id: ColumnFieldsEnum.SettleStatus, name_cn: '', name_en: '' },
  [ColumnFieldsEnum.QuoteStat]: { id: ColumnFieldsEnum.QuoteStat, name_cn: '', name_en: '' }
};
