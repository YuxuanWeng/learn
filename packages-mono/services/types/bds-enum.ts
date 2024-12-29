export enum CustProdType {
  CustProdTypeNone = 0, // proto3要求必须以0开头
  CustProdBCO = 1, // 信用   先忽略 BBE
  CustProdBNC = 2, // 利率   先忽略 BBN
  CustProdABS = 3, // ABS
  CustProdHYB = 4, // HYB
  CustProdNCD = 5, // NCD
  CustProdNCDP = 6, // NCDP
  CustProdPC = 7, // PC
  CustProdSLD = 8 // SLD
}

export enum BondCategory {
  BondCategoryNone = 0,
  SCP = 1, // 超短融 Super & Short-term Commercial Paper
  CP = 2, // 短融 Commercial Paper
  MTN = 3, // 中票 Medium-Term Notes
  EB = 4, // 企业债 Enterprice Bonds
  CB = 5, // 公司债 Corporate Bonds
  SD = 6, // 次级债 Subordinated Debt
  PPN = 7, // 非公开定向债务融资工具 Private Placement Notes
  GB = 8, // 国债 Government Bonds
  CBB = 9, // 央票 Central Bank Bills
  FB = 10, // 金融债 Financial Bonds
  LGB = 11, // 地方债 Local Government Bonds
  OBC = 12 // 其他 Other Bond Category
}

export enum BondShortName {
  BondShortNameNone = 0, // proto3要求必须以0开头
  CDB = 1, // 1: 国开
  EIB = 2, // 2: 口发
  ADB = 3 // 3: 农发
}

export enum ListedMarket {
  ListedMarketNone = 0, // proto3要求必须以0开头
  CIB = 1, // 1: 银行间
  SSE = 2, // 2: 上交所
  SZE = 3 // 3: 深交所
}

export enum ProductMarket {
  ProductMarketNone = 0, // proto3要求必须以0开头
  ProductMarketBBN = 1, // 交易所利率债
  ProductMarketBNC = 2, // 银行间利率债
  ProductMarketBBE = 3, // 交易所信用债
  ProductMarketBCO = 4, // 银行间信用债
  ProductMarketNCD = 5 // 存单
}

export enum CollectionMethod {
  CollectionMethodNone = 0, // proto3要求必须以0开头
  SAAA = 1, // 超AAA
  PUB = 2, // 公募债：Asset_Status=PUB 或 Asset_Status=NULL
  PRI = 3, // 私募债：Asset_Status=PRI
  SCV = 4 // 可交换：Bond_Subtype = SCV
}

export enum BondNature {
  BondNatureNone = 0, // proto3要求必须以0开头
  GeneralDebt = 1, // 1: 一般债
  SpecialDebt = 2 // 2: 专项债
}

export enum PerpType {
  PerpTypeNone = 0, // proto3要求必须以0开头
  PerpSub = 1, // 永续次级
  PerpNotSub = 2, // 永续非次级
  NotPerp = 3 // 非永续
}

export enum OptionType {
  OptionTypeNone = 0, // proto3要求必须以0开头
  CAL = 1, // 赎回权
  CNP = 2, // 回售权和赎回权
  ETS = 3, // 永续债
  NON = 4, // 普通债券
  PUT = 5, // 回售权
  CNV = 6, // 单向换券权
  DCN = 7, // 互换券权
  ASS = 8 // 投资者定向转让选择权
}

export enum OptionStyle {
  OptionStyleNone = 0, // proto3要求必须以0开头
  EUR = 1,
  AME = 2
}

export enum Bool {
  BoolNone = 0, // proto3要求必须以0开头
  Y = 1, // yes
  N = 2 // no
}

export enum BankType {
  BankTypeNone = 0, // proto3要求必须以0开头
  BankTypeSPD = 1, // 1: 政策性
  BankTypeMCD = 2, // 2: 大行
  BankTypeSHD = 3, // 3: 股份制
  BankTypeCCD = 4, // 4: 城商行
  BankTypeFRD = 5, // 5: 外资行
  BankTypeRRD = 6, // 6: 农信
  BankTypeRTD = 7, // 7: 村镇
  BankTypeOTD = 8 // 8: 其他
}

export enum NcdSubtype {
  NcdSubtypeNone = 0, // proto3要求必须以0开头
  NcdSubtypeMCB = 1, // 1: 国有大型银行
  NcdSubtypeSPB = 2, // 2: 政策性银行
  NcdSubtypeSHB = 3, // 3: 股份制商业银行
  NcdSubtypeFRB = 4, // 4: 外资银行
  NcdSubtypeRRB = 5, // 5: 三农机构
  NcdSubtypeCCB = 6, // 6: 城市商业银行
  NcdSubtypeOTB = 7, // 7: 其他银行
  NcdSubtypeRTB = 8 // 8: 村镇银行
}

export enum MktType {
  MktTypeNone = 0, // proto3要求必须以0开头
  IntentionalDebt = 1, // 1: 意向债
  SecondaryDebt = 2 // 2: 二级债
}

export enum FormType {
  FormTypeNone = 0, // proto3要求必须以0开头
  Basic = 1, // 1: 基本报价
  Optimal = 2, // 2: 最优报价
  MarketDeal = 3, // 3: 市场成交
  DCS = 4, // 4: DCS成交单
  Deprecated = 5 // 5: 作废区
}

export enum Side {
  SideNone = 0, // proto3要求必须以0开头
  SideBid = 1, // 1: Bid
  SideOfr = 2 // 2: Ofr
}

export enum Direction {
  DirectionNone = 0, // proto3要求必须以0开头
  DirectionGvn = 1, // 1: Gvn
  DirectionTkn = 2, // 2: Tkn
  DirectionTrd = 3 // 3: Trd
}

export enum MarketDealLastActionType {
  MarketDealLastActionTypeNone = 0, // proto3要求必须以0开头
  GvnTkn = 1, // 最后一次操作Gvn/Tkn
  Join = 2, // 最后一次操作Join
  Others = 3 // 其它方式
}

export enum DealDateType {
  DealDateTypeNone = 0, // proto3要求必须以0开头
  Traded = 1, // 1: 交易日
  Settlement = 2, // 2: 结算日
  Delivery = 3, // 3: 交割日
  DealTime = 4 // 4: 成交时间
}

export enum ReviewStatus {
  ReviewStatusNone = 0, // proto3要求必须以0开头
  Pending = 1, // 1: 待处理
  Acknowledged = 2, // 2: 已确认
  Ignored = 3 // 3: 已忽略
}

export enum RefType {
  RefTypeNone = 0, // proto3要求必须以0开头
  Deal = 1, // 1: 成交撤销
  Manual = 2, // 2: 人工撤销
  Auto = 3 // 3: 自动撤销
}

export enum InstitutionSubtype {
  InstitutionSubtypeNone = 0, // proto3要求必须以0开头
  CGE = 1, // 1: 央企
  LGE = 2, // 2: 国企
  PVE = 3, // 3: 民企
  OTE = 4 // 4: 其他
}

export enum BondSector {
  BondSectorNone = 0,
  Bank = 1, // 银行
  Brokerages = 2, // 券商
  Insurance = 3, // 保险
  GN = 4
}

export enum BondSubtype {
  BondSubtypeNone = 0, // proto3要求必须以0开头
  BondSubtypePSB = 1,
  BondSubtypeCBB = 2,
  BondSubtypeCSB = 3,
  BondSubtypeCXB = 4,
  BondSubtypeSEB = 5,
  BondSubtypeSSB = 6,
  BondSubtypeSES = 7
}

export enum AssetStatus {
  AssetStatusNone = 0, // proto3要求必须以0开头
  AssetStatusSuperAAA = 1, // 1: 超AAA
  AssetStatusPUB = 2, // 2: 公募债
  AssetStatusPRI = 3, // 3: 私募债
  AssetStatusSCV = 4 // 4: 可交换债
}

export enum Rating {
  RatingNone = 0, // proto3要求必须以0开头
  AAAPlus = 1, // 1: AAA+
  AAA = 2, // 2: AAA
  AAAMinus = 3, // 3: AAA-
  AAPlus = 4, // 4: AA+
  AA = 5, // 5: AA
  AAMinus = 6, // 6: AA-
  APlus = 7, // 7: A+
  A = 8, // 8: A
  AMinus = 9, // 9: A-
  OtherIssuerRating = 10, // 10: 其他
  BBBPlus = 11, // 11: BBB+
  BBB = 12 // 12: BBB
}

export enum Outlook {
  OutlookNone = 0, // proto3要求必须以0开头
  OutlookSTB = 1, // 稳定
  OutlookRWT = 2, // 列入观察
  OutlookPOS = 3, // 正面
  OutlookNON = 4, // 无
  OutlookNEG = 5 // 负面
}

export enum FRType {
  FRTypeNone = 0, // proto3要求必须以0开头
  Shibor = 1, // 上海银行间同业拆放利率 Shanghai Interbank Offered Rate
  LPR = 2, // 贷款市场报价利率 Loan Prime Rate
  Depo = 3, // 1年期定期存款基准利率 Deposit Rate
  FRD = 4, // 固定利息 Fixed Rate
  DR = 5, // 质押式回购利率
  CDC = 6 // CDC
}

export enum MarketOpenStatus {
  MarketOpen = 1, // 开市
  MarketClosed = 2 // 闭市
}

export enum OperationType {
  BondDealAddBondDeal = 1, // 新增市场成交
  BondDealAddBridgeDeal = 2, // 新增过桥单
  BondDealDeleteBondDeal = 3, // 删除市场成交
  BondDealUpdate = 4, // 修改市场成交
  BondDealUpdateDealInfo = 5, // 修改市场成交信息
  BondDealUndoUpdateInfo = 6, // 客户端undo操作，回退成交的修改
  BondQuoteAdd = 7, // 新增报价
  BondQuoteEditReferredQuote = 8, // refer区编辑报价
  BondQuoteGvnTknQuote = 9, // gvn/tkn报价
  BondQuoteRefer = 10, // refer报价
  BondQuoteReferAll = 11, // refer全部报价
  BondQuoteUnRefer = 12, // unrefer refer区的报价
  BondQuoteUpdate = 13, // 修改报价
  BondQuoteUpdateInfo = 14, // 修改报价信息（客户端右侧快捷操作，议价等价格和量化外的信息）
  BondQuoteUpdateInternalInfo = 15, // 内外部修改
  BondQuoteDeleteQuote = 16, // 删除报价
  BondQuoteUpdateReferredQuote = 17, // refer区右侧快捷操作及undo操作触发
  BondQuoteUpdateYiJiBanRate = 18, // 债券详情中新上市券更新票面利率等信息
  IDCAddQuote = 19, // 新增报价
  IDCUpdateQuote = 20, // 修改报价
  IDCReferQuote = 21, // refer报价
  IDCGvnTknQuote = 22, // gvn/tkn报价
  BondQuoteAddDirection = 23, // 方向修改造成的新增
  BondQuoteUndoUpdate = 24, // Undo操作：普通update
  BondQuoteUndoRefer = 25, // Undo操作：Refer
  BondQuoteUndoUnRefer = 26, // Undo操作：UnRefer
  BondQuoteUndoDelete = 27, // Undo操作：DeleteQuote
  BondQuoteQmRollback = 28, // Qm回滚操作
  BondDealGvnTknDeal = 29, // GvnTkn成交
  BondDealTrdDeal = 30, // Trd成交
  BondDealUndoDelete = 31, // Undo删除成交
  BondDealUndoUpdate = 32 // Undo修改成交
}

export enum OperationSource {
  OperationSourceNone = 0, // 默认
  OperationSourceBdsIdb = 1, // 新系统IDB(又称 行情)
  OperationSourceBdsIdc = 2, // 新系统IDC(又称 交易处理)
  OperationSourceIdb = 3, // 老系统IDB
  OperationSourceIdc = 4, // 老系统IDC
  OperationSourceQm = 5, // QM
  OperationSourceStc = 6, // STC
  OperationSourceOffline = 7, // offline
  OperationSourceQuickChat = 8, // 快聊(又称 交易助手)
  OperationSourceQuoteDraft = 9, // 报价审核(又称 协同报价)
  OperationSourceReceiptDeal = 10, // 成交单
  OperationSourceSpotPricing = 11, // 点价
  OperationSourceDealRecord = 12, // 成交记录
  OperationSourceApproveReceiptDeal = 13, // 成交审批
  OperationSourceReceiptDealDetail = 14, // 成交单明细过桥
  OperationSourceReceiptDealBridge = 15, // 成交单过桥
  OperationSourceQQGroup = 16, // QQ群
  OperationSourceDataFeed = 17 // 数据推送
}

export enum DealDetailUpdateType {
  DealDetailUpdateTypeEnumNone = 0, // proto3要求必须以0开头
  DealDetailUpdateCP = 1, // CP变更
  DealDetailUpdateSendOrderInfo = 2, // 发单信息变更
  DealDetailUpdateBidSendOrderInfo = 3, // Bid发单信息变更
  DealDetailUpdateOfrSendOrderInfo = 4, // Ofr发单信息变更
  DealDetailUpdateBidBridgeDirection = 5, // Bid桥方向
  DealDetailUpdateBidSendMsg = 6, // Bid发给
  DealDetailUpdateBidBridgeChannel = 7, // Bid桥渠道
  DealDetailUpdateBidFee = 8, // Bid费用
  DealDetailUpdateBidSendOrderComment = 9, // Bid桥发单备注
  DealDetailUpdateBidHideComment = 10, // Bid桥隐藏备注
  DealDetailUpdateBidSendOrderInstList = 11, // Bid发单机构列表
  DealDetailUpdateBidBridgeComment = 12, // Bid桥备注
  DealDetailUpdateOfrBridgeDirection = 13, // Ofr桥方向
  DealDetailUpdateOfrSendMsg = 14, // Ofr发给
  DealDetailUpdateOfrBridgeChannel = 15, // Ofr桥渠道
  DealDetailUpdateOfrFee = 16, // Ofr费用
  DealDetailUpdateOfrSendOrderComment = 17, // Ofr桥发单备注
  DealDetailUpdateOfrHideComment = 18, // Ofr桥隐藏备注
  DealDetailUpdateOfrSendOrderInstList = 19, // Ofr发单机构列表
  DealDetailUpdateOfrBridgeComment = 20, // Ofr桥备注
  DealDetailUpdateSingleBridgeComment = 21, // 桥备注（单桥，双桥情况下为Bid/Ofr桥备注即Enum12+20）
  DealDetailUpdateDoubleBridgeSendMsg = 22, // 双桥发给
  DealDetailUpdateDoubleBridgeChannel = 23, // 双桥渠道
  DealDetailUpdateDoubleBridgeFee = 24, // 双桥费用
  DealDetailUpdateDoubleBridgeSendOrderComment = 25, // 双桥发单备注
  DealDetailUpdateDoubleBridgeDirection = 26 // 双桥方向
}

export enum DealRecordUpdateType {
  DealRecordUpdateTypeEnumNone = 0, // proto3要求必须以0开头
  DealRecordUpdateBond = 1, // 债券变更
  DealRecordUpdatePrice = 2, // 价格变更
  DealRecordUpdateReturnPoint = 3, // 返点变更
  DealRecordUpdatePriceType = 4, // 价格类型变更
  DealRecordUpdateConfirmVolume = 5, // 点价确认量变更
  DealRecordUpdateBidSettlementType = 6, // Bid结算方式变更
  DealRecordUpdateOfrSettlementType = 7, // Ofr结算方式变更
  DealRecordUpdateBidTradedDate = 8, // Bid交易日变更
  DealRecordUpdateBidDeliveryDate = 9, // Bid交割日变更
  DealRecordUpdateOfrTradedDate = 10, // Ofr交易日变更
  DealRecordUpdateOfrDeliveryDate = 11, // Ofr交割日变更
  DealRecordUpdateFlagStockExchange = 12, // 换券标识变更
  DealRecordUpdateExerciseType = 13, // 行权方式变更
  DealRecordUpdateSpotPricingee = 14, // 被点价方变更
  DealRecordUpdateSpotPricinger = 15, // 点价方变更
  DealRecordUpdateFlagBridge = 16, // 需要加桥标识变更
  DealRecordUpdateSendOrderMsg = 17, // 发单信息变更
  DealRecordUpdateBidSendOrderMsg = 18, // Bid发单信息变更
  DealRecordUpdateOfrSendOrderMsg = 19, // Ofr发单信息变更
  DealRecordUpdateStaggerDate = 20, // 错期变更
  DealRecordUpdateCP = 21 // CP信息变更
}

export enum Sceniority {
  SceniorityEnumNone = 0,
  SceniorityFIN = 1,
  SceniorityGEN = 2,
  ScenioritySUB = 3,
  SceniorityMIX = 4
}

export enum ProductClass {
  ProductClassEnumNone = 0,
  FixedIncome = 1, // 固定收益
  Derivatives = 2, // 衍生品
  Funds = 3, // 资金
  Currencies = 4 // 外汇
}

export enum IsCrossMkt {
  CrossMktEnumNone = 0,
  CrossMktY = 1, // 是
  CrossMktN = 2 // 否
}

export enum IsMortgage {
  MortgageEnumNone = 0,
  MortgageY = 1, // 是
  MortgageN = 2 // 否
}

export enum IsMunicipal {
  MunicipalEnumNone = 0,
  MunicipalY = 1, // 是
  MunicipalN = 2 // 否
}

export enum DateIsHoliday {
  DateIsHolidayEnumNone = 0,
  Holiday = 1, // 假期
  Workday = 2 // 工作日
}

export enum FiccBondInfoLevel {
  FiccBondInfoLevelNone = 0, // proto3要求必须以0开头
  BasicInfo = 1, // 基础信息
  AppendixInfo = 2 // 完整信息
}

export enum FiccBondInfoLevelV2 {
  FiccBondInfoLevelV2None = 0, // proto3要求必须以0开头
  InfoLevelBasic = 1, // 基础信息
  InfoLevelDetail = 2 // 完整信息
}

export enum BondSearchType {
  BondSearchTypeNone = 0, // proto3要求必须以0开头
  SearchAllField = 1, // 模糊搜索2-5所有字段
  SearchCode = 2, // 模糊搜索 bondcode
  SearchShortName = 3, // 模糊搜索 bond shortname
  SearchFullName = 4, // 模糊搜索 bond fullname
  SearchPinyin = 5, // 模糊搜索 bond 简称拼音
  SearchDealProcess = 6, // 搜索交易处理
  SearchParsing = 7 // 搜索识别
}

export enum SpotPricingConfirmStatus {
  ConfirmStatusNone = 0, // proto3要求必须以0开头
  ConfirmToBe = 1, // 待确认
  Confirmed = 2, // 确认
  Refuse = 3, // 拒绝
  PartConfirmed = 4, // 部分确认
  Delete = 5 // 已删除
}

export enum DealOrderType {
  DealOrderTypeNone = 0, // proto3要求必须以0开头
  MarketOrderDeal = 1, // 市场
  DCSOrderDeal = 2, // 市场
  AllDeal = 3 // 市场 + DCS
}

export enum DealType {
  DealTypeNone = 0,
  GVN = 1,
  TKN = 2,
  TRD = 3
}

export enum SendDealMeg {
  SendDealMeg = 0,
  NotSendDeal = 1,
  SendedDeal = 2
}

export enum TradeMode {
  TradeModeNone = 0,
  QQ = 1,
  QM = 2,
  Line = 3, // 直线
  Phone = 4, // 电话
  RM = 5
}

export enum Source {
  SourceNone = 0,
  IDB = 1,
  IDC = 2,
  BDS = 3,
  STC = 4,
  OFFLine = 5,
  SourceQM = 6
}

export enum BondQuoteType {
  TypeNone = 0,
  CleanPrice = 1,
  FullPrice = 2,
  Yield = 3,
  Spread = 4
}

export enum FuzzySearchType {
  FuzzySearchTypeNone = 0,
  GroupingManagement = 1,
  MainPage = 2
}

export enum UserHotkeyFunction {
  UserHotkeyFunctionNone = 0,
  UserHotkeyHotkeyWindow = 1,
  UserHotkeyOpenQuoteWindow = 2,
  UserHotkeyQuoteJoin = 3,
  UserHotkeyQuoteRefer = 4,
  UserHotkeyQuoteAddStar = 5,
  UserHotkeyQuoteAddDoubleStar = 6,
  UserHotkeyQuoteBatch = 7,
  UserHotkeyTrade = 8,
  UserHotkeyGVNTKNDeal = 9,
  UserHotkeyTRDDeal = 10,
  UserHotkeyOCO = 11,
  UserHotkeyPackageKey = 12,
  UserHotkeyShowAll = 13,
  UserHotkeyRefresh = 14,
  UserHotkeyRemarkOne = 15,
  UserHotkeyRemarkTwo = 16,
  UserHotkeyValuationQuote = 17,
  UserHotkeyInternalConversion = 18,
  UserHotkeySearchCompleteQuote = 19,
  UserHotkeyQuoteAddZero = 20,
  UserHotkeyQuoteAddOne = 21,
  UserHotkeyQuoteTomorrowAddZero = 22,
  UserHotkeyQuoteTomorrowAddOne = 23,
  UserHotkeyQuoteMonday = 24,
  UserHotkeyQuoteTuesday = 25,
  UserHotkeyQuoteWednesday = 26,
  UserHotkeyQuoteThursday = 27,
  UserHotkeyQuoteFriday = 28,
  UserHotkeyAlmostDone = 29,
  UserHotkeyRecommend = 30,
  UserHotkeyBondCalculator = 31,
  UserHotkeyRemarkThree = 32,
  UserHotkeyRemarkFour = 33,
  UserHotkeyRemarkFive = 34,
  UserHotkeyRemarkSix = 35,
  UserHotkeyRemarkSeven = 36,
  UserHotkeyRemarkEight = 37,
  UserHotkeyQuoteUnRefer = 38,
  UserHotkeyOpenBatchQuoteWindow = 39,
  UserHotkeyMarketRotation = 40
}

export enum UserSettingFunction {
  UserSettingFunctionNone = 0,
  UserSettingQuoteShortcutWaitTime = 1, // 价格快捷键等待时间
  UserSettingAmountShortcutWaitTime = 2, // 数量快捷键修改等待时间
  UserSettingQuoteAutoAddStar = 3, // 报价自动加*
  UserSettingQuoteAmount = 5, // 报价数量
  UserSettingValuationDecimalDigit = 6, // 估值小数位选择
  /** @deprecated */
  UserSettingQuoteImportQMGroup = 7, // 报价导入qm群    // deprecated
  /** @deprecated */
  UserSettingCreditGroup = 8, // 信用群         // deprecated
  /** @deprecated */
  UserSettingRateGroup = 9, // 利率群         // deprecated
  UserSettingOptimalQuoteCopyMethod = 10, // 最优报价界面复制方式
  UserSettingIncludeValuation = 11, // 含估值
  UserSettingIncludeDuration = 12, // 含永期
  UserSettingIncludeIssueAmount = 13, // 含发行量
  UserSettingIncludeMaturityDate = 14, // 含到期日
  UserSettingSortByTerm = 15, // 按期限排序
  UserSettingDisplaySetting = 16, // 最优报价/深度报价悬浮框设置
  UserSettingLocationDisplay = 17, // 地点显示
  UserSettingInitSearchBond = 18, // 搜券是否默认券名
  UserSettingTeamCollaboration = 19, // 团队协作
  /** @deprecated */
  UserSettingDCSAutoFillBroker = 20, // DCS成交单-自填充经纪人       // deprecated
  /** @deprecated */
  UserSettingDCSDefaultCommissionN = 21, // DCS成交单-默认佣金类型为n    // deprecated
  /** @deprecated */
  UserSettingDCSDefaultTPlusZero = 22, // DCS成交单-默认t+0          // deprecated
  UserSettingSettlementBCO = 23, // 结算方式-BCO台子
  /** @deprecated */
  UserSettingTabs = 24, // 用户重命名台子 // deprecated
  /** @deprecated */
  UserSettingBCOTableColumn = 25, // BCO 表格列设置 // deprecated
  /** @deprecated */
  UserSettingBNCTableColumn = 26, // BNC 表格列设置 // deprecated
  /** @deprecated */
  UserSettingABSTableColumn = 27, // ABS 表格列设置 // deprecated
  /** @deprecated */
  UserSettingBCOBondDetailColumn = 28, // BCO 债券详情 表格列设置 // deprecated
  /** @deprecated */
  UserSettingBNCBondDetailColumn = 29, // BNC 债券详情 表格列设置 // deprecated
  /** @deprecated */
  UserSettingABSBondDetailColumn = 30, // ABS 债券详情 表格列设置 // deprecated
  UserSettingSettlementGroupBCO = 31, // 结算方式-分组模式-BCO
  UserSettingSettlementBNC = 32, // 结算方式-BNC台子
  UserSettingSettlementABS = 33, // 结算方式-ABS台子
  /** @deprecated */
  UserSettingCompleteQuoteMainColumn = 34, // 完整报价-上方列表-列设置 // deprecated
  /** @deprecated */
  UserSettingCompleteQuoteExpandColumn = 35, // 完整报价-下方列表-列设置 // deprecated
  UserSettingSettlementGroupBNC = 36, // 结算方式-分组模式-BNC
  UserSettingSettlementGroupABS = 37, // 结算方式-分组模式-ABS
  /** @deprecated */
  UserSettingQuoteOperationLogColumn = 38, // 报价日志-表格设置 // deprecated
  UserSettingQuoteParsingDefaultFlagStar = 39, // 单条报价识别默认加*
  UserSettingBatchParsingDefaultFlagStar = 40, // 批量报价识别默认加*
  /** @deprecated */
  UserSettingMarketDealLogColumn = 41, // 市场成交日志-列设置 deprecated
  /** @deprecated */
  UserSettingBridgeTop = 42, // 桥置顶 deprecated
  /** @deprecated */
  UserSettingOfflineDeal = 43, // 线下成交         // deprecated
  /** @deprecated */
  UserSettingMarketRotation = 44, // 行情切换         // deprecated
  /** @deprecated */
  UserSettingQuoteWindowColumn = 45, // 报价窗口列数设置   // deprecated
  UserSettingOptimalQuoteDisplayAmount = 46, // 最优报价展示数量
  UserSettingQuoteDraftBrokerGroups = 47, // 报价审核经纪人分组列表
  UserSettingQuoteDraftCurrentBrokerGroup = 48, // 报价审核选中的经纪人分组
  UserSettingOppositePriceNotificationWindow = 49, // 对价提醒窗口
  /** @deprecated */
  UserSettingGroupManagementOrder = 50, // 分组管理顺序    // deprecated
  /** @deprecated */
  UserSettingOppositePriceNotificationTraderMap = 51, // 对价提醒交易员QQ开关map    // deprecated
  UserSettingNavigationMenu = 52, // 导航菜单
  UserSettingCoQuoteVolume = 53, // 协同报价报价量设置
  UserSettingFilterGroup = 54, // 高级筛选分组管理
  UserSettingMessageCenter = 55 // 消息中心配置
}

export enum UserPreferenceType {
  UserPreferenceTypeNone = 0,
  UserPreferenceSearchTrader = 1, // 用户首选项-查询Trader
  UserPreferenceDealDetailButton = 2 // 成交明细筛选-按钮状态
}

export enum UserAccessGrantType {
  UserAccessGrantTypeNone = 0,
  UserAccessGrantTypeIdcDeal = 1, // 用户授予权限-IDC成交
  UserAccessGrantTypeReceiptDeal = 2, // 用户授予权限-成交单
  UserAccessGrantTypeDealInfo = 3, // 用户授予权限-成交记录
  UserAccessGrantTypeDealDetailBridge = 4 // 用户授予权限-成交明细与过桥
}

export enum QuoteSortedField {
  FieldNone = 0,
  FieldFirstMaturityDate = 1, // 剩余期限
  FieldBondCode = 2, // 债券代码
  FieldBondShortName = 3, // 债券简称
  FieldBid = 4, // bid
  FieldOfr = 5, // ofr
  FieldVolume = 6, // 报价量
  FieldBroker = 7, // Broker名
  FieldIssuerRatingVal = 8, // 主体评级
  FieldUpdateTime = 9, // 更新时间
  FieldBondRatingVal = 10, // 债券评级
  FieldValCleanPrice = 11, // 中债净价
  FieldValYield = 12, // 中债YTM
  FieldCsiCleanPrice = 13, // 中证净价
  FieldCsiFullPrice = 14, // 中证全价
  FieldCsiYield = 15, // 中证YTM
  FieldTrader = 16, // cp
  FieldFullPrice = 17, // 全价
  FieldCleanPrice = 18, // 净价
  FieldSpread = 19, // 利差
  FieldListedDate = 20, // 上市日
  FieldValModifiedDuration = 21, // 久期
  FieldValConvexity = 22, // 凸性
  FieldValBasisPointValue = 23, // PVBP
  FieldIssuerOutlookCurrent = 24, // 展望
  FieldOperator = 25, // 操作人
  FieldCreateTime = 26, // 创建时间
  FieldComment = 27, // 备注
  FieldRefType = 28, // 撤销类型
  FieldConversionRate = 29, // 质押率
  FieldCbcRatingVal = 30, // 中债资信评级
  FieldMaturityDate = 31, // 到期日
  FieldCouponRateCurrent = 32, // 票面利率
  FieldCPBid = 33, // CP.Bid
  FieldVolBid = 34, // Vol.Bid
  FieldCPOfr = 35, // CP.Ofr
  FieldVolOfr = 36, // Vol.Ofr
  FieldNBid = 37, // N.Bid
  FieldNOfr = 38, // N.Ofr
  FieldBrokerBid = 39, // Broker(B)
  FieldBrokerOfr = 40, // Broker(O)
  FiledOffsetBid = 41, // 偏离 Bid
  FiledOffsetOfr = 42, // 偏离 Ofr
  FieldFullPriceBid = 43, // 全价 Bid
  FieldCleanPriceBid = 44, // 净价 Bid
  FieldSpreadBid = 45, // 利差 Bid
  FieldFullPriceOfr = 46, // 全价 Ofr
  FieldCleanPriceOfr = 47, // 净价 Ofr
  FieldSpreadOfr = 48, // 利差 Ofr
  FieldImpliedRating = 49, // 隐含评级
  ReferTime = 50, // refer时间
  FieldDealPrice = 51, // 成交价格
  FieldTradedDate = 52, // 交易日
  FieldDeliveryDate = 53, // 交割日
  FieldDealTime = 54, // 成交时间
  FieldIssuerInst = 55, // 发行机构
  FieldIssuerDate = 56, // 发行日
  FieldPrice = 57, // 价格
  FieldPriceChange = 58, // 价格变动
  FieldSide = 59 // 方向
}

export enum UserOSType {
  UserOSTypeNone = 0,
  Mac = 1,
  Windows = 2
}

export enum RepaymentMethod {
  RepayNone = 0,
  RepayInAdvance = 1, // 提前还本
  RepayAtOnce = 2 // 到期一次还本
}

export enum CompleteQuoteGroup {
  GroupNone = 0,
  GroupGB = 1, // 国债
  GroupLGB = 2, // 地方债
  GroupCBB = 3, // 央票
  GroupFBFRD = 4, // 金融债
  GroupFBFRDOption = 5, // 金融债(含权)
  GroupFBShibor = 6, // 金融债(Shibor)
  GroupFBShiborOption = 7, // 金融债(Shibor含权)
  GroupFBLPR = 8, // 金融债(LPR)
  GroupFBLPROption = 9, // 金融债(LPR含权)
  GroupDepo = 10, // 金融债(Depo)
  GroupDepoOption = 11, // 金融债(Depo含权)
  GroupDR = 12 // 金融债(DR)
}

export enum LiquidationSpeedTag {
  LiquidationSpeedTagNone = 0,
  Today = 1,
  Tomorrow = 2,
  Monday = 3,
  Tuesday = 4,
  Wednesday = 5,
  Thursday = 6,
  Friday = 7,
  Saturday = 8,
  Sunday = 9,
  Default = 10
}

export enum DataSyncMessageType {
  DataSyncMessageTypeNone = 0,
  SyncData = 1,
  SyncPing = 2,
  SyncPong = 3,
  SyncAck = 4,
  SyncClose = 5,
  SyncDone = 6
}

export enum BridgeChannel {
  ChannelEnumNone = 0, // 默认0开始
  Talk = 1, // 对话
  Request = 2, // 请求
  BothSides = 3, // 双边
  Xbond = 4, // Xbond
  Ideal = 5, // ideal
  ChannelFixedIncome = 6, // 固收
  Bidding = 7, // 竞价
  Bulk = 8 // 大宗
}

export enum SettlementLabel {
  SettlementLabelNone = 0, // 默认
  SettlementLabelToday = 1, // 今天
  SettlementLabelTomorrow = 2, // 明天
  SettlementLabelOther = 3 // 其他
}

export enum ExerciseType {
  ExerciseTypeNone = 0, // 默认
  Exercise = 1, // 行权
  Expiration = 2 // 到期
}

export enum SpotPricingFailedReason {
  SpotPricingFailedReasonNone = 0,
  QuoteInvalid = 1, // 不符合规则
  MarketChanged = 2 // 行情更新
}

export enum SpotPricingImMsgSendStatus {
  SpotPricingImMsgSendStatusNone = 0,
  SpotPricingSending = 1, // 发送中
  SpotPricingSendSuccess = 2, // 发送成功
  SpotPricingBrokerNoImId = 3, // broker未绑定qq/qm
  SpotPricingTraderNoImId = 4, // trader未绑定qq/qm
  SpotPricingIMHelperOffline = 5, // im 小助手未登录
  SpotPricingNotFriends = 6, // 非好友关系
  SpotPricingOtherSendErr = 7 // 除以上三种情况的发送失败
}

export enum QuoteRelatedInfoFailedType {
  FailedTypeNone = 0, // 默认
  FailedTypeTraderOrInst = 1, // 交易员或机构
  FailedTypeBroker = 2, // 经纪人
  FailedTypeDelistedDate = 3, // 债券下市日
  FailedTypeOtherProcessed = 4 // 他人处理
}

export enum ReceiverSide {
  ReceiverSideNone = 0, // 默认
  SpotPricinger = 1, // 点价方
  BeSpotPricinger = 2 // 被点价方
}

export enum NotifyType {
  NotifyTypeNone = 0, // 默认
  NotifyTypeSpotPricing = 1, // 点价
  NotifyTypeOffline = 2 // 线下
}

export enum DealOperationType {
  DealOperationTypeNone = 0,
  DOTSpotPricing = 1, // 点价
  DOTBrokerAConfirm = 2, // 点价方确认
  DOTBrokerAReject = 3, // 点价方拒绝
  DOTBrokerBConfirm = 4, // 被点价方确认
  DOTBrokerBPartiallyFilled = 5, // 被点价方部分确认
  DOTBrokerBReject = 6, // 被点价方拒绝
  DOTOfflineConfirm = 7, // 线下成交确认
  DOTCreateByClone = 8, // 克隆
  DOTCloned = 9, // 被克隆
  DOTReceiptDealInput = 10, // 成交单录入
  DOTReceiptDealJoin = 11, // Join新增
  DOTAssociateBridge = 12, // 关联桥
  DOTModifyDeal = 13, // 成交单修改
  DOTModifySendOrderInfo = 14, // 修改发单信息
  DOTPrint = 15, // 打印
  DOTApprovalRuleReset = 16, // 审批规则重置
  DOTReceiptDealSubmit = 17, // 成交单提交
  DOTReceiptDealDestroy = 18, // 成交单毁单
  DOTReceiptDealApprove = 19, // 审核
  DOTReceiptDealReturn = 20, // 退回
  DOTAddBridge = 21, // 加桥
  DOTDeleteBridge = 22, // 删桥
  DOTResetBridge = 23, // 重置桥
  DOTChangeBridge = 24, // 换桥
  DOTModifyBridgeInfo = 25, // 修改桥信息
  DOTSend = 26, // 发送
  DOTRemindOrder = 27, // 催单
  DOTHandOver = 28, // 移交
  DOTReceiptDealDelete = 29, // 删除成交单
  DOTReceiptDealBidConfirm = 30, // 成交单Bid方确认
  DOTReceiptDealOfrConfirm = 31, // 成交单Ofr方确认
  DOTNewDeal = 32, // 新意向
  DOTBrokerAAsking = 33, // 点价方点击在问
  DOTBrokerBAsking = 34, // 被点价方点击在问
  DOTDeleteDealRecord = 35, // 删除成交记录
  DOTAddDoubleBridge = 36, // 加双桥
  DOTReceiptDealMulConfirm = 37, // 批量确认
  DOTReceiptDealNeedBridge = 38 // 修改待加桥状态
}

export enum AudioType {
  AudioNone = 0,
  AudioDeal = 1,
  AudioChoice = 2,
  AudioInvented = 3
}

export enum DealReadStatus {
  DealReadStatusNone = 0,
  Read = 1, // 已读
  CurUnread = 2, // 己方修改未读
  OppUnread = 3 // 对手方修改未读
}

export enum QuoteDraftDetailStatus {
  QuoteDraftDetailStatusNone = 0,
  QuoteDraftDetailStatusPending = 1, // 待处理
  QuoteDraftDetailStatusConfirmed = 2, // 已挂价
  QuoteDraftDetailStatusIgnored = 5 // 已忽略
}

export enum QuoteDraftMessageStatus {
  QuoteDraftMessageStatusNone = 0,
  QuoteDraftMessageStatusPending = 1, // 待处理
  QuoteDraftMessageStatusProcessed = 2 // 已处理
}

export enum BondDealStatus {
  BondDealStatusNone = 0, // proto3要求必须以0开头
  DealConfirming = 1, // 待确认
  DealConfirmed = 2, // 确认
  DealRefuse = 3, // 拒绝
  DealPartConfirmed = 4, // 部分确认
  DealDelete = 5, // 已删除
  DealAsking = 6 // 在问
}

export enum TradeDirection {
  TradeDirectionNone = 0, // proto3要求必须以0开头
  TradeDirectionOfr2Bid = 1, // ofr -> bid
  TradeDirectionBid2Ofr = 2 // bid -> ofr
}

export enum OppositePriceNotifyMsgFillType {
  OppositePriceNotifyMsgFillTypeNone = 0, // proto3要求必须以0开头
  OppositePriceNotifyMsgFillTypeAllMsg = 1, // 全部话术
  OppositePriceNotifyMsgFillTypeNoMsg = 2, // 无话术
  OppositePriceNotifyMsgFillTypeExcludeHist = 3, // 除历史成交
  OppositePriceNotifyMsgFillTypeOnlyCurrent = 4, // 仅即时成交
  OppositePriceNotifyMsgFillTypeExcludeDeal = 5 // 除成交话术
}

export enum OppositePriceNotifyLogicType {
  OppositePriceNotifyLogicTypeNone = 0, // proto3要求必须以0开头
  NotifyLogicTypeFirstOppositePrice = 1, // 首次出现对价
  NotifyLogicTypeBetterPriceOnSameSide = 2, // 同边报价更优
  NotifyLogicTypeBetterPriceOnOppositeSide = 3, // 对边报价更优
  NotifyLogicTypeWorsePriceOnSameSide = 4, // 同边最优退价
  NotifyLogicTypeWorsePriceOnOppositeSide = 5, // 对边最优退价
  NotifyLogicTypeNoQuoteOnOppositeSide = 6, // 对边报价清空
  NotifyLogicTypeNewQuoteWithOppositePrice = 7, // 新报价且有对价
  NotifyLogicTypeBidPriceOnOppositeSide = 8, // 对价为Bid意向价
  NotifyLogicTypeOfrPriceOnOppositeSide = 9, // 对价为Ofr意向价
  NotifyLogicTypeHasCurrentDeal = 10, // 有即时成交
  NotifyLogicTypeHasHistDeal = 11, // 有历史成交
  NotifyLogicTypeLessPriceDifference = 12, // 价差缩窄
  NotifyLogicTypeOfrPriceOffset = 13, // Ofr偏离估值
  NotifyLogicTypeBidPriceOffset = 14 // Bid偏离估值
}

export enum OppositePriceNotifyColor {
  OppositePriceNotifyColorNone = 0, // proto3要求必须以0开头
  OppositePriceNotifyColorPrimary = 1,
  OppositePriceNotifyColorAuxiliary = 2,
  OppositePriceNotifyColorOfr = 3,
  OppositePriceNotifyColorRed = 4,
  OppositePriceNotifyColorGolden = 5,
  OppositePriceNotifyColorTrd = 6
}

export enum QuoteDraftIgnoreType {
  QuoteDraftIgnoreTypeNone = 0,
  QuoteDraftIgnoreTypeIDList = 1, // 需要传入id列表
  QuoteDraftIgnoreTypeAll = 2, // 在All/待处理页签的全部忽略
  QuoteDraftIgnoreTypeMessage = 4 // 同一消息下的全部忽略
}

export enum QuoteDraftModifiedStatus {
  QuoteDraftMulModifiedStatusClear = 0, // 未修改过
  QuoteDraftMulModifiedStatusOnce = 1, // 仅一人修改过
  QuoteDraftMulModifiedStatusMul = 2 // 多人修改过
}

export enum DealHandOverStatus {
  DealHandOverStatusNone = 0,
  CanHandOver = 1, // 可以移交
  CanNotHandOver = 2, // 不能移交
  HandOver = 3 // 已经移交
}

export enum SettlementMode {
  SettlementModeNone = 0,
  DVP = 1
}

export enum BrokerageType {
  BrokerageTypeNone = 0,
  BrokerageTypeC = 1,
  BrokerageTypeN = 2,
  BrokerageTypeB = 3,
  BrokerageTypeR = 4
}

export enum ReceiptDealOperationType {
  ReceiptDealOperationTypeNone = 0,
  ReceiptDealAdd = 1, // 新增
  ReceiptDealBidConfirm = 2, // bid确认
  ReceiptDealOfrConfirm = 3, // ofr确认
  ReceiptDealModify = 4, // 修改
  ReceiptDealDelete = 5, // 删除
  ReceiptDealSubmit = 6, // 提交
  ReceiptDealDestroy = 7, // 毁单
  ReceiptDealApprove = 8, // 审核
  ReceiptDealReturn = 9, // 退回
  ReceiptDealPrint = 10, // 打印
  ReceiptDealRuleReset = 11, // 规则重置
  ReceiptDealAssociateBridge = 12, // 关联桥
  ReceiptDealHandOver = 13, // 移交
  ReceiptDealBrokerAAsking = 14, // 点价方点击在问
  ReceiptDealBrokerBAsking = 15, // 被点价方点击在问
  ReceiptDealMulConfirm = 16 // 批量确认
}

export enum ReceiptDealStatus {
  ReceiptDealStatusNone = 0, // proto3要求必须以0开头
  ReceiptDealToBeHandOver = 1, // 待移交
  ReceiptDealToBeConfirmed = 2, // 待确认
  ReceiptDealToBeSubmitted = 3, // 处理中
  ReceiptDealSubmitApproval = 4, // 送审中
  ReceiptDealToBeExamined = 5, // 待审核
  ReceiptDealNoPass = 6, // 未通过
  ReceiptDealPass = 7, // 通过
  ReceiptDealDestroyed = 8, // 已毁单
  ReceiptDealDeleted = 9 // 删除
}

export enum ReceiptDealSortedField {
  ReceiptDealSortedFieldNone = 0, // proto3要求必须以0开头
  RDSortInternalCode = 1,
  RDSortSeqNumber = 2,
  RDSortOrderNo = 3,
  RDSortFirstMaturityDate = 4, // 剩余期限
  RDSortBondCode = 5, // 债券代码
  RDSortPrice = 6, // 成交价
  RDSortVolume = 7, // 券面总额
  RDSortTradedDate = 8, // 交易日
  RDSortDeliveryDate = 9, // 交割日
  RDSortDealDate = 10, // 成交时间
  RDSortValCleanPrice = 11, // 中债净价
  RDSortValYield = 12, // 中债YTM
  RDSortCsiCleanPrice = 13, // 中证净价
  RDSortCsiFullPrice = 14, // 中证全价
  RDSortCsiYield = 15, // 中证YTM
  RDSortUpdateTime = 16, // 更新时间
  RDSortListedDate = 17, // 上市日
  RDSortMaturityDate = 18, // 到期日
  RDSortSendStatus = 19 // 外发状态
}

export enum ReceiptDealUpdateType {
  ReceiptDealDelUpdateTypeEnumNone = 0, // proto3要求必须以0开头
  RDUpdateDelBridge = 1, // 合单新增（删桥）新增 无字段对应
  RDUpdateAddBridge = 2, // 拆单新增（加桥）新增 无字段对应
  RDUpdateBridgeFlag = 3, // 桥标记 flag_need_bridge
  RDUpdateUrgentFlag = 4, // 紧急标识 flag_urgent
  RDUpdateStatus = 5, // 状态 receipt_deal_status
  RDUpdatePrice = 6, // Px 成交价 price,价格类型 price_type,返点 return_point
  RDUpdateInternalFlag = 7, // Px 明盘—> 暗盘 flag_internal
  RDUpdateVol = 8, // 券面总额 volume
  RDUpdateBidBroker = 9, // Broker(B)
  RDUpdateOfrBroker = 10, // Broker(O)
  RDUpdateCPBid = 11, // CP.Bid flag_bid_bridge:Bid方是否为过桥机构,bid_trader_id,bid_inst_id,bid_trader_tag
  RDUpdateCPOfr = 12, // CP.Ofr flag_ofr_bridge:Ofr方是否为过桥机构,ofr_trader_id,ofr_inst_id,ofr_trader_tag
  RDUpdateTradedDate = 13, // 交易日 traded_date
  RDUpdateDeliveryDate = 14, // 交割日 delivery_date
  RDUpdateDealDate = 15, // 成交时间 deal_time
  RDUpdateLiquidationSpeed = 16, // 清算速度 liquidation_speed_list
  RDUpdateBidPayFor = 17, // 被代付信息（B）bid_pay_for_inst_id:机构,bid_pay_for_trader_id:交易员id
  RDUpdateOfrPayFor = 18, // 被代付信息（O）ofr_pay_for_inst_id:机构,ofr_pay_for_trader_id:交易员id
  RDUpdateBidPayForNC = 19, // 被代付信息NC（B）flag_bid_pay_for_nc:是否nc,bid_pay_for_nc:nc原因
  RDUpdateOfrPayForNC = 20, // 被代付信息NC（O）flag_ofr_pay_for_nc:是否nc,ofr_pay_for_nc:nc原因
  RDUpdateSettlementMode = 21, // 结算模式 settlement_mode
  RDUpdateExercise = 22, // 行权方式 is_exercise
  RDUpdateDealDirection = 23, // 交易方向 direction
  RDUpdateOrderNo = 24, // 订单号 order_no
  RDUpdateYield = 25, // 收益率 yield
  RDUpdateSpread = 26, // 利差 spread
  RDUpdateCleanPrice = 27, // 净价 clean_price
  RDUpdateFullPrice = 28, // 全价 full_price
  RDUpdateMktType = 29, // 市场 mkt_type
  RDUpdateBidBrokerageType = 30, // 佣金B bid_brokerage_type:佣金类型,bid_brokerage:bid佣金
  RDUpdateOfrBrokerageType = 31, // 佣金O ofr_brokerage_type:佣金类型,ofr_brokerage:ofr佣金
  RDUpdateBidTradeMode = 32, // 交易方式B bid_trade_mode
  RDUpdateOfrTradeMode = 33, // 交易方式O ofr_trade_mode
  RDUpdateBidNC = 34, // NC(B) flag_bid_nc:是否nc,bid_nc:nc原因
  RDUpdateOfrNC = 35, // NC(O) flag_ofr_nc:是否nc,ofr_nc:nc原因
  RDUpdateBackendMsg = 36, // 后台信息 backend_msg
  RDUpdateBidInstSpecial = 37, // 特别细节B bid_inst_special
  RDUpdateOfrInstSpecial = 38, // 特别细节O ofr_inst_special
  RDUpdateBridgeCode = 39, // 过桥码 bridge_code
  RDUpdateBondCode = 40, // 产品 bond_code
  RDUpdateOtherDetail = 41, // 其他细节 other_detail
  RDUpdateUpdateTime = 42, // 更新时间 update_time
  RDUpdateSettlementAmount = 43, // 结算金额 settlement_amount
  RDInternalCode = 44, // 内码 order_no
  RDSeqNumber = 45, // 序列号 seq_number
  RDUpdateSorSendStatus = 46, // 外发状态
  RDUpdateYieldToExecution = 47 // 行权收益率 yield_to_execution
}

export enum ReceiptDealTradeInstBrokerageComment {
  RDTradeInstBrokerageCommentEnumNone = 0, // proto3要求必须以0开头
  RDTradeInstBrokerageCommentNormalBrokerage = 1, // 正常佣金
  RDTradeInstBrokerageCommentNoSignOrObjection = 2, // 部门未签约或有异议
  RDTradeInstBrokerageCommentStopLoss = 3, // 止损
  RDTradeInstBrokerageCommentEmergency = 4, // 解决突发问题
  RDTradeInstBrokerageCommentChannel = 5, // 通道
  RDTradeInstBrokerageCommentNotFoundOrUnArrangePayFor = 6, // 找不到或未安排代付
  RDTradeInstBrokerageCommentOneTimeSettlement = 7, // 单笔单议
  RDTradeInstBrokerageCommentOthers = 8, // 其他
  RDTradeInstBrokerageCommentSpecial = 9 // 特殊佣金
}

export enum ReceiptDealRuleType {
  ReceiptDealRuleTypeNone = 0, // proto3要求必须以0开头
  ReceiptDealRuleTypeDefault = 1, // 默认规则
  ReceiptDealRuleTypeSpecialBrokerage = 2, // 特别佣金
  ReceiptDealRuleTypeMD = 3, // MD
  ReceiptDealRuleTypeDestroyDeal = 4, // 毁单
  ReceiptDealRuleTypeNC = 5, // NC
  ReceiptDealRuleTypeSD = 6 // SD
}

export enum ReceiptDealRuleSubtype {
  ReceiptDealRuleSubtypeNone = 0, // proto3要求必须以0开头
  ReceiptDealRuleSubtypeSameYear = 1, // 同年
  ReceiptDealRuleSubtypeDifferentYear = 2, // 不同年
  ReceiptDealRuleSubtypeSameMonth = 3, // 同月
  ReceiptDealRuleSubtypeDifferentMonth = 4, // 不同月
  ReceiptDealRuleSubtypeSameDay = 5, // 同日
  ReceiptDealRuleSubtypeDifferentDay = 6 // 不同日
}

export enum AdvancedApprovalType {
  AdvancedApprovalTypeNone = 0, // proto3要求必须以0开头
  AdvancedApprovalTypeAny = 1, // 不限
  AdvancedApprovalTypeSpecialBrokerage = 2, // 特殊佣金
  AdvancedApprovalTypeMD = 3, // MD
  AdvancedApprovalTypeDestroy = 4, // 毁单
  AdvancedApprovalTypeNC = 5, // NC
  AdvancedApprovalTypeSD = 6 // SD
}

export enum ReceiptDealConflictType {
  ReceiptDealConflictTypeNone = 0, // proto3要求必须以0开头
  UnSubmit = 1, // 他人在成交单进行要素修改
  AuthorityChange = 2, // 流程配置权限变更(此时本人无该条成交单处理权限)
  Handled = 3 // 该成交单先被他人处理
}

export enum CheckBridge {
  CheckBridgeEnumNone = 0, // proto3要求必须以0开头
  HasBridge = 1, // 已有桥
  Inverse = 2, // 反向
  Submitted = 3, // 已提交
  Paid = 4, // 无桥且已代付，不可加桥
  SorSentModified = 5 // 山西证券代付单 已外发后修改
}

export enum DealMarketType {
  DealMarketNone = 0,
  PrimaryMarket = 1, // 一级市场
  SecondaryMarket = 2 // 二级市场
}

export enum HistDealStatus {
  HistDealStatusNone = 0, // 默认0开始
  HistDealToBeHandOver = 1, // 待移交
  HistDealHasHandOver = 2, // 已移交
  HistDealDeleted = 3, // 已删除
  HistDealToBeConfirm = 4, // 待确认
  HistDealRefused = 5 // 已拒绝
}

export enum UploadFileScene {
  UploadFileSceneNone = 0,
  UploadFileSceneImage = 1
}

export enum Acceptor {
  AcceptorNone = 0, // 默认0开始
  AcceptorWind = 1, // 万得
  AcceptorSor = 2 // 山证
}

export enum MarketNotifyMsgType {
  MarketNotifyMsgTypeNone = 0, // 默认0开始
  MarketNotifyMsgBondHandicap = 1, // 债券盘口
  MarketNotifyMsgDeal = 2, // 成交
  MarketNotifySorAD = 3, // 山证单独的，新增订单
  MarketNotifySorCT = 4, // 山证单独的，订单信息变更
  MarketNotifySorRST = 5, // 山证单独的，订单信息重推
  MarketNotifySorAE = 6, // 山证单独的，订单状态变更
  MarketNotifySorRTS = 7, // 山证单独的，订单状态重推
  MarketNotifyMsgNCDP = 8 // NCD一级数据
}

export enum LocalServerRealtimeScene {
  LocalServerRealtimeSceneNone = 0,
  LocalServerRealtimeSceneOptimalQuote = 1,
  LocalServerRealtimeSceneGetQuoteByKeyMarket = 2,
  LocalServerRealtimeSceneGetQuoteById = 3,
  LocalServerRealtimeSceneDealInfo = 4
}

export enum OptimalQuoteSettlementType {
  OptimalQuoteSettlementTypeNone = 0,
  OptimalQuoteSettlementTypeTodayPlus0 = 1,
  OptimalQuoteSettlementTypeTodayPlus1 = 2,
  OptimalQuoteSettlementTypeTomorrowPlus0 = 3,
  OptimalQuoteSettlementTypeForward = 4
}

export enum LocalServerWsMsgType {
  LocalServerWsMsgNone = 0,
  LocalServerWsMsgPing = 1,
  LocalServerWsMsgPong = 2,
  LocalServerWsMsgRequest = 3,
  LocalServerWsMsgResponse = 4
}

export enum LocalServerRequestType {
  LocalServerRequestNone = 0,
  Register = 1, // 注册
  Update = 2, // 更新查询条件
  DeRegister = 3 // 注销
}

export enum ApprovalSortedField {
  ReceiptChildDealSortedFieldNone = 0, // proto3要求必须以0开头
  SortOrderNo = 1, // 订单号
  SortPrice = 2, // 成交价
  SortVolume = 3, // 券面总额
  SortTradedDate = 4 // 交易日
}

export enum DealSorSendStatus {
  DealSorSendStatusNone = 0, // 默认状态
  DSSendStatusToBeSent = 1, // 待推送
  DSSendStatusSent = 2, // 已推送
  DSSendStatusApplying = 3, // 申请单
  DSSendStatusRefused = 4, // 拒绝更新
  DSSendStatusInstruction = 5, // 指令单
  DSSendStatusToBeExecuted = 6, // 交易执行
  DSSendStatusWithdrew = 7, // 交易撤单
  DSSendStatusDeleted = 8, // 已删除
  DSSendStatusExecuting = 9, // 处理中
  DSSendStatusConfirmed = 10 // 成交确认
}

export enum IssuerDateType {
  IssuerDateTypeNone = 0, // proto3要求必须以0开头
  IssuerDateTypeMonday = 1, // 周一
  IssuerDateTypeTuesday = 2, // 周二
  IssuerDateTypeWednesday = 3, // 周三
  IssuerDateTypeThursday = 4, // 周四
  IssuerDateTypeFriday = 5, // 周五
  IssuerDateTypeSaturday = 6, // 周六
  IssuerDateTypeSunday = 7, // 周日
  IssuerDateTypeToday = 8, // 今天
  IssuerDateTypeRecent = 9 // 近期
}

export enum MaturityDateType {
  MaturityDateTypeNone = 0, // proto3要求必须以0开头
  OneMonth = 1, // 1M
  ThreeMonth = 2, // 3M
  SixMonth = 3, // 6M
  NineMonth = 4, // 9M
  OneYear = 5 // 1Y
}

export enum NCDPOperationType {
  NcdPOperationTypeNone = 0, // proto3要求必须以0开头
  NcdPAdd = 1, // 新增
  NcdPModify = 2, // 修改
  NcdPQuickModify = 3, // 快捷修改
  NcdPDelete = 4, // 删除
  NcdPSystemDelete = 5 // 系统删除
}

export enum DateType {
  DateTypeNone = 0, // proto3要求必须以0开头
  Year = 1,
  Month = 2,
  Day = 3
}

export enum NCDPCheckError {
  NCDPCheckErrorNone = 0, // proto3要求必须以0开头
  NCDPCheckErrorInst = 1, // 机构报错
  NCDPCheckErrorIssueRating = 2 // 机构绑定发行人评级报错
}

export enum FrontendSyncMsgScene {
  FrontendSyncMsgSceneNone = 0, // proto3要求必须以0开头
  IQuoteRoomDetailSync = 1, // iQuote房间数据同步
  MarketChangeNotification = 2, // 行情变更-提醒
  MarketChangeOptimalQuote = 3, // 行情变更-最优报价
  MarketChangeMarketDeal = 4, // 行情变更-市场成交
  UserProductAccessSync = 5, // 用户产品权限变更同步
  UserMessage = 6, // 用户消息中心
  UserSetting = 7 // 用户配置
}

export enum MessageType {
  MessageTypeEnumNone = 0,
  MessageTypeUrgentDeal = 1
}

export enum MessageSource {
  MessageSourceEnumNone = 0,
  MessageSourceDTM = 1,
  MessageSourceCRM = 2,
  MessageSourceOMS = 3
}

export enum PreSignMethod {
  PreSignMethodEnumNone = 0,
  PreSignMethodGet = 1,
  PreSignMethodHead = 2
}
