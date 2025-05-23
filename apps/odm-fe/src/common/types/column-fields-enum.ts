export enum ColumnFieldsEnum {
  /** 协议版本 */
  BeginString = 8,
  /** 表示消息内容的长度 */
  BodyLength = 9,
  /** 校验和字段 */
  CheckSum = 10,
  /** 消息序列号 */
  MsgSeqNum = 34,
  /** 消息类型 */
  MsgType = 35,
  /** 发送方id */
  SenderCompID = 49,
  /** 表示消息的时间戳 */
  SendingTime = 52,
  /** 接收方id */
  TargetCompID = 56,
  /** 数据类型 */
  BondMsgType = 10000,
  /** 操作类型 */
  BondMsgMethod = 10001,
  /** 当前版本号 */
  Version = 10002,
  /** 债券code */
  BondCode = 11015,
  /** 债券key */
  BondKey = 11016,
  /** 债券唯一标识 */
  BondKeyListedMarket = 11017,
  /** 债券简称 */
  BondShortName = 11018,
  /** 成交净价 */
  DealCleanPrice = 11021,
  /** 票面利率 */
  CouponRate = 11022,
  /** 创建时间 */
  CreateTime = 11023,
  /** 成交券面总额单位 */
  DealBondVolumeUnit = 11024,
  /** 成交内部标识 */
  DealInternal = 11025,
  /** 成交时间戳 */
  DealTime = 11028,
  /** 删除标记 */
  DelFlag = 11029,
  /** 成交备注 */
  DealDescription = 11030,
  /** 成交方向 */
  DealDirection = 11031,
  /** 成交全价 */
  DealDirtyPrice = 11032,
  /** 成交返点值 */
  DealFanDian = 11033,
  /** 成交返点标识 */
  DealFanDianFlag = 11034,
  /** 产品ID */
  Id = 11035,
  /** 交易市场 */
  ListedMarket = 11039,
  /** 成交价 */
  DealPrice = 11055,
  /** 公司ID */
  PushMessageCompanyId = 11057,
  /** 公司名称 */
  PushMessageCompanyName = 11058,
  /** 报价方向 */
  QuoteSide = 11060,
  /** 成交价格类型 */
  DealPriceType = 11062,
  /** 利率类型 */
  RateType = 11063,
  /** 成交结算金额 */
  DealSettlementAmount = 11065,
  /** 成交交割时间 */
  DealDeliveryTime = 11066,
  /** 成交结算模式 */
  DealSettlementMode = 11067,
  /** 成交清算速度 */
  DealLiquidationSpeed = 11068,
  /** 成交券面总额 */
  DealVolume = 11073,
  /** 成交收益率 */
  DealYield = 11074,
  /** 是否跨市场 */
  AcrossMarket = 11076,
  /** 相关跨市场债券 */
  AcrossMarketBondCodes = 11077,
  /** Bid最优净价 */
  BestBidCleanPrice = 11078,
  /** Bid最优全价 */
  BestBidDirtyPrice = 11079,
  /** Bid最优报价个数 */
  BestBidQuoteCount = 11080,
  /** Bid最优报价量 */
  BestBidVolume = 11082,
  /** Bid最优总量 */
  BestBidVolumeClient = 11083,
  /** Ofr最优净价 */
  BestOfrCleanPrice = 11090,
  /** Ofr最优全价 */
  BestOfrDirtyPrice = 11091,
  /** Ofr最优报价个数 */
  BestOfrQuoteCount = 11092,
  /** Ofr最优报价量 */
  BestOfrVolume = 11094,
  /** Ofr最优总量 */
  BestOfrVolumeClient = 11095,
  /** Bid方Bad标识 */
  BidBadFlag = 11096,
  /** Bid议价标识 */
  BidBargainFlag = 11097,
  /** Bid报价描述 */
  BidDescription = 11098,
  /** Bid返点数 */
  BidFanDian = 11099,
  /** Bid返点标识 */
  BidFanDianFlag = 11100,
  /** Bid返点描述 */
  BidFanDianString = 11101,
  /** Bid内部标识 */
  BidInternalFlag = 11103,
  /** ， */
  BidOcoFlag = 11104,
  /** 价差 */
  BidOfrSpread = 11105,
  /** Bid价格 */
  BidPrice = 11106,
  /** Bid价格描述 */
  BidPriceString = 11107,
  /** Bid报价个数 */
  BidQuoteCount = 11108,
  /** Bid报价ID */
  BidQuoteId = 11109,
  /** Bid报价类型 */
  BidQuoteType = 11110,
  /** Bid收益率类型 */
  BidYieldType = 11112,
  /** 债券种类 */
  BondCategory = 11113,
  /** 债券评级 */
  BondRating = 11114,
  /** 债券评级权值 */
  BondRatingOrder = 11117,
  /** 债券类型 */
  BondType = 11118,
  /** 公司债 */
  CompanyBond = 11122,
  /** 完整报价中债券类型 */
  CompletedBondType = 11123,
  /** 机构类型 */
  EnterpriseType = 11126,
  /** 到期日 */
  FilterMaturity = 11127,
  /** 平台债 */
  FinancingPlatform = 11128,
  /** 担保方式 */
  GuaranteeType = 11129,
  /** 有无担保 */
  Guarenteed = 11130,
  /** 是否含权 */
  HasOption = 11131,
  /** 是否有Bid方报价 */
  HavingBidQuote = 11132,
  /** 是否有Ofr方报价 */
  HavingOfrQuote = 11135,
  /** 是否有报价 */
  HavingQuote = 11136,
  /** 发行机构 */
  IssueInstitution = 11143,
  /** 发行省份代码 */
  IssueProvinceCode = 11144,
  /** 发行年份 */
  IssueYear = 11145,
  /** 主体评级 */
  IssuerRatingFilter = 11146,
  /** 主体评级权值 */
  IssuerRatingOrder = 11149,
  /** 上市日 */
  ListedDate = 11151,
  /** 市场类型 */
  MarketType = 11152,
  /** 到期日 */
  Maturity = 11153,
  /** 到期日是否节假日 */
  MaturityDateType = 11154,
  /** 到期日距工作日日期 */
  MaturityHolidays = 11155,
  /** 是否城投债 */
  Municipal = 11156,
  /** Ofr方Bad标识 */
  OfrBadFlag = 11157,
  /** Ofr议价标识 */
  OfrBargainFlag = 11158,
  /** Ofr报价描述 */
  OfrDescription = 11159,
  /** Ofr返点数 */
  OfrFanDian = 11160,
  /** Ofr返点标识 */
  OfrFanDianFlag = 11161,
  /** Ofr返点描述 */
  OfrFanDianString = 11162,
  /** Ofr内部标识 */
  OfrInternalFlag = 11164,
  /** ， */
  OfrOcoFlag = 11165,
  /** Ofr偏离值 */
  OfrPrice = 11166,
  /** Ofr价格 */
  OfrPriceString = 11167,
  /** Ofr报价个数 */
  OfrQuoteCount = 11168,
  /** Ofr报价ID */
  OfrQuoteId = 11169,
  /** Ofr报价类型 */
  OfrQuoteType = 11170,
  /** Ofr收益率类型 */
  OfrYieldType = 11172,
  /** 新上市 */
  OnTheRun = 11173,
  /** 是否可质押 */
  Pledged = 11175,
  /** 利率方式 */
  RateIndex = 11176,
  /** 债券评级机构 */
  RatingInstitution = 11177,
  /** 行业代码 */
  SwSectorCode = 11179,
  /** 上级行业代码 */
  SwSectorUpperCode = 11180,
  /** 剩余期限 */
  TimeToMaturity = 11181,
  /** ） */
  TimeToMaturityReal = 11182,
  /** 是否双边 */
  TwoSided = 11183,
  /** Bid收益率 */
  BidYield = 11186,
  /** Ofr收益率 */
  OfrYield = 11187,
  /** Bid最优总量 */
  BestBidVolumeTotal = 11189,
  /** Ofr最优总量 */
  BestOfrVolumeTotal = 11190,
  /** Bid最优备注 */
  BestBidDescription = 11191,
  /** Ofr最优备注 */
  BestOfrDescription = 11192,
  /** 成交时间 */
  DealTimeStr = 11193,
  /** Ofr方经纪人部门 */
  OfrBrokerDepartmentName = 14001,
  /** Bid方经纪人部门 */
  BidBrokerDepartmentName = 14002,
  /** 成交操作人部门 */
  DealOperatorDepartmentName = 14003,
  /** 发行日期 */
  IssueDate = 14004,
  /** NCD一级价格 */
  NCDPPrice = 14005,
  /** NCD一级数量 */
  NCDPVolume = 14006,
  /** NCD一级是否询满 */
  NCDPFlagFull = 14007,
  /** NCD一级价格变动 */
  NCDPPriceChange = 14008,
  /** 固定5 */
  OnBehalfOfCompID = 115,
  /** 交易明细唯一ID */
  TradeRequestID = 568,
  /** 交易明细报告的唯一id */
  TradeReportID = 571,
  /** 交易组合编号 */
  TradeID = 1003,
  /** 交易子单号同TradeRequestID */
  SecondaryTradeID = 1040,
  /** 1：普通单笔交易单2：过桥单3：代付单 */
  TradeRequestType = 569,
  /** 加桥、加代付方时间 */
  TradeMatchTimestamp = 1888,
  /** 0：有效New4：撤销Canceled */
  OrdStatus = 39,
  /** 交易方式 */
  TrdType = 828,
  /** 1：我方发起2：对方发起 */
  TrdSubType = 829,
  /** 市场4：现券市场 */
  MarketIndicator = 10176,
  /** 债券类型BNC：利率债BCO：信用债NCD：存单二级 */
  SecurityType = 167,
  /** 债券代码2128028.IB */
  SecurityID = 48,
  /** 债券简称21邮储银行二级01 */
  Symbol = 55,
  /** 到期日格式：YYYYMMDD */
  MaturityDate = 541,
  /** 固定值MATURITY */
  YieldType = 235,
  /** 如果235有值，必传，到期收益率 */
  Yield = 236,
  NoStipulations = 232,
  /** 固定值StrikeYield */
  StipulationType = 233,
  /** 如果233有值，必传行权收益率 */
  StipulationValue = 234,
  /** 票面总额 */
  LastQty = 32,
  /** 净价 */
  CleanPrice = 10047,
  /** 全价 */
  DirtyPrice = 10048,
  /** 结算金额 */
  SettleCurrAmt = 119,
  /** 报文接收方的交易方向，山证1：买入2：卖出 */
  Side = 54,
  /** 清算速度1：T+0N+1：T+N */
  SettleType = 63,
  /** 清算日期格式：YYYYMMDD */
  SettleDate = 64,
  /** 清算方式：0：DVP */
  DeliveryType = 919,
  /** 交易日期格式：YYYYMMDD */
  TradeDate = 75,
  /** 交易发送信息循环组的个数 */
  NoAllocs = 78,
  /** 交易发送至（机构） */
  AllocAccount = 79,
  /** 交易发送至（交易员） */
  IndividualAllocID = 467,
  /** 交易备注 */
  AllocText = 161,
  /** 内码2位字母+4位数字，一年内不重复新增交易时生成，修改撤销不变 */
  Text = 58,
  /** 约定号 */
  TrdMatchID = 880,
  /** 成交明细的创建时间 */
  TransactTime = 60,
  /** 几个费用循环组 */
  NoPayments = 40212,
  /** 固定值，费用类型0：中介费1：代付费2：返费 */
  PaymentType = 40213,
  /** 费率40213=0：单位bp40213=1：单位厘40213=2：单位元 */
  PaymentFixedRate = 43097,
  /** 费用，单位元 */
  PaymentAmount = 40217,
  /** 循环组个数 */
  NoPartyIDs = 453,
  /** 固定值- */
  PartyID = 448,
  /** 交易角色1：本方2：对手方 */
  PartyRole = 452,
  /** 固定值5 */
  NoPartySubID = 802,
  /** 机构名称 */
  PartySubID = 523,
  PartySubIDType = 803,
  /** 补差校验版本号 */
  SorVersion = 45003,
  /** 交易明细报告反馈状态 */
  TradeRptStat = 939,
  /** 结算状态 */
  SettleStatus = 45001,
  /** 报价状态 */
  QuoteStat = 45002
}
