import {
  BondQuoteType,
  BridgeChannel,
  DealMarketType,
  DealType,
  Direction,
  ExerciseType,
  FRType,
  LiquidationSpeedTag,
  ListedMarket,
  MarketNotifyMsgType,
  NCDPOperationType,
  NcdSubtype,
  OperationSource,
  OptionType,
  ProductType,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment,
  RepaymentMethod,
  SettlementMode,
  Side,
  TradeMode
} from '@fepkg/services/types/enum';
import {
  BrokerageTypeOptions,
  HistDealStatusOptions,
  IssuerDateTypeOptions,
  MapRecord,
  MaturityDateTypeOptions,
  RatingOptions,
  ReceiptDealTradeInstBrokerageCommentOptions,
  TraderModeOptions,
  transformOpts2Map
} from './options';

/** 评级 */
export const RatingMap = transformOpts2Map(RatingOptions);

export const FRTypeShortMap = {
  [FRType.FRTypeNone]: '',
  [FRType.Shibor]: 'S',
  [FRType.LPR]: 'L',
  [FRType.Depo]: 'D',
  [FRType.FRD]: '',
  [FRType.DR]: 'DR',
  [FRType.CDC]: 'C'
};

export const FRTypeFullMap = {
  [FRType.FRTypeNone]: '',
  [FRType.Shibor]: 'Shibor',
  [FRType.LPR]: 'LPR',
  [FRType.Depo]: 'Depo',
  [FRType.FRD]: 'FRD',
  [FRType.DR]: 'DR',
  [FRType.CDC]: 'CDC'
};

/** 期限 */
export const MaturityDateTypeMap = transformOpts2Map(MaturityDateTypeOptions);

/** 发行日期类型 */
export const IssuerDateTypeMap = transformOpts2Map(IssuerDateTypeOptions);

// 枚举映射字符文案 start
/** 产品文案映射 */
export const transformProductType = (productType: ProductType, listedMarket?: string) => {
  switch (productType) {
    case ProductType.BNC:
      if (listedMarket && listedMarket !== 'CIB') return { en: 'BBN', cn: '利率债' };
      return { en: 'BNC', cn: '利率债' };
    case ProductType.BCO:
      if (listedMarket && listedMarket !== 'CIB') return { en: 'BBE', cn: '利率债' };
      return { en: 'BCO', cn: '信用债' };
    case ProductType.NCD:
      return { en: 'NCD', cn: '存单' };
    case ProductType.NCDP:
      return { en: 'NCDP', cn: '存单' };
    default:
      return { en: '', cn: '' };
  }
};

/** 价格类型 */
export const BondQuoteTypeMap: MapRecord<BondQuoteType> = {
  [BondQuoteType.TypeNone]: '',
  [BondQuoteType.CleanPrice]: '净价',
  [BondQuoteType.FullPrice]: '全价',
  [BondQuoteType.Yield]: '收益率',
  [BondQuoteType.Spread]: '利差'
};

/** 调佣理由 */
export const BrokerageCommentMap: MapRecord<ReceiptDealTradeInstBrokerageComment> = {
  ...transformOpts2Map(ReceiptDealTradeInstBrokerageCommentOptions),
  [ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentEnumNone]: '',
  [ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage]: '正常佣金',
  [ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentSpecial]: '特殊佣金'
};

/** 操作来源/来源 */
export const OperationSourceMap: MapRecord<OperationSource> = {
  [OperationSource.OperationSourceNone]: '',
  [OperationSource.OperationSourceBdsIdb]: '行情',
  [OperationSource.OperationSourceBdsIdc]: '交易处理',
  [OperationSource.OperationSourceIdb]: 'IDB',
  [OperationSource.OperationSourceIdc]: 'IDC',
  [OperationSource.OperationSourceQm]: 'QM',
  [OperationSource.OperationSourceStc]: 'STC',
  [OperationSource.OperationSourceOffline]: '线下',
  [OperationSource.OperationSourceQuickChat]: 'iQuote',
  [OperationSource.OperationSourceQuoteDraft]: '协同报价',
  [OperationSource.OperationSourceReceiptDeal]: '成交单',
  [OperationSource.OperationSourceSpotPricing]: '点价',
  [OperationSource.OperationSourceDealRecord]: '成交记录',
  [OperationSource.OperationSourceApproveReceiptDeal]: 'DTM',
  [OperationSource.OperationSourceReceiptDealDetail]: '明细',
  [OperationSource.OperationSourceReceiptDealBridge]: '过桥',
  [OperationSource.OperationSourceQQGroup]: 'qq群',
  [OperationSource.OperationSourceDataFeed]: '数据推送'
};

/** 佣金类型 */
export const BrokerageTypeMap = transformOpts2Map(BrokerageTypeOptions);

/** 交易方式 */
export const TradeModeMap = {
  ...transformOpts2Map(TraderModeOptions),
  [TradeMode.QM]: 'QM'
};

/** 行权/到期 */
export const ExerciseTypeMap: MapRecord<ExerciseType> = {
  [ExerciseType.ExerciseTypeNone]: '',
  [ExerciseType.Exercise]: '行权',
  [ExerciseType.Expiration]: '到期'
};

/** 成交单状态 */
export const ReceiptDealStatusMap: MapRecord<ReceiptDealStatus> = {
  [ReceiptDealStatus.ReceiptDealStatusNone]: '',
  [ReceiptDealStatus.ReceiptDealToBeHandOver]: '待移交',
  [ReceiptDealStatus.ReceiptDealToBeConfirmed]: '待确认',
  [ReceiptDealStatus.ReceiptDealToBeSubmitted]: '待提交',
  [ReceiptDealStatus.ReceiptDealSubmitApproval]: '送审中',
  [ReceiptDealStatus.ReceiptDealToBeExamined]: '待审核',
  [ReceiptDealStatus.ReceiptDealNoPass]: '未通过',
  [ReceiptDealStatus.ReceiptDealPass]: '已通过',
  [ReceiptDealStatus.ReceiptDealDestroyed]: '已毁单',
  [ReceiptDealStatus.ReceiptDealDeleted]: '已删除'
};

/** 结算模式 */
export const SettlementModeMap: MapRecord<SettlementMode> = {
  [SettlementMode.SettlementModeNone]: '',
  [SettlementMode.DVP]: 'DVP'
};

/** 成交市场类型 */
export const DealMarketTypeMap: MapRecord<DealMarketType> = {
  [DealMarketType.DealMarketNone]: '',
  [DealMarketType.PrimaryMarket]: '一级',
  [DealMarketType.SecondaryMarket]: '二级'
};

/** 方向 */
export const DirectionMap: MapRecord<Direction> = {
  [Direction.DirectionNone]: '',
  [Direction.DirectionGvn]: 'GVN',
  [Direction.DirectionTkn]: 'TKN',
  [Direction.DirectionTrd]: 'TRD'
};

/** 含权类型 */
export const OptionTypeMap: MapRecord<OptionType> = {
  [OptionType.OptionTypeNone]: '',
  [OptionType.CAL]: 'CAL',
  [OptionType.CNP]: 'CNP',
  [OptionType.ETS]: 'ETS',
  [OptionType.NON]: 'NON',
  [OptionType.PUT]: 'PUT',
  [OptionType.CNV]: 'CNV',
  [OptionType.DCN]: 'DCN',
  [OptionType.ASS]: 'ASS'
};

/** 含权类型 */
export const OptionTypeStringMap: MapRecord<string> = {
  ETS: '永续债',
  NON: '普通债券',
  CAL: '赎回权',
  PUT: '回售权',
  CNP: '回售权和赎回权',
  CNV: '单向换券权',
  DCN: '互换券权',
  ASS: '投资者定向转让选择权'
};

/** 方向 Bid/Ofr */
export const SideMap = {
  [Side.SideNone]: {
    upperCase: '',
    lowerCase: '',
    firstUpperCase: ''
  },
  [Side.SideBid]: {
    upperCase: 'BID',
    lowerCase: 'bid',
    firstUpperCase: 'Bid'
  },
  [Side.SideOfr]: {
    upperCase: 'OFR',
    lowerCase: 'ofr',
    firstUpperCase: 'Ofr'
  }
};

/** 方向 GVN/TKN */
export const DealTypeMap: MapRecord<DealType> = {
  [DealType.DealTypeNone]: '',
  [DealType.GVN]: 'GVN',
  [DealType.TKN]: 'TKN',
  [DealType.TRD]: 'TRD'
};

/** 清算速度 */
export const LiquidationSpeedTagMap: MapRecord<LiquidationSpeedTag> = {
  [LiquidationSpeedTag.LiquidationSpeedTagNone]: 'None',
  [LiquidationSpeedTag.Today]: '',
  [LiquidationSpeedTag.Tomorrow]: '明天',
  [LiquidationSpeedTag.Monday]: '周一',
  [LiquidationSpeedTag.Tuesday]: '周二',
  [LiquidationSpeedTag.Wednesday]: '周三',
  [LiquidationSpeedTag.Thursday]: '周四',
  [LiquidationSpeedTag.Friday]: '周五',
  [LiquidationSpeedTag.Saturday]: '周六',
  [LiquidationSpeedTag.Sunday]: '周日',
  [LiquidationSpeedTag.Default]: '默认'
};

/** 渠道 */
export const BridgeChannelMap: MapRecord<BridgeChannel> = {
  [BridgeChannel.ChannelEnumNone]: '',
  [BridgeChannel.Talk]: '对话',
  [BridgeChannel.Request]: '请求',
  [BridgeChannel.BothSides]: '双边',
  [BridgeChannel.Xbond]: 'Xbond',
  [BridgeChannel.Ideal]: 'ideal',
  [BridgeChannel.ChannelFixedIncome]: '固收',
  [BridgeChannel.Bidding]: '竞价',
  [BridgeChannel.Bulk]: '大宗'
};

/** 成交单状态 */
export const HistDealStatusMap = transformOpts2Map(HistDealStatusOptions);

/** 外发数据类型 */
export const MarketNotifyMsgTypeMap = {
  [MarketNotifyMsgType.MarketNotifyMsgBondHandicap]: '最优报价推送',
  [MarketNotifyMsgType.MarketNotifyMsgDeal]: '市场成交推送'
};

/** 还本方式 */
export const RepaymentMethodMap = {
  [RepaymentMethod.RepayInAdvance]: '提前还本',
  [RepaymentMethod.RepayAtOnce]: '到期一次还本'
};

// 枚举映射字符文案 end

// 字符映射枚举 start
/** 发行市场 */
export const ListedMarketMap: Record<string, ListedMarket> = {
  CIB: ListedMarket.CIB,
  SSE: ListedMarket.SSE,
  SZE: ListedMarket.SZE
};

/** 发行市场 */
export const ListedMarketStringMap: MapRecord<string> = {
  CIB: '银行间债券市场',
  SSE: '上海证券交易所',
  SZE: '深圳证券交易所'
};

/** NCD 一级操作类型 */
export const NCDPOperationTypeMap = {
  [NCDPOperationType.NcdPOperationTypeNone]: '',
  [NCDPOperationType.NcdPAdd]: '新增',
  [NCDPOperationType.NcdPModify]: '修改',
  [NCDPOperationType.NcdPQuickModify]: '快捷修改',
  [NCDPOperationType.NcdPDelete]: '手动删除',
  [NCDPOperationType.NcdPSystemDelete]: '系统删除'
};

/** NCD 银行债细分 */
export const NcdSubtypeMap = {
  [NcdSubtype.NcdSubtypeNone]: '',
  [NcdSubtype.NcdSubtypeSPB]: '政策性',
  [NcdSubtype.NcdSubtypeMCB]: '大行',
  [NcdSubtype.NcdSubtypeSHB]: '股份制',
  [NcdSubtype.NcdSubtypeCCB]: '城商行',
  [NcdSubtype.NcdSubtypeFRB]: '外资行',
  [NcdSubtype.NcdSubtypeRRB]: '农商',
  [NcdSubtype.NcdSubtypeRTB]: '村镇',
  [NcdSubtype.NcdSubtypeOTB]: '其他'
};
// 字符映射枚举 end
