import {
  AdvancedApprovalType,
  BargainFlagType,
  BigVolumeType,
  BondAssetType,
  BondCategory,
  BondFinancialCategoryType,
  BondInstType,
  BondNature,
  BondPeriodType,
  BondPerpetualType,
  BondSector,
  BondShortName,
  BridgeChannel,
  BrokerageType,
  ClearSpeedType,
  CollectionMethod,
  DealDateType,
  FRType,
  HistDealStatus,
  InstRatingType,
  InstitutionSubtype,
  InternalType,
  IsMunicipalType,
  IsPlatformType,
  IssuerDateType,
  IssuerRatingType,
  ListedMarket,
  MarketNotifyMsgType,
  MaturityDateType,
  MktType,
  NcdSubtype,
  PerpType,
  ProductMarket,
  QuickChatScriptAlgoOperationType,
  Rating,
  ReceiptDealTradeInstBrokerageComment,
  RefType,
  Side,
  TradeMode,
  ValuationConfType,
  WithWarranterType
} from '@fepkg/services/types/enum';

export type MapRecord<T extends string | number | symbol> = Record<T, string>;

export type Options<T> = { label: string; value: T }[];

/** 由 options 转换为 map */
export const transformOpts2Map = <T extends string | number | symbol>(options: Options<T>) => {
  // 0 即 map 中的 XXXNone 枚举值，proto3 要求必须以 0 开头，因此会需要把 0 作为默认值处理
  const map = { 0: '' } as MapRecord<T>;

  for (const option of options) {
    map[option.value] = option.label;
  }

  return map;
};

/** 期限 */
export const MaturityDateTypeOptions: Options<MaturityDateType> = [
  { label: '1M', value: MaturityDateType.OneMonth },
  { label: '3M', value: MaturityDateType.ThreeMonth },
  { label: '6M', value: MaturityDateType.SixMonth },
  { label: '9M', value: MaturityDateType.NineMonth },
  { label: '1Y', value: MaturityDateType.OneYear }
];

/** 发行日期类型  */
export const IssuerDateTypeOptions: Options<IssuerDateType> = [
  { label: '周一', value: IssuerDateType.IssuerDateTypeMonday },
  { label: '周二', value: IssuerDateType.IssuerDateTypeTuesday },
  { label: '周三', value: IssuerDateType.IssuerDateTypeWednesday },
  { label: '周四', value: IssuerDateType.IssuerDateTypeThursday },
  { label: '周五', value: IssuerDateType.IssuerDateTypeFriday },
  { label: '周六', value: IssuerDateType.IssuerDateTypeSaturday },
  { label: '周日', value: IssuerDateType.IssuerDateTypeSunday },
  { label: '今日', value: IssuerDateType.IssuerDateTypeToday },
  { label: '近期', value: IssuerDateType.IssuerDateTypeRecent }
];

/** 债券类型 */
export const BondCategoryOptions: Options<BondCategory> = [
  { label: '超短融', value: BondCategory.SCP },
  { label: '短融', value: BondCategory.CP },
  { label: '中票', value: BondCategory.MTN },
  { label: '企业债', value: BondCategory.EB },
  { label: '公司债', value: BondCategory.CB },
  { label: '次级债', value: BondCategory.SD },
  { label: 'PPN', value: BondCategory.PPN },
  { label: '国债', value: BondCategory.GB },
  { label: '央票', value: BondCategory.CBB },
  { label: '金融债', value: BondCategory.FB },
  { label: '地方债', value: BondCategory.LGB },
  { label: '其他', value: BondCategory.OBC }
];

/** 债券子类型（政策性金融债） */
export const BondShortNameOptions: Options<BondShortName> = [
  { label: '国开', value: BondShortName.CDB },
  { label: '口行', value: BondShortName.EIB },
  { label: '农发', value: BondShortName.ADB }
];

/** 流通场所 */
export const ListedMarketOptions: Options<ListedMarket> = [
  { label: '上交所', value: ListedMarket.SSE },
  { label: '深交所', value: ListedMarket.SZE },
  { label: '银行间', value: ListedMarket.CIB }
];

/** 利率台子市场 */
export const BNCProductMarketOptions: Options<ProductMarket> = [
  { label: 'BBN', value: ProductMarket.ProductMarketBBN },
  { label: 'BNC', value: ProductMarket.ProductMarketBNC }
];
/** 信用台子市场 */
export const BCOProductMarketOptions: Options<ProductMarket> = [
  { label: 'BBE', value: ProductMarket.ProductMarketBBE },
  { label: 'BCO', value: ProductMarket.ProductMarketBCO }
];

/** 存单台子市场 */
export const NCDProductMarketOptions: Options<ProductMarket> = [
  { label: 'NCD', value: ProductMarket.ProductMarketNCD }
];

/** 募集方式 */
export const CollectionMethodOptions: Options<CollectionMethod> = [
  { label: '公募债', value: CollectionMethod.PUB },
  { label: '私募债', value: CollectionMethod.PRI },
  { label: '可交换', value: CollectionMethod.SCV }
];

/** 债券子类型（地方政府债） */
export const BondNatureOptions: Options<BondNature> = [
  { label: '一般债', value: BondNature.GeneralDebt },
  { label: '专项债', value: BondNature.SpecialDebt }
];

/** 永续 */
export const PerpTypeOptions: Options<PerpType> = [
  { label: '永续次级', value: PerpType.PerpSub },
  { label: '永续非次级', value: PerpType.PerpNotSub },
  { label: '非永续', value: PerpType.NotPerp }
];

/** 银行债细分 */
export const SubTypeOptions: Options<NcdSubtype> = [
  { label: '大行', value: NcdSubtype.NcdSubtypeMCB },
  { label: '股份制', value: NcdSubtype.NcdSubtypeSHB },
  { label: '其他', value: NcdSubtype.NcdSubtypeOTB }
];

/** NCD银行债细分 */
export const NcdSubTypeOptions: Options<NcdSubtype> = [
  { label: '政策性', value: NcdSubtype.NcdSubtypeSPB },
  { label: '大行', value: NcdSubtype.NcdSubtypeMCB },
  { label: '股份制', value: NcdSubtype.NcdSubtypeSHB },
  { label: '城商行', value: NcdSubtype.NcdSubtypeCCB },
  { label: '外资行', value: NcdSubtype.NcdSubtypeFRB },
  { label: '农商', value: NcdSubtype.NcdSubtypeRRB },
  { label: '村镇', value: NcdSubtype.NcdSubtypeRTB },
  { label: '其他', value: NcdSubtype.NcdSubtypeOTB }
];

/** NCD（一级）银行债细分 */
export const NcdpSubTypeOptions: Options<NcdSubtype> = [
  { label: '大行', value: NcdSubtype.NcdSubtypeMCB },
  { label: '股份制', value: NcdSubtype.NcdSubtypeSHB },
  { label: '城商行', value: NcdSubtype.NcdSubtypeCCB },
  { label: '外资行', value: NcdSubtype.NcdSubtypeFRB },
  { label: '农商', value: NcdSubtype.NcdSubtypeRRB },
  { label: '其他', value: NcdSubtype.NcdSubtypeOTB }
];

/** 市场 */
export const MktTypeOptions: Options<MktType> = [
  { label: '意向', value: MktType.IntentionalDebt },
  { label: '二级', value: MktType.SecondaryDebt }
];

/** 买/卖方 */
export const SideOptions: Options<Side> = [
  { label: '买方', value: Side.SideBid },
  { label: '卖方', value: Side.SideOfr }
];

/** 日期类型 */
export const DateTypeOptions: Options<DealDateType> = [
  { label: '成交日', value: DealDateType.DealTime },
  { label: '交易日', value: DealDateType.Traded },
  { label: '交割日', value: DealDateType.Delivery }
];

/** 撤单类型——成交撤销、手动撤销、自动撤销 */
export const ReferTypeOptions: Options<RefType> = [
  { label: '成交撤销', value: RefType.Deal },
  { label: '手动撤销', value: RefType.Manual },
  { label: '自动撤销', value: RefType.Auto }
];

/** 撤单类型——成交、手动、自动 */
export const SimplifyReferTypeOptions: Options<RefType> = [
  { label: '成交', value: RefType.Deal },
  { label: '手动', value: RefType.Manual },
  { label: '自动', value: RefType.Auto }
];

/** 主体类型 */
export const InstitutionSubtypeOptions: Options<InstitutionSubtype> = [
  { label: '央企', value: InstitutionSubtype.CGE },
  { label: '国企', value: InstitutionSubtype.LGE },
  { label: '民企', value: InstitutionSubtype.PVE },
  { label: '其他', value: InstitutionSubtype.OTE }
];

/** 发行主体 */
export const BondSectorOptions: Options<BondSector> = [
  { label: '银行', value: BondSector.Bank },
  { label: '券商', value: BondSector.Brokerages },
  { label: '保险', value: BondSector.Insurance },
  { label: 'GN', value: BondSector.GN }
];

/** 评级 */
export const RatingOptions: Options<Rating> = [
  { label: 'AAA+', value: Rating.AAAPlus },
  { label: 'AAA', value: Rating.AAA },
  { label: 'AAA-', value: Rating.AAAMinus },
  { label: 'AA+', value: Rating.AAPlus },
  { label: 'AA', value: Rating.AA },
  { label: 'AA-', value: Rating.AAMinus },
  { label: 'A+', value: Rating.APlus },
  { label: 'A', value: Rating.A },
  { label: 'A-', value: Rating.AMinus },
  { label: 'BBB+', value: Rating.BBBPlus },
  { label: 'BBB', value: Rating.BBB },
  { label: '其他', value: Rating.OtherIssuerRating }
];

/** 计息基准 */
export const FRTypeOptions: Options<FRType> = [
  { label: 'Shibor', value: FRType.Shibor },
  { label: 'LPR', value: FRType.LPR },
  { label: 'Depo', value: FRType.Depo },
  { label: '固息', value: FRType.FRD },
  { label: 'DR', value: FRType.DR }
];

/** 交易方式 */
export const TraderModeOptions: Options<TradeMode> = [
  { label: 'QQ', value: TradeMode.QQ },
  { label: '直线', value: TradeMode.Line },
  { label: '电话', value: TradeMode.Phone },
  { label: 'RM', value: TradeMode.RM }
];

/** 渠道 */
export const BridgeChannelOptions: Options<BridgeChannel> = [
  { label: '对话', value: BridgeChannel.Talk },
  { label: '请求', value: BridgeChannel.Request },
  { label: '双边', value: BridgeChannel.BothSides },
  { label: 'xbond', value: BridgeChannel.Xbond },
  { label: 'ideal', value: BridgeChannel.Ideal },
  { label: '固收', value: BridgeChannel.ChannelFixedIncome },
  { label: '竞价', value: BridgeChannel.Bidding },
  { label: '大宗', value: BridgeChannel.Bulk }
];

/** 佣金类型 */
export const BrokerageTypeOptions: Options<BrokerageType> = [
  { label: 'N', value: BrokerageType.BrokerageTypeN },
  { label: 'B', value: BrokerageType.BrokerageTypeB },
  { label: 'C', value: BrokerageType.BrokerageTypeC },
  { label: 'R', value: BrokerageType.BrokerageTypeR }
];

/** 调佣理由 */
export const ReceiptDealTradeInstBrokerageCommentOptions: Options<ReceiptDealTradeInstBrokerageComment> = [
  {
    label: '部门未签约或有异议',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNoSignOrObjection
  },
  {
    label: '止损',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentStopLoss
  },
  {
    label: '解决突发问题',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentEmergency
  },
  {
    label: '通道',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentChannel
  },
  {
    label: '找不到或未安排代付',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNotFoundOrUnArrangePayFor
  },
  {
    label: '单笔单议',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentOneTimeSettlement
  },
  {
    label: '其他',
    value: ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentOthers
  }
];

/** 审核类型 */
export const AdvancedApprovalTypeOptions: Options<AdvancedApprovalType> = [
  { label: '佣金', value: AdvancedApprovalType.AdvancedApprovalTypeSpecialBrokerage },
  { label: '毁单', value: AdvancedApprovalType.AdvancedApprovalTypeDestroy },
  { label: 'NC', value: AdvancedApprovalType.AdvancedApprovalTypeNC },
  { label: 'SD', value: AdvancedApprovalType.AdvancedApprovalTypeSD },
  { label: 'MD', value: AdvancedApprovalType.AdvancedApprovalTypeMD }
];

/** 成交单状态 */
export const HistDealStatusOptions: Options<HistDealStatus> = [
  { label: '待移交', value: HistDealStatus.HistDealToBeHandOver },
  { label: '已移交', value: HistDealStatus.HistDealHasHandOver },
  { label: '已删除', value: HistDealStatus.HistDealDeleted },
  { label: '待确认', value: HistDealStatus.HistDealToBeConfirm },
  { label: '已拒绝', value: HistDealStatus.HistDealRefused }
];

/** 外发数据类型 */
export const MarketNotifyMsgTypeOptions: Options<MarketNotifyMsgType> = [
  { label: '全部', value: MarketNotifyMsgType.MarketNotifyMsgTypeNone },
  { label: '最优报价', value: MarketNotifyMsgType.MarketNotifyMsgBondHandicap },
  { label: '市场成交', value: MarketNotifyMsgType.MarketNotifyMsgDeal }
];

/** 外发数据类型——特殊机构山西证券 */
export const MarketNotifySorOptions: Options<MarketNotifyMsgType> = [
  { label: '全部', value: MarketNotifyMsgType.MarketNotifyMsgTypeNone },
  { label: '新增', value: MarketNotifyMsgType.MarketNotifySorAD },
  { label: '信息变更', value: MarketNotifyMsgType.MarketNotifySorCT },
  { label: '信息重推', value: MarketNotifyMsgType.MarketNotifySorRST },
  { label: '状态变更', value: MarketNotifyMsgType.MarketNotifySorAE },
  { label: '状态重推', value: MarketNotifyMsgType.MarketNotifySorRTS }
];

// 算法 start
/** 交割方式——算法 */
export const ClearSpeedOptions: Options<ClearSpeedType> = [
  { value: ClearSpeedType.ClearSpeedDefault, label: '默认' }, // 默认
  { value: ClearSpeedType.ClearSpeedNextDay, label: '+1' }, // +1
  { value: ClearSpeedType.ClearSpeedCurrDay, label: '明天+0' } // +0
];

/** 大量——算法 */
export const BigVolumeOptions: Options<BigVolumeType> = [
  { value: BigVolumeType.BigVolumeDefault, label: '默认' },
  { value: BigVolumeType.BigVolume1E, label: '大于1E挂5K' }
];

/** 明/暗盘 */
export const InternalOptions: Options<InternalType> = [
  { value: InternalType.InternalDefault, label: '默认' },
  { value: InternalType.InternalNo, label: '明盘' },
  { value: InternalType.InternalYes, label: '暗盘' }
];

/** 置信度 */
export const BargainFlagOptions: Options<BargainFlagType> = [
  { value: BargainFlagType.BargainFlagDefault, label: '默认' },
  { value: BargainFlagType.BargainFlagOneStar, label: '*' },
  { value: BargainFlagType.BargainFlagTwoStar, label: '**' }
];

/** 估值类型 */
export const ValConfigOptions: Options<ValuationConfType> = [
  { label: '完整估值', value: ValuationConfType.ValuationFull },
  { label: '保留2位小数', value: ValuationConfType.ValuationKeepTwoDecimals }
];

/** 操作类型 */
export const ChatScriptOptions: Options<QuickChatScriptAlgoOperationType> = [
  { label: 'ADD', value: QuickChatScriptAlgoOperationType.QuickChatScriptADD },
  { label: 'UPD', value: QuickChatScriptAlgoOperationType.QuickChatScriptUPD },
  { label: 'REF', value: QuickChatScriptAlgoOperationType.QuickChatScriptREF },
  { label: 'TKN', value: QuickChatScriptAlgoOperationType.QuickChatScriptTKN },
  { label: 'GVN', value: QuickChatScriptAlgoOperationType.QuickChatScriptGVN }
];

/** 金融债分类 */
export const BondFinancialCategoryTypeOptions: Options<BondFinancialCategoryType> = [
  { value: BondFinancialCategoryType.Aa, label: 'Aa大行商金' },
  { value: BondFinancialCategoryType.Ab, label: 'Ab优质股份制商金' },
  { value: BondFinancialCategoryType.Ac, label: 'Ac优质城商商金' },
  { value: BondFinancialCategoryType.Ad, label: 'Ad一般股份制商金' },
  { value: BondFinancialCategoryType.Ae, label: 'Ae一般城商商金' },
  { value: BondFinancialCategoryType.Af, label: 'Af其他商金' },
  { value: BondFinancialCategoryType.Ba, label: 'Ba大行二级资本' },
  { value: BondFinancialCategoryType.Bb, label: 'Bb优质股份制二级资本' },
  { value: BondFinancialCategoryType.Bc, label: 'Bc优质城商二级资本' },
  { value: BondFinancialCategoryType.Bd, label: 'Bd一般股份制二级资本' },
  { value: BondFinancialCategoryType.Be, label: 'Be一般城商二级资本' },
  { value: BondFinancialCategoryType.Bf, label: 'Bf其他二级资本' },
  { value: BondFinancialCategoryType.Ca, label: 'Ca大行永续' },
  { value: BondFinancialCategoryType.Cb, label: 'Cb优质股份制永续' },
  { value: BondFinancialCategoryType.Cc, label: 'Cc优质城商永续' },
  { value: BondFinancialCategoryType.Cd, label: 'Cd一般股份制永续' },
  { value: BondFinancialCategoryType.Ce, label: 'Ce一般城商永续' },
  { value: BondFinancialCategoryType.Cf, label: 'Cf其他永续' },
  // { value: BondFinancialCategoryType.Ao, label: 'Ao策性银行二级资本' },
  { value: BondFinancialCategoryType.Da, label: 'Da头部券商公募' },
  { value: BondFinancialCategoryType.Db, label: 'Db优良券商公募' },
  { value: BondFinancialCategoryType.Dc, label: 'Dc一般券商公募' },
  { value: BondFinancialCategoryType.Dd, label: 'Dd低流动性券商公募' },
  { value: BondFinancialCategoryType.De, label: 'De其他' },
  { value: BondFinancialCategoryType.DaS, label: 'DaS头部券商私募' },
  { value: BondFinancialCategoryType.DbS, label: 'DbS优良券商私募' },
  { value: BondFinancialCategoryType.DcS, label: 'DcS一般券商私募' },
  { value: BondFinancialCategoryType.DdS, label: 'DdS低流动性券商私募' },
  { value: BondFinancialCategoryType.Ea, label: 'Ea券商次级头部' },
  { value: BondFinancialCategoryType.Eb, label: 'Eb券商次级良' },
  { value: BondFinancialCategoryType.Ec, label: 'Ec券商次级一般' },
  { value: BondFinancialCategoryType.Ed, label: 'Ed券商次级其他' },
  { value: BondFinancialCategoryType.EaY, label: 'EaY券商次级头部永续' },
  { value: BondFinancialCategoryType.EbY, label: 'EbY券商次级良永续' }
];

/** 久期 */
export const BondPeriodTypeOptions: Options<BondPeriodType> = [
  { value: BondPeriodType.PeriodLT3M, label: '<3M' },
  { value: BondPeriodType.PeriodLT6M, label: '3-6M' },
  { value: BondPeriodType.PeriodLT9M, label: '6-9M' },
  { value: BondPeriodType.PeriodLT1Y, label: '9-12M' },
  { value: BondPeriodType.PeriodLT2Y, label: '1-2Y' },
  { value: BondPeriodType.PeriodLT3Y, label: '2-3Y' },
  { value: BondPeriodType.PeriodLT5Y, label: '3-5Y' },
  { value: BondPeriodType.PeriodGT10Y, label: '5-10Y' }
];

/** 是否平台债 */
export const IsPlatformTypeOptions: Options<IsPlatformType> = [
  { value: IsPlatformType.PlatformTrue, label: '平台债' },
  { value: IsPlatformType.PlatformFalse, label: '非平台' }
];

/** 有无担保 */
export const WithWarranterTypeOptions: Options<WithWarranterType> = [
  { value: WithWarranterType.WarranterTrue, label: '有担保' },
  { value: WithWarranterType.WarranterFalse, label: '无担保' }
];

/** 是否城投 */
export const IsMunicipalTypeOptions = [
  { value: IsMunicipalType.MunicipalTrue, label: '城投债' },
  { value: IsMunicipalType.MunicipalFalse, label: '非城投' }
];

/** 是否永续债 */
export const BondPerpetualTypeOptions = [
  { value: BondPerpetualType.BondPerpetualEtsSub, label: '永续次级' },
  { value: BondPerpetualType.BondPerpetualEtsGen, label: '非永续次级' },
  { value: BondPerpetualType.BondPerpetualNotEts, label: '非永续' }
];

/** 中信资债评级 */
export const InstRatingTypeOptions = [
  { value: InstRatingType.InstRatingAAAP, label: 'AAA+' },
  { value: InstRatingType.InstRatingAAA, label: 'AAA' },
  { value: InstRatingType.InstRatingAAAM, label: 'AAA-' },
  { value: InstRatingType.InstRatingAAP, label: 'AA+' },
  { value: InstRatingType.InstRatingAA, label: 'AA' },
  { value: InstRatingType.InstRatingOtr, label: '其他' }
];

/** 主体评级 */
export const IssuerRatingTypeOptions = [
  { value: IssuerRatingType.IssuerRatingSAAA, label: '超AAA' },
  { value: IssuerRatingType.IssuerRatingAAA, label: 'AAA' },
  { value: IssuerRatingType.IssuerRatingAAP, label: 'AA+' },
  { value: IssuerRatingType.IssuerRatingAA, label: 'AA' },
  { value: IssuerRatingType.IssuerRatingAAM, label: 'AA-' },
  { value: IssuerRatingType.IssuerRatingAP, label: 'A+' },
  { value: IssuerRatingType.IssuerRatingOtr, label: '其他' }
];

/** 债券主体类型 */
export const BondInstOptions = [
  { value: BondInstType.InstCGE, label: '央企' },
  { value: BondInstType.InstLGE, label: '国企' },
  { value: BondInstType.InstPVE, label: '民企' },
  { value: BondInstType.InstOtr, label: '其他' }
];

/** 发行 */
export const BondAssetOptions = [
  { value: BondAssetType.AssetPub, label: '公募' },
  { value: BondAssetType.AssetPri, label: '私募' },
  { value: BondAssetType.AssetScv, label: '可交换' }
];

// 算法 end
