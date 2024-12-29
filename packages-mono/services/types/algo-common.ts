import { LiquidationSpeed, RestDayToWorkday } from './bds-common';
import {
  AlgoBondQuoteType,
  AlgoDirection,
  AlgoOperationType,
  AutoQuoteRecognitionType,
  AutoQuoteTrustDegree,
  AutoQuoteType,
  BdsProductType,
  BncBondSortedField,
  BondAssetType,
  BondCategory,
  BondFinancialCategoryType,
  BondGoodsType,
  BondInstType,
  BondIssueDayType,
  BondMarketType,
  BondPeriodType,
  BondPerpetualType,
  BondSubCategory,
  CouponRateType,
  DealType,
  FRType,
  InstRatingType,
  InstStatus,
  InstUsageStatus,
  IsMunicipalType,
  IsPlatformType,
  IssuerRatingType,
  LiquidationSpeedTag,
  MktType,
  MsgType,
  PerpType,
  PostSource,
  QuickChatAlgoOperationType,
  QuickChatScriptAlgoOperationType,
  QuickChatTrustDegree,
  RecommendRuleType,
  RefType,
  RepaymentMethod,
  RoomDetailSyncType,
  Side,
  TimeToMaturityType,
  TimeToMaturityUnit,
  TraderJobStatus,
  TraderUsageStatus,
  TrustDegreeHelper,
  WithWarranterType,
  YieldType
} from './enum';

export type AlgoFiccBond = {
  key_market: string; // 债券的系统唯一标识+发行市场
  bond_key: string; // 债券的系统唯一标识
  bond_code: string; // 债券代码
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  display_code: string; // 展示用的 code market, 在无相同跨市场的债券代码的情况下省略 .IB 后缀
  // ---------- 标的通用属性 ----------
  product_type: BdsProductType; // 产品类型，英文简写
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
};

export type Line = {
  text: string;
  event_id: string;
  timestamp: string;
  is_customer: boolean;
  product_type?: string[]; // broker所属产品台子
  room_id?: string;
  trader_id?: string; // trader qm/qq id
  broker_id?: string; // broker qm id
  trader_idb_key?: string; // 与market-service一致的唯一确定的trader的key
  broker_idb_key?: string; // 与market-service一致的唯一确定的broker的key
  msg_id?: string; // 快聊生成的消息id
};

export type Operation = {
  bond_code: string; // 债券编码
  short_name: string; // 债券简称
  key_market: string; // 债券唯一编号
  operation_type: AlgoOperationType; // 操作类型
  direction: AlgoDirection; // 操作方向
  trust_degree: TrustDegreeHelper; // 靠谱程度
  oco: boolean; // 是否进行oco操作
  dark: boolean; // 是否进行暗盘操作
  trader_id: string; // trader qm/qq id
  broker_id: string; // broker qm id
  offer_id: string;
  batch_id: string; // 标识批处理的编号，拥有同样BatchID的操作被认为属于同一批
  idb_id: string;
  delivery: string; // 清算速度
  price_type: string; // 报价类型  1-净价；2-全价；3-收益率；4-利差；8-返点
  yield_type: string; // 标识行权/到期   行权=“0” 到期=“1”
  generated_time?: number; // QM前端使用
  settlement_date?: string;
  amount?: number;
  price?: number;
  is_post?: boolean;
  is_feedback?: boolean;
  trader_idb_key?: string; // 与market-service一致的唯一确定的trader的key
  broker_idb_key?: string; // 与market-service一致的唯一确定的broker的key
  reco_time?: string; // 识别时间 "2022-08-31 10:41:31"
  post_time?: string; // 挂单时间 "2022-08-31 10:42:30"
  msg_id?: string; // 快聊生成的消息id
  product_type?: string; // 产品类型
  post_source?: PostSource; // 是否来自回收站
};

export type AlgoBridgeDetail = {
  inst: string; // 机构
  rate: string; // 利率
  trader?: string; // 交易员
  path?: string; // 路径
};

export type BridgeOrder = {
  trade_date: string; // 交易日
  amount: string; // 卷面总额
  expire_date?: string; // 到期日
  deadline?: string; // 期限
  order_type?: string; // 票据类型
  broker_remark?: string; // 备注(经纪人)
  bridge_remark?: string; // 备注(桥机构)
  bid_order_detail: AlgoBridgeDetail; // 买方订单
  ofr_order_detail: AlgoBridgeDetail; // 卖方订单
};

export type AutoQuoteRecord = {
  record_id?: string; // 唯一id
  broker_idb_key?: string; // broker idbKey
  trader_idb_key?: string; // trader idbKey
  room_id?: string; // 房间id
  inst_name?: string; // 机构名
  trader_name?: string; // trader名
  create_time?: string; // 创建时间  例:2022-12-01 12:13:12
  recognition_type?: AutoQuoteRecognitionType; // 识别出的操作类型
  code_market?: string; // 券码
  bond_short_name?: string; // 债券简称
  direction?: AlgoDirection; // 方向 1-bid，2-ofr
  amount?: number; // 量
  price?: number; // 价格
  oco?: boolean; // oco
  trust_degree?: AutoQuoteTrustDegree; // 置信度
  delivery?: string; // 交割
  type?: AutoQuoteType; // 类型
  count_down_millisecond?: number; // 倒计时毫秒数
  execution_timestamp?: string; // 执行时间时间戳
  dark?: boolean; // 是否是暗盘 true是；false：不是
};

export type AutoQuoteQuickChat = {
  broker_chat_id?: string; // broker 在quickchat中的id,可能是QMid也可能是QQ,邮箱格式
  trader_chat_id?: string; // trader 在quickchat中的id,可能是QMid也可能是QQ,邮箱格式
  broker_idb_key?: string; // broker idbKey
  trader_idb_key?: string; // trader idbKey
  room_id?: string; // 房间id
  create_time?: string; // 创建时间  例:2022-12-01 12:13:12
  recognition_type?: AutoQuoteRecognitionType; // 识别出的操作类型
  code_market?: string; // 券码
  bond_short_name?: string; // 债券简称
  direction?: AlgoDirection; // 方向 1-bid，2-ofr
  amount?: number; // 量
  price?: number; // 价格
  oco?: boolean; // oco
  trust_degree?: AutoQuoteTrustDegree; // 置信度
  delivery?: string; // 交割
  offer_id?: string; // 识别id
  msg_id?: string; // 消息id
  product_type?: string; // 产品类型包含cc
  bond_category?: string; // 纯产品类型
  key_market?: string; // key_market
  is_dark?: boolean; // 是否是暗盘
  quote_type?: string; // 报价类型  3-收益率；1-净价；2-全价；4-利差；8-返点
  yield_type?: string; // 收益率类型  0-行权收益率，1-到期收益率
  traded_date?: string; // 交易日 yyyy-MM-dd
  settlement_date?: string; // 结算日 yyyy-MM-dd
  delivery_date?: string; // 交割日
};

export type AutoQuoteQuickchatOptData = {
  offer_id?: string; // 提交的offer_id
  idb_id?: string; // 去idb挂单以后idb返回的id
};

export type QuickChatChatScript = {
  chat_script?: string; // 话术
  switch?: boolean; // 开关
  operation_type?: QuickChatScriptAlgoOperationType; // 操作类型
};

export type QuickChatHandicap = {
  bond_info: QuickChatBondInfo; // 债券信息
  bid_quote_list?: QuickChatQuoteInfo[]; // 最优 bid 报价信息
  ofr_quote_list?: QuickChatQuoteInfo[]; // 最优 ofr 报价信息
  deal_info: QuickChatDealInfo; // 成交信息
};

export type QuickChatCardInfo = {
  offer_id: string;
  operation_type: QuickChatAlgoOperationType; // 操作类型
  direction?: AlgoDirection; // 方向
  code_market: string; // 券码
  bond_short_name: string; // 债券简称
  product_type: BdsProductType; // 产品类型
  trader_id: string; // trader crm id
  trader_name?: string; // 交易员名称
  inst_id?: string; // 机构id
  inst_name?: string; // 机构名称
  trust_degree?: QuickChatTrustDegree; // 置信度
  flag_oco?: boolean; // oco
  flag_internal?: boolean; // 暗盘
  has_option?: boolean; // 含权/非含权
  amount?: number; // 量
  price?: number; // 价格
  price_type?: AlgoBondQuoteType; // 价格类型
  liquidation_speed_list?: LiquidationSpeed[]; // 清算速度
  liquidation_speed_str?: string; // 清算速度字符串形式
  recognition_time?: string; // 识别时间 yyyy-MM-dd hh:mm:ss
  key_market?: string; // 债券唯一标识
  comment?: string; // 备注
  flag_stock_exchange?: boolean; // 交易所
  flag_bilateral?: boolean; // 点双边
  flag_request?: boolean; // 请求报价
  flag_indivisible?: boolean; // 整量
  time_to_maturity?: string; // 剩余期限
  yield_type?: YieldType; // 1行权收益率2到期收益率
  broker_id?: string; // broker crm id
  broker_chat_id?: string; // broker qm id
  trader_chat_id?: string; // trader qm id
  msg_id?: string; // 消息id，用于关联聊天和识别的信息
  batch_id?: string; // 批次ID，同一批次代表同一句话识别出来的
  department_type?: string; // 部门类型，目前有bnc/bco/cc
  quote_id?: string; // 报价的ID
  return_point?: number; // 返点
  flag_rebate?: boolean; // 是否有返点
  exercise_manual?: boolean; // 是否手动操作行权
  room_id?: string;
  update_time?: string;
  delisted_date?: string; // 债券下市日
  flag_deviate?: boolean; // 是否是偏离估值
  quote?: AlgoQuoteLite; // 对应的挂单
  rating?: string; // 债券评级
};

export type AlgoQuoteLite = {
  quote_id: string; // 报价ID
  update_time: string; // 更新时间
  product_type: BdsProductType; // 产品类型，台子
  bond_id?: string; // 债券 id
  broker_id?: string; // 经纪人 id
  trader_id?: string; // 交易员 id
  inst_id?: string; // 机构 id
  operator_id?: string; // 操作人 id
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
  quote_type: AlgoBondQuoteType; // 报价类型
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
  quote_price?: number; // 用户手动输入价格
};

export type QuickChatQuoteInfo = {
  keymarket: string; // 债券KeyMarket
  broker_id: string; // 经纪人ID
  trader_id: string; // 交易员ID
  product_type: string; // 台子，必有
  side: AlgoDirection; // 方向
  quote_type: AlgoBondQuoteType; // 报价类型
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
  exercise_manual?: boolean; // 是否手动操作行权到期: true为手动
};

export type QuickChatBondInfo = {
  time_to_maturity?: string; // 剩余期限
  rest_day_to_workday?: RestDayToWorkday; // 休几: 债券到期日为某个市场的休息日时，距离下个工作日的天数
  bond_category: BondCategory; // 券种
  product_type: BdsProductType; // 产品类型
  coupon_rate_current?: number; // 票面利率
  short_name: string; // 债券简称
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code: string; // 债券代码
  is_cross_mkt: boolean; // 是否交易所跨市场
  display_code: string; // 债券跨市场信息
  has_option?: boolean; // 是否含权
  issuer_rating?: string; // 主体评级
  rating?: string; // 债券评级
  with_warranty?: boolean; // 是否有担保
  fr_type: FRType; // 浮动利率类型
  listed_date?: string; // 上市日
  delisted_date?: string; // 下市日
  next_coupon_date?: string; // 下次付息日
  val_yield_exe?: number; // 中债YTM 行权
  val_yield_mat?: number; // 中债YTM 到期
  perp_type: PerpType; // 永续类型
  val_modified_duration?: number; // 久期
  fund_objective_sub_category?: string; // 地方债具体分类
  fund_objective_category?: string; // 地方债大类
  issue_amount?: number; // 发行总量
  maturity_date?: string; // 到期日
};

export type QuickChatDealInfo = {
  product_type: string; // 台子
  keymarket: string; // 债券KeyMarket
  direction: DealType; // 市场成交方向
  deal_time: string; // 成交时间(yyyy-MM-dd hh:mm:ss)
  price_type: AlgoBondQuoteType; // PriceType
  price?: number; // 价格
  volume?: number; // 量
  return_point?: number; // 返点
  flag_rebate?: boolean; // 是否返点
  comment?: string; // 备注
  comment_flag_bridge?: boolean; // 备注-过桥
  comment_flag_pay_for?: boolean; // 备注-代付
  flag_internal?: boolean; // 内部
  is_exercise?: boolean; // 收益率类型（行权/到期）
  settlement_date?: number; // 到期日时间戳
  traded_date?: number; // 交易日时间戳
  bid_broker_id?: number; // Bid经纪人id
  bid_institution_id?: number; // Bid机构id
  bid_trader_id?: number; // Bid交易员id
  ofr_broker_id?: number; // Ofr经纪人id
  ofr_institution_id?: number; // Ofr机构id
  ofr_trader_id?: number; // Ofr交易员id
  nothing_done?: boolean; // NothingDone
};

export type QuickChatQuoteDealLog = {
  code_market: string;
  key_market: string;
  quote_id: string;
  broker_id: string;
  trader_id: string;
  side: Side;
  product_type: string;
  update_time: number; // 毫秒级时间戳
  price?: number;
  price_type?: AlgoBondQuoteType;
  yield_type?: YieldType;
  traded_date?: string;
  delivery_date?: string;
  settlement_date?: string;
  amount?: number;
  dark?: boolean; // 明暗盘;internal_flag
  trust_degree?: number; // 置信度
  oco?: boolean;
  operation_type?: number; // 操作类型;1表示挂单，2表示撤单，3表示改单，4表示成交
};

export type QuickChatRoom = {
  room_id: string; // 房间id
  broker_id: string;
  broker_qq: string;
  trader_id?: string;
  trader_qq: string;
  trader_qq_nickname: string;
  trader_name?: string;
  inst_id?: string;
  inst_name?: string;
  trader_name_first_pinyin?: string; // 交易员名字简拼
  trader_name_pinyin?: string; // 交易员名字全拼
  unread: boolean; // 是否未读
  update_time: string; // 更新时间戳
  broker_avatar?: string;
  trader_avatar?: string;
  trader_job_status?: TraderJobStatus;
  trader_usage_status?: TraderUsageStatus;
  last_chat_time?: string; // 最后一次聊天时间(时间戳)
  last_recognition_time?: string; // 最后一次识别时间(时间戳)
  inst_status?: InstStatus; // 机构状态
  inst_usage_status?: InstUsageStatus; // 机构使用状态
};

export type QuickChatSyncRoomDetail = {
  msg_type: RoomDetailSyncType; // 1:upsert/2:delete
  room_info: QuickChatRoom; // 当前房间信息
  isCardChanged?: boolean; // 卡片是否有变更
};

export type OperationFailed = {
  offer_id: string;
  code: number;
  msg: string;
};

export type QQMsg = {
  msg_id: string; // 消息id
  message: string; // 文本信息
  msg_type: MsgType; // 消息类型
  sender_qq: string; // 发送者QQ
  receiver_qq: string; // 接收者QQ
  create_time: string; // 创建时间的时间戳
};

// 快聊broker估值配置
export type BondRecommendConfig = {
  id: string; // 模板唯一ID
  name?: string; // 模板名称
  min_price?: number; // 最小收益率 * 10^4
  max_price?: number; // 最大收益率 * 10^4
  deviate_price?: number; // 偏离估值，单位BP
  bond_goods_type?: BondGoodsType[]; // 产品类型
  bond_asset_type?: BondAssetType[]; // 发行
  bond_inst_type?: BondInstType[]; // 债券主体类型
  bond_market_type?: BondMarketType[]; // 交易所
  period_type?: BondPeriodType[]; // 久期
  min_period?: number; // 最小剩余期限
  max_period?: number; // 最大剩余期限
  issuer_rating_type?: IssuerRatingType[]; // 主体评级
  inst_rating_type?: InstRatingType[]; // 中信资债评级
  is_municipal?: IsMunicipalType; // 是否为城投债
  with_warranter?: WithWarranterType; // 是否有担保
  is_financing_platform_bond?: IsPlatformType; // 是否是平台债
  is_perpetual_bond?: BondPerpetualType[]; // 是否是永续债
  issue_year?: number[]; // 发行年份
  config_desc?: string; // 配置描述
  bond_financial_category_type?: BondFinancialCategoryType[]; // 金融债分类
  time_to_maturity_unit?: TimeToMaturityUnit; // 剩余期限单位 （年， 月，日）
  province_code_list?: string[]; // 省份
  is_mortgage?: boolean; // 是否可质押
  is_gn?: boolean; // GN
  is_not_option?: boolean; // 是否非含权
  rule_type?: RecommendRuleType; // 规则类型
};

export type BncTraderRecommendRule = {
  rule_id: string; // 规则唯一ID
  name?: string; // 模板名称
  min_price?: number; // 最小收益率 * 10^4
  max_price?: number; // 最大收益率 * 10^4
  price_deviation?: number; // 偏离估值，单位BP
  bond_issue_day_type_list?: BondIssueDayType[]; // 发行日
  bond_market_type_list?: BondMarketType[]; // 市场类型
  bond_sub_category_list?: BondSubCategory[]; // 债券子类别 一般/专项
  min_time_to_maturity?: number; // 最小剩余期限
  max_time_to_maturity?: number; // 最大剩余期限
  time_to_maturity_unit?: TimeToMaturityUnit; // 剩余期限单位 （年， 月，日）
  time_to_maturity_type_list?: TimeToMaturityType[]; // 剩余期限
  coupon_rate_type_list?: CouponRateType[]; // 债券利率种类
  province_code_list?: string[]; // 省份
  issue_year_list?: number[]; // 发行年份
  config_desc?: string; // 配置描述
  max_coupon_rate?: number; // 最大票面利率
  min_coupon_rate?: number; // 最小票面利率
};

export type BondDetail = {
  bond_code: string; // 债券Code：债券的系统唯一标识+发行市场
  bond_type: string; // 债券类型
  bond_name: string; // 债券名称
  listed_market: string; // 发行市场，CIB为银行间，SSH为上交所，SZE为深交所
  bond_full_name: string; // 债券全名
  val_yield: number; // 推荐收益率估值/行权收益率估值
  val_net_price: number; // 净价
  val_full_price: number; // 全价
  ficc_type_code: string; // typeCode
  bond_ficc_type: string;
  asset_status: string; // 资产状态
  val_modified_duration: number; // 久期
  issuer_rating_current: string; // 主体评级
  cbc_rating: string; // 中信资债评级
  issuer_year: number; // 发行年份
  is_municipal: boolean; // 是否是城投债
  warranter: string; // 担保人
  cbrc_financing_platform: boolean; // 是否是平台债
  option_type: string; // 永续类型
  sceniority: string; // 偿还次序
  is_mortgage: boolean; // 是否可质押
  term_structure: string; // 含权债期限结构
  issuer_code: string; // 主体代码
  issuer_institution_subtype: string; // 债券主体类型
  rating_current: string; // 最新评级
  bid_price: number; // BID最优报价
  bid_volume: string; // BID最优报价对应量
  ofr_price: number; // OFR最优报价
  ofr_volume: string; // OFR最优报价对应量
  csi_yield_to_exercise: number; // 行权收益率
  csi_yield_to_maturity: number; // 到期收益率
  time_to_maturity: string; // 剩余期限
  bid_internal: boolean; // BID最优报价是否是内部报价
  ofr_internal: boolean; // BID最优报价是否是内部报价
  val_yield_maturity: number; // 非推荐收益率估值/到期收益率估值
  rest_day_to_workday: number; // 休几
};

export type AlgoBondQuote = {
  quote_id: string; // 报价ID
  quote_type: string; // 报价类型 - OFR/BID
  price: number; // 报价
  clean_price: number;
  volume: number;
  broker_idb_key: string;
  trader_idb_key: string;
  listed_market: string;
  time_to_maturity: string;
};

export type DealLog = {
  bargain_flag: string;
  bond_code: string;
  bond_key_listed_market: string;
  bond_short_name: string;
  bond_sub_type: string;
  broker_id: string;
  category: string;
  clear_speed: string;
  create_time: string;
  delivery_date: string;
  id: string;
  modify_time_str: string;
  price: string;
  quote_side: string;
  settlement_date: string;
  trader_id: string;
  volume: string;
  yield_type: string;
};

export type BidOfrStructList = {
  bargain_flag: string;
  bond_rating: string;
  broker_idb_key: string;
  cdc_valuations_yield: string;
  clean_price: number;
  clear_speed: string;
  create_time: string;
  id: string;
  internal: boolean;
  issuer_rating: string;
  modify_time_str: string;
  price: number;
  price_description: string;
  quote_type: number;
  settlement_date: string;
  side: string;
  time_to_maturity: string;
  traded_date: string;
  trader_idb_key: string;
  volume: number;
  yield: number;
  yield_type: string;
};

export type AlgoSortingMethod = {
  sorted_field: BncBondSortedField; // 排序字段名
  is_desc: boolean; // 是否倒序
};

export type AlgoBondCrossMkt = {
  ficc_id: string; // ficc id
  code_market: string; // 债券代码+发行市场后缀，业务的唯一标识（如210016.SH）
  bond_code: string; // 债券代码
  bond_key: string; // 债券的系统唯一标识
  val_modified_duration: number; // 久期
  val_yield_exe: number; // 推荐收益率估值/行权收益率估值
  val_yield_mat: number; // 到期收益率估值/非推荐收益率估值
};

export type KeyValue = {
  key: string;
  val: string;
};
