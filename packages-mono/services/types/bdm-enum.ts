export enum AccessType {
  AccessTypeNone = 0, // 默认0开始
  System = 1, // 系统
  Module = 2, // 模块
  Menu = 3, // 菜单
  Page = 4, // 页面
  Tab = 5, // 页签
  Data = 6, // 数据
  Operation = 7 // 操作
}

export enum AccessBizType {
  AccessBizTypeNone = 0,
  CustomerManage = 1, // 客户管理模块
  CRMAdmin = 2 // CRM后台管理模块
}

export enum ProductAuthTargetType {
  ProductAuthTargetTypeNone = 0,
  Inst = 1, // 机构
  Trader = 2, // 交易员
  User = 3 // CRM系统用户
}

export enum UsageStatus {
  UsageStatusNone = 0, // 默认0开始
  Using = 1, // 启用
  Deactivate = 2 // 停用
}

export enum TraderUsageStatus {
  TraderUsageStatusNone = 0, // 默认0开始
  TraderEnable = 1, // 启用
  TraderDisable = 2 // 停用
}

export enum CreateType {
  CreateTypeNone = 0, // 默认0开始
  KYC = 1, // KYC
  CRM = 2 // CRM
}

export enum Gender {
  GenderNone = 0,
  Man = 1, // 男
  Woman = 2 // 女
}

export enum JobStatus {
  JobStatusNone = 0,
  OnJob = 1, // 在职
  Quit = 2 // 离职
}

export enum AccountStatus {
  AccountStatusNone = 0,
  Enable = 1, // 启用
  Disable = 2, // 停用
  Locked = 3 // 锁定
}

export enum TagType {
  TagTypeNone = 0, // proto3要求必须以0开头
  InstType = 1, // 机构类型
  InstLevel = 2, // 机构级别
  InstFondType = 3, // 机构资金类型
  TraderTag = 4, // 交易员标签
  StockType = 5, // 股票类型
  ControllerType = 6, // 控制人/最终实际控制人类型
  Currency = 7 // 币种
}

export enum DistrictType {
  DistrictTypeNone = 0, // none
  CN = 1, // 中国大陆
  OTHER = 2 // 海外国家/地区
}

export enum FlowStatus {
  FlowStatusNone = 0, // proto3要求必须以0开头
  UnderApproval = 1, // 1表示进行中
  Passed = 2, // 2表示审批通过
  Failed = 3 // 3表示审批不通过
}

export enum FlowNodeStatus {
  NodeStatusNone = 0, // proto3要求必须以0开头
  NodeUnderApproval = 1, // 1表示待审批
  NodePassed = 2, // 2表示审批通过
  NodeFailed = 3 // 3表示审批不通过
}

export enum ApproverStatus {
  ApproverStatusNone = 0, // proto3要求必须以0开头
  ApproverWaiting = 1, // 1表示待审批
  ApproverPassed = 2, // 2表示已审批通过
  ApproverFailed = 3, // 3表示已审批不通过
  ApproverMissed = 4 // 4表示已被同级其他审批人审批
}

export enum NodeType {
  NodeTypeNone = 0, // proto3要求必须以0开头
  Head = 1, // 1表示起始结点
  Inner = 2, // 2表示中间节点
  Tail = 3 // 3表示终止结点
}

export enum OpType {
  OpTypeNone = 0, // proto3要求必须以0开头
  Create = 1, // 新增
  Modify = 2, // 修改
  OpEnable = 3, // 启用
  OpDisable = 4 // 停用
}

export enum TraderOpField {
  TraderOpFieldNone = 0, // proto3要求必须以0开头
  TraderBasicInfo = 1, // 交易员-基本信息
  CareerPath = 2 // 交易员-事业路线
}

export enum InstOpField {
  InstOpFieldNone = 0, // proto3要求必须以0开头
  InstBasicInfo = 1, // 机构基本信息
  PaymentCreate = 2, // 机构-清算账户-新增
  PaymentModify = 3, // 机构-清算账户-修改
  PaymentDelete = 4, // 机构-清算账户-删除
  SettleFileAdd = 5, // 机构-清算账户附件-新增
  SettleFileRemove = 6 // 机构-清算账户附件-删除
}

export enum KYCStatus {
  KYCStatusNone = 0, // proto3要求必须以0开头
  NotChecked = 1, // 待通过
  Pass = 2, // 通过
  Ignore = 3 // 忽略
}

export enum SearchType {
  SearchTypeNone = 0, // proto3要求必须以0开头
  AllSearch = 1, // 全部查询
  InstSearch = 2, // 查询机构
  UserSearch = 3, // 查询用户
  TraderSearch = 4 // 查询机构
}

export enum ProductType {
  ProductTypeNone = 0, // proto3要求必须以0开头
  FXO = 1, // 利率债
  FX = 2, // 信用债
  ABS = 3, // ABS二级
  IRS = 4, // 利率互换
  BCO = 5, // 外汇
  BNC = 6, // 外汇期权
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

export enum SyncDataType {
  SyncDataTypeNone = 0, // proto3要求必须以0开头
  SyncDataTypeQuote = 1, // 报价
  SyncDataTypeDeal = 2, // 成交
  SyncDataTypeTrader = 3, // 交易员
  SyncDataTypeInst = 4, // 机构
  SyncDataTypeUser = 5, // 经纪人
  SyncDataTypeBondBasic = 6, // 债券，请求初始化这个的时候会同时返回basic与appendix结构
  SyncDataTypeQuoteDraft = 7, // 报价审核，请求初始化这个的时候会同时返回message与detail结构，实时同步接收到的是detail
  SyncDataTypeHoliday = 8, // 节假日
  SyncDataTypeBondAppendix = 9, // 债券appendix
  SyncDataTypeQuoteDraftMessage = 10,
  SyncDataTypeBondDetail = 11, // 新版债券
  SyncDataTypeQuoteDetail = 12, // 报价完整结构
  SyncDataTypeDealRecord = 13, // 成交记录，支持增量更新
  SyncDataTypeIssuerInst = 14 // 发行机构
}

export enum Post {
  PostNone = 0, // proto3要求必须以0开头
  Post_Broker = 1, // 经纪人
  Post_BrokerAssistant = 2, // 助理经纪人
  Post_BrokerTrainee = 3, // 经纪人培训生
  Post_DI = 4, // DI
  Post_Backstage = 5, // 后台
  Post_Trader = 6 // 交易员
}

export enum AccountType {
  AccountInfoNone = 0, // proto3要求必须以0开头
  Account = 1, // Account
  Chip = 2, // Chip
  None = 3 // None
}

export enum SearchInstMatchField {
  SearchInstMatchFieldNone = 0, // proto3要求必须以0开头
  PinYin = 1,
  PinYinFull = 2,
  ShortNameZh = 3,
  StandardCode = 4,
  FullNameZh = 5
}

export enum ProductMarkType {
  ProductMarkNone = 0, // proto3要求必须以0开头
  VIP = 1, // VIP
  Lead = 2 // 主承
}

export enum BindStatus {
  BindStatusNone = 0, // proto3要求必须以0开头
  Binded = 1, // 已绑定
  Unbound = 2 // 未绑定
}

export enum BindOperation {
  BindOperationNone = 0, // proto3要求必须以0开头
  Bind = 1, // 绑定
  UnBind = 2 // 解绑
}

export enum LegalPerson {
  LegalPersonNone = 0, // -
  LegalPerson = 1, // 是
  NotLegalPerson = 2 // 否
}

export enum BindMbs {
  BindMbsNone = 0, // -
  BindMbs = 1, // 是
  NotBind = 2 // 否
}

export enum InstStatus {
  InstStatusNone = 0, // -
  StartBiz = 1, // 在业
  StopBiz = 2 // 停业
}

export enum Enable {
  EnableNone = 0, // proto3要求必须以0开头
  DataEnable = 1, // 使用中
  DataDisable = 2 // 未使用/停用
}

export enum SearchDupType {
  SearchDupTypeNone = 0, // proto3要求必须以0开头
  SameInstAndName = 1, // 同名同机构
  SameInstAndInitial = 2, // 同机构同首字母
  SameNameOnly = 3 // 同名不同机构
}

export enum RegionLevel {
  RegionLevelNone = 0, // proto3要求必须以0开头
  Country = 1, // 1: 国家
  Province = 2, // 2: 省级
  City = 3, // 3: 市级
  District = 4, // 4: 区县级
  OtherRegionLevel = 5 // 5: 其他
}

export enum AreaLevel {
  AreaLevelNone = 0, // proto3要求必须以0开头
  PRN = 1, // 省级
  CTY = 2, // 市级
  TWN = 3, // 区县级
  OTH = 4, // 其它
  ARE = 5,
  IND = 6,
  VIL = 7
}

export enum ProductLock {
  ProductLockEnumNone = 0, // proto3要求必须以0开头
  Lock = 1, // 产品权限锁定
  Unlock = 2 // 产品权限未锁定
}

export enum Sort {
  SortEnumNone = 0, // 默认0开始
  ASC = 1, // 升序
  DESC = 2 // 降序
}

export enum Sensitive {
  SensitiveEnumNone = 0, // 默认0开始
  Sensitive = 1, // 是
  NonSensitive = 2 // 否
}

export enum AliyunTokenType {
  BizTypeNone = 0,
  BizTypeTTS = 1 // 语音合成
}

export enum MsgSendScene {
  MsgSendSceneNone = 0, // 默认0开始
  RemindOrder = 1, // 催单
  DealDetailSend = 2, // 成交明细发送
  DealRecordSend = 3, // 成交记录发送
  SpotPricingSend = 4 // 点价发送
}

export enum UserType {
  UserTypeNone = 0, // 默认0开始
  UserTypeBroker = 1, // 经纪人
  UserTypeTrader = 2 // 交易员
}

export enum ImMsgSendStatus {
  ImMsgSendStatusNone = 0, // 默认0开始
  SendSuccess = 1, // 成功
  SendFailed = 2 // 发送失败
}

export enum UrgeStatus {
  UrgeStatusNone = 0, // 默认0开始
  UrgeSuccess = 1, // 成功
  UrgePartSuccess = 2, // 部分成功
  UrgeFailed = 3 // 失败
}
