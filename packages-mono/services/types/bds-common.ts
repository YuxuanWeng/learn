import {
  BaseResponse,
  BizShortName,
  Broker,
  InstitutionLite,
  InstitutionTiny,
  ProductMark,
  Trader,
  TraderLite,
  TraderWhiteListLite,
  User,
  UserLite
} from './bdm-common';
import {
  AccountStatus,
  AdvancedApprovalType,
  ApprovalSortedField,
  AreaLevel,
  BondCategory,
  BondDealStatus,
  BondNature,
  BondQuoteType,
  BondSector,
  BondShortName,
  BridgeChannel,
  BrokerageType,
  CheckBridge,
  CollectionMethod,
  DataSyncMessageType,
  DateIsHoliday,
  DealDateType,
  DealDetailUpdateType,
  DealHandOverStatus,
  DealMarketType,
  DealOperationType,
  DealReadStatus,
  DealRecordUpdateType,
  DealSorSendStatus,
  DealType,
  Direction,
  Enable,
  ExerciseType,
  FRType,
  FrontendSyncMsgScene,
  ImMsgSendStatus,
  InstStatus,
  InstitutionSubtype,
  IsCrossMkt,
  IsMortgage,
  IssuerDateType,
  JobStatus,
  LiquidationSpeedTag,
  ListedMarket,
  LocalServerRealtimeScene,
  LocalServerRequestType,
  LocalServerWsMsgType,
  MarketDealLastActionType,
  MaturityDateType,
  MessageSource,
  MessageType,
  MktType,
  NCDPCheckError,
  NCDPOperationType,
  NcdSubtype,
  NotifyType,
  OperationSource,
  OperationType,
  OppositePriceNotifyColor,
  OppositePriceNotifyLogicType,
  OppositePriceNotifyMsgFillType,
  OptionType,
  Outlook,
  PerpType,
  Post,
  ProductClass,
  ProductType,
  QuoteDraftDetailStatus,
  QuoteDraftMessageStatus,
  QuoteDraftModifiedStatus,
  QuoteRelatedInfoFailedType,
  QuoteSortedField,
  Rating,
  ReceiptDealOperationType,
  ReceiptDealRuleSubtype,
  ReceiptDealRuleType,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment,
  ReceiptDealUpdateType,
  ReceiverSide,
  RefType,
  RepaymentMethod,
  Sceniority,
  SettlementMode,
  Side,
  SpotPricingConfirmStatus,
  SpotPricingFailedReason,
  SpotPricingImMsgSendStatus,
  SyncDataType,
  TradeDirection,
  TradeMode,
  TraderUsageStatus,
  UsageStatus,
  UserAccessGrantType,
  UserHotkeyFunction,
  UserPreferenceType,
  UserSettingFunction
} from './enum';

export type QuoteFilterGroup = {
  group_id: string; // 分组id
  product_type: ProductType; // 产品类型
  group_name: string; // 分组名称
  creator_id: string; // 创建者id
  creator_name: string; // 创建者名称
  desc: string; // 筛选框的详细情况
  shared_broker_list?: Broker[]; // 被分享的 broker list
  watching_broker_list?: Broker[]; // 正在看的 broker list
};

export type UpdatedQuoteFilterGroup = {
  group_id?: string; // 分组id
  product_type?: ProductType; // 产品类型
  group_name?: string; // 分组名称
  creator_name?: string; // 创建者名称
  desc?: string; // 筛选框的详细情况
  shared_broker_id_list?: string[]; // 被分享的 broker id list
  watching_broker_id_list?: string[]; // 正在看的 broker id list
};

export type RangeDouble = {
  min?: number;
  max?: number;
};

export type RangeInteger = {
  min?: number;
  max?: number;
};

export type RangeTime = {
  start_time?: string; // 开始时间(时间戳)
  end_time?: string; // 结束时间(时间戳)
};

export type QuickFilter = {
  intelligence_sorting: boolean; // 智能排序   一期
  yield?: RangeDouble; // 收益率    一期
  new_listed?: boolean; // 新上市    一期
  offset?: RangeDouble; // 偏移     一期
  val_modified_duration?: RangeDouble; // 久期     一期
  is_mortgage?: boolean; // 可质押    一期
  is_cross_mkt?: boolean; // 跨市场    一期
  unquoted?: boolean; // 未报价
  consideration?: number; // 对价
  trader_id_list?: string[]; // 交易员 id
  is_yield?: boolean; // 是否勾选收益率
  is_offset?: boolean; // 是否勾选偏移
  is_duration?: boolean; // 是否勾选久期
  is_consideration?: boolean; // 是否勾选对价
  is_coupon_rate?: boolean; // 是否勾选票面
  coupon_rate?: RangeDouble; // 票面利率
};

export type TableRelatedFilter = {
  is_vip?: boolean; // isVip
  has_underwriter_code?: boolean; // 主承
  broker_id_list?: string[]; // 我的, 需要将当前 broker 和其团队协作的人员id通过list传过来
  flag_internal?: boolean; // 内部
  flag_urgent?: boolean; // 紧急
  is_scattered?: boolean; // 散量
  date_type?: DealDateType; // 筛选日期类型 (交易日/结算日/交割日)
  date_range?: RangeTime; // 日期范围
  side?: Side; // 方向 Bid=1/Ofr=2
  is_exercise?: boolean; // 行权/到期
  is_nd?: boolean; // N.D/非N.D
  ref_type_list?: RefType[]; // 撤销类型
  ofr_volume?: number; // ofr 量
  clear_speed_list?: string[]; // 清算速度：+0、明天+1、周五+1...
  flag_recommend?: boolean; // 推荐
  is_lead?: boolean; // 主承
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  nothing_done?: boolean; // 成交ND
  flag_full?: boolean; // NCD询满
  flag_brokerage?: boolean; // NCD佣金
};

export type InputFilter = {
  bond_id_list?: string[];
  inst_id_list?: string[];
  trader_id_list?: string[];
  broker_id_list?: string[];
  user_input?: string; // 用户录入
  key_market_list?: string[]; // 债券唯一标识
  bond_key_list?: string[];
};

export type GeneralFilter = {
  bond_category_list?: BondCategory[]; // 超短融、短融、中票、企业债、公司债、次级债、PPN、国债、央票、地方债、金融债、其他 同一个字段在不同台子下的筛选项
  institution_subtype_list?: InstitutionSubtype[]; // 央企、国企、民企、其他  一期
  listed_market_list?: ListedMarket[]; // 上交所、深交所、银行间  一期
  collection_method_list?: CollectionMethod[]; // 超AAA、公募债、私募债、可交换     一期
  inst_is_listed?: boolean; // 上市/非上市(机构属性)  一期
  bond_sector_list?: BondSector[]; // 银行债、券商债、保险、GN     一期
  remain_days_list?: RangeInteger[]; // 剩余期限     一期
  mkt_type_list?: MktType[]; // 意向、二级   一期
  issuer_rating_list?: Rating[]; // 主体评级     一期
  implied_rating_list?: Rating[]; // 隐含评级   一期
  cbc_rating_list?: Rating[]; // 中债资信评级       一期
  with_warranty?: boolean; // 有担保、无担保     一期
  fr_type_list?: FRType[]; // Shibor、LPR、Depo、固息、DR   一期
  is_municipal?: boolean; // 城投债/非城投      一期
  is_platform_bond?: boolean; // 平台债/非平台       一期
  area_level_list?: AreaLevel[]; // 省级、市级、区县级、其他     一期
  /** @deprecated */
  has_option?: boolean; // 含权/非含权       一期
  /** @deprecated */
  perp_type_list?: PerpType[]; // 永续类型：永续次级、永续非次级、非永续   一期
  bond_issue_info_filter?: BondIssueInfo; // 债券发行信息 一期
  maturity_is_holiday?: boolean; // 工作日、节假日      一期
  bond_short_name_list?: BondShortName[]; // 国开、口发、农发   一期
  bond_nature_list?: BondNature[];
  is_abs?: boolean;
  bank_type_list?: string[]; // 政策性、大行、股份制。。。
  ncd_subtype_list?: NcdSubtype[]; // 银行债细分
  option_perp_filter_list?: OptionPerpFilter[]; // 含权永续筛选
  maturity_date_type_list?: MaturityDateType[];
};

export type GroupFilter = {
  quick_filter?: QuickFilter;
  general_filter?: GeneralFilter;
};

// 含权永续筛选
export type OptionPerpFilter = {
  has_option?: boolean; // 含权
  perp_type_list?: PerpType[]; // 永续类型
};

export type SortingMethod = {
  sorted_field: QuoteSortedField; // 排序字段名
  is_desc: boolean; // 是否倒序
};

export type Industry = {
  industry_id: string;
  name: string;
  level: number;
  parent_industry_id: string;
  deleted: number;
};

// 债券发行信息
export type BondIssueInfo = {
  sw_sector_list?: string[];
  sw_subsector_list?: string[];
  province_list?: string[];
  city_list?: string[];
  year_list?: number[];
  issuer_id_list?: string[];
  warranter_id_list?: string[];
};

// deprecated: todo delete
export type BondCrossMkt = {
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code: string; // 债券代码
};

// deprecated using FiccBondBasicStruct instead
export type BondLite = {
  product_type: ProductType; // 产品类型
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  has_option: boolean; // 是否含权
  time_to_maturity: string; // 剩余期限
  bond_code: string; // 债券代码
  short_name: string; // 债券简称
  issuer_rating: string; // 主体评级
  update_time?: string; // 更新时间
  rating: string; // 债券评级
  val_clean_price_exe: number; // 中债净价 行权
  val_yield_exe: number; // 中债YTM 行权
  csi_clean_price_exe: number; // 中证净价 行权
  csi_full_price_exe: number; // 中证全价 行权
  csi_yield_exe: number; // 中证YTM 行权
  val_clean_price_mat: number; // 中债净价 到期
  val_yield_mat: number; // 中债YTM 到期
  csi_clean_price_mat: number; // 中证净价 到期
  csi_full_price_mat: number; // 中证全价 到期
  csi_yield_mat: number; // 中证YTM 到期
  option_type: OptionType; // 含权类型
  listed_market: string; // 发行市场
  listed_date: string; // 上市日
  delisted_date: string; // 下市日
  bond_category: BondCategory; // 券种
  val_modified_duration: number; // 久期
  redemption_no: number; // 提前偿付期数
  perp_type: PerpType; // 永续类型
  fr_type: FRType; // 浮动利率类型
  issue_amount: number; // 发行总量
  create_time?: string; // 创建时间
  conversion_rate: number; // 质押率
  cbc_rating: string; // 中债资信评级
  maturity_date: string; // 到期日
  coupon_rate_current: number; // 票面利率
  maturity_is_holiday: boolean; // 到期日是否为节假日
  next_coupon_date: string; // 下次付息日
  is_cross_mkt: boolean; // 是否交易所跨市场
  mkt_type: MktType; // 市场类型:1为意向债,2二级债
  rest_day_to_workday?: RestDayToWorkday; // 休几: 债券到期日为某个市场的休息日时，距离下个工作日的天数
  is_fixed_rate: boolean; // 是否固息
  fund_objective_category: string; // 地方债大类
  fund_objective_sub_category: string; // 地方债具体分类
  implied_rating: string; // 隐含评级
  interest_start_date: string; // 起息日
  bond_cross_mkt_list?: BondCrossMkt[]; // 债券跨市场信息
  repayment_method?: RepaymentMethod; // 还本方式
  issue_rate?: number; // 发行利率
  key_market: string; // 债券唯一标识
  with_warranty: boolean; // 是否有担保
  val_basis_point_value: number; // PVBP
  option_date: string; // 行权日
  display_code: string; // 用于展示的债券代码
};

export type QuoteLite = {
  quote_id: string; // 报价ID
  update_time: string; // 更新时间
  product_type: ProductType; // 产品类型，台子
  bond_id?: string; // 债券 id
  broker_id?: string; // 经纪人 id
  trader_id?: string; // 交易员 id
  inst_id?: string; // 机构 id
  operator_id?: string; // 操作人 id
  /** @deprecated */
  bond_info?: BondLite; // 债券信息 using bond_basic_info instead
  broker_info?: Broker; // 经纪人信息
  trader_info?: TraderLite; // 交易员信息
  inst_info?: InstitutionTiny; // 机构信息
  operator_info?: Broker; // 操作人信息
  side: number; // 方向
  yield: number; // 收益率
  clean_price: number; // 净价
  full_price: number; // 全价
  volume: number; // 交易量
  comment: string; // 备注信息
  return_point: number; // 返点值
  flag_rebate: boolean; // 返点标记
  spread: number; // 利差
  refer_type: RefType; // 报价ref类型
  deal_status: number; // 成交状态
  deal_date: string; // 成交日期
  flag_recommend: boolean; // 推荐
  almost_done: boolean; // almost_done 标志
  flag_internal: boolean; // 内部
  flag_exchange: boolean; // 交换
  flag_oco: boolean; // oco
  flag_star: number; // 1-单星 2-双星
  flag_urgent: boolean; // 紧急
  flag_package: boolean; // 是否打包
  is_exercise: boolean; // 是否行权
  flag_intention: boolean; // 是否意向价
  quote_type: BondQuoteType; // 报价类型
  refer_time?: string; // refer时间
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  create_time: string; // 创建时间
  bond_key_market: string; // 债券唯一标识
  flag_code_changed: boolean; // 债券代码变更标识
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  flag_indivisible?: boolean; // 整量
  flag_stc?: boolean; // STC 报价
  exercise_manual?: boolean; // 是否手动操作行权
  bond_basic_info?: FiccBondBasic;
  quote_price?: number; // 用户手动输入价格
  flag_sustained_volume?: boolean; // 是否是续量
};

export type DealQuote = {
  quote_id: string;
  create_time: string;
  update_time: string;
  product_type: ProductType;
  bond_key_market: string;
  broker_id?: string;
  trader_id?: string;
  inst_id?: string;
  operator_id?: string;
  broker_info?: Broker;
  trader_info?: TraderLite;
  inst_info?: InstitutionTiny;
  side: number;
  quote_type: BondQuoteType;
  quote_price: number;
  yield?: number;
  clean_price?: number;
  full_price?: number;
  return_point?: number;
  spread?: number;
  volume: number;
  comment: string;
  flag_rebate: boolean;
  flag_internal: boolean;
  flag_exchange: boolean;
  flag_oco: boolean;
  flag_star: number;
  flag_urgent: boolean;
  flag_package: boolean;
  is_exercise: boolean;
  flag_intention: boolean;
  flag_stock_exchange: boolean;
  flag_bilateral: boolean;
  flag_request: boolean;
  flag_indivisible: boolean;
  flag_stc: boolean;
  exercise_manual: boolean;
  liquidation_speed_list?: LiquidationSpeed[];
  deal_liquidation_speed_list?: LiquidationSpeed[];
};

export type BondOptimalQuote = {
  /** @deprecated */
  bond_info?: BondLite; // 债券信息 using bond_basic_info instead
  optimal_quote_id_bid: string; // 最优报价 id bid
  optimal_quote_id_ofr: string; // 最优报价 id ofr
  optimal_price_id_list_bid?: string[]; // 最优价格对应 报价id list bid方向
  optimal_price_id_list_ofr?: string[]; // 最优价格对应 报价id list ofr方向
  quote_bid_list?: QuoteLite[]; // 债券对应所有Bid方向报价的 list
  quote_ofr_list?: QuoteLite[]; // 债券对应所有Ofr方向报价的 list
  n_bid: number; // bid 报价数量
  n_ofr: number; // ofr 报价数量
  price_int_bid: number; // 暗盘 bid 报价
  price_ext_bid: number; // 明盘 bid 报价
  price_int_ofr: number; // 暗盘 ofr 报价
  price_ext_ofr: number; // 明盘 ofr 报价
  quote_id_int_bid: string; // 暗盘 bid 报价 id
  quote_id_ext_bid: string; // 明盘 bid 报价 id
  quote_id_int_ofr: string; // 暗盘 ofr 报价 id
  quote_id_ext_ofr: string; // 明盘 ofr 报价 id
  volume_int_bid?: number[]; // 暗盘 bid 最优报价量
  volume_ext_bid?: number[]; // 明盘 bid 最优报价量
  volume_int_ofr?: number[]; // 暗盘 ofr 最优报价量
  volume_ext_ofr?: number[]; // 明盘 ofr 最优报价量
  offset_bid: number; // 偏离 bid
  offset_ofr: number; // 偏离 ofr
  flag_deal_price_bid: boolean; // 是否成交价 bid    todo：二期暂时不做
  flag_deal_price_ofr: boolean; // 是否成交价 ofr    todo：二期暂时不做
  update_time?: string; // 最优报价更新时间
  optimal_price_ext_id_list_bid?: string[]; // 明盘最优价格对应的报价 id list bid方向
  optimal_price_ext_id_list_ofr?: string[]; // 明盘最优价格对应的报价 id list ofr方向
  clean_price_int_bid?: number; // 暗盘 bid 净价
  clean_price_ext_bid?: number; // 明盘 bid 净价
  clean_price_int_ofr?: number; // 暗盘 ofr 净价
  clean_price_ext_ofr?: number; // 明盘 ofr 净价
  bond_basic_info: FiccBondBasic; // 债券信息
};

export type UserHotkey = {
  function: UserHotkeyFunction;
  value: string;
  desc: string;
};

export type UserSetting = {
  function: UserSettingFunction;
  value: string;
};

export type UserPreference = {
  preference_type: UserPreferenceType;
  key: string;
  value: string;
};

export type UserAccessGrantUpsert = {
  grantee_id: string;
  granter_id?: string[];
};

// deprecated
export type UserAccessGrantCreate = {
  grantee_id: string;
  granter_id?: string[];
};

export type UserAccessGrant = {
  grantee: UserLite; // 被授权人
  /** @deprecated */
  granter_list?: UserLite[]; // 指定人列表   // deprecated
  granter_access_list?: GranterAccess[]; // 指定人授权人列表
  flag_valid_grantee?: boolean; // 被授权人是否有效
};

export type GranterAccess = {
  granter: UserLite; // 指定授权人
  access_grant_list?: UserAccessGrantType[]; // 权限列表
  flag_valid_granter?: boolean; // 授权人是否有效
};

export type GranterIdAccess = {
  granter_id: string; // 指定授权人id
  access_grant_list?: UserAccessGrantType[]; // 权限列表
};

// 新增quote表单结构
export type QuoteInsert = {
  bond_key_market: string; // 债券唯一标识
  broker_id: string; // 经纪人ID
  trader_id: string; // 交易员ID
  algo_tags?: string; // 算法标签
  // bid/ofr的结构详情
  side: number; // 方向
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  volume?: number; // 交易量
  traded_date?: string; // 交易日，毫秒时间戳
  settlement_date?: string; // 结算日，毫秒时间戳
  delivery_date?: string; // 交割日，毫秒时间戳
  comment?: string; // 备注信息
  return_point?: number; // 返点值
  spread?: number; // 利差
  clear_speed?: string; // 清算速度
  flag_internal?: boolean; // 是否为内部报价
  flag_urgent?: boolean; // 是否为紧急报价
  flag_exchange?: boolean; // 是否换券报价
  flag_star?: number; // 星数
  flag_oco?: boolean; // 是否oco
  flag_package?: boolean; // 是否打包
  flag_recommend?: boolean; // 是否推荐
  is_exercise?: boolean; // 是否行权
  flag_rebate?: boolean; // 是否返点
  quote_type: BondQuoteType; // 报价类型
  flag_intention?: boolean; // 是否是意向价
  trader_tag?: string; // 交易员标签
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  flag_indivisible?: boolean; // 整量
  exercise_manual?: boolean; // 是否手动操作行权
  quote_price?: number;
  flag_sustained_volume?: boolean; // 是否是续量
};

export type QuoteUpdate = {
  quote_id: string; // 报价ID
  broker_id?: string; // 经纪人ID
  trader_id?: string; // 交易员ID
  algo_tags?: string; // 算法标签
  // bid/ofr的结构详情
  side?: number; // 方向
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  volume?: number; // 交易量
  traded_date?: string; // 交易日，毫秒时间戳
  settlement_date?: string; // 结算日，毫秒时间戳
  delivery_date?: string; // 交割日，毫秒时间戳
  comment?: string; // 备注信息
  return_point?: number; // 返点值
  spread?: number; // 利差
  clear_speed?: string; // 清算速度
  flag_internal?: boolean; // 是否为内部报价
  flag_urgent?: boolean; // 是否为紧急报价
  flag_exchange?: boolean; // 是否换券报价
  flag_star?: number; // 星数
  flag_oco?: boolean; // 是否oco
  flag_package?: boolean; // 是否打包
  flag_recommend?: boolean; // 是否推荐
  is_exercise?: boolean; // 是否行权
  flag_rebate?: boolean; // 是否返点
  quote_type?: BondQuoteType; // 报价类型
  almost_done?: boolean; // almost done标记
  flag_intention?: boolean; // 是否是意向价
  refer_type?: RefType; // ref/unref
  enable?: Enable; // 是否删除
  trader_tag?: string; // 交易员标签
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  operation_type?: OperationType; // 操作类型
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  flag_indivisible?: boolean; // 整量
  exercise_manual?: boolean; // 是否手动操作行权
  quote_price?: number; // 用户手动输入价格
};

export type OperationInfo = {
  operator?: string; // 操作者
  operation_type: OperationType; // 操作类型
  operation_source?: OperationSource; // 操作源
};

export type BondQuote = {
  quote_id: string; // 报价ID
  bond_id: string; // 债券ID
  broker_id: string; // 经纪人ID
  trader_id: string; // 交易员ID
  side: number; // 方向
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  volume?: number; // 交易量
  traded_date?: string; // 交易日
  settlement_date?: string; // 结算日
  delivery_date?: string; // 交割日
  comment: string; // 备注信息
  return_point?: number; // 返点值
  spread?: number; // 利差
  clear_speed?: string; // 清算速度
  source?: number; // 来源
  refer_type?: RefType; // 报价ref类型
  deal_status?: number; // 成交状态
  deal_date?: string; // 成交日期
  // --------- 债券信息 ----------
  bond_code: string; // 债券代码
  bond_type: string; // 债券类型
  bond_short_name: string; // 债券简称
  bond_rating: Rating; // 债券评级
  bond_key: string; // 债券系统唯一标示
  listed_market: string; // 发行市场
  ent_cor: string; // 企业/公司债
  val_modified_duration: number; // 久期
  frn_index_id: string; // 基础利率代码
  coupon_type: string; // 利率方式
  option_type: string; // 永续类型
  mkt_type: MktType; // 市场类型/报价类型
  maturity_date: string; // 到期日
  maturity_is_holiday: boolean; // 到期日为节假日
  product_type: ProductType; // 产品类型
  selective_code: string; // 发行方式
  asset_status?: string; // 交易类型
  is_mortgage: boolean; // 是否质押
  is_cross_mkt: boolean; // 是否交易跨市场
  ficc_type_code: string; // 固收产品类型代码
  bond_ficc_type: string; // 固收类型
  listed_date: string; // 上市日
  warranter: string; // 担保方代码
  is_municipal: boolean; // 是否城投债
  term_structure: string; // 含权债期限结构
  bond_full_name: string; // 全称
  redemption_no: number; // 提前偿付期数
  sceniority: Sceniority; // 偿还次序
  conversion_rate?: number; // 质押率
  // --------- 主体信息 ----------
  issuer_code: string; // 机构代码
  issuer_name: string; // 机构名称
  issuer_rating: Rating; // 主体评级
  institution_subtype: string; // 企业类型
  cbc_rating: Rating; // 中债资信评级
  cbrc_financing_platform: string; // 银监会投融资平台
  province: string; // 省级
  city: string; // 市级
  // --------- 交易员信息 ----------
  trader_name: string; // 交易员名称
  is_vip: boolean; // 是否为vip
  is_danger: boolean; // 是否危险
  is_bargain: boolean; // 是否可议价
  flag_internal?: boolean; // 是否为内部报价
  flag_urgent?: boolean; // 是否为紧急报价
  flag_exchange?: boolean; // 是否换券报价
  flag_star?: number; // 星数
  flag_oco?: boolean; // 是否oco
  flag_package?: boolean; // 是否打包
  operator: string; // 操作者
  create_time: string; // 创建时间
  update_time: string; // 修改时间
  val_yield: number; // 收益率
  issue_year: number; // 发行年度
  sw_sector: string; // 主体一级行业
  sw_sub_sector: string; // 主体二级行业
  delisted_date: string; // 下市日
  algo_tags?: string;
  underwriter_code: string; // 主承销商代码
  area_level: string; // 区域级别
  inst_type: string; // 机构类型
  from_draft?: boolean; // 是否来自draft表
  inst_listed_type: string; // 机构上市公司类型
  quote_type: BondQuoteType; // 报价类型
  bond_category: BondCategory; // 券种
  bond_sector: BondSector; // 债券所属行业
  fr_type: FRType; // 浮动利率类型
  perp_type: PerpType; // 永续类型
  has_option: boolean; // 是否含权
  flag_recommend?: boolean; // 推荐
  inst_rating: Rating;
  implied_rating: Rating; // 隐含评级
  is_exercise?: boolean; // 行权/到期
  almost_done?: boolean;
  flag_rebate?: boolean; // 是否返点
  flag_intention?: boolean; // 是否是意向价
  inst_short_name_zh?: string;
  trader_tag?: string;
  val_clean_price_exe?: number; // 中债净价 行权
  val_clean_price_mat?: number; // 中债净价 到期
  val_yield_exe?: number; // 中债YTM 行权
  val_yield_mat?: number; // 中债YTM 到期
  time_to_maturity?: string; // 剩余期限
  rest_day_to_workday?: RestDayToWorkday; // 休几: 债券到期日为某个市场的休息日时，距离下个工作日的天数
  repayment_method?: RepaymentMethod; // 还本方式
  broker_name?: string; // 经纪人名字
  bond_rating_str?: string;
  issuer_rating_str?: string;
  cbc_rating_str?: string;
  inst_rating_str?: string;
  implied_rating_str?: string;
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  option_type_val?: OptionType; // 含权类型
  /** @deprecated */
  bond_cross_mkt_list?: BondCrossMkt[]; // deprecated 债券跨市场信息
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  flag_indivisible?: boolean; // 整量
  flag_stc?: boolean; // STC报价
  exercise_manual?: boolean; // 是否手动操作行权
  bond_display_code?: string; // 债券展示代码
  quote_price?: number;
  flag_sustained_volume?: boolean; // 是否是续量
};

export type BondQuoteHandicap = {
  key_market: string;
  bid_quote_list?: QuoteHandicap[]; // Bid方向最优报价/所有报价列表
  ofr_quote_list?: QuoteHandicap[]; // Ofr方向最优报价/所有报价列表
  bid_quote_total?: string; // Bid方向活跃报价总数
  ofr_quote_total?: string; // Ofr方向活跃报价总数
  bid_handicap?: number; // Bid方向报价最优盘口价格
  ofr_handicap?: number; // Ofr方向报价最优盘口价格
};

export type QuoteHandicap = {
  quote_id: string;
  key_market: string; // 债券KeyMarket
  broker_id: string; // 经纪人ID
  trader_id: string; // 交易员ID
  product_type: ProductType; // 台子，必有
  side: Side; // 方向
  quote_type: BondQuoteType; // 报价类型
  price?: number; // 用户手填价格，价格可能为空，所以optional
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  spread?: number; // 利差
  volume?: number; // 交易量，可能为空，所以optional
  flag_rebate?: boolean; // 是否返点
  return_point?: number; // 返点
  flag_intention?: boolean; // 是否意向价
  liquidation_speed_list?: LiquidationSpeed[]; // BDS清算速度
  refer_type?: RefType; // 作废类型
  comment?: string; // 备注信息
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  flag_indivisible?: boolean; // 整量
  flag_internal?: boolean; // 是否为内部报价
  flag_urgent?: boolean; // 是否为紧急报价
  flag_exchange?: boolean; // 是否换券报价
  flag_star?: number; // 星数
  flag_oco?: boolean; // 是否oco
  flag_package?: boolean; // 是否打包
  flag_recommend?: boolean; // 是否推荐
  is_exercise?: boolean; // 是否行权
  almost_done?: boolean;
  flag_stc?: boolean; // STC报价
  inst_id: string; // 机构id
  inst_name: string; // 机构名称
  trader_name: string; // 交易员名称
  trader_tag?: string; // 交易员标签
  exercise_manual?: boolean; // 是否手动操作行权
  code_market: string; // 债券代码+市场
  delivery_date?: string; // 交割日，毫秒时间戳，下同
  traded_date?: string; // 交易日
  settlement_date?: string; // 交割日
  update_time: string; // 报价更新时间
};

// 债券基础信息数据字典文档：https:// shihetech.feishu.cn/wiki/wikcnJfYLcujSbl39cSlip6jIMg
// Deprecated: using FiccBondBasicStruct instead
export type FiccBond = {
  ficc_id: string; // fic业务id
  enable: Enable; // 删除位标记，1为正常，2为已删除
  create_time?: string; // 创建时间
  update_time?: string; // 更新时间
  // ---------- 标的通用属性 ----------
  product_class: ProductClass; // 产品大类
  product_type: ProductType; // 产品类型，英文简写
  product_key: string; // 产品唯一标识，一般"ficc_"+key_market
  product_code: string; // 产品代码，一般为"ficc_"+code_market
  product_name: string; // 产品简称
  bond_ficc_type: string; // 固收类型，这里等于ficc_belong
  key_market: string; // 债券的系统唯一标识+发行市场
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code: string; // 债券代码
  bond_key: string; // 债券的系统唯一标识
  listed_market: string; // 发行市场，CIB为银行间，SSE为上交所，SZE为深交所
  listed_date: string; // 上市日
  delisted_date: string; // 下市日
  full_name: string; // 全称
  short_name: string; // 简称
  pinyin: string; // 拼音
  pinyin_full: string; // 拼音全称
  selective_code: string; // 固收基础类型代码
  selective_name: string; // 固收基础类型名称
  ficc_type_code: string; // 固收产品类型代码
  ficc_belong: string; // 固收产品所属台子
  // ---------- 中债估值部分 ----------
  val_yield_exe: number; // 中债行权收益率（推荐估值）
  val_yield_mat: number; // 中债到期收益率（非推荐估值）
  val_clean_price_exe: number; // 中债行权净价（推荐估值）
  val_clean_price_mat: number; // 中债到期净价（非推荐估值）
  val_full_price_exe: number; // 中债行权全价（推荐估值）
  val_modified_duration: number; // 久期
  val_convexity: number; // 凸性
  val_basis_point_value: number; // PVBP
  remaining_par_value: number; // 剩余本金（推荐估值）
  // ---------- 中证估值部分 ----------
  csi_yield_to_maturity: number; // 到期收益率    ？？具体逻辑未知
  csi_modified_duration: number; // 修正久期
  csi_clean_price: number; // 净价
  csi_clean_price_exe: number; // 中证行权净价
  csi_clean_price_mat: number; // 中证到期净价
  csi_yield_exe: number; // 中证行权收益率
  csi_yield_mat: number; // 中证到期收益率
  csi_full_price_exe: number; // 中证行权全价
  csi_full_price_mat: number; // 中证到期全价
  // ---------- 其他固收债券属性 ----------
  is_cross_mkt: boolean; // 是否交易所跨市场
  is_mortgage: boolean; // 是否质押
  is_municipal: boolean; // 是否城投债
  mkt_type: MktType; // 市场类型:1为意向债;2二级债
  issuer_rating_npy: string; // 非鹏元-发行人（主体）评级
  rating_npy: string; // 非鹏元-债券评级
  issuer_rating: string; // 发行人最新评级（主体评级）
  maturity_term: number; // 偿还期限
  warranter: string; // 担保方代码
  coupon_type: string; // 利率方式
  rating_augment: string; // 信用增级方式
  rating_date: string; // 信用评级日期
  option_type: OptionType; // 含权类型（行权类型）
  coupon_rate_current: number; // 最新票面利率
  maturity_date: string; // 到期日
  first_maturity_date: string; // 第一段到期日
  maturity_is_holiday: boolean; // 到期日是否为假期
  issuer_code: string; // 发行代码
  next_coupon_date: string; // 下次付息日
  redemption_no: number; // 提前偿付期数
  rating: string; // 最新评级（债券评级都用这个）
  frn_index_id: string; // 基础利率代码
  fixing_ma_days: number; // 平均利率天期
  coupon_rate_spread: number; // 利差（%）
  option_date: string; // 含权日期
  issue_amount: number; // 发行总量
  underwriter_code: string; // 主承销商代码
  issuer_rating_inst_code: string; // 发行人评级机构代码
  term_unit: string; // 偿还期限的单位
  rating_inst_code: string; // 评级机构代码
  interest_start_date: string; // 起息日
  issue_year: number; // 发行年度
  ent_cor: string; // 企业/公司债
  issue_rate?: number; // 发行利率
  asset_status: string; // 资产状态
  auction_date_start: string; // 招标日/建档日开始日
  auction_date_end: string; // 招标日/建档日结束日
  call_str: string; // 欧式赎回日/美式赎回区间+价格
  put_str: string; // 欧式回售日/美式回售区间+价格
  sceniority: string; // 偿还次序
  compensate_rate: string; // 补偿利率（%）
  issuer_outlook_current: Outlook; // 当前发行人评级展望
  bond_category: BondCategory; // 券种
  bond_sector: BondSector; // 债券所属行业
  fr_type: FRType; // 浮动利率类型
  perp_type: PerpType; // 永续类型
  has_option: boolean; // 是否含权
  time_to_maturity: string; // 剩余期限
  rest_day_to_workday: RestDayToWorkday; // 休几: 债券到期日为某个市场的休息日时，距离下个工作日的天数
  is_fixed_rate: boolean; // 是否固息
  option_style: string; // 含权方式（行权方式）
  conversion_rate: number; // 质押率
  fund_objective_category: string; // 地方债大类
  fund_objective_sub_category: string; // 地方债具体分类
  implied_rating: string; // 隐含评级
  cbc_rating: string; // 中债资信评级
  bond_cross_mkt_list?: BondCrossMkt[]; // 债券跨市场信息
  repayment_method?: RepaymentMethod; // 还本方式
  warrant_method: string; // 担保方式，根据 rating_augment 字段枚举值映射
  issuer_info?: Issuer; // 发行人信息
  with_warranty: boolean; // 是否有担保
  display_code: string; // 用于展示的债券代码
};

export type RestDayToWorkday = {
  days_cib?: number; // 银行间市场休几
  days_sse?: number; // 上交所休几
  days_sze?: number; // 深交所休几
};

// deprecated: using FiccBondDetail instead
export type FiccBasicBondAppendix = {
  ficc_id: string; // ficc 业务id
  enable: Enable; // 删除位标记，1为正常，2为已删除
  create_time: string; // 创建时间
  update_time: string; // 更新时间
  // ---------- 标的通用属性 ----------
  product_class: ProductClass; // 产品大类，1为固定收益、2为利率衍生品、3为资金、4为外汇
  product_type: string; // 产品类型，英文简写
  product_key: string; // 产品唯一标识，一般"ficc_"+key_market
  product_code: string; // 产品代码，一般为"ficc_"+code_market
  product_name: string; // 产品简称
  bond_ficc_type: string; // 固收类型，这里等于ficc_belong
  key_market: string; // 债券的系统唯一标识+发行市场
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code: string; // 债券代码
  bond_key: string; // 债券的系统唯一标识
  listed_market: string; // 发行市场，CIB为银行间，SSH为上交所，SZE为深交所
  listed_date: string; // 上市日
  delisted_date: string; // 下市日
  full_name: string; // 全称
  short_name: string; // 简称
  pinyin: string; // 拼音
  pinyin_full: string; // 拼音全称
  selective_code: string; // 固收基础类型代码
  selective_name: string; // 固收基础类型名称
  ficc_type_code: string; // 固收产品类型代码
  ficc_belong: string; // 固收产品所属台子
  // ---------- 中债估值部分 ----------
  val_yield: number; // 收益率（推荐估值）
  val_yield_unrec: number; // 收益率（非推荐估值）
  val_net_price: number; // 净价（推荐估值）
  val_net_price_unrec: number; // 净价（非推荐估值）
  val_full_price: number; // 全价（推荐估值）
  val_full_price_unrec: number; // 全价（非推荐估值）
  val_modified_duration: number; // 久期
  val_convexity: number; // 凸性
  val_basis_point_value: number; // PVBP
  remaining_year: number; // 待偿期（推荐估值）
  remaining_year_unrec: number; // 待偿期（非推荐估值）
  val_accrued_interest: number; // 应计利息（推荐估值）
  val_accrued_interest_unrec: number; // 应计利息（非推荐估值）
  val_closed_dirty_price: number; // 日终估值全价（推荐估值）
  val_closed_dirty_price_unrec: number; // 日终估值全价（非推荐估值）
  val_closed_accrued_interest: number; // 日终应计利息（推荐估值）
  val_closed_accrued_interest_unrec: number; // 日终应计利息（非推荐估值）
  remaining_par_value: number; // 剩余本金（推荐估值）
  remaining_par_value_unrec: number; // 剩余本金（非推荐估值）
  cdc_date: string; // 估值日期
  valuation_date: string; // 日期
  // ---------- 中证估值部分 ----------
  csi_calculation_price: number; // 计算价格
  csi_yield_to_maturity: number; // 到期收益率
  csi_modified_duration: number; // 修正久期
  csi_convexity: number; // 凸性
  csi_clean_price: number; // 净价
  csi_accrued_interest: number; // 应计利息
  csi_full_price_maturity: number; // 到期全价
  csi_clean_price_maturity: number; // 到期净价
  csi_yld_to_maturity: number; // 到期收益率
  csi_modified_duration_maturity: number; // 到期修正久期
  csi_convexity_maturity: number; // 到期凸性
  csi_full_price_exercise: number; // 行权全价
  csi_clean_price_exercise: number; // 行权净价
  csi_yld_to_exercise: number; // 行权收益率
  csi_modified_duration_exercise: number; // 行权修正久期
  csi_convexity_exercise: number; // 行权凸性
  csi_recommendation: boolean; // 推荐
  csi_estimated_coupon: number; // 预计利息
  // ---------- 其他固收债券属性 ----------
  inputer: string; // 录入者
  checker: string; // 审核者
  country: string; // 国别
  currency: string; // 币种
  isin: string; // ISIN Code
  issuer_code: string; // 发行代码
  underwriter_code: string; // 主承销商代码
  bond_type: string; // 债券类别
  external_type: string; // 外部分类
  maturity_term_y: number; // 偿还期限(年)
  maturity_term: number; // 偿还期限
  term_unit: string; // 偿还期限的单位
  interest_start_date: string; // 起息日
  maturity_date: string; // 到期日
  maturity_is_holiday: DateIsHoliday; // 到期日是否为节假日
  first_coupon_date: string; // 首次付息日
  next_coupon_date: string; // 下次付息日
  announce_date: string; // 公告日期
  issue_start_date: string; // 发行开始日
  issue_end_date: string; // 发行截至日
  wi_start_date: string; // when issue起始日
  wi_end_date: string; // when issue到期日
  dist_date_start: string; // 分销开始日
  dist_date_end: string; // 分销结束日
  auction_date_start: string; // 招标日/建档日开始日
  auction_date_end: string; // 招标日/建档日结束日
  payment_date: string; // 承销缴款日
  register: string; // 发行方式
  option_type: string; // 含权类型（行权类型）
  option_style: string; // 含权方式（行权方式）
  option_date: string; // 含权日期
  call_no: number; // 欧式赎回日数/美式区间数
  call_str: string; // 欧式赎回日/美式赎回区间+价格
  put_no: number; // 欧式回售日数/美式区间数
  put_str: string; // 欧式回售日/美式回售区间+价格
  compensate_rate: string; // 补偿利率（%）
  compensate_from: string; // 补偿生效期数
  option_exercise: string; // 选择权执行
  option_exercise_date: string; // 实际选择权执行日
  coupon_type: string; // 利率方式
  coupon_rate_spread: number; // 利差（%）
  coupon_rate_current: number; // 最新票面利率
  coupon_frequency: string; // 付息频率
  compound_frequency: string; // 计息频率
  interest_basis: string; // 应计利息计算基准
  coupon_dist: string; // 利息分配方式
  frn_multiplier: number; // 浮动利率乘数
  frn_index_id: string; // 基础利率代码
  first_index_rate: string; // 首次基础利率
  fixing_frequency: string; // 浮息券利率年重置次数
  fixing_ma_days: number; // 平均利率天期
  fixing_preceds: string; // 指标为前几日的平均
  fixing_calendar_key: string; // 指标利率参考的日历
  fixing_tailing: string; // 小数处理法
  fixing_digit: number; // 基础利率四舍五入位数
  reset_effective: string; // 浮息券重置生效条件
  simple_compound: string; // 单利复利
  issue_reference_desc: string; // 发行时跟定的指标说明
  variable_schedule: string; // 特殊现金流
  coupon_day_adjust: string; // 付息结算调整
  coupon_day_dmc: string; // 付息日DMC
  coupon_calendar_key: string; // 套用日历表
  pricing_conv: string; // 收益率计算惯例
  issue_price: number; // 发行价格
  issue_rate?: number; // 发行利率
  planned_issue_amount: number; // 计划发行总量
  first_issue_amount: number; // 首次发行总量
  issue_amount: number; // 发行总量
  redemption_no: number; // 提前偿付期数
  redemption_str: string; // 提前偿付期信息
  maturity_adjust: string; // 兑付日调整
  maturity_dmc: string; // 兑付日DMC
  maturity_calendar_key: string; // 兑付套用日历表
  sceniority: string; // 偿还次序
  rating_current: Rating; // 最新评级（债券评级都用这个）
  rating_institution_code: string; // 评级机构代码
  rating_date: string; // 信用评级日期
  rating_augment: string; // 信用增级方式
  warranter: string; // 担保方代码
  warrant_note: string; // 担保说明
  issuer_rating_current: Rating; // 发行人最新评级
  issuer_rating_institution_code: string; // 发行人评级机构代码
  issuer_rating_date: string; // 最新发行人评级日
  issue_commission_rate: string; // 发行手续费率
  redm_commission_rate: string; // 兑付手续费(%)
  issue_year: number; // 发行年度
  issue_no: number; // 发行期数
  quotation: string; // 报价方式
  asset_status: string; // 资产状态
  purpose_of_issue: string; // 募集资金用途
  first_issueKey: string; // 原债券编码
  note: string; // 附注
  term_structure: string; // 含权债期限结构
  p_rating_current: Rating; // 前次债项评级
  p_issuer_rating_current: Rating; // 前次发行人评级
  is_crossMkt: IsCrossMkt; // 是否交易所跨市场
  is_mortgage: IsMortgage; // 是否质押
  mkt_type: MktType; // 市场类型:1为意向债;2二级债
  ann_status: number; // 流通要素状态
  liquidity_supporter: string; // 流动性支持
  outstanding_amount: number;
  is_cib: number; // 是否银行间
  yield_curve_type: string;
  is_municipal: number; // 是否城投债
  issuer_rating_current_npy: Rating; // 非鹏元-发行人（主体）评级
  rating_current_npy: Rating; // 非鹏元-债券评级
  issuer_outlook_current: string; // 当前发行人评级展望
  p_issuer_outlook_current: string; // 当前发行人评级展望
  short_name_en: string; // 英文简称
  full_name_en: string; // 英文全称
  bid_limit_bottom: number; // 投标区间下限（%）
  bid_limit_top: number; // 投标区间上限（%）
  issue_end_time: string; // 发行结束时间
  ent_co: string; // 企业/公司债
  conversion_rate: number; // 质押率
  underwriter_group: string; // 承销团
  repayment_method: RepaymentMethod; // 还本方式
};

export type FiccBondBasic = {
  key_market: string; // 债券的系统唯一标识+发行市场
  bond_key: string; // 债券的系统唯一标识
  bond_code: string; // 债券代码
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  display_code: string; // 展示用的 code market, 在无相同跨市场的债券代码的情况下省略 .IB 后缀
  // ---------- 标的通用属性 ----------
  product_type: ProductType; // 产品类型，英文简写
  listed_market: string; // 发行市场，CIB为银行间，SSE为上交所，SZE为深交所
  listed_date?: string; // 上市日
  delisted_date?: string; // 下市日
  short_name: string; // 简称
  bond_category: BondCategory; // 券种
  fr_type: FRType; // 浮动利率类型
  is_fixed_rate: boolean; // 是否固息
  perp_type: PerpType; // 永续类型
  has_option?: boolean; // 是否含权: 永续债既不是 true 也不是 false
  option_type?: string; // 含权类型（行权类型）
  option_date?: string; // 含权日期
  conversion_rate?: number; // 质押率
  fund_objective_sub_category?: string; // 地方债具体分类
  fund_objective_category?: string; // 地方债大类
  with_warranty: boolean; // 是否有担保
  is_cross_mkt: boolean; // 是否交易所跨市场
  mkt_type: MktType; // 市场类型:1为意向债,2二级债
  maturity_date?: string; // 到期日
  maturity_is_holiday?: boolean; // 到期日是否为假期
  time_to_maturity?: string; // 剩余期限
  rest_day_to_workday?: RestDayToWorkday; // 休几: 债券到期日为某个市场的休息日时，距离下个工作日的天数
  redemption_no?: number; // 提前偿付期数
  // ---------- 中债估值部分 ----------
  // Remark: 中债估值中 推荐估值=行权估值，非推荐估值=到期估值
  val_yield_exe?: number; // 推荐收益率估值/行权收益率估值
  val_yield_mat?: number; // 到期收益率估值/非推荐收益率估值
  val_clean_price_exe?: number; // 推荐净价估值/行权净价估值
  val_clean_price_mat?: number; // 到期净价估值/非推荐净价估值
  val_modified_duration?: number; // 久期
  val_basis_point_value?: number; // PVBP
  // ---------- 中证估值部分 ----------
  csi_yield_exe?: number; // 行权收益率
  csi_yield_mat?: number; // 到期收益率
  csi_clean_price_exe?: number; // 行权净价
  csi_clean_price_mat?: number; // 到期净价
  csi_full_price_exe?: number; // 行权全价
  csi_full_price_mat?: number; // 到期全价
  // ---------- 评级属性 ----------
  rating?: string; // 最新评级
  implied_rating?: string; // 隐含评级
  cbc_rating?: string; // 中债资信评级
  issuer_rating?: string; // 发行人最新评级
  // ---------- 其他固收债券属性 ----------
  issue_rate?: number; // 发行利率
  issue_amount?: number; // 发行总量
  repayment_method: RepaymentMethod; // 还本方式
  interest_start_date?: string; // 起息日
  next_coupon_date?: string; // 下次付息日
  coupon_rate_current?: number; // 最新票面利率
  issuer_code: string; // 发行人代码
  first_maturity_date?: string; // 第一段到期日
};

// 债券基础信息数据字典文档：https:// shihetech.feishu.cn/wiki/wikcnJfYLcujSbl39cSlip6jIMg
export type FiccBondDetail = {
  ficc_id: string; // fic业务id
  enable: boolean; // 删除位标记，1为正常，2为已删除
  create_time: string; // 创建时间
  update_time: string; // 更新时间
  key_market: string; // 债券的系统唯一标识+发行市场
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code: string; // 债券代码
  bond_key: string; // 债券的系统唯一标识
  display_code: string; // 展示用的 code market, 在无相同跨市场的债券代码的情况下省略 .IB 后缀
  bond_type: string; // 债券类别
  external_type: string; // 外部分类
  // ---------- 标的通用属性 ----------
  product_class: ProductClass; // 产品大类
  product_type: string; // 产品类型，英文简写
  product_code: string; // 产品代码，一般为"ficc_"+code_market
  bond_ficc_type: string; // 固收类型，这里等于ficc_belong
  listed_market: string; // 发行市场，CIB为银行间，SSE为上交所，SZE为深交所
  listed_date?: string; // 上市日
  delisted_date?: string; // 下市日
  full_name: string; // 全称
  pinyin_full: string; // 拼音全称
  short_name: string; // 简称
  pinyin: string; // 拼音
  selective_code: string; // 固收基础类型代码
  selective_name: string; // 固收基础类型名称
  ficc_type_code: string; // 固收产品类型代码
  ficc_belong: string; // 固收产品所属台子
  bond_category: BondCategory; // 券种
  bond_sector: BondSector; // 债券所属行业
  fr_type: FRType; // 浮动利率类型
  is_fixed_rate: boolean; // 是否固息
  perp_type: PerpType; // 永续类型
  has_option?: boolean; // 是否含权: 永续债既不是 true 也不是 false
  option_type?: string; // 含权类型（行权类型）
  option_date?: string; // 含权日期
  term_structure?: string; // 含权债期限结构
  conversion_rate?: number; // 质押率
  fund_objective_sub_category?: string; // 地方债具体分类
  fund_objective_category?: string; // 地方债大类
  is_gn?: boolean; // 是否为环保行业
  ncd_subtype?: string; // 银行债细分类型
  rating_augment?: string; // 信用增级方式
  warranter?: string; // 担保方代码
  with_warranty: boolean; // 是否有担保
  warrant_method?: string; // 是否担保
  warrant_note?: string; // 担保说明
  asset_status?: string; // 资产状态
  is_cross_mkt: boolean; // 是否交易所跨市场
  is_mortgage: boolean; // 是否质押
  mkt_type: MktType; // 市场类型:1为意向债,2二级债
  is_municipal: boolean; // 是否城投债
  ent_cor?: string; // 企业/公司债
  maturity_date?: string; // 到期日
  maturity_is_holiday?: boolean; // 到期日是否为假期
  time_to_maturity?: string; // 剩余期限
  first_maturity_date?: string; // 债券第一个到期日，如非含权债，则等于 maturity_date，如为含权债，则等于 option_date 或 call_str 中的对应日期，（前提是日期都大于当天）
  rest_day_to_workday?: RestDayToWorkday; // 休几: 债券到期日为某个市场的休息日时，距离下个工作日的天数
  redemption_no?: number; // 提前偿付期数
  sceniority?: string; // 偿还次序
  liquidity_supporter?: string; // 流动性支持
  // ---------- 中债估值部分 ----------
  // Remark: 中债估值中 推荐估值=行权估值，非推荐估值=到期估值
  val_yield_exe?: number; // 推荐收益率估值/行权收益率估值
  val_yield_mat?: number; // 到期收益率估值/非推荐收益率估值
  val_clean_price_exe?: number; // 推荐净价估值/行权净价估值
  val_clean_price_mat?: number; // 到期净价估值/非推荐净价估值
  val_full_price_exe?: number; // 行权全价估值/推荐全价估值
  val_full_price_mat?: number; // 非推荐全价估值/到期全价估值
  val_modified_duration?: number; // 久期
  val_convexity?: number; // 凸性
  val_basis_point_value?: number; // PVBP
  // ---------- 中证估值部分 ----------
  csi_yield_exe?: number; // 行权收益率
  csi_yield_mat?: number; // 到期收益率，该值暂时不要用，不明确业务含义
  csi_clean_price_exe?: number; // 行权净价
  csi_clean_price_mat?: number; // 到期净价
  csi_full_price_exe?: number; // 行权全价
  csi_full_price_mat?: number; // 到期全价
  csi_recommendation: boolean; // 推荐
  // ---------- 评级属性 ----------
  rating?: string; // 最新评级
  rating_inst_code?: string; // 评级机构代码
  rating_date?: string; // 信用评级日期
  implied_rating?: string; // 隐含评级
  cbc_rating?: string; // 中债资信评级
  issuer_rating?: string; // 发行人最新评级
  issuer_rating_inst_code?: string; // 发行人评级机构代码
  issuer_rating_date?: string; // 最新发行人评级日期
  issuer_outlook_current?: string; // 当前发行人评级展望
  // ---------- 其他固收债券属性 ----------
  issuer_code: string; // 发行代码
  issue_year: number; // 发行年度
  issue_price?: number; // 发行价格
  issue_rate?: number; // 发行利率
  issue_amount?: number; // 发行总量
  issue_start_date?: string; // 发行开始日
  issue_end_date?: string; // 发行截至日
  underwriter_code?: string; // 主承销商代码
  underwriter_group?: string; // 承销团
  maturity_term?: number; // 偿还期限
  term_unit?: string; // 偿还期限的单位
  repayment_method: RepaymentMethod; // 还本方式
  interest_start_date?: string; // 起息日
  first_coupon_date?: string; // 首次付息日
  next_coupon_date?: string; // 下次付息日
  call_str?: string; // 欧式赎回日/美式赎回区间+价格
  put_str?: string; // 欧式回售日/美式回售区间+价格
  coupon_type?: string; // 利率方式
  coupon_rate_spread?: number; // 利差（%）
  coupon_rate_current?: number; // 最新票面利率
  coupon_frequency?: string; // 付息频率
  frn_index_id?: string; // 基础利率代码
  compound_frequency?: string; // 计息频率
};

export type BondQuoteOperationLog = {
  log_id: string; // 日志ID
  quote_id: string; // 报价ID
  operator: string; // 操作者
  operation_type: string; // 操作类型
  quote_snapshot: BondQuote; // 报价快照
  create_time: string; // 操作时间
  operation_type_val: OperationType; // 操作类型enum
  operation_source: OperationSource; // 操作类型
  code_market?: string; // 债券标识
  key_market?: string; // 债券唯一标识
};

// 通知结构体
export type DealNotice = {
  contract_id?: string; // 成交单Id
  send_direction?: number; // 1:B->Ofr; 2:Ofr->B
  receive_trader_id?: string; // 接收消息的交易员Id
  send_channel?: string; // 渠道
  cost?: string; // 费用
  special_brokerage?: string; // 特殊佣金
  remarks?: string; // 备注
};

// 代付结构体
export type DealPayForInst = {
  contract_id?: string; // 成交单Id
  pay_for_direction?: number; // 1:Bid代付; 2:Ofr代付
  inst?: InstitutionLite; // 机构
  trader_id?: string; // 交易员ID
  trader_remarks?: string; // trader后备注
  nc?: string; // nc原因
};

// 成交信息--机构简体
export type DealInstSimpleInfo = {
  inst_id?: string; // 机构Id
  trader_id?: string; // 交易员ID
  trader_remarks?: string; // trader后备注
  nc?: string; // nc原因
  broker_id?: string; // brokerID
  brokerage?: string; // 佣金种类 //CNY
  broker_id_b?: string; // brokerID_B;自动佣金使用
  broker_id_c?: string;
  broker_id_d?: string;
  broker_percent?: number; // broker佣金比例
  broker_percent_b?: number;
  broker_percent_c?: number;
  broker_percent_d?: number;
  quote_id?: string; // 报价ID
  broker_confirmed?: number; // broker是否确认，1为未确认，2为确认
  broker_confirmed_time?: string; // broker确认时间
  is_nc?: number; // 方是否nc，1为no，2yes
  bridge?: number; // 方是否为过桥机构 "2"-过桥机构， "1"-非过桥机构
  charge?: number; // 是否收费 "2"-收费，"1"-不收费
  is_pay_for?: number; // 是否被代付 1否; 2是
  trade_mode?: TradeMode; // 交易方式 1.QQ; 2QM; 3.直线 4.电话 5.RM
  pay_for_inst?: DealPayForInst; // 代付信息
  special_inst?: string; // 机构特殊细节
  msg_inst?: string; // 机构备注
};

// 成交信息--机构详情
export type DealInstDetail = {
  inst?: InstitutionLite; // 机构信息
  trader?: Trader; // Trader信息
  trader_remarks?: string; // trader后备注
  nc?: string; // nc原因
  broker?: User; // broker
  brokerage?: string; // 佣金种类 //CNY
  broker_b?: User; // brokerID_B;自动佣金使用
  broker_c?: User;
  broker_d?: User;
  broker_percent?: number; // broker佣金比例
  broker_percent_b?: number;
  broker_percent_c?: number;
  broker_percent_d?: number;
  quote_id?: string; // 报价ID
  broker_confirmed?: number; // broker是否确认，1为未确认，2为确认
  broker_confirmed_time?: string; // broker确认时间
  is_nc?: number; // 是否nc，1为no，2yes
  bridge?: number; // 是否为过桥机构 "2"-过桥机构， "1"-非过桥机构
  charge?: number; // 是否收费 "2"-收费，"1"-不收费
  is_pay_for?: number; // 是否被代付 1否; 2是
  bid_trade_mode?: TradeMode; // 交易方式 1.QQ; 2QM; 3.直线 4.电话 5.RM
  pay_for_inst?: DealPayForInst; // 代付信息
  special_inst?: string; // 机构特殊细节
  msg_inst?: string; // 机构备注
};

export type TradeInfo = {
  inst_id?: string; // 机构id
  full_name?: string; // 机构全名
  short_name_zh?: string; // 中文简称
  full_name_zh?: string; // 中文全称
  trader_id?: string; // 交易员id
  name_zh?: string; // 中文名
  trader_tag?: string; // 交易员标签
  flag_modify_brokerage?: boolean; // 调整佣金标识 1:调佣 0:不调
  modify_brokerage_reason?: string; // 调整佣金标识
  confirm_status?: SpotPricingConfirmStatus; // 确认状态
  broker_id?: string; // broker
  broker_name_zh?: string; // 中文名
  brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 调整佣金标识枚举
};

// 点价
export type SpotPricing = {
  // ------- 成交基础条件 -------
  contract_id?: string; // 成交单Id
  internal_code?: string; // 内码
  create_time?: string; // 创建时间
  update_time?: string;
  deal_type?: DealType; // 成交类型
  source?: OperationSource; // 来源
  flag_bridge?: boolean; // 过桥标识
  send_order_msg?: string; // 发单信息
  bid_send_order_msg?: string; // bid发单信息
  ofr_send_order_msg?: string; // ofr发单信息
  /** @deprecated */
  bond_info?: BondLite; // 债券详情  using bond_basic_info
  confirm_volume?: number; // 成交量
  price_type?: BondQuoteType; // 成交价格种类
  price?: number; // 成交价
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  return_point?: number; // 返点数值; 比如返0.12
  bid_settlement_type?: LiquidationSpeed[]; // bid结算方式
  bid_traded_date?: string; // 交易日，毫秒时间戳
  bid_delivery_date?: string; // 交割日，毫秒时间戳
  ofr_settlement_type?: LiquidationSpeed[]; // ofr结算方式
  ofr_traded_date?: string; // 交易日，毫秒时间戳
  ofr_delivery_date?: string; // 交割日，毫秒时间戳
  flag_exchange?: boolean; // 交易所
  exercise_type?: ExerciseType; // 0：默认，1.行权；2.到期
  spot_pricing_status?: SpotPricingConfirmStatus; // 点价状态
  spot_pricing_inst?: TradeInfo; // 点价方
  be_spot_pricing_inst?: TradeInfo; // 被点价方
  spot_pricing_record_id?: string; // 点价记录ID
  flag_internal?: boolean; // 是否暗盘
  operator?: UserLite; // 操作人
  listed_market?: ListedMarket; // 发行市场，CIB为银行间，SSH为上交所，SZE为深交所
  bid_bridge_operator?: UserLite; // bid方过桥操作人
  ofr_bridge_operator?: UserLite; // ofr方过桥操作人
  im_msg_text?: string; // 自动发送的im消息
  im_msg_send_status?: ImMsgSendStatus; // im发送消息状态
  im_msg_record_id?: string;
  quote_id?: string; // 报价id (线下成交没有)
  spot_pricing_volume?: number; // 点价匹配量
  bid_old_content?: OldContent; // bid方的最后一次修改前的内容
  ofr_old_content?: OldContent; // ofr方的最后一次修改前的内容
  bid_deal_read_status: DealReadStatus;
  ofr_deal_read_status: DealReadStatus;
  exercise_manual?: boolean; // 是否手动操作行权到期
  bond_basic_info?: FiccBondBasic; // 债券信息
};

export type OldContent = {
  flag_bridge: boolean; // 过桥标识
  bid_send_order_msg?: string; // bid发单信息
  ofr_send_order_msg?: string; // ofr发单信息
  bond_key_market: string; // 债券代码
  price: number; // 成交价
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  return_point?: number; // 返点数值; 比如返0.12
  confirm_volume: number; // 成交量
  flag_exchange: boolean; // 交易所
  bid_trader_info?: Trader; // 点价方交易员
  bid_broker_info: User; // 点价方经纪人
  ofr_trader_info?: Trader; // 被点价方交易员
  ofr_broker_info?: User; // 被点价方经纪人
  deal_type: DealType; // 成交类型，gvn/tkn/trd
  bid_traded_date: string; // 交易日，毫秒时间戳
  bid_delivery_date: string; // 交割日，毫秒时间戳
  ofr_traded_date: string; // 交易日，毫秒时间戳
  ofr_delivery_date: string; // 交割日，毫秒时间戳
  price_type: BondQuoteType; // 报价类型
  exercise_type: ExerciseType; // 0：默认，1.行权；2.到期
  bid_trader_tag?: string; // bid方向的交易员标签
  ofr_trader_tag?: string; // ofr方向的交易员标签
  bid_bridge_send_order_comment?: string; // bid发单备注
  ofr_bridge_send_order_comment?: string; // ofr发单备注
  exercise_manual: boolean; // 是否手动行权
  bid_broker_info_b?: User;
  bid_broker_info_c?: User;
  bid_broker_info_d?: User;
  ofr_broker_info_b?: User;
  ofr_broker_info_c?: User;
  ofr_broker_info_d?: User;
  bond_display_code?: string;
  bond_short_name?: string;
  bid_inst_info?: InstitutionTiny; // bid机构
  ofr_inst_info?: InstitutionTiny; // ofr机构
  bid_trader_lite_info?: TraderLite; // 点价方交易员
  ofr_trader_lite_info?: TraderLite; // 被点价方交易员
};

export type OldContentSync = {
  flag_bridge?: boolean; // 过桥标识
  bid_send_order_msg?: string; // bid发单信息
  ofr_send_order_msg?: string; // ofr发单信息
  bond_key_market?: string; // 债券代码
  price?: number; // 成交价
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  return_point?: number; // 返点数值; 比如返0.12
  confirm_volume?: number; // 成交量
  flag_exchange?: boolean; // 交易所
  bid_trader_id?: string; // 点价方交易员
  bid_broker_id?: string; // 点价方经纪人
  ofr_trader_id?: string; // 被点价方交易员
  ofr_broker_id?: string; // 被点价方经纪人
  deal_type?: DealType; // 成交类型，gvn/tkn/trd
  bid_traded_date?: string; // 交易日，毫秒时间戳
  bid_delivery_date?: string; // 交割日，毫秒时间戳
  ofr_traded_date?: string; // 交易日，毫秒时间戳
  ofr_delivery_date?: string; // 交割日，毫秒时间戳
  price_type?: BondQuoteType; // 报价类型
  exercise_type?: ExerciseType; // 0：默认，1.行权；2.到期
  bid_trader_tag?: string; // bid方向的交易员标签
  ofr_trader_tag?: string; // ofr方向的交易员标签
  bid_bridge_send_order_comment?: string; // bid发单备注
  ofr_bridge_send_order_comment?: string; // ofr发单备注
  exercise_manual: boolean; // 是否手动行权
  bid_broker_id_b?: string; // 点价方经纪人B
  bid_broker_id_c?: string; // 点价方经纪人C
  bid_broker_id_d?: string; // 点价方经纪人D
  ofr_broker_id_b?: string; // 被点价方经纪人B
  ofr_broker_id_c?: string; // 被点价方经纪人C
  ofr_broker_id_d?: string; // 被点价方经纪人D
};

export type MarketDeal = {
  deal_id: string; // 成交ID
  key_market: string; // 债券唯一标识
  deal_time: string; // 成交时间
  traded_date: string; // 交易日
  delivery_date: string; // 交割日
  direction: Direction; // 方向
  price?: number; // 成交价格
  price_type: BondQuoteType; // 报价类型
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  spread?: number; // 利差
  return_point?: number; // 返点
  volume?: number; // 成交量
  is_exercise: boolean; // 是否行权
  flag_rebate: boolean; // 是否返点
  flag_internal: boolean; // 内外部成交
  operator_id: string; // 操作人ID
  operator_name: string; // 操作人姓名
  comment: string; // 备注
  comment_flag_bridge: boolean; // 备注过桥
  comment_flag_pay_for: boolean; // 备注代付
  source: OperationSource; // 来源
  product_type: ProductType; // 台子
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  bid_institution_id?: string; // bid方向机构id
  bid_institution_name?: string; // bid方向机构名
  bid_trader_id?: string; // bid方向交易员ID
  bid_trader_name?: string; // bid方向交易员姓名
  bid_trader_tag?: string; // bid方向交易员标签
  bid_trader_is_vip?: boolean; // bid方向交易员标签
  bid_broker_id?: string; // bid方向经纪人ID
  bid_broker_name?: string; // bid方向经纪人姓名
  bid_broker_percent?: number; // bid方向经纪人分成百分比
  ofr_institution_id?: string; // ofr方向机构id
  ofr_institution_name?: string; // ofr方向机构名
  ofr_trader_id?: string; // ofr方向交易员ID
  ofr_trader_name?: string; // ofr方向交易员姓名
  ofr_trader_tag?: string; // ofr方向交易员标签
  ofr_trader_is_vip?: boolean; // ofr方向交易员是否是VIP
  ofr_broker_id?: string; // ofr方向经纪人ID
  ofr_broker_name?: string; // ofr方向经纪人姓名
  ofr_broker_percent?: number; // ofr方向经纪人分成百分比
  /** @deprecated */
  bond_info?: BondLite; // using bond_basic_info instead
  with_active_quote: boolean; // 是否有活跃的报价
  nothing_done: boolean; // NothingDone状态
  flag_intention: boolean; // 是否意向价
  last_action_type: MarketDealLastActionType; // 最后一次操作类型
  join_count: number;
  update_time?: string;
  bond_basic_info: FiccBondBasic;
  exercise_manual?: boolean; // 是否手动行权
  is_sync_receipt_deal?: boolean; // 是否同步成交单
};

export type MarketDealOperationLog = {
  log_id: string; // 日志ID
  deal_id: string; // 市场成交ID
  operator: string; // 操作者
  operation_type: string; // 操作类型
  market_deal_snapshot: MarketDeal; // 报价快照
  create_time: string; // 操作时间
  operation_type_val: OperationType; // 操作类型enum
  operation_source: OperationSource; // 操作类型
  code_market?: string; // 债券标识
  key_market?: string; // 债券唯一标识
};

export type UpsertDealErrorRecord = {
  line_no: number;
  error_msg: string;
  error_type?: number;
};

export type MarketDealCreate = {
  key_market: string; // 债券唯一标识
  quote_id?: string; // 报价id,如果有关联报价id时需要
  deal_time?: string; // 成交时间
  traded_date?: string; // 交易日
  delivery_date?: string; // 交割日
  direction: Direction; // 方向
  price?: number; // 成交价格
  price_type: BondQuoteType; // 价格类型
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  spread?: number; // 利差
  return_point?: number; // 返点
  volume?: number; // 成交量
  is_exercise?: boolean; // 是否行权
  flag_rebate?: boolean; // 是否返点
  flag_internal: boolean; // 内外部成交
  comment?: string; // 备注
  comment_flag_bridge: boolean; // 备注过桥
  comment_flag_pay_for: boolean; // 备注代付
  source: OperationSource; // 来源
  product_type: ProductType; // 台子
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  bid_institution_id?: string; // bid方向机构ID
  bid_trader_id?: string; // bid方向交易员ID
  bid_broker_id?: string; // bid方向经纪人ID
  bid_broker_percent?: number; // bid方向经纪人分成百分比
  ofr_institution_id?: string; // ofr方向机构ID
  ofr_trader_id?: string; // ofr方向交易员ID
  ofr_broker_id?: string; // ofr方向经纪人ID
  ofr_broker_percent?: number; // ofr方向经纪人分成百分比
  bid_trader_tag?: string; // bid方向交易员tag
  ofr_trader_tag?: string; // ofr方向交易员tag
  flag_intention?: boolean; // 是否意向价
  last_action_type?: MarketDealLastActionType; // 用户最后一次操作类型
  join_count?: number;
  exercise_manual?: boolean; // 是否手动行权
  settlement_amount?: number; // 结算金额
  is_sync_receipt_deal?: boolean; // 是否同步成交单
};

export type MarketDealUpdate = {
  deal_id: string; // 成交ID
  deal_time?: string; // 成交时间
  traded_date?: string; // 交易日
  delivery_date?: string; // 交割日
  direction?: Direction; // 方向
  price?: number; // 成交价格
  price_type?: BondQuoteType; // 价格类型
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  spread?: number; // 利差
  return_point?: number; // 返点
  volume?: number; // 成交量
  is_exercise?: boolean; // 是否行权
  flag_rebate?: boolean; // 是否返点
  flag_internal?: boolean; // 内外部成交
  comment?: string; // 备注
  comment_flag_bridge?: boolean; // 备注过桥
  comment_flag_pay_for?: boolean; // 备注代付
  source?: OperationSource; // 来源
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  bid_institution_id?: string; // bid方向机构ID
  bid_trader_id?: string; // bid方向交易员ID
  bid_broker_id?: string; // bid方向经纪人ID
  bid_broker_percent?: number; // bid方向经纪人分成百分比
  ofr_institution_id?: string; // ofr方向机构ID
  ofr_trader_id?: string; // ofr方向交易员ID
  ofr_broker_id?: string; // ofr方向经纪人ID
  ofr_broker_percent?: number; // ofr方向经纪人分成百分比
  nothing_done?: boolean; // NothingDone状态
  operation_type?: OperationType; // 操作类型
  enable?: Enable;
  bid_trader_tag?: string; // bid方向交易员tag
  ofr_trader_tag?: string; // ofr方向交易员tag
  flag_intention?: boolean; // 是否意向价
  last_action_type?: MarketDealLastActionType; // 用户最后一次操作类型
  join_count?: number;
  exercise_manual?: boolean; // 是否手动行权
  settlement_amount?: number; // 结算金额
};

export type InstRating = {
  rating_id: string;
  enable: Enable; // 删除位标记，1为正常，2为已删除
  create_time?: string; // 创建时间
  update_time?: string; // 更新时间
  inst_code?: string; // 机构代码
  inst_type?: string; // 机构类型
  rating_inst_code?: string; // 评级机构代码
  rating_date?: string; // 评级日期
  rate?: Rating; // 评级
  outlook?: string; // 展望
  inputer?: string; // 录入者
  inst_name?: string; // 机构名称
  rate_val?: string; // 评级值
};

export type City = {
  city_name_zh: string;
  city_name_en: string;
  city_code: string;
};

export type Province = {
  province_name_zh: string;
  province_name_en: string;
  province_code: string;
  cities?: City[];
};

export type Subsector = {
  subsector_name_zh: string;
  subsector_name_en: string;
  subsector_code: string;
};

export type Sector = {
  sector_name_zh: string;
  sector_name_en: string;
  sector_code: string;
  subsectors?: Subsector[];
};

export type InstInfo = {
  inst_id: string;
  inst_code: string;
  full_name_zh: string;
  short_name_zh: string;
  pinyin: string;
  pinyin_full: string;
  inst_type?: string;
  bind_inst_info?: InstitutionLite; // 绑定的机构
};

export type LiquidationSpeed = {
  offset: number; // 0/1
  tag?: LiquidationSpeedTag;
  date?: string; // 交易日期对应时间毫秒戳
};

export type WeekdayItem = {
  target_date: string;
  listed_market?: ListedMarket;
  with_today?: boolean;
};

export type Issuer = {
  issuer_id: string;
  issuer_name: string; // 发行人名称
  issuer_type?: string; // 发行人类型
  inst_code: string; // 机构代码
  inst_type?: string; // 机构类型
  inst_subtype?: string; // 机构子类型
  inst_rating?: string; // 机构评级    主界面筛选项 超AAA
  establishment_date: string; // 创办时间
  full_name_zh: string; // 机构中文全称
  short_name_zh?: string; // 机构中文简称
  full_name_en?: string; // 机构英文全称
  short_name_en?: string; // 机构英文简称
  pin_yin: string; // 拼音
  pin_yin_full: string; // 拼音全称
  country?: string; // 国别
  province?: string; // 省份
  province_code?: string; // 省份代码
  city?: string; // 城市
  largest_shareholder?: string; // 控制人
  legal_representative?: string; // 法人代表
  registered_capital?: string; // 注册资本
  registered_capital_currency?: string; // 注册资本单位
  registered_address?: string; // 注册地址
  regd_num?: string; // 注册号
  business_scope?: string; // 经营范围
  main_product?: string; // 主营产品
  rating?: string; // 评级
  rating_inst_code?: string; // 评级机构代码
  former_name?: string; // 曾用名
  org_type?: string; // 组织形式
  sw_sector?: string; // 申万一级行业名称
  sw_sector_code?: string; // 申万一级行业代码
  sw_subsector?: string; // 申万二级行业名称
  sw_subsector_code?: string; // 申万二级行业代码
  stockholder_name?: string; // 控股股东名称
  stockholder_type?: string; // 控股股东类型
  stockholding_percentage?: string; // 持股比例
  actual_controller_name?: string; // 实际控制人
  actual_controller_type?: string; // 实际控制人类型
  ultimate_actual_controller_name?: string; // 最终实际控制人
  ultimate_actual_controller_type?: string; // 最终实际控制人类型
  cbrc_financing_platform?: boolean; // 银监会投融资平台
  endowment?: string; // 增资方式
  orgnization_code?: string; // 组织代码
  uni_code?: string; // 工商局统一编码
  municipal_code?: string; // 城投属性
  is_municipal?: boolean; // 是否城投
  municipal_business?: boolean; // 城投项目
  area_level?: string; // 区域级别
  listed_type?: string; // 上市公司
  cbc_rating?: string; // 中债资信评级
  cbc_outlook?: string; // 展望
};

export type IssuerLite = {
  issuer_id?: string;
  issuer_name?: string; // 发行人名称
  inst_code?: string; // 机构代码
  full_name_zh?: string; // 机构中文全称
  short_name_zh?: string; // 机构中文简称
  bank_type?: string; // 银行细分 大行:SCB,政策性银行:POB,股份制银行:JCB,外资银行:FCB,城商行:CCB,三农机构银行:RB,村镇银行:VIB,其他银行:OTB,银行业非银机构:NBI
};

export type BondBenchmarkRate = {
  value: number; // 基准利率值
  name: string; // 基准利率代码
  latest_index_date: string; // 基准利率最新日期
};

export type BondRating = {
  bond_rating_id: string;
  bond_key: string;
  rating_institution_code?: string;
  rating_date: string; // YYYY-MM-DD格式日期
  bond_rating: string;
  rating_reason?: string;
  rating_source?: string;
  outlook?: string;
  rating_institution_name?: string;
};

// v3版本同步使用
export type BondQuoteSync = {
  quote_id: string; // 报价ID
  bond_key_market: string; // 债券 key market
  update_time: string; // 更新时间
  create_time: string; // 创建时间
  product_type: ProductType; // 产品类型，台子
  volume: number; // 交易量
  yield: number; // 收益率
  clean_price: number; // 净价
  full_price: number; // 全价
  return_point: number; // 返点值
  flag_rebate: boolean; // 返点标记
  side: Side; // 方向
  quote_type: BondQuoteType; // 报价类型
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  inst_info: InstitutionTiny; // 机构信息  （机构业务简称 short_name_zh）
  trader_info: TraderLite; // 交易员信息   （交易员姓名 name_zh、交易员标签 trader_tag）
  broker_info: Broker; // 经纪人信息      （经纪人姓名 name_zh）
  operator_info: Broker; // 操作人信息     (本人 name_zh)
  flag_urgent: boolean; // 紧急
  flag_star: number; // 1-单星 2-双星
  flag_package: boolean; // 是否打包
  flag_oco: boolean; // oco
  flag_exchange: boolean; // 交换
  flag_stock_exchange: boolean; // 交易所
  is_exercise: boolean; // 是否行权
  flag_intention: boolean; // 是否意向价
  flag_indivisible: boolean; // 整量
  flag_stc: boolean; // STC 报价
  comment: string; // 备注信息
  sync_version: string; // 版本信息
  flag_internal: boolean; // 内外部
  spread: number; // 利差
  quote_price: number; // 用户手动输入价格
  inst_biz_short_name_list?: string[]; // 机构业务简称列表
  flag_request: boolean;
  flag_bilateral: boolean;
  exercise_manual?: boolean; // 是否手动操作行权
};

// v4版本同步使用
export type QuoteSync = {
  quote_id: string; // 报价ID
  bond_key_market?: string; // 债券 key market
  update_time?: string; // 更新时间
  create_time?: string; // 创建时间
  product_type?: ProductType; // 产品类型，台子
  volume?: number; // 交易量
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  return_point?: number; // 返点值
  flag_rebate?: boolean; // 返点标记
  side?: Side; // 方向
  quote_type?: BondQuoteType; // 报价类型
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  inst_id?: string; // 机构id
  trader_id?: string; // 交易员id
  broker_id?: string; // 经纪人id
  operator?: string; // 操作人id
  flag_urgent?: boolean; // 紧急
  flag_star?: number; // 1-单星 2-双星
  flag_package?: boolean; // 是否打包
  flag_oco?: boolean; // oco
  flag_exchange?: boolean; // 交换
  flag_stock_exchange?: boolean; // 交易所
  is_exercise?: boolean; // 是否行权
  flag_intention?: boolean; // 是否意向价
  flag_indivisible?: boolean; // 整量
  flag_stc?: boolean; // STC 报价
  comment?: string; // 备注信息
  sync_version?: string; // 版本信息
  flag_internal?: boolean; // 内外部
  spread?: number; // 利差
  quote_price?: number; // 用户手动输入价格
  flag_request?: boolean;
  flag_bilateral?: boolean;
  enable?: Enable;
  trader_tag?: string;
  exercise_manual?: boolean; // 是否手动操作行权
  deal_liquidation_speed_list?: LiquidationSpeed[]; // 成交清算速度
};

export type QuoteDetail = {
  quote_id: string;
  sync_version?: string;
  create_time?: string;
  update_time?: string;
  bond_key_market?: string;
  bond_id?: string;
  broker_id?: string;
  trader_id?: string;
  inst_id?: string;
  side?: number;
  quote_type?: number;
  offset?: number;
  price?: number;
  yield?: number;
  clean_price?: number;
  full_price?: number;
  spread?: number;
  return_point?: number;
  volume?: number;
  is_vip?: boolean;
  is_danger?: boolean;
  is_bargain?: boolean;
  flag_internal?: boolean;
  flag_urgent?: boolean;
  flag_exchange?: boolean;
  flag_star?: number;
  flag_oco?: boolean;
  flag_package?: boolean;
  flag_rebate?: boolean;
  flag_recommend?: boolean;
  almost_done?: boolean;
  flag_intention?: boolean;
  is_exercise?: boolean;
  exercise_manual?: boolean;
  is_lead?: boolean;
  comment?: string;
  flag_stock_exchange?: boolean;
  flag_bilateral?: boolean;
  flag_request?: boolean;
  flag_indivisible?: boolean;
  flag_stc?: boolean;
  liquidation_speed_list?: string;
  idc_liquidation_speed_list?: string;
  operator?: string;
  trader_tag?: string;
  refer_time?: string;
  latest_traded_date?: string;
  first_delivery_date?: string;
  source?: number;
  refer_type?: number;
  enable?: number;
  bond_code?: string;
  bond_type?: string;
  bond_short_name?: string;
  bond_key?: string;
  listed_market?: string;
  ent_cor?: string;
  val_modified_duration?: number;
  frn_index_id?: string;
  coupon_type?: string;
  option_type?: string;
  mkt_type?: number;
  maturity_is_holiday?: boolean;
  product_type?: string;
  selective_code?: string;
  asset_status?: string;
  is_mortgage?: boolean;
  is_cross_mkt?: boolean;
  ficc_type_code?: string;
  bond_ficc_type?: string;
  warranter?: string;
  is_municipal?: boolean;
  term_structure?: string;
  bond_full_name?: string;
  redemption_no?: number;
  sceniority?: string;
  conversion_rate?: number;
  issuer_code?: string;
  issuer_name?: string;
  institution_subtype?: string;
  cbrc_financing_platform?: boolean;
  province?: string;
  city?: string;
  issue_year?: number;
  sw_sector?: string;
  sw_subsector?: string;
  maturity_date?: string;
  first_maturity_date?: string;
  listed_date?: string;
  delisted_date?: string;
  interest_start_date?: string;
  option_date?: string;
  underwriter_code?: string;
  area_level?: string;
  inst_type?: string;
  inst_listed_type?: string;
  bond_category?: number;
  bond_sector?: number;
  fr_type?: number;
  perp_type?: number;
  has_option?: boolean;
  val_yield?: number;
  val_clean_price_exe?: number;
  val_clean_price_mat?: number;
  val_yield_exe?: number;
  val_yield_mat?: number;
  val_clean_price?: number;
  val_convexity?: number;
  val_basis_point_value?: number;
  csi_clean_price?: number;
  csi_full_price?: number;
  csi_yield?: number;
  coupon_rate_current?: number;
  operator_name?: string;
  trader_name?: string;
  broker_name_pinyin?: string;
  operator_name_pinyin?: string;
  bond_short_name_pinyin?: string;
  bond_short_name_pinyin_full?: string;
  trader_name_pinyin?: string;
  inst_short_name_zh?: string;
  inst_biz_short_name_list?: string;
  broker_name?: string;
  repayment_method?: number;
  bond_rating_str?: string;
  issuer_rating_str?: string;
  cbc_rating_str?: string;
  inst_rating_str?: string;
  implied_rating_str?: string;
  bond_rating_score?: number;
  issuer_rating_score?: number;
  cbc_rating_score?: number;
  inst_rating_score?: number;
  implied_rating_score?: number;
  call_str?: string;
  put_str?: string;
  is_gn?: boolean;
  rating_augment?: string;
  bond_display_code?: string;
  ncd_subtype?: string;
};

export type TraderDefaultBroker = {
  product_code: string;
  broker_id: string;
};

export type TraderSync = {
  trader_id: string; // id
  name_zh?: string; // 中文名
  pinyin?: string; // 拼音
  pinyin_full?: string; // 拼音全称
  name_en?: string; // 英文名
  code?: string; // 代码
  department?: string; // 部门
  position?: string; // 职位
  qq?: string[]; // qq
  product_codes?: string[]; // 业务产品权限code列表
  tags?: string[]; // 交易员标签ID列表
  inst_id?: string; // 交易员绑定的机构id
  broker_ids?: string[]; // 交易员绑定的经纪人id
  qm_account?: string; // qm_id绑定qm
  white_list?: TraderWhiteListLite[]; // 交易员的业务产品经纪人白名单
  update_time?: string;
  product_marks?: ProductMark[]; // 产品标识
  default_broker_list?: TraderDefaultBroker[]; // 经纪人首选项
  enable?: Enable;
  sync_version?: string;
  job_status?: JobStatus;
  usage_status?: TraderUsageStatus;
};

export type UserSync = {
  user_id: string; // id
  name_cn?: string; // 中文名字
  name_en?: string; // 英文名字
  account?: string; // 登陆邮箱
  post?: Post; // 岗位
  qq?: string; // qq
  qm_account?: string; // qm账号绑定
  product_codes?: string[]; // 业务产品权限code列表
  pinyin?: string; // 拼音
  pinyin_full?: string; // 拼音全称
  email?: string; // 邮箱
  phone?: string; // 手机号
  telephone?: string; // 座机号
  job_num?: string; // 工号
  enable?: Enable;
  sync_version?: string;
  update_time?: string;
  job_status?: JobStatus;
  account_status?: AccountStatus;
};

export type InstSync = {
  inst_id: string; // id
  standard_code?: string; // 标准代码
  inst_type?: string; // 机构类型
  short_name_zh?: string; // 中文简称
  full_name_zh?: string; // 中文全称
  short_name_en?: string; // 英文简称
  full_name_en?: string; // 英文全称
  pinyin?: string; // 机构拼音
  pinyin_full?: string; // 机构拼音全称
  product_codes?: string[]; // 产品权限
  product_short_name_set?: BizShortName[]; // 业务简称
  enable?: Enable;
  sync_version?: string;
  update_time?: string;
  district_id?: string;
  district_name?: string;
  inst_status?: InstStatus;
  usage_status?: UsageStatus;
  issuer_code?: string;
  issuer_rating?: string;
};

export type BondBasicSync = {
  ficc_id: string; // fic业务id
  enable?: Enable; // 删除位标记，1为正常，2为已删除
  sync_version?: string; // 创建时间
  update_time?: string; // 更新时间
  // ---------- 标的通用属性 ----------
  product_class?: ProductClass; // 产品大类
  product_type?: ProductType; // 产品类型，英文简写
  product_key?: string; // 产品唯一标识，一般"ficc_"+key_market
  product_code?: string; // 产品代码，一般为"ficc_"+code_market
  product_name?: string; // 产品简称
  bond_ficc_type?: string; // 固收类型，这里等于ficc_belong
  key_market?: string; // 债券的系统唯一标识+发行市场
  code_market?: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code?: string; // 债券代码
  bond_key?: string; // 债券的系统唯一标识
  listed_market?: string; // 发行市场，CIB为银行间，SSE为上交所，SZE为深交所
  listed_date?: string; // 上市日
  delisted_date?: string; // 下市日
  full_name?: string; // 全称
  short_name?: string; // 简称
  pinyin?: string; // 拼音
  pinyin_full?: string; // 拼音全称
  selective_code?: string; // 固收基础类型代码
  selective_name?: string; // 固收基础类型名称
  ficc_type_code?: string; // 固收产品类型代码
  ficc_belong?: string; // 固收产品所属台子
  bond_category?: BondCategory; // 券种
  bond_sector?: BondSector; // 债券所属行业
  fr_type?: FRType; // 浮动利率类型
  perp_type?: PerpType; // 永续类型
  has_option?: boolean; // 是否含权
  // ---------- 中债估值部分 ----------
  // Remark: 中债估值中 推荐估值=行权估值，非推荐估值=到期估值
  val_yield_exe?: number; // 推荐收益率估值/行权收益率估值
  val_yield_mat?: number; // 到期收益率估值/非推荐收益率估值
  val_clean_price_exe?: number; // 推荐净价估值/行权净价估值
  val_clean_price_mat?: number; // 到期净价估值/非推荐净价估值
  val_full_price_exe?: number; // 行权全价估值/推荐全价估值
  val_modified_duration?: number; // 久期
  val_convexity?: number; // 凸性
  val_basis_point_value?: number; // PVBP
  remaining_par_value?: number; // 剩余本金（推荐估值）
  // ---------- 中证估值部分 ----------
  csi_yield_to_maturity?: number; // 到期收益率
  csi_modified_duration?: number; // 修正久期
  csi_clean_price?: number; // 净价
  csi_clean_price_exe?: number; // 行权净价
  csi_clean_price_mat?: number; // 到期净价
  csi_yield_exe?: number; // 行权收益率
  csi_yield_mat?: number; // 到期收益率
  csi_full_price_exe?: number; // 行权全价
  csi_full_price_mat?: number; // 到期全价
  // ---------- 其他固收债券属性 ----------
  issuer_code?: string; // 发行代码
  underwriter_code?: string; // 主承销商代码
  maturity_term?: number; // 偿还期限
  term_unit?: string; // 偿还期限的单位
  interest_start_date?: string; // 起息日
  maturity_date?: string; // 到期日
  maturity_is_holiday?: boolean; // 到期日是否为假期
  next_coupon_date?: string; // 下次付息日
  auction_date_start?: string; // 招标日/建档日开始日
  auction_date_end?: string; // 招标日/建档日结束日
  option_type?: OptionType; // 含权类型（行权类型）
  option_date?: string; // 含权日期
  call_str?: string; // 欧式赎回日/美式赎回区间+价格
  put_str?: string; // 欧式回售日/美式回售区间+价格
  compensate_rate?: string; // 补偿利率（%）
  coupon_type?: string; // 利率方式
  coupon_rate_spread?: number; // 利差（%）
  coupon_rate_current?: number; // 最新票面利率
  frn_index_id?: string; // 基础利率代码
  fixing_ma_days?: number; // 平均利率天期
  issue_rate?: number; // 发行利率
  issue_amount?: number; // 发行总量
  redemption_no?: number; // 提前偿付期数
  sceniority?: string; // 偿还次序
  rating_current?: string; // 最新评级
  implied_rating?: string; // 隐含评级
  rating_inst_code?: string; // 评级机构代码
  rating_date?: string; // 信用评级日期
  rating_augment?: string; // 信用增级方式
  warranter?: string; // 担保方代码
  issuer_rating?: string; // 发行人最新评级
  issuer_rating_inst_code?: string; // 发行人评级机构代码
  issue_year?: number; // 发行年度
  asset_status?: string; // 资产状态
  is_cross_mkt?: boolean; // 是否交易所跨市场
  is_mortgage?: boolean; // 是否质押
  mkt_type?: MktType; // 市场类型:1为意向债,2二级债
  is_municipal?: boolean; // 是否城投债
  issuer_rating_npy?: string; // 非鹏元-发行人（主体）评级
  rating_npy?: string; // 非鹏元-债券评级
  issuer_outlook?: Outlook; // 当前发行人评级展望
  ent_cor?: string; // 企业/公司债
  time_to_maturity?: string; // 剩余期限
  first_maturity_date?: string; // 债券第一个到期日，如非含权债，则等于 maturity_date，如为含权债，则等于 option_date 或 call_str 中的对应日期，（前提是日期都大于当天）
  option_style?: string; // 含权方式（行权方式）
  conversion_rate?: number; // 质押率
  fund_objective_sub_category?: string; // 地方债具体分类
  fund_objective_category?: string; // 地方债大类
  cbc_rating?: string; // 中债评级
  is_gn?: boolean; // 是否为环保行业
  with_warranty?: boolean; // 是否担保
  warrant_method?: string; // 担保方式
  is_fixed_rate?: boolean;
  rating?: string; // 债券评级
  display_code?: string; // 用于展示的债券代码
};

export type BondAppendixSync = {
  ficc_id: string;
  enable?: Enable; // 删除位标记，1为正常，2为已删除
  update_time?: string; // 更新时间
  sync_version?: string; // 版本
  repayment_method?: RepaymentMethod; // 还本方式
  bond_type?: string; // 债券类型
  term_structure?: string;
  conversion_rate?: number;
  underwriter_group?: string;
};

export type BondDetailSync = {
  ficc_id: string;
  enable?: Enable;
  sync_version?: string;
  key_market?: string;
  code_market?: string;
  bond_code?: string;
  bond_key?: string;
  listed_market?: string;
  listed_date?: string;
  delisted_date?: string;
  full_name?: string;
  short_name?: string;
  pinyin?: string;
  pinyin_full?: string;
  bond_category?: BondCategory;
  fr_type?: FRType;
  perp_type?: PerpType;
  has_option?: boolean;
  interest_start_date?: string;
  maturity_date?: string;
  maturity_is_holiday?: boolean;
  next_coupon_date?: string;
  option_date?: string;
  coupon_rate_current?: number;
  issue_rate?: number;
  issue_amount?: number;
  redemption_no?: number;
  implied_rating?: string;
  issuer_rating?: string;
  is_cross_mkt?: boolean;
  mkt_type?: MktType;
  time_to_maturity?: string;
  conversion_rate?: number;
  fund_objective_category?: string;
  fund_objective_sub_category?: string;
  rating?: string;
  issuer_code?: string;
  display_code?: string;
  product_type?: ProductType;
  option_type?: OptionType;
  with_warranty?: boolean;
  is_fixed_rate?: boolean;
  val_yield_exercise?: number; // 推荐收益率估值/行权收益率估值
  val_yield_maturity?: number; // 到期收益率估值/非推荐收益率估值
  val_clean_price_exercise?: number; // 推荐净价估值/行权净价估值
  val_clean_price_maturity?: number; // 到期净价估值/非推荐净价估值
  val_modified_duration?: number; // 久期
  val_convexity?: number; // 凸性
  val_basis_point_value?: number; // PVBP
  csi_yield_exercise?: number; // 行权收益率
  csi_yield_maturity?: number; // 到期收益率
  csi_clean_price_exercise?: number; // 行权净价
  csi_clean_price_maturity?: number; // 到期净价
  csi_full_price_exercise?: number; // 行权全价
  csi_full_price_maturity?: number; // 到期全价
  repayment_method?: RepaymentMethod; // 还本方式
  first_maturity_date?: string;
  call_str?: string;
  put_str?: string;
  ent_cor?: string; // 企业/公司债
};

export type HolidaySync = {
  holiday_id: string;
  enable?: Enable;
  update_time?: string; // 更新时间
  sync_version?: string; // 版本
  holiday_date?: string;
  country?: string;
  market_type?: string;
  holiday_name?: string;
};

export type QuoteDraftDetailOrder = {
  corresponding_line: number;
  detail_id_list?: string[]; // 详情id列表
  with_trader_info?: boolean;
};

export type QuoteDraftMessageSync = {
  message_id: string;
  create_time?: string;
  update_time?: string;
  inst_id?: string;
  trader_id?: string;
  broker_id?: string;
  text_list?: string[];
  img_url?: string;
  creator?: string;
  operator?: string;
  trader_tag?: string;
  sync_version?: string;
  enable?: Enable;
  product_type?: ProductType;
  detail_order_list?: QuoteDraftDetailOrder[]; // 详情id列表，标识顺序
  modified_status?: QuoteDraftModifiedStatus;
  source?: OperationSource;
  status?: QuoteDraftMessageStatus;
  img_name?: string;
};

export type QuoteDraftDetailSync = {
  detail_id: string;
  message_id?: string;
  corresponding_line?: number;
  side?: Side;
  key_market?: string;
  quote_type?: BondQuoteType;
  price?: number;
  volume?: number;
  return_point?: number;
  flag_rebate?: boolean;
  flag_star?: number;
  flag_package?: boolean;
  flag_oco?: boolean;
  flag_exchange?: boolean;
  flag_intention?: boolean;
  flag_indivisible?: boolean;
  flag_stock_exchange?: boolean;
  flag_bilateral?: boolean;
  flag_request?: boolean;
  flag_urgent?: boolean;
  flag_internal?: boolean;
  flag_recommend?: boolean;
  liquidation_speed_list?: LiquidationSpeed[];
  comment?: string;
  is_exercise?: boolean;
  exercise_manual?: boolean;
  status?: QuoteDraftDetailStatus;
  creator?: string;
  operator?: string;
  sync_version?: string;
  enable?: Enable;
  create_time?: string;
  update_time?: string;
  product_type?: ProductType;
  flag_inverted?: boolean; // 倒挂
};

export type QuoteDraftMessage = {
  message_id: string;
  create_time?: string;
  update_time?: string;
  inst_id?: string;
  trader_id?: string;
  broker_id?: string;
  text_list?: string[];
  img_url?: string;
  creator?: string;
  operator?: string;
  product_type: ProductType;
  detail_order_list?: QuoteDraftDetailOrder[]; // 详情id列表，标识顺序
  modified_status: QuoteDraftModifiedStatus;
  source: OperationSource;
  status: QuoteDraftMessageStatus;
  img_name?: string;
  detail_list?: QuoteDraftDetail[];
};

export type QuoteDraftDetail = {
  detail_id: string;
  message_id: string;
  product_type: ProductType;
  status: QuoteDraftDetailStatus;
  corresponding_line: number;
  side?: Side;
  key_market?: string;
  quote_type?: BondQuoteType;
  price?: number;
  volume?: number;
  return_point?: number;
  flag_rebate?: boolean;
  flag_star?: number;
  flag_package?: boolean;
  flag_oco?: boolean;
  flag_exchange?: boolean;
  flag_intention?: boolean;
  flag_indivisible?: boolean;
  flag_stock_exchange?: boolean;
  flag_bilateral?: boolean;
  flag_request?: boolean;
  flag_urgent?: boolean;
  flag_internal?: boolean;
  flag_recommend?: boolean;
  flag_inverted?: boolean; // 倒挂
  liquidation_speed_list?: LiquidationSpeed[];
  comment?: string;
  is_exercise?: boolean;
  exercise_manual?: boolean;
  creator?: string;
  operator?: string;
  create_time?: string;
  update_time?: string;
  flag_sustained_volume?: boolean; // 是否是续量
};

export type DealInfoSync = {
  deal_id: string;
  internal_code?: string;
  create_time?: string;
  update_time?: string;
  deal_type?: DealType;
  source?: OperationSource;
  flag_bridge?: boolean;
  send_order_msg?: string;
  bid_send_order_msg?: string;
  ofr_send_order_msg?: string;
  bond_key_market?: string;
  confirm_volume?: number;
  price_type?: BondQuoteType;
  price?: number;
  yield?: number;
  clean_price?: number;
  full_price?: number;
  return_point?: number;
  bid_settlement_type?: LiquidationSpeed;
  bid_traded_date?: string;
  bid_delivery_date?: string;
  ofr_settlement_type?: LiquidationSpeed;
  ofr_traded_date?: string;
  ofr_delivery_date?: string;
  flag_stock_exchange?: boolean;
  exercise_type?: ExerciseType;
  deal_status?: BondDealStatus;
  bid_inst_id?: string;
  bid_trader_id?: string;
  bid_broker_id?: string;
  flag_bid_modify_brokerage?: boolean;
  bid_confirm_status?: SpotPricingConfirmStatus;
  ofr_inst_id?: string;
  ofr_trader_id?: string;
  ofr_broker_id?: string;
  flag_ofr_modify_brokerage?: boolean;
  ofr_confirm_status?: SpotPricingConfirmStatus;
  spot_pricing_record_id?: string;
  flag_internal?: boolean;
  operator?: string;
  listed_market?: string;
  bid_bridge_record_id?: string;
  ofr_bridge_record_id?: string;
  im_msg_text?: string;
  im_msg_send_status?: ImMsgSendStatus;
  im_msg_record_id?: string;
  quote_id?: string;
  spot_pricing_volume?: number;
  bid_old_content?: OldContentSync;
  ofr_old_content?: OldContentSync;
  bid_deal_read_status?: DealReadStatus;
  ofr_deal_read_status?: DealReadStatus;
  exercise_manual?: boolean;
  flag_bid_bridge_hide_comment?: boolean;
  flag_ofr_bridge_hide_comment?: boolean;
  bid_bridge_send_order_comment?: string;
  ofr_bridge_send_order_comment?: string;
  enable?: Enable;
  sync_version?: string;
  bid_modify_brokerage_reason?: string;
  ofr_modify_brokerage_reason?: string;
  hand_over_status?: DealHandOverStatus; // 1:可以移交 2:不能移交(成交单删除) 3:已移交
  bid_brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 调整佣金标识枚举
  ofr_brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 调整佣金标识枚举
  bid_trader_tag?: string;
  ofr_trader_tag?: string;
  bid_broker_id_b?: string;
  bid_broker_id_c?: string;
  bid_broker_id_d?: string;
  ofr_broker_id_b?: string;
  ofr_broker_id_c?: string;
  ofr_broker_id_d?: string;
  flag_reverse_sync?: boolean; // 是否有反向同步
  flag_unrefer_quote: boolean; // 是否反挂
  bid_add_bridge_operator_id?: string; // bid方加桥操作人
  ofr_add_bridge_operator_id?: string; // ofr方加桥操作人
  remain_volume?: number; // 是否反挂
  flag_deal_has_changed: boolean; // 成交记录是否有变化
  bridge_list?: ReceiptDealBridgeOp[]; // 桥列表，顺序bid单->ofr单
  flag_bid_pay_for_inst?: boolean; // bid方向代付标识是否点亮，无桥点亮=给对方代付，有桥点亮=被代付
  flag_ofr_pay_for_inst?: boolean; // ofr方向代付标识是否点亮，无桥点亮=给对方代付，有桥点亮=被代付
  product_type?: ProductType;
  confirm_time?: string; // 双方点确认时间
  default_bridge_config?: DefaultBridgeConfig; // 默认加桥配置
  child_deal_list?: ChildDealInfo[]; // 子成交信息
};

export type ChildDealInfo = {
  receipt_deal_id: string;
  traded_date?: string;
  delivery_date?: string;
};

export type InitSyncMessage = {
  message_id: string;
  message_type: DataSyncMessageType;
  quote_list?: BondQuoteSync[];
  trader_list?: TraderSync[];
  inst_list?: InstSync[];
  user_list?: UserSync[];
  sync_data_type: SyncDataType;
  bond_basic_list?: BondBasicSync[];
};

export type InitSyncTaskMessage = {
  uid: number;
  channel: string;
  data_type: SyncDataType;
  start_version: number;
  end_version: number;
};

export type RealtimeSyncMessage = {
  upsert_quote_list?: BondQuoteSync[];
  removed_quote_id_list?: string[];
};

export type BondQuoteSyncCheck = {
  quote_id: string;
  sync_version: string;
  refer_type: RefType;
  enable: Enable;
};

export type CheckSyncMessage = {
  quote_list?: BondQuoteSyncCheck[];
  start_time: string;
  end_time: string;
};

export type QuoteParsing = {
  /** @deprecated */
  bond_info?: BondLite; // 债券信息 using bond_basic_info instead
  /** @deprecated */
  trader_list?: Trader[]; // 交易员信息  todo: remove
  algo_tags?: string; // 算法标签
  // bid/ofr的结构详情
  side: number; // 方向
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  volume?: number; // 交易量
  traded_date?: string; // 交易日，毫秒时间戳
  settlement_date?: string; // 结算日，毫秒时间戳
  delivery_date?: string; // 交割日，毫秒时间戳
  comment?: string; // 备注信息
  return_point?: number; // 返点值
  spread?: number; // 利差
  flag_internal?: boolean; // 是否为内部报价
  flag_urgent?: boolean; // 是否为紧急报价
  flag_exchange?: boolean; // 是否换券报价
  flag_star?: number; // 星数
  flag_oco?: boolean; // 是否oco
  flag_package?: boolean; // 是否打包
  flag_recommend?: boolean; // 是否推荐
  is_exercise?: boolean; // 是否行权
  flag_rebate?: boolean; // 是否返点
  quote_type: BondQuoteType; // 报价类型
  flag_intention?: boolean; // 是否是意向价
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  corresponding_line?: number; // 对应行
  bond_basic_info: FiccBondBasic;
};

export type BridgeInst = {
  bridge_inst_id: string;
  contact_info: DealInstTrader; // 联系人
  biller_info: DealInstTrader; // 计费人
  send_msg: string;
  channel: BridgeChannel;
  comment: string;
  contact: string; // 联系方式
  /** @deprecated */
  bridge_status?: number;
  create_time: string;
  update_time: string;
};

export type DealInstTrader = {
  inst_id: string;
  inst_full_name?: string;
  inst_short_name_zh?: string;
  inst_full_name_zh?: string;
  trader_id: string;
  trader_name_zh?: string;
  trader_tag?: string;
};

export type BridgeRecord = {
  bridge_record_id: string; // 过桥记录ID
  contract_id: string; // 成交单ID
  bridge_inst_id: string; // 桥机构ID
  other_bridge_inst_id: string; // 双桥中的另外一个桥，若为空，则为单桥
  bridge_side: number; // 桥的方向 0:没有（默认）； 1:为O(ofr)  2: 为B（bid）3：ofr编辑中 4:bid-编辑中
  status: number; // 1:正常 0：删除
  tag_info: BridgeTag; // 详情
  flag_double_bridge?: boolean; // 是否双桥
  bridge_code: string; // 过桥码 成交单相同，所有桥的过桥码相同
  serial_number: number; // 序号
};

export type BridgeDeal = {
  bridge_record: BridgeRecord; // 过桥记录
  spot_pricing_deal: SpotPricing; // 点价详情
};

export type BridgeTag = {
  bridge_code: string;
  ofr_bridge_detail: BridgeDetail; // ofr方桥信息
  bid_bridge_detail: BridgeDetail;
  double_bridge_detail?: DoubleBridgeDetail; // 双桥详情
};

export type BridgeDetail = {
  bridge_inst: BridgeInst;
  inst_trader: DealInstTrader;
  bridge_side: number;
  cost: number; // 费用
  special_brokerage?: number; // 特别佣金
  liquidation_speed_list?: LiquidationSpeed[]; // 结算方式
  flag_hide_comment: boolean;
  send_order_info?: SendOrderInfo[]; // 发单机构 & 量
  comment?: string; // 备注
};

export type DoubleBridgeDetail = {
  send_msg: string; // 发给
  cost: number;
  comment: string;
  channel: BridgeChannel;
  stagger_date: number; // 错期 1:ofr 2:bid
  bridge_side: number; // ofr - bid 指向，单桥无方向为0； 1：ofr->bid 2：bid -> ofr
};

export type SendOrderInfo = {
  send_order_inst: InstitutionTiny;
  volume: number;
};

export type SpotPricingMessage = {
  spot_pricing_message_id: string; // 消息id
  quote_trader_info?: TraderLite; // 被点价方交易员
  quote_broker_info: User; // 被点价方经纪人
  quote_inst_info?: InstitutionTiny; // 被点价方机构
  quote_price?: number; // 报价价格
  quote_volume?: number; // 报价量
  confirm_volume?: number; // 确认量
  spot_pricing_confirm_status: SpotPricingConfirmStatus; // 成交单状态
  return_point?: number; // 返点
  im_msg_text?: string; // 发送的im信息
  im_msg_send_status: SpotPricingImMsgSendStatus; // im信息发送状态
  quote_id?: string; // 报价id
  contract_id?: string; // 成交单id
  message_record_id?: string; // 消息发送记录 id
  bid_confirm_status: SpotPricingConfirmStatus; // bid方向确认状态
  ofr_confirm_status: SpotPricingConfirmStatus; // ofr方向确认状态
  deal_liquidation_speed_list?: LiquidationSpeed[]; // 成交单的交割方式
};

export type SpotPricingRecord = {
  spot_record_id: string; // 点价记录id
  /** @deprecated */
  bond_info?: BondLite; // 债券信息 using bond_basic_info
  spot_pricing_time: string; // 点价时间
  sp_liquidation_speed_list?: LiquidationSpeed[]; // 点价交割方式
  spot_pricing_trader_info?: TraderLite; // 点价方交易员
  spot_pricing_broker_info: User; // 点价方经纪人
  spot_pricing_inst_info?: InstitutionTiny; // 点价方机构
  deal_type: DealType; // 点价方式 tkn/gvn
  spot_pricing_volume?: number; // 点价量
  spot_pricing_price?: number; // 点价价格
  spot_pricing_message_list?: SpotPricingMessage[]; // 点价卡片中的点价信息列表
  return_point?: number; // 返点值
  spot_pricing_quote_list?: SpotPricingQuote[]; // 点价中的报价信息列表
  receiver_side: ReceiverSide; // 点价身份，1是点价方，2是被点价方
  unmatch_volume?: number; // 未匹配量
  bond_basic_info?: FiccBondBasic; // 债券信息
};

export type IdcDealDetail = {
  deal_list?: SpotPricing[]; // 成交信息
  spot_pricing_record?: SpotPricingRecord; // 点价信息（线下成交没有）
};

export type SpotPricingQuote = {
  quote_id?: string;
  spot_pricing_failed_reason: SpotPricingFailedReason;
  flag_stock_exchange?: boolean;
  is_exercise?: boolean;
  flag_indivisible?: boolean;
  flag_star?: number;
  flag_package?: boolean;
  flag_oco?: boolean;
  flag_exchange?: boolean;
  flag_internal?: boolean;
  comment?: string;
  quote_liquidation_speed_list?: LiquidationSpeed[]; // 报价交割
  flag_urgent?: boolean; // 是否为紧急报价
  flag_request?: boolean; // 是否请求报价
  flag_bilateral?: boolean; // 是否双边
  flag_rebate?: boolean; // 返点标记
  quote_volume: number; // 报价量
  yield?: number; // 收益率
  full_price?: number; // 全价
  spread?: number; // 利差
  quote_type: BondQuoteType; // 报价类型
  return_point?: number; // 返点
  trader_tag?: string; // 交易员标签
  price?: number; // 价格-用户输入价格
  exercise_manual?: boolean; // 是否手动操作行权到期
};

export type DealOperationLogV2 = {
  log_id: string; // 日志ID
  deal_id: string; // 成交ID
  operator: UserLite; // 操作者
  operation_type: DealOperationType; // 操作类型
  create_time: string; // 操作时间
  before_deal_snapshot?: BondDealLog; // 成交快照
  after_deal_snapshot?: BondDealLog; // 成交快照
  operation_source?: OperationSource; // 来源
  update_types?: DealRecordUpdateType[]; // 后端计算的更新类型，前端暂未使用，后端只用于筛选
};

export type DealDetailOperationLog = {
  log_id: string; // 日志ID
  deal_id: string; // 成交ID
  operator: UserLite; // 操作者
  operation_type: DealOperationType; // 操作类型
  create_time: string; // 操作时间
  before_deal_snapshot?: DealDetailLog; // 成交快照
  after_deal_snapshot?: DealDetailLog; // 成交快照
  operation_source: OperationSource; // 来源
  update_types?: DealDetailUpdateType[]; // 更新类型
};

export type DealDetailOperationLogUpdate = {
  update_type: DealDetailUpdateType; // 更新类型
  before: string; // 更新前内容
  after: string; // 更新后内容
};

export type BondDealLog = {
  snapshot?: BondDeal; // 修改前成交快照
  be_clone_internal_code?: string[]; // 被克隆成交单id列表
  stagger_date?: number; // 错期
  details?: DealDetailLogChild[]; // 子成交单信息
  flag_bid_pay_for_inst?: boolean;
  flag_ofr_pay_for_inst?: boolean;
};

export type DealDetailLog = {
  deal_id: string; // 成交单Id
  bid_send_order_msg?: string; // bid发单信息
  ofr_send_order_msg?: string; // ofr发单信息
  details?: DealDetailLogChild[]; // 子成交单
  flag_bid_pay_for_inst?: boolean; // bid方向是否被代付
  flag_ofr_pay_for_inst?: boolean; // ofr方向是否被代付
};

export type DealDetailLogChild = {
  child_deal_id: string;
  bid_inst_id: string;
  bid_trader_id: string;
  bid_inst_snapshot?: InstitutionTiny;
  bid_trader_snapshot?: Trader;
  ofr_inst_id: string;
  ofr_trader_id: string;
  ofr_inst_snapshot?: InstitutionTiny;
  ofr_trader_snapshot?: Trader;
  bridge_direction?: TradeDirection;
  send_msg?: string;
  bridge_channel?: BridgeChannel;
  fee?: number;
  send_order_comment?: string;
  flag_hide_comment?: boolean;
  send_order_inst_info?: SendOrderInst[];
  bridge_comment?: string;
  bid_flag_bridge?: boolean; // bid方向机构是否为桥机构
  ofr_flag_bridge?: boolean; // ofr方向机构是否为桥机构
  bid_trader_tag?: string; // bid方交易员标签
  ofr_trader_tag?: string; // ofr方交易员标签
};

export type MarketClosingTime = {
  start: number; // 开始时间距离0点的时间：单位毫秒
  end: number; // 结束时间距离0点的时间：单位毫秒
};

export type DealUnreadNotifyDetail = {
  deal_notify_info: DealNotify; // 提示通知
  idc_deal_detail: IdcDealDetail; // 成交详情
};

export type DealNotify = {
  notify_id: string; // 提示弹窗ID
  create_time: string; // 创建时间
  receiver_side: ReceiverSide; // 接收身份，1是点价方，2是被点价方
  NotifyType: NotifyType; // 线下提示 or 点价提示
};

export type DataFeed = {
  sync_data_type: SyncDataType;
  trader_list?: TraderSync[];
  inst_list?: InstSync[];
  user_list?: UserSync[];
  quote_list?: QuoteSync[];
  bond_basic_list?: BondBasicSync[];
  bond_appendix_list?: BondAppendixSync[];
  quote_draft_message_list?: QuoteDraftMessageSync[];
  quote_draft_detail_list?: QuoteDraftDetailSync[];
  deal_info_list?: DealInfoSync[];
  bond_detail_list?: BondDetailSync[];
};

export type DataFeedCompressed = {
  sync_data_type: SyncDataType;
  data: string;
};

export type QuoteDraftMessageConfirm = {
  message_id: string;
  inst_id: string;
  trader_id: string;
  broker_id: string;
  trader_tag: string;
};

export type QuoteDraftDetailConfirm = {
  detail_id: string;
  message_id: string;
  corresponding_line: number;
  side: Side;
  key_market: string;
  quote_type: BondQuoteType;
  price: number;
  volume: number;
  return_point: number;
  flag_rebate: boolean;
  flag_star: number;
  flag_package: boolean;
  flag_oco: boolean;
  flag_exchange: boolean;
  flag_intention: boolean;
  flag_indivisible: boolean;
  flag_stock_exchange: boolean;
  flag_bilateral: boolean;
  flag_request: boolean;
  flag_urgent: boolean;
  flag_internal: boolean;
  flag_recommend: boolean;
  liquidation_speed_list?: LiquidationSpeed[];
  comment: string;
  is_exercise: boolean;
  exercise_manual: boolean;
  status: QuoteDraftDetailStatus; // 目标状态，不能为pending或ignore
  former_detail_id?: string; // 新增时需要传入，由哪条详情新增就传入哪条的ID，在空行新增置空，如果同一批有此字段相同的新增详情则按传入的顺序依次排列
  flag_inverted: boolean;
};

export type QuoteDraftDetailUpsert = {
  detail_id?: string; // 新增时不传入
  message_id?: string; // 仅新增时传入
  corresponding_line?: number; // 仅新增时传入
  side?: Side;
  key_market?: string;
  quote_type?: BondQuoteType;
  product_type?: ProductType;
  price?: number;
  volume?: number;
  return_point?: number;
  flag_rebate?: boolean;
  flag_star?: number;
  flag_package?: boolean;
  flag_oco?: boolean;
  flag_exchange?: boolean;
  flag_intention?: boolean;
  flag_indivisible?: boolean;
  flag_stock_exchange?: boolean;
  flag_bilateral?: boolean;
  flag_request?: boolean;
  flag_urgent?: boolean;
  flag_internal?: boolean;
  flag_recommend?: boolean;
  liquidation_speed_list?: LiquidationSpeed[];
  comment?: string;
  is_exercise?: boolean;
  exercise_manual?: boolean;
  status?: QuoteDraftDetailStatus;
  former_detail_id?: string; // 仅新增时需要传入，由哪条详情新增就传入哪条的ID，在空行新增置空，如果同一批有此字段相同的新增详情则按传入的顺序依次排列
  flag_inverted?: boolean; // 倒挂由前端传入
};

export type BondDeal = {
  // ------- 成交基础条件 -------
  deal_id: string; // 成交单Id
  internal_code: string; // 内码
  create_time: string; // 创建时间
  update_time: string;
  deal_type: DealType; // 成交类型
  source: OperationSource; // 来源
  flag_bridge: boolean; // 过桥标识
  send_order_msg?: string; // 发单信息
  bid_send_order_msg?: string; // bid发单信息
  ofr_send_order_msg?: string; // ofr发单信息
  /** @deprecated */
  bond_info?: BondLite; // 债券详情 using bond_basic_info instead
  confirm_volume: number; // 成交量
  price_type?: BondQuoteType; // 成交价格种类
  price?: number; // 成交价
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  return_point?: number; // 返点数值; 比如返0.12
  bid_settlement_type?: LiquidationSpeed[]; // bid结算方式
  bid_traded_date?: string; // 交易日，毫秒时间戳
  bid_delivery_date?: string; // 交割日，毫秒时间戳
  ofr_settlement_type?: LiquidationSpeed[]; // ofr结算方式
  ofr_traded_date?: string; // 交易日，毫秒时间戳
  ofr_delivery_date?: string; // 交割日，毫秒时间戳
  flag_exchange?: boolean; // 交易所
  exercise_type?: ExerciseType; // 0：默认，1.行权；2.到期
  deal_status?: BondDealStatus; // 成交状态
  spot_pricinger?: Counterparty; // 点价方
  spot_pricingee?: Counterparty; // 被点价方
  /** @deprecated */
  spot_pricing_record_id?: string; // 点价记录ID
  flag_internal?: boolean; // 是否暗盘
  operator?: UserLite; // 操作人
  /** @deprecated */
  listed_market?: ListedMarket; // 发行市场，CIB为银行间，SSH为上交所，SZE为深交所
  /** @deprecated */
  bid_bridge_operator?: UserLite; // bid方过桥操作人
  /** @deprecated */
  ofr_bridge_operator?: UserLite; // ofr方过桥操作人
  im_msg_text?: string; // 自动发送的im消息
  im_msg_send_status?: ImMsgSendStatus; // im发送消息状态
  /** @deprecated */
  im_msg_record_id?: string;
  quote_id?: string; // 报价id (线下成交没有)
  spot_pricing_volume?: number; // 点价匹配量
  /** @deprecated */
  bid_old_content?: OldContent; // bid方的最后一次修改前的内容
  /** @deprecated */
  ofr_old_content?: OldContent; // ofr方的最后一次修改前的内容
  /** @deprecated */
  bid_deal_read_status?: DealReadStatus;
  /** @deprecated */
  ofr_deal_read_status?: DealReadStatus;
  exercise_manual?: boolean; // 是否手动操作行权到期
  bond_basic_info?: FiccBondBasic; // 债券信息
  /** @deprecated */
  hand_over_status?: DealHandOverStatus; // 1:可以移交 2:不能移交(成交单删除) 3:已移交
  clone_source_internal_code?: string; // 克隆源内码（只在操作日志中展示）
};

// 交易方
export type Counterparty = {
  inst?: InstitutionTiny; // 机构
  trader?: TraderLite; // 交易员
  broker?: User; // 经纪人
  flag_modify_brokerage?: boolean; // 调整佣金标识 1:调佣 0:不调
  modify_brokerage_reason?: string; // 调整佣金标识
  confirm_status?: BondDealStatus; // 确认状态
  brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 调整佣金标识枚举
  broker_b?: User;
  broker_c?: User;
  broker_d?: User;
};

export type BridgeInstInfo = {
  bridge_inst_id: string;
  contact_inst: InstitutionTiny; // 联系人机构
  contact_trader: TraderLite; // 联系人
  bill_inst: InstitutionTiny; // 计费人机构
  bill_trader: TraderLite; // 计费人
  send_msg: string;
  channel: BridgeChannel;
  comment: string;
  contact: string; // 联系方式
  bridge_status: number;
  create_time: string;
  update_time: string;
  receipt_deal_count?: number; // 界面展示——关联的成交单数量
  is_valid: boolean; // CRM数据是否合法
};

export type DealBridge = {
  bridge_record: Bridge; // 过桥记录
  deal_detail: BondDeal; // 成交详情
};

export type Bridge = {
  bridge_record_id: string; // 过桥记录ID
  deal_id: string; // 成交单ID
  bridge_inst_id: string; // 桥机构ID
  other_bridge_inst_id?: string; // 双桥中的另外一个桥，若为空，则为单桥
  bridge_side: number; // 桥的方向 0:没有（默认）； 1:为O(ofr)  2: 为B（bid）3：ofr编辑中 4:bid-编辑中
  status: number; // 1:正常 0：删除
  bridge_tag_form: BridgeTagForm; // 过桥标签页
  flag_double_bridge?: boolean; // 是否双桥
  serial_number: number; // 序号
};

export type BridgeTagForm = {
  bridge_code: string;
  ofr_bridge_detail: BridgeDetailV2; // ofr方桥信息
  bid_bridge_detail: BridgeDetailV2;
  double_bridge_detail?: DoubleBridgeDetail; // 双桥详情
};

export type BridgeDetailV2 = {
  bridge_inst_id: string;
  contact_inst: InstitutionTiny; // 联系人机构
  contact_trader: TraderLite; // 联系人
  bill_inst?: InstitutionTiny; // 计费人机构
  bill_trader?: TraderLite; // 计费人
  contact?: string; // 联系方式
  deal_inst?: InstitutionTiny; // 交易方机构
  deal_trader?: TraderLite; // 交易方-交易员
  bridge_direction: TradeDirection; // 桥方向
  send_msg?: string; // 发给
  channel: BridgeChannel; // 渠道
  send_order_comment?: string; // 发单备注 - 备注ofr | 备注bid
  cost?: number; // 费用
  special_brokerage?: number; // 特别佣金
  liquidation_speed_list?: LiquidationSpeed[]; // 结算方式
  flag_hide_comment: boolean; // 是否隐藏备注
  send_order_info?: SendOrderInfo[]; // 发单机构 & 量
  bridge_comment?: string; // 桥备注
};

export type SpotPricingDetail = {
  deal_list?: BondDeal[]; // 成交信息
  spot_pricing_record?: SpotPricingRecord; // 点价信息（线下成交没有）
};

export type DealUnreadNotify = {
  deal_notify_info: DealNotify; // 提示通知
  spot_pricing_detail: SpotPricingDetail; // 成交详情
};

export type OppositePriceNotification = {
  opposite_price_notification_id: string; // 对价提醒id
  bond_key_market: string; // 债券keyMarket
  broker_id: string; // 被提醒经纪人id
  quote_id: string; // 被提醒报价id
  trader_id: string; // 交易员id
  inst_name: string; // 机构名称
  trader_name: string; // 交易员名称
  quote_side: Side; // 报价方向
  quote_price?: number; // 报价价格
  quote_type: BondQuoteType; // 报价类型
  flag_rebate: boolean; // 返点标记
  flag_intention?: boolean; // 意向价
  flag_internal?: boolean; // 明暗盘
  flag_urgent?: boolean; // 是否紧急
  flag_exchange?: boolean; // 是否换价
  flag_star?: number; // 无星、单星、双星
  flag_oco?: boolean; // OCO
  flag_package?: boolean; // 打包
  flag_recommend?: boolean; // 推荐
  flag_indivisible?: boolean; // 整量
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  comment?: string; // 备注
  return_point?: number; // 返点值
  volume?: number; // 量
  liquidation_speed?: LiquidationSpeed[]; // 清算速度
  notification_msg: string; // 提醒话术(不包括颜色)
  is_read: boolean; // 未读/已读状态
  send_status: ImMsgSendStatus; // 发送状态
  send_failed_reason?: string; // 发送失败具体原因
  update_time: string; // 更新时间-时间戳
  notify_color: OppositePriceNotifyColor; // 提醒颜色
  trader_tag?: string; // 交易员标签
  inst_id: string; // 机构id
  enable?: Enable; // 是否有效
  notify_logic_ids?: string[]; // 逻辑IDs
  clean_price?: number; // 净价
  notification_content?: NotificationContent[]; // 提醒逻辑
  product_type?: ProductType; // 台子
};

export type NotificationContent = {
  notify_logic_type: OppositePriceNotifyLogicType; // 模版逻辑类型
  notify_logic_id: string; // 逻辑ID
  notification_msg: string; // 逻辑话术
  price_msg: string; // 价格话术 发送话术 = 价格话术 + 逻辑话术
  notify_logic_name: string; // 逻辑名称
};

// 对价提醒设置
export type OppositePriceNotificationSetting = {
  broker_id: string; // 经纪人id
  notify_logic?: OppositePriceNotifyLogic[]; // 提醒逻辑
  msg_fill_type: OppositePriceNotifyMsgFillType; // 发送话术填充设置
  bond_filter_logic: OppositePriceBondFilter; // 债券组逻辑
  flag_valuation_for_cp_handicap: boolean; // 复制最优盘口_含估值
  flag_issue_amount_for_cp_handicap: boolean; // 复制最优盘口_含发行量
  flag_maturity_date_for_cp_handicap: boolean; // 复制最优盘口_含到期日
  merge_msg_for_batch: boolean; // 批量发送合并话术
  display_limit: number;
};

// 对价提醒逻辑
export type OppositePriceNotifyLogic = {
  notify_logic_type: OppositePriceNotifyLogicType; // 模版逻辑类型
  n_value?: number; // n值
  color: OppositePriceNotifyColor; // 颜色
  turn_on: boolean; // 是否开启
  msg_template: string; // 话术模版
  copied: boolean; // 是否是复制产生的
  notify_logic_name: string; // 模版名称
  notify_logic_id: string; // 逻辑ID
};

// 对价提醒债券组
export type OppositePriceBondFilter = {
  bond_category_list?: BondCategory[]; // 债券类型，即超短融、短融、中票、企业债等
  listed_market_list?: ListedMarket[]; // 市场类型，上交所、深交所、银行间
  remain_days_list?: RangeInteger[]; // 剩余期限
  bond_shortname_list?: BondShortName[]; // 国开、口发、农发
  fr_type_list?: FRType[]; // 浮息债类型 （Shibor、LPR、Depo、固息、DR）
  maturity_is_holiday?: boolean; // 工作日、节假日
  bond_nature_list?: BondNature[]; // 一般债、专项债
};

export type SendQQMsgWs = {
  msg_list?: SendQQMsgWsItem[];
};

export type SendQQMsgWsItem = {
  msg_id: string;
  send_qq: string;
  recv_qq: string;
  msg: string;
  create_time: string;
};

export type QuoteDraftFailed = {
  index: number;
  failed_type: QuoteRelatedInfoFailedType;
};

export type ReceiptDealDetail = {
  parent_deal: ReceiptDeal; // 父级结构，假如A->B->C的成交的话，此处实际展示A->C的信息
  details?: ReceiptDeal[]; // 实际成交单，如A->B和B->C，由于债券一致，子结构内债券不传值
  diff_settlement_type?: number; // 错期 1:bid 2:ofr
  pending_side?: number; // 桥待定方向
  deal_confirm_snapshot?: DealConfirmSnapshot;
  default_bridge_config?: DefaultBridgeConfig;
  flag_bridge?: boolean;
};

export type DefaultBridgeConfig = {
  bid_bridge_direction?: TradeDirection;
  ofr_bridge_direction?: TradeDirection;
  bid_bridge_channel?: BridgeChannel;
  ofr_bridge_channel?: BridgeChannel;
};

export type DeliveryInfo = {
  traded_date: string;
  delivery_date: string;
};

export type DealConfirmTradeInfo = {
  broker_id?: string;
  broker_name?: string;
  broker_id_b?: string;
  broker_name_b?: string;
  broker_id_c?: string;
  broker_name_c?: string;
  broker_id_d?: string;
  broker_name_d?: string;
  trader_id?: string;
  trader_name?: string;
  inst_id?: string;
  inst_name?: string;
  send_order_info: string;
};

export type DealConfirmSnapshot = {
  bid_deal_confirm_trade_info: DealConfirmTradeInfo;
  ofr_deal_confirm_trade_info: DealConfirmTradeInfo;
  bond_key_market: string;
  price: number;
  confirm_volume: number;
  return_point?: number;
  delivery_info_list?: DeliveryInfo[];
  flag_bridge: boolean;
  bid_delivery_info: DeliveryInfo;
  ofr_delivery_info: DeliveryInfo;
};

export type ReceiptDealApproval = {
  parent_deal_id: string;
  bridge_code?: string;
  bid_inst?: InstitutionTiny;
  bid_trader?: Trader;
  ofr_inst?: InstitutionTiny;
  ofr_trader?: Trader;
  deal_list?: ReceiptDeal[];
};

// 读的结构体
export type ReceiptDeal = {
  bond_basic_info: FiccBondBasic; // 债券信息
  receipt_deal_id: string;
  parent_deal_id?: string; // 拆单父成交单ID相同
  bridge_index?: number; // 桥拆单&关联的序号1,2,3
  receipt_deal_status: ReceiptDealStatus; // 成交单状态
  flag_bid_broker_confirmed: boolean;
  bid_broker_confirmed_time?: string; // 毫秒时间戳
  flag_ofr_broker_confirmed: boolean;
  ofr_broker_confirmed_time?: string; // 毫秒时间戳
  create_time: string;
  update_time: string;
  direction: Direction;
  seq_number?: string;
  order_no?: string;
  internal_code?: string;
  bridge_code?: string;
  deal_time?: string;
  deal_market_type?: DealMarketType; // 成交市场
  flag_internal: boolean; // 内部
  flag_send_market: boolean; // 发市场
  flag_urgent: boolean; // 加急
  price?: number;
  yield?: number; // 收益率
  clean_price?: number; // 净价
  full_price?: number; // 全价
  volume?: number; // 交易量
  spread?: number; // 利差
  return_point?: number; // 返点数值
  settlement_amount?: number; // 结算金额
  settlement_mode: SettlementMode; // 结算金额
  flag_rebate: boolean;
  is_exercise: ExerciseType; // 行权/到期
  liquidation_speed_list?: LiquidationSpeed[]; // 结算方式
  traded_date: string; // 交易日，毫秒时间戳
  delivery_date: string; // 交割日，毫秒时间戳
  bid_trade_info: ReceiptDealTrade; // bid 交易方
  ofr_trade_info: ReceiptDealTrade; // ofr 交易方
  other_detail: string; // 其他细节
  backend_msg: string; // 后台信息
  backend_feed_back: string; // 后台反馈
  operator?: User; // 操作者
  price_type: BondQuoteType; // 价格类型
  flag_need_bridge?: boolean; // 点亮需要加桥标识
  destroy_reason?: string; // 毁单原因
  source?: OperationSource; // 来源
  all_approver_id_list?: string[]; // 各个阶段审批人
  matched_advanced_rule_id_list?: string[]; // 匹配的高级规则
  disapproval_snapshot?: ReceiptDeal; // 审批未通过时的快照
  advanced_approval_type?: AdvancedApprovalType[]; // 匹配的高级规则类型
  cur_approval_role?: string; // 当前审批角色
  cur_role_is_normal?: boolean; // 当前审批角色是否为普通审批角色
  advanced_role_num?: number; // 高级审批的角色数量
  disapproval_reason?: string; // 审批不通过原因
  sync_version?: string; // 数据变更时间
  all_approval_role_list?: string[]; // 各个阶段审批角色
  sub_rule_name_list?: string[]; // 匹配的高级规则子规则名称
  bid_send_order_info?: string; // bid发单信息
  ofr_send_order_info?: string; // ofr发单信息
  flag_stock_exchange?: boolean; // 备注——交易所标识
  add_bridge_operator?: User; // 加桥操作人
  print_operator_list?: User[]; // 所有打印人的信息：只给name和id赋值
  flag_history_pass?: boolean; // 历史是否有通过
  generate_data_source?: number; // 数据来源 1为点价，2为成交单录入，3为克隆
  bid_real_receipt_deal_id?: string; // bid方真实成交单ID
  ofr_real_receipt_deal_id?: string; // ofr方真实成交单ID
  channel?: BridgeChannel; // 渠道，例如固收、大宗、请求等
  send_msg?: string; // 发给
  send_msg_comment?: string; // 发单备注
  hide_comment?: boolean; // 隐藏备注
  fee?: number; // 费用
  send_order_inst_list?: SendOrderInst[]; // 发单机构&费用
  bid_biller_id?: string; // bid计费人id
  ofr_biller_id?: string; // ofr计费人id
  bid_biller_tag?: string; // bid计费人标签
  ofr_biller_tag?: string; // bid计费人标签
  bid_biller_name?: string; // bid计费人名字
  ofr_biller_name?: string; // ofr计费人名字
  bridge_comment?: string; // 桥备注
  bid_contact?: string; // 联系方式
  ofr_contact?: string; // 联系方式
  bridge_direction?: TradeDirection; // 桥指向
  flag_bridge_info_changed?: boolean; // 桥消息是否变更
  flag_change_after_sor_execution?: boolean; // 山西证券外发单开始处理后，在OMS仍做成交要素修改，则修改此标识为1；默认为2
  deal_sor_send_status?: DealSorSendStatus; // 成交单山西证券外发状态，没有外发默认为0
  yield_to_execution?: number; // 行权收益率
  flag_urge?: boolean; // 是否催单
  urge_time?: string; // 催单时间
};

// 读结构
export type ReceiptDealTrade = {
  inst?: InstitutionTiny;
  city?: string;
  trader?: Trader;
  brokerage?: string; // 佣金
  brokerage_type?: BrokerageType; // 佣金类型
  trade_mode?: TradeMode; // 交易模式
  broker?: User; // broker
  broker_b?: User;
  broker_c?: User;
  broker_d?: User;
  broker_percent?: number; // 比例
  broker_percent_b?: number;
  broker_percent_c?: number;
  broker_percent_d?: number;
  flag_bridge?: boolean; // 是否是桥
  flag_nc?: boolean; // NC 按钮
  nc?: string; // NC 内容
  pay_for_info?: ReceiptDealPayFor; // 代付
  inst_brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 机构佣金备注
  inst_special?: string; // 机构特殊细节
  flag_in_bridge_inst_list?: boolean; // 是否在桥机构列表里
  trader_tag?: string; // 交易员tag
  flag_pay_for_inst?: boolean; // 是否代付
};

export type ReceiptDealDetailBridge = {
  bridge_bid_channel?: BridgeChannel; // bid方向桥渠道，例如固收、大宗、请求等
  bridge_ofr_channel?: BridgeChannel; // ofr方向桥渠道，例如固收、大宗、请求等
  bid_send_msg?: string; // bid发给
  ofr_send_msg?: string; // ofr发给
  bid_send_msg_comment?: string; // bid发单备注
  ofr_send_msg_comment?: string; // ofr发单备注
  bid_hide_comment?: boolean; // bid隐藏备注
  ofr_hide_comment?: boolean; // ofr隐藏备注
  bid_send_order_inst_list?: SendOrderInst[]; // bid发单机构&费用
  ofr_send_order_inst_list?: SendOrderInst[]; // ofr发单机构&费用
  bid_send_settlement_type?: LiquidationSpeed[]; // bid发单结算方式
  ofr_send_settlement_type?: LiquidationSpeed[]; // ofr发单结算方式
  bid_biller_id?: string; // bid计费人id
  ofr_biller_id?: string; // ofr计费人id
  bid_bridge_comment?: string; // bid桥备注
  ofr_bridge_comment?: string; // ofr桥备注
  double_bridge_send_msg?: string; // 双桥发给信息
  bid_biller_tag?: string; // bid计费人标签
  ofr_biller_tag?: string; // bid计费人标签
  bid_contact?: string; // bid联系方式
  ofr_contact?: string; // ofr联系方式
  double_bridge_pay?: number; // 双桥费用
  double_bridge_send_comment?: string; // 双桥发给备注
  double_bridge_send_channel?: BridgeChannel; // 双桥发送渠道
  bid_bridge_direction?: TradeDirection; // bid方向上的指向
  ofr_bridge_direction?: TradeDirection; // ofr方向上的桥指向
  double_bridge_direction?: TradeDirection; // 双桥指向
  flag_double_bridge_is_pending?: boolean; // 双桥是否待定
  stagger_date?: number; // 错期 1:bid 2:ofr
  bid_contact_id?: string; // bid加桥联系人id
  bid_contact_tag?: string; // bid加桥联系人标签
  ofr_contact_id?: string; // ofr加桥联系人
  ofr_contact_tag?: string; // ofr加桥联系人标签
  bid_contact_name?: string; // bid加桥联系人名字
  ofr_contact_name?: string; // ofr加桥联系人名字
  bid_biller_name?: string; // bid加桥计费人名字
  ofr_biller_name?: string; // ofr加桥计费人名字
  bid_send_pay?: number; // bid发单费用
  ofr_send_pay?: number; // ofr发单费用
  pending_side?: number; // 待定方向
  flag_bid_bridge_info_changed?: boolean; // Bid桥消息是否变更
  flag_ofr_bridge_info_changed?: boolean; // Ofr桥消息是否变更
};

// 写结构WStruct => write struct
export type ReceiptDealTradeOp = {
  inst_id?: string;
  city?: string;
  trader_id?: string;
  trader_tag?: string;
  brokerage?: string;
  brokerage_type?: BrokerageType;
  trade_mode?: TradeMode;
  broker_id?: string;
  broker_id_b?: string;
  broker_id_c?: string;
  broker_id_d?: string;
  broker_percent?: number;
  broker_percent_b?: number;
  broker_percent_c?: number;
  broker_percent_d?: number;
  flag_bridge: boolean;
  flag_nc: boolean;
  nc?: string;
  pay_for_info?: ReceiptDealPayForOp;
  inst_brokerage_comment?: ReceiptDealTradeInstBrokerageComment; // 机构佣金备注
  inst_special?: string; // 机构特殊细节
  flag_pay_for_inst?: boolean; // 代付机构标识
  traded_date?: string; // 交易日，毫秒时间戳
  delivery_date?: string; // 交割日，毫秒时间戳
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
};

export type SendOrderInst = {
  inst: InstitutionTiny;
  volume: number;
};

// ReceiptDealPayForStruct
// 读结构
export type ReceiptDealPayFor = {
  flag_pay_for: boolean; // 是否代付
  pay_for_inst?: InstitutionTiny; // 代付机构
  pay_for_city?: string; // 代付机构城市
  pay_for_trader?: Trader; // 代付交易员
  flag_pay_for_nc?: boolean; // 代付NC按钮
  pay_for_nc?: string; // 代付NC内容
};

// 写结构
export type ReceiptDealPayForOp = {
  flag_pay_for?: boolean;
  pay_for_inst_id?: string;
  pay_for_city?: string;
  pay_for_trader_id?: string;
  pay_for_trader_tag?: string;
  flag_pay_for_nc?: boolean;
  pay_for_nc?: string;
};

// ReceiptDealBridgeStruct
// 读结构
export type ReceiptDealBridge = {
  inst?: InstitutionTiny;
  city?: string;
  trader?: Trader;
  broker?: User;
};

// 写结构
export type ReceiptDealBridgeOp = {
  inst_id: string;
  city?: string;
  trader_id: string;
  trader_tag?: string;
  broker_id: string;
};

export type ReceiptDealOperationLog = {
  log_id: string; // 日志ID
  deal_id: string; // 成交ID
  operator?: User; // 操作者
  operation_type: ReceiptDealOperationType; // 操作类型
  before_receipt_deal_snapshot?: ReceiptDeal; // 修改之前的成交单快照
  after_receipt_deal_snapshot?: ReceiptDeal; // 修改之后的成交单快照
  update_types?: ReceiptDealUpdateTypeItem[]; // 更新的字段枚举列表
  create_time: string; // 操作时间
  operation_source: OperationSource; // 操作类型
  code_market?: string; // 债券标识
  key_market?: string; // 债券唯一标识
};

export type ReceiptDealUpdateTypeItem = {
  update_type: ReceiptDealUpdateType; // 更新字段
  update_field_comment?: string; // 更新字段的备注
};

export type DealOperationInfo = {
  operator: string; // 操作者id
  operation_type: DealOperationType; // 操作类型
  operation_source: OperationSource; // 操作源
};

export type ReceiptDealApprovalRole = {
  approval_role_id: string; // 角色id
  approval_role_name: string; // 角色名称
  approval_role_level: number; // 角色级别
  role_member_list?: ReceiptDealRoleMember[]; // 角色成员列表
  product_type: ProductType; // 产品类型，英文简写
};

export type ReceiptDealRoleMember = {
  member_id: string; // 成员id
  member_name: string; // 成员名称
  flag_valid?: boolean; // 是否有效
};

export type ReceiptDealApprovalRule = {
  approval_rule_id: string;
  rule_type: ReceiptDealRuleType;
  is_active: boolean; // 是否启用
  rule_name: string;
  rule_subtype?: ReceiptDealRuleSubtype[];
  rule_subtype_name?: string;
  advanced_role_list?: ReceiptDealApprovalRole[]; // 高级审批角色
  normal_role_list?: ReceiptDealApprovalRole[]; // 普通审批角色
  product_type: ProductType; // 产品类型，英文简写
};

export type TableRelatedDealApprovalFilter = {
  receipt_deal_order_no?: string; // 订单号 order_no,
  bridge_code?: string;
  trader_id?: string;
  trader_side?: Side;
  inst_id?: string;
  inst_is_bridge_inst?: boolean;
  inst_side?: Side;
  bond_key?: string;
  deal_price?: number;
  volume?: number; // 券面总额，单位万
  inst_user_input?: string; // 机构框——用户输入
  trader_user_input?: string; // 交易员框——用户输入
};

export type ReceiptDealOperateIllegal = {
  internal_code_list?: string[]; // 内码列表
  bridge_code_list?: string[]; // 过桥码列表
  check_bridge: CheckBridge; // 桥校验
  order_no_list?: string[]; // 订单号列表
  seq_no_list?: string[]; // 序列号列表
};

export type InstWithTradersMinimal = {
  inst_id: string;
  inst_name: string;
  traders?: TraderMinimal[];
  biz_short_name?: string;
};

export type TraderMinimal = {
  trader_id: string;
  trader_name: string;
};

export type LocalServerWsClientMessage = {
  msg_type: LocalServerWsMsgType;
  trace_parent: string;
  // pong
  alive_request_id_list?: string[]; // 当前需要关心的请求id列表
  // request
  request_id?: string;
  interval?: number;
  request_type?: LocalServerRequestType;
  scene?: LocalServerRealtimeScene;
  request_params?: string;
};

export type LocalServerWsServerMessage = {
  msg_type: LocalServerWsMsgType;
  base_response?: BaseResponse;
  // ping
  data_is_ready?: boolean; // local server数据是否准备好
  net_is_ready?: boolean; // local server网络是否正常
  // response
  request_id?: string;
  response_data?: string;
};

export type ApprovalSortingMethod = {
  sorted_field: ApprovalSortedField; // 排序字段名
  is_desc: boolean; // 是否倒序
};

export type SendOrderInstInfo = {
  inst_id: string; // 发单机构id
  volume: number; // 发单量
};

export type DealRecord = {
  deal_id: string;
  internal_code: string;
  create_time: string;
  update_time: string;
  deal_type: DealType;
  source: OperationSource;
  flag_bridge?: boolean;
  send_order_msg?: string;
  bid_send_order_msg?: string;
  ofr_send_order_msg?: string;
  bond_info?: FiccBondBasic;
  confirm_volume?: number;
  price_type?: BondQuoteType;
  price?: number;
  yield?: number;
  clean_price?: number;
  full_price?: number;
  return_point?: number;
  bid_settlement_type?: LiquidationSpeed[];
  bid_traded_date?: string;
  bid_delivery_date?: string;
  ofr_settlement_type?: LiquidationSpeed[];
  ofr_traded_date?: string;
  ofr_delivery_date?: string;
  bid_bridge_record_id?: string;
  ofr_bridge_record_id?: string;
  flag_exchange?: boolean;
  exercise_type?: ExerciseType;
  deal_status?: BondDealStatus;
  spot_pricinger?: Counterparty;
  spot_pricingee?: Counterparty;
  spot_pricing_record_id?: string;
  flag_internal?: boolean;
  operator?: User;
  listed_market?: ListedMarket;
  im_msg_text?: string;
  im_msg_send_status?: ImMsgSendStatus;
  im_msg_record_id?: string;
  quote_id?: string;
  spot_pricing_volume?: number;
  remain_volume?: number;
  bid_old_content?: OldContent;
  ofr_old_content?: OldContent;
  bid_deal_read_status?: DealReadStatus;
  ofr_deal_read_status?: DealReadStatus;
  exercise_manual?: boolean;
  hand_over_status?: DealHandOverStatus;
  flag_reverse_sync?: boolean;
  flag_unrefer_quote?: boolean;
  flag_deal_has_changed?: boolean;
  bid_add_bridge_operator?: User;
  ofr_add_bridge_operator?: User;
  bridge_list?: BridgeInfo[]; // 桥信息 顺序bid单->ofr单
  flag_bid_pay_for_inst?: boolean; // bid方向代付标识是否点亮，无桥点亮=给对方代付，有桥点亮=被代付
  flag_ofr_pay_for_inst?: boolean; // ofr方向代付标识是否点亮，无桥点亮=给对方代付，有桥点亮=被代付
  confirm_time?: string; // 双方确认时间
  default_bridge_config?: DefaultBridgeConfig;
  child_deal_list?: ChildDealInfo[];
};

export type BridgeInfo = {
  user?: User;
  trader: TraderLite;
  trader_tag?: string;
  inst: InstitutionTiny;
};

export type NCDPInfo = {
  ncdp_id: string;
  inst_id: string;
  inst_name: string;
  issuer_code: string; // 绑定的发行人
  issuer_rating_current: Rating; // 发行人最新评级
  maturity_date: MaturityDateType; // 期限
  fr_type: FRType; // 浮动利率类型
  price: number; // 价格
  price_changed?: number; // 价格变动，默认值为0
  volume?: number; // 交易量
  issuer_date?: string; // 发行日,毫秒级时间戳
  issuer_type?: IssuerDateType; // 发行日级别
  comment?: string; // 备注
  flag_internal?: boolean; // 内部
  flag_brokerage?: boolean; // 佣金
  flag_full?: boolean; // 询满
  operator: string; // 操作人id
  operator_name?: string; // 操作人名称
  update_time?: string; // 毫秒级时间戳
  issuer_bank_type?: string; // 发行人银行类别
  inst_standard_code?: string; // 机构代码
  inst_full_name?: string; // 机构全称
};

export type NCDPInfoLite = {
  ncdp_id?: string;
  inst_id: string;
  issuer_rating_current: Rating; // 发行人最新评级
  maturity_date: MaturityDateType; // 期限
  fr_type: FRType; // 浮动利率类型
  price: number; // 价格
  price_changed?: number; // 价格变动，默认值为0
  volume?: number; // 交易量
  issuer_date?: string; // 发行日,毫秒级时间戳
  issuer_type?: IssuerDateType; // 发行日级别
  comment?: string; // 备注
  flag_internal?: boolean; // 内部
  flag_brokerage?: boolean; // 佣金
  flag_full?: boolean; // 询满
  line: number; // 录入行号
};

export type NCDPInfoLiteUpdate = {
  ncdp_id: string;
  inst_id?: string;
  issuer_rating_current?: Rating; // 发行人最新评级
  maturity_date?: MaturityDateType; // 期限
  fr_type?: FRType; // 浮动利率类型
  price?: number; // 价格
  price_changed?: number; // 价格变动，默认值为0
  volume?: number; // 交易量
  issuer_date?: string; // 发行日,毫秒级时间戳
  issuer_type?: IssuerDateType; // 发行日级别
  comment?: string; // 备注
  flag_internal?: boolean; // 内部
  flag_brokerage?: boolean; // 佣金
  flag_full?: boolean; // 询满
  line: number; // 录入行号
};

export type NCDPOperationInfo = {
  operator: string; // 操作者id
  operation_type: NCDPOperationType; // 操作类型
  operation_source: OperationSource; // 操作源
};

export type NCDPOperationLog = {
  log_id: string;
  ncdp_id: string;
  operator: string; // 操作者
  operation_type: NCDPOperationType; // 操作类型
  ncdp_snapshot: NCDPInfo; // 存单快照
  create_time: string; // 操作时间     // 操作时间
};

export type FilterGroup = {
  group_id?: string; // 分组id
  group_name?: string; // 分组名称
  desc?: string; // 筛选框的详细情况
};

export type NCDPCheck = {
  line: number; // 行数
  error_type: NCDPCheckError;
};

export type FrontendSyncMsg = {
  scene: FrontendSyncMsgScene; // 当前消息场景
  label?: string; // 场景下相应的标识
  data: string; // 数据
  version?: string; // 版本号
};

export type ReceiptDealDeliveryAndTradedDate = {
  delivery_date?: string; // 交割日，毫秒时间戳
  traded_date?: string; // 交易日，毫秒时间戳
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
};

export type Message = {
  message_id: string;
  message_type: MessageType;
  create_time: string;
  flag_read: boolean;
  receiver_id: string;
  detail?: MessageDetail; // 弹窗中展示的信息
  product_type?: ProductType;
  biz_info?: MessageBizInfo; // 类型为催单时该字段是子成交单id
  enable?: Enable;
  update_time?: string;
  source?: MessageSource;
};

export type MessageDetail = {
  sender_name?: string;
  content_values?: string[];
};

export type MessageBizInfo = {
  receipt_deal_id?: string;
};
