export enum BNCSendBond {
  SendBondNone = 0,
  SendBondBroker = 1, // 地方债发送债券给broker
  SendBondTrader = 2 // 地方债发送债券给trader
}

export enum AlgoOperationType {
  AlgoOperationTypeNone = 0,
  AlgoOperationTypeQuotation = 1, // 报价          Qutation = Add
  AlgoOperationTypeDeal = 2, // 成交           Deal + BID = TKN       Deal + OFR = GVN
  AlgoOperationTypeRef = 3, // 撤单
  AlgoOperationTypeModify = 4 // 改单         Modify = Upd
}

export enum PostSource {
  PostFromNone = 0,
  PostFromHelper = 1, // 来自helper识别
  PostFromRecycle = 2 // 来自回收站
}

export enum AlgoDirection {
  AlgoDirectionNone = 0,
  AlgoDirectionBID = 1, // 买入方向
  AlgoDirectionOFR = 2 // 卖出方向
}

export enum TrustDegreeHelper {
  TrustDegreeHelperNone = 0,
  TrustDegreeZero = 1, // 非常靠谱
  TrustDegreeOne = 2, // 不靠谱程度为1颗星
  TrustDegreeTwo = 3 // 不靠谱程度为2颗星
}

export enum ClearSpeedType {
  ClearSpeedNone = 0,
  ClearSpeedDefault = 1, // 默认
  ClearSpeedCurrDay = 2, // +0
  ClearSpeedNextDay = 3 // +1
}

export enum BigVolumeType {
  BigVolumeNone = 0,
  BigVolumeDefault = 1, // 默认
  BigVolume1E = 2 // 大于1E挂5K
}

export enum InternalType {
  InternalNone = 0,
  InternalDefault = 1, // 默认
  InternalNo = 2, // 明盘
  InternalYes = 3 // 暗盘
}

export enum BargainFlagType {
  BargainFlagNone = 0,
  BargainFlagDefault = 1, // 默认
  BargainFlagOneStar = 2, // *
  BargainFlagTwoStar = 3 // **
}

export enum AthenaAlgoOperationType {
  AthenaOperationNone = 0,
  AthenaOperationAdd = 1, // 加入操作
  AthenaOperationDel = 2 // 移除操作
}

export enum AutoQuoteSelectType {
  AutoQuoteSelectNone = 0,
  AutoQuoteAll = 1, // 全部
  AutoQuoteStart = 2, // 开始-处理中
  AutoQuoteStop = 3, // 暂停
  AutoQuoteSuccess = 4, // 成功-已处理
  AutoQuoteFail = 5 // 挂单失败
}

export enum AutoQuoteTrustDegree {
  AutoQuoteTrustDegreeNone = 0,
  AutoQuoteTrustDegreeZero = 1, // 非常靠谱
  AutoQuoteTrustDegreeOne = 2, // 不靠谱程度为1颗星
  AutoQuoteTrustDegreeTwo = 3 // 不靠谱程度为2颗星
}

export enum AutoQuoteRecognitionType {
  AutoQuoteRecognitionTypeEnumNone = 0,
  AutoQuoteRecognitionTypeAdd = 1,
  AutoQuoteRecognitionTypeUpd = 2,
  AutoQuoteRecognitionTypeRef = 3,
  AutoQuoteRecognitionTypeGVN = 4,
  AutoQuoteRecognitionTypeTKN = 5,
  AutoQuoteRecognitionTypeTRD = 6
}

export enum AutoQuoteType {
  AutoQuoteTypeEnumNone = 0,
  AutoQuoteTypeStart = 1, // 进行
  AutoQuoteTypeStop = 2, // 暂停
  AutoQuoteTypeSuccessAuto = 3, // 已处理自动
  AutoQuoteTypeSuccessManual = 4, // 已处理手动(自动挂单页面操作)
  AutoQuoteTypeQuickChatSuccessManual = 5, // 已处理手动(快聊点击识别卡片)
  AutoQuoteTypeFail = 6, // 未挂单拒绝
  AutoQuoteTypeIDBFail = 7, // idb处理失败
  AutoQuoteTypeRef = 8, // 已失效，点击ref后的状态
  AutoQuoteTypeRecycle = 9 // 移入了回收站，不显示
}

export enum AutoQuoteCountDown {
  AutoQuoteCountDownEnumNone = 0,
  AutoQuoteCountDown5 = 1, // 5秒
  AutoQuoteCountDown10 = 2, // 10秒
  AutoQuoteCountDown30 = 3 // 30秒
}

export enum AutoQuoteOptType {
  AutoQuoteOptTypeNone = 0,
  AutoQuoteOptTypeAgree = 1, // 同意
  AutoQuoteOptTypeRefuse = 2, // 拒绝
  AutoQuoteOptTypeRefer = 3 // ref
}

export enum AutoQuoteCountDownType {
  AutoQuoteCountDownTypeNone = 0,
  AutoQuoteCountDownTypeStart = 1, // 开启
  AutoQuoteCountDownTypeStop = 2, // 暂停
  AutoQuoteCountDownTypeTimeEnd = 3 // 自动到时间
}

export enum AutoQuoteQuickchatOptType {
  AutoQuoteQuickchatOptTypeNone = 0,
  AutoQuoteQuickchatOptTypeRecognitionConfirm = 1, // 识别卡片点确认
  AutoQuoteQuickchatOptTypeRecycle = 2 // 回收站操作
}

export enum ValuationConfType {
  ValuationConfTypeEnumNone = 0,
  ValuationFull = 1, // 完整估值
  ValuationKeepTwoDecimals = 2 // 保留两位小数
}

export enum QuickChatCardsOperation {
  QuickChatCardsOperationEnumNone = 0,
  QuickChatCardsConfirm = 1, // 确认
  QuickChatCardsDelete = 2 // 删除
}

export enum QuickChatRecycleBinOperation {
  QuickChatRecycleBinOperationEnumNone = 0,
  QuickChatRecycleBinConfirm = 1, // 确认
  QuickChatRecycleBinDelete = 2 // 删除
}

export enum QuickChatScriptAlgoOperationType {
  QuickChatScriptEnumNone = 0,
  QuickChatScriptADD = 1,
  QuickChatScriptUPD = 2,
  QuickChatScriptREF = 3,
  QuickChatScriptTKN = 4,
  QuickChatScriptGVN = 5
}

export enum QuickChatAlgoOperationType {
  QuickChatEnumNone = 0,
  QuickChatADD = 1,
  QuickChatUPD = 2,
  QuickChatREF = 3,
  QuickChatTKN = 4,
  QuickChatGVN = 5
}

export enum QuickChatTrustDegree {
  QuickChatTrustDegreeNone = 0,
  QuickChatTrustDegreeOne = 1, // 不靠谱程度为1颗星
  QuickChatTrustDegreeTwo = 2 // 不靠谱程度为2颗星
}

export enum AlgoBondQuoteType {
  TypeNone = 0,
  CleanPrice = 1,
  FullPrice = 2,
  Yield = 3,
  Spread = 4,
  ReturnPoint = 8
}

export enum YieldType {
  YieldTypeEnumNone = 0, // 默认
  Exercise = 1, // 行权收益率
  Expiration = 2 // 到期收益率
}

export enum QuickChatRoomReadType {
  QuickChatRoomReadTypeEnumNone = 0,
  QuickChatRoomList = 1, // 聊天列表
  QuickChatRecycleBin = 2, // 回收站
  QuickChatMainInterface = 3 // 主界面
}

export enum MsgType {
  MsgTypeEnumNone = 0,
  Text = 1, // 文本
  Others = 2, // 其他
  Image = 3, // 图片
  Shake = 4, // 抖动
  Emoji = 5 // 表情
}

export enum TraderJobStatus {
  JobStatusNone = 0,
  OnJob = 1, // 在职
  Quit = 2 // 离职
}

export enum RoomDetailSyncType {
  RoomDetailSyncTypeNone = 0,
  RoomDetailSyncTypeUpsert = 1,
  RoomDetailSyncTypeDelete = 2
}

export enum InstUsageStatus {
  UsageStatusNone = 0, // 默认0开始
  Using = 1, // 启用
  Deactivate = 2 // 停用
}

export enum FeedbackType {
  FeedbackNone = 0,
  FeedbackInst = 1, // 主体
  FeedbackPeriod = 2, // 期限
  FeedbackRating = 3, // 评级
  FeedbackBondType = 4, // 券种
  FeedbackPrice = 5, // 价格
  FeedbackInstSubType = 6, // 企业类型
  FeedbackPerpetualBond = 7, // 永续
  FeedbackWarranter = 8, // 担保
  FeedbackMortgage = 9, // 可质押
  FeedbackTermStructure = 10 // 含权
}

export enum BondPermission {
  PermissionEmpty = 0,
  PermissionRO = 1,
  PermissionRW = 2
}

export enum RecommendBondStatus {
  None = 0,
  Default = 1,
  Reject = 2,
  Delete = 3,
  Success = 4,
  PriceReject = 5,
  Ignore = 6
}

export enum RecommendRuleType {
  RuleTypeNone = 0,
  H = 1,
  I = 2,
  L = 3,
  S = 4,
  F = 5,
  I_TKN = 6
}

export enum CouponRateType {
  CouponRateNone = 0,
  CouponRateTypeAll = 1, // 全部
  SuperHigh = 2, // 超高票面
  High = 3, // 高票面
  Low = 4 // 低票面
}

export enum BondSubCategory {
  BondSubCategoryNone = 0,
  BondSubCategoryAll = 1,
  BondSubCategorySMB = 2, // 一般债
  BondSubCategoryNMB = 3 // 专项债
}

export enum TimeToMaturityType {
  BondTimeToMaturityNone = 0,
  BondTPeriodLT3M = 1,
  BondTPeriodLT6M = 2,
  BondTPeriodLT9M = 3,
  BondTPeriodLT1Y = 4,
  BondTPeriodLT3Y = 5,
  BondTPeriodLT5Y = 6,
  BondTPeriodLT7Y = 7,
  BondTPeriodLT10Y = 8,
  BondTPeriodLT15Y = 9,
  BondTPeriodLT20Y = 10,
  BondTPeriodLT30Y = 11,
  BondTPeriodGT30Y = 12,
  BondTPeriodAll = 13
}

export enum RegionType {
  RegionNone = 0,
  RegionAll = 1, // 全部
  RegionHot = 2, // 网红地区
  RegionHigh = 3, // 好地区
  RegionMedium = 4, // 中等地区
  RegionLow = 5 // 差地区
}

export enum TimeToMaturityUnit {
  TimeToMaturityUnitNone = 0,
  TimeToMaturityUnitYear = 1, // 年
  TimeToMaturityUnitMonth = 2, // 月
  TimeToMaturityUnitDay = 3 // 日
}

export enum BondIssueDayType {
  BondIssueDayNone = 0,
  BondIssueDayAll = 1,
  BondIssueDayWorkday = 2, // 工作日
  BondIssueDayHoliday = 3 // 节假日
}

export enum BondFinancialCategoryType {
  BondFinancialCategoryNone = 0,
  Aa = 1, // 大行商金
  Ab = 2, // 优质股份制商金
  Ac = 3, // 优质城商商金
  Ad = 4, // 一般股份制商金
  Ae = 5, // 一般城商商金
  Af = 6, // 其他商金
  Ba = 7, // 大行二级资本
  Bb = 8, // 优质股份制二级资本
  Bc = 9, // 优质城商二级资本
  Bd = 10, // 一般股份制二级资本
  Be = 11, // 一般城商二级资本
  Bf = 12, // 其他二级资本
  Ca = 13, // 大行永续
  Cb = 14, // 优质股份制永续
  Cc = 15, // 优质城商永续
  Cd = 16, // 一般股份制永续
  Ce = 17, // 一般城商永续
  Cf = 18, // 其他永续
  Ao = 19, // 策性银行二级资本
  Da = 20, // 头部券商公募
  Db = 21, // 优良券商公募
  Dc = 22, // 一般券商公募
  Dd = 23, // 低流动性券商公募
  De = 24, // 其他
  DaS = 25, // 头部券商私募
  DbS = 26, // 优良券商私募
  DcS = 27, // 一般券商私募
  DdS = 28, // 低流动性券商私募
  Ea = 29, // 券商次级头部
  Eb = 30, // 券商次级良
  Ec = 31, // 券商次级一般
  Ed = 32, // 券商次级其他
  EaY = 33, // 券商次级头部永续
  EbY = 34, // 券商次级良永续
  BondFinancialCategoryAll = 35
}

export enum BondPeriodType {
  PeriodNone = 0,
  PeriodLT3M = 1,
  PeriodLT6M = 2,
  PeriodLT9M = 3,
  PeriodLT1Y = 4,
  PeriodLT2Y = 5,
  PeriodLT5Y = 6,
  PeriodLT10Y = 7,
  PeriodGT10Y = 8,
  PeriodALL = 9,
  PeriodLT3Y = 10
}

export enum IsPlatformType {
  PlatformNone = 0,
  PlatformTrue = 1,
  PlatformFalse = 2,
  PlatformAll = 3
}

export enum WithWarranterType {
  WarranterNone = 0,
  WarranterTrue = 1,
  WarranterFalse = 2,
  WarranterAll = 3
}

export enum IsMunicipalType {
  MunicipalNone = 0,
  MunicipalTrue = 1,
  MunicipalFalse = 2,
  MunicipalAll = 3
}

export enum BondPerpetualType {
  BondPerpetualNone = 0,
  BondPerpetualEtsSub = 1, // 永续次级
  BondPerpetualEtsGen = 2, // 永续非次级
  BondPerpetualNotEts = 3, // 非永续
  BondPerpetualAll = 4
}

export enum InstRatingType {
  InstRatingNone = 0,
  InstRatingAAAP = 1,
  InstRatingAAA = 2,
  InstRatingAAAM = 3,
  InstRatingAAP = 4,
  InstRatingAA = 5,
  InstRatingOtr = 6,
  InstRatingAll = 7
}

export enum IssuerRatingType {
  IssuerRatingNone = 0,
  IssuerRatingSAAA = 1, // 超AAA
  IssuerRatingAAA = 2,
  IssuerRatingAAP = 3,
  IssuerRatingAA = 4,
  IssuerRatingAAM = 5,
  IssuerRatingAP = 6,
  IssuerRatingOtr = 7,
  IssuerRatingAll = 8
}

export enum BondMarketType {
  MarketNone = 0,
  MarketSSE = 1, // 上交所
  MarketSZE = 2, // 深交所
  MarketCIB = 3, // 银行间
  MarketAll = 4
}

export enum BondInstType {
  InstNone = 0,
  InstCGE = 1, // 央企
  InstLGE = 2, // 国企
  InstPVE = 3, // 民企
  InstOtr = 4, // 其他
  InstAll = 5
}

export enum BondAssetType {
  AssetNone = 0,
  AssetPub = 1, // 公募
  AssetPri = 2, // 私募
  AssetScv = 3, // 可交换
  AssetAll = 4
}

export enum BondGoodsType {
  GoodsNone = 0,
  GoodsSCP = 1, // 超短融
  GoodsCP = 2, // 短融
  GoodsMTN = 3, // 中票
  GoodsED = 4, // 企业债
  GoodsCD = 5, // 公司债
  GoodsSD = 6, // 次级债
  GoodsPPN = 7, // PPN
  GoodsOtr = 8, // 其他
  GoodsAll = 9
}

export enum BncBondSortedField {
  BncBondSortedNone = 0,
  RecommendCountSorted = 1, // 可推荐人数
  SendCountSorted = 2, // 已推荐人数
  TimeToMaturitySorted = 3, // 剩余期限
  CouponRateSorted = 4, // 票面利率
  ValYieldSorted = 5 // 估值
}

export enum RuleSwitchStatus {
  BncRuleSwitchStatusNone = 0,
  RuleSwitchStatusOn = 1, // 开启
  RuleSwitchStatusOff = 2, // 关闭
  RuleSwitchStatusDisabled = 3 // 禁用
}

export enum BdsProductType {
  BdsProductTypeNone = 0, // proto3要求必须以0开头
  FXO = 1,
  FX = 2,
  ABS = 3, // ABS二级
  IRS = 4, // 利率互换
  BCO = 5, // 信用债
  BNC = 6, // 利率债
  NCD = 7, // NCD二级
  FXBOND = 8, // 美元债
  GOLD = 9, // 黄金
  PC = 10, // 一级分销
  MM = 11, // 线上资金本币
  MMCD = 12, // 线上资金外币
  BILL = 13, // 票据
  MMOFF1 = 14, // 同业存款
  MMOFF2 = 15, // 线下资产
  ABSP = 16, // ABS一级
  HYB = 17, // 高收益
  ABH = 18, // 资金线下
  SLD = 19, // 债券借贷
  NCDP = 20 // NCD一级
}
