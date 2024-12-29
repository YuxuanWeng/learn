import { SERVER_NIL } from '@fepkg/common/constants';
import {
  BondDeal,
  BondQuote,
  Broker,
  City,
  Counterparty,
  DealOperationLogV2,
  FiccBondBasic,
  InstitutionLite,
  InstitutionTiny,
  LiquidationSpeed,
  NCDPInfo,
  OppositePriceBondFilter,
  OppositePriceNotificationSetting,
  OppositePriceNotifyLogic,
  Province,
  QuoteFilterGroup,
  QuoteLite,
  ReceiptDeal,
  ReceiptDealOperationLog,
  ReceiptDealUpdateTypeItem,
  Sector,
  Subsector,
  Tag,
  Trader,
  TraderLite,
  User,
  UserAccessGrant
} from '@fepkg/services/types/common';
import {
  AccountStatus,
  BankType,
  BondCategory,
  BondDealStatus,
  BondNature,
  BondQuoteType,
  BondSector,
  BondShortName,
  DealMarketType,
  DealOperationType,
  DealReadStatus,
  DealType,
  Direction,
  ExerciseType,
  FRType,
  Gender,
  InstStatus,
  IssuerDateType,
  JobStatus,
  LiquidationSpeedTag,
  ListedMarket,
  MaturityDateType,
  MktType,
  OperationSource,
  OppositePriceNotifyColor,
  OppositePriceNotifyLogicType,
  OppositePriceNotifyMsgFillType,
  OptionType,
  PerpType,
  Post,
  ProductType,
  Rating,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment,
  ReceiptDealUpdateType,
  RefType,
  RepaymentMethod,
  Sceniority,
  SettlementMode,
  Side,
  TagType,
  TraderUsageStatus,
  UsageStatus
} from '@fepkg/services/types/enum';
import { MarketNotifyTag } from '@fepkg/services/types/market-notify/get-all-tag';
import { DealParsing } from '@fepkg/services/types/parsing/deal-info';
import { fakerZH_CN as faker, faker as fakerEn } from '@faker-js/faker';
// import { DealQuote } from 'app/types/DataLocalization/local-common';
import { range as lodashRange, random } from 'lodash-es';
import { getRandomEnumValue } from '.';

type DealQuote = {
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
  deal_liquidation_speed_list?: LiquidationSpeed[]; // 成交清算速度
};

export const fakeId = () => faker.string.uuid();

export const fakeDate = () => {
  return (+faker.date.anytime()).toString();
};

export const fakeCNName = () => {
  return faker.person.lastName() + faker.person.firstName();
};

export const fakeCity = (): City => {
  const city: City = {
    city_name_zh: faker.location.city(),
    city_name_en: fakerEn.location.city(),
    city_code: faker.string.uuid()
  };
  return city;
};

export const fakeProvince = (): Province => {
  const province: Province = {
    province_name_zh: faker.location.city(),
    province_name_en: fakerEn.location.city(),
    province_code: faker.string.uuid(),
    cities: faker.helpers.uniqueArray(fakeCity, faker.number.int({ min: 1, max: 20 }))
  };
  return province;
};

export const fakeSubsector = (): Subsector => {
  const subsector: Subsector = {
    subsector_name_zh: faker.company.name(),
    subsector_name_en: fakerEn.company.name(),
    subsector_code: faker.string.uuid()
  };
  return subsector;
};

export const fakeSector = (): Sector => {
  const sector: Sector = {
    sector_name_zh: faker.company.name(),
    sector_name_en: fakerEn.company.name(),
    sector_code: faker.string.uuid(),
    subsectors: faker.helpers.uniqueArray(fakeSubsector, faker.number.int({ min: 1, max: 20 }))
  };
  return sector;
};

export const fakeBroker = (): Broker => {
  const broker: Broker = {
    broker_id: faker.string.uuid(),
    name_zh: fakeCNName(),
    name_en: fakerEn.person.firstName() + fakerEn.person.lastName(),
    email: faker.internet.email(),
    department: faker.company.name(),
    trader_count: faker.number.int(500),
    account: faker.internet.email(),
    account_status: AccountStatus.Enable // 账户状态
  };
  return broker;
};

export const fakeUser = (): User => {
  return {
    user_id: faker.string.uuid(), // 用户id
    job_status: JobStatus.OnJob, // 在职状态：1表示在职，2表示离职
    account_status: AccountStatus.Enable, // 账户状态：1表示启用，2表示停用，3表示锁定（账户异常操作导致）
    name_cn: fakeCNName(),
    name_en: fakerEn.person.firstName() + fakerEn.person.lastName(),
    account: 'abc', // 账户
    email: faker.internet.email(),
    phone: '123', // 座机
    telephone: '456-789', // 移动电话
    QQ: '10000', // qq
    department_id: '999', // 部门编号
    deleted: 1, // 2为已删除
    qm_account: 'foo', // qm账户
    post: Post.Post_Broker, // 岗位
    pinyin: '',
    pinyin_full: ''
  };
};

export const fakeTraderLite = (): TraderLite => {
  const lite: TraderLite = {
    trader_id: faker.string.uuid(),
    name_zh: fakeCNName(),
    name_en: fakerEn.person.firstName() + fakerEn.person.lastName(),
    is_vip: faker.datatype.boolean()
  };
  return lite;
};

export const fakeBondQuote = (side?: Side): BondQuote => {
  const quote: BondQuote = {
    quote_id: faker.string.uuid(), // 报价ID
    bond_id: faker.string.uuid(), // 债券ID
    broker_id: faker.string.uuid(), // 经纪人ID
    trader_id: faker.string.uuid(), // 交易员ID
    side: side === undefined ? Math.ceil(Math.random() * 2) : side, // 方向
    yield: Number((Math.random() * 100).toFixed(2)), // 收益率
    clean_price: Number((Math.random() * 100).toFixed(2)), // 净价
    full_price: Number((Math.random() * 100).toFixed(2)), // 全价
    quote_price: Number((Math.random() * 100).toFixed(2)), // 报价
    volume: Number((Math.random() * 100).toFixed(0)), // 交易量
    traded_date: fakeDate(), // 交易日
    settlement_date: fakeDate(), // 结算日
    delivery_date: fakeDate(), // 交割日
    comment: faker.finance.transactionDescription(), // 备注信息
    return_point: Number((Math.random() * 100).toFixed(2)), // 返点值
    spread: 0, // 利差
    liquidation_speed_list: [], // 清算速度
    source: 0, // 来源
    refer_type: getRandomEnumValue(RefType), // 报价ref类型
    deal_status: 0, // 成交状态
    deal_date: fakeDate(), // 成交日期
    // --------- 债券信息 ----------
    bond_code: faker.finance.accountNumber(), // 债券代码
    bond_type: '', // 债券类型
    bond_short_name: '16豫高管MTN002', // 债券简称
    bond_rating: getRandomEnumValue(Rating), // 债券评级
    bond_key: '', // 债券系统唯一标示
    listed_market: '', // 发行市场
    ent_cor: '', // 企业/公司债
    val_modified_duration: 0, // 久期
    frn_index_id: '', // 基础利率代码
    coupon_type: '', // 利率方式
    option_type: '', // 永续类型
    mkt_type: getRandomEnumValue(MktType), // 市场类型/报价类型
    maturity_date: fakeDate(), // 到期日
    maturity_is_holiday: faker.datatype.boolean(), // 到期日为节假日
    product_type: getRandomEnumValue(ProductType), // 产品类型
    selective_code: '', // 发行方式
    asset_status: '', // 交易类型
    is_mortgage: faker.datatype.boolean(), // 是否质押
    is_cross_mkt: faker.datatype.boolean(), // 是否交易跨市场
    ficc_type_code: '', // 固收产品类型代码
    bond_ficc_type: '', // 固收类型
    listed_date: fakeDate(), // 上市日
    warranter: faker.finance.accountNumber(), // 担保方代码
    is_municipal: faker.datatype.boolean(), // 是否城投债
    term_structure: '', // 含权债期限结构
    bond_full_name: '', // 全称
    redemption_no: 0, // 提前偿付期数
    sceniority: getRandomEnumValue(Sceniority), // 偿还次序
    conversion_rate: 0, // 质押率
    // --------- 主体信息 ----------
    issuer_code: faker.finance.accountNumber(), // 机构代码
    issuer_name: faker.company.name(), // 机构名称
    issuer_rating: getRandomEnumValue(Rating), // 主体评级
    institution_subtype: '', // 企业类型
    cbc_rating: getRandomEnumValue(Rating), // 中债资信评级
    cbrc_financing_platform: '', // 银监会投融资平台
    province: faker.location.city(), // 省级
    city: faker.location.city(), // 市级
    // --------- 交易员信息 ----------
    trader_name: fakeCNName(), // 交易员名称
    is_vip: faker.datatype.boolean(), // 是否为vip
    is_danger: faker.datatype.boolean(), // 是否危险
    is_bargain: faker.datatype.boolean(), // 是否可议价
    flag_internal: faker.datatype.boolean(), // 是否为内部报价
    flag_urgent: faker.datatype.boolean(), // 是否为紧急报价
    flag_exchange: faker.datatype.boolean(), // 是否换券报价
    flag_star: Math.ceil(Math.random() * 3), // 星数
    flag_oco: faker.datatype.boolean(), // 是否oco
    flag_package: faker.datatype.boolean(), // 是否打包
    operator: fakeCNName(), // 操作者
    create_time: fakeDate(), // 创建时间
    update_time: fakeDate(), // 修改时间
    val_yield: Number((Math.random() * 10).toFixed(4)), // 收益率
    issue_year: 0, // 发行年度
    sw_sector: '', // 主体一级行业
    sw_sub_sector: '', // 主体二级行业
    delisted_date: fakeDate(), // 下市日
    algo_tags: '',
    underwriter_code: '', // 主承销商代码
    area_level: '', // 区域级别
    inst_type: '', // 机构类型
    from_draft: faker.datatype.boolean(), // 是否来自draft表
    inst_listed_type: '',
    quote_type: getRandomEnumValue(BondQuoteType), // 报价类型
    bond_category: getRandomEnumValue(BondCategory), // 券种
    bond_sector: getRandomEnumValue(BondSector), // 债券所属行业
    fr_type: getRandomEnumValue(FRType), // 浮动利率类型
    perp_type: getRandomEnumValue(PerpType), // 永续类型
    has_option: faker.datatype.boolean(), // 是否含权
    flag_recommend: faker.datatype.boolean(), // 推荐
    inst_rating: getRandomEnumValue(Rating),
    implied_rating: getRandomEnumValue(Rating),
    is_exercise: faker.datatype.boolean()
  };
  return quote;
};

export const fakeFiccBondBasic = (): FiccBondBasic => {
  const basic: FiccBondBasic = {
    // ---------- 标的通用属性 ----------
    product_type: getRandomEnumValue(ProductType),
    key_market: '',
    code_market: faker.string.uuid(),
    bond_code: faker.finance.accountNumber(),
    bond_key: '',
    listed_market: '',
    listed_date: Math.random() > 0.5 ? fakeDate() : '0',
    delisted_date: fakeDate(),
    short_name: `21${faker.location.city()}行永续债01`,

    // ---------- 中债估值部分 ----------
    val_yield_exe: random(1, 99),
    val_yield_mat: 0,
    val_clean_price_mat: 0,
    val_clean_price_exe: 0,
    csi_clean_price_exe: 0,
    csi_clean_price_mat: 0,
    csi_full_price_exe: 0,
    csi_yield_exe: 0,
    implied_rating: '',
    val_modified_duration: 0,
    val_basis_point_value: 0,

    // ---------- 中证估值部分 ----------
    csi_full_price_mat: 0,
    csi_yield_mat: 0,

    // ---------- 其他固收债券属性 ----------
    is_cross_mkt: faker.datatype.boolean(),
    mkt_type: getRandomEnumValue(MktType),
    issuer_rating: '',
    option_type: getRandomEnumValue(OptionType),
    coupon_rate_current: 0,
    maturity_date: fakeDate(),
    maturity_is_holiday: faker.datatype.boolean(),
    next_coupon_date: fakeDate(),
    redemption_no: Math.floor(Math.random() * 2),
    rating: getRandomEnumValue(Rating),
    option_date: fakeDate(),
    issue_amount: 0,
    interest_start_date: fakeDate(),
    issue_rate: 0,
    bond_category: getRandomEnumValue(BondCategory),
    fr_type: getRandomEnumValue(FRType),
    perp_type: getRandomEnumValue(PerpType),
    has_option: faker.datatype.boolean(),
    time_to_maturity: '00Y',
    rest_day_to_workday: {
      days_cib: 0,
      days_sse: 0,
      days_sze: 0
    },
    is_fixed_rate: faker.datatype.boolean(),
    conversion_rate: getRandomEnumValue(Rating),
    fund_objective_category: '',
    fund_objective_sub_category: '',
    cbc_rating: '',
    with_warranty: false,
    display_code: '',
    repayment_method: getRandomEnumValue(RepaymentMethod),
    issuer_code: ''
  };
  return basic;
};

export const fakeQuoteFilterGroup = (): QuoteFilterGroup => {
  const basic: QuoteFilterGroup = {
    group_id: faker.string.uuid(),
    group_name: faker.finance.accountName(),
    product_type: getRandomEnumValue(ProductType),
    creator_id: faker.string.uuid(),
    creator_name: '',
    desc: '{"quick_filter":{"intelligence_sorting":false,"new_listed":false,"is_mortgage":true,"is_cross_mkt":false},"general_filter":{"bond_category_list":[4],"institution_subtype_list":[],"listed_market_list":[],"bond_sector_list":[],"remain_days_list":[],"collection_method_list":[],"mkt_type_list":[],"issuer_rating_list":[],"cbc_rating_list":[],"fr_type_list":[],"perp_type_list":[],"area_level_list":[],"bond_issue_info_filter":{},"maturity_is_holiday":[]},"bond_id_list":[]}'
  };
  return basic;
};

export const fakeTag = (type: TagType): Tag => ({
  tag_id: faker.string.uuid(),
  type,
  code: faker.string.uuid(),
  name: faker.company.name(),
  deleted: 1
});

export const fakeInst = (inst_id = ''): InstitutionLite => {
  const id = inst_id || faker.string.uuid();
  const short = inst_id ? inst_id.slice(0, 6).toUpperCase() : `银行${faker.company.name().slice(0, 3)}-01`;
  return {
    inst_id: id, // 机构id
    full_name: '上海商业银行01', // 机构全名
    short_name_zh: short,
    standard_code: '222', // 机构标准代码
    inst_type: fakeTag(TagType.InstType), // 机构类型
    inst_level: fakeTag(TagType.InstLevel), // 机构级别
    usage_status: UsageStatus.Using, // 使用状态
    inst_status: InstStatus.StartBiz // 机构状态
  };
};

export const fakeBondQuoteSync = (): DealQuote => {
  const quote = {
    ...fakeBondQuote(),
    broker_info: fakeBroker(),
    trader_info: fakeTraderLite(),
    inst_info: fakeInst(),
    quote_type: Math.random() > 0.5 ? BondQuoteType.CleanPrice : BondQuoteType.Yield,
    flag_rebate: Math.random() > 0.5,
    flag_stc: Math.random() > 0.5,
    side: Math.random() > 0.5 ? Side.SideBid : Side.SideOfr,
    bond_key_market: '',
    operator_info: {
      broker_id: '',
      name_zh: '',
      name_en: '',
      email: '',
      department: '',
      trader_count: 0,
      account: '',
      product_list: undefined,
      account_status: undefined
    },
    sync_version: '',
    quote_price: 0
  } as DealQuote;
  return quote;
};

export const fakeQuoteLite = (): QuoteLite => {
  const quote = {
    ...fakeBondQuote(),
    bond_basic_info: fakeFiccBondBasic(),
    quote_price: Number((Math.random() * 100).toFixed(2)), // 报价
    broker_info: fakeBroker(),
    trader_info: fakeTraderLite(),
    inst_info: fakeInst(),
    quote_type: Math.random() > 0.5 ? BondQuoteType.CleanPrice : BondQuoteType.Yield,
    flag_rebate: Math.random() > 0.5,
    flag_stc: Math.random() > 0.5,
    side: Math.random() > 0.5 ? Side.SideBid : Side.SideOfr,
    bond_key_market: '',
    flag_code_changed: false
  } as QuoteLite;
  return quote;
};

export const fakeTrader = (inst_id = ''): Trader => {
  return {
    trader_id: faker.string.uuid(), // 交易员id
    name_zh: fakeCNName(), // 中文名
    name_en: fakerEn.person.fullName(), // 英文名
    gender: Gender.Man, // 性别
    code: faker.string.uuid(), // 交易员代码
    job_status: JobStatus.OnJob, // 职位状态
    department: faker.company.name(), // 部门
    inst_info: fakeInst(inst_id) as any,
    position: 'aaa', // 岗位
    address: faker.location.streetAddress(), // 通讯地址
    usage_status: TraderUsageStatus.TraderEnable, // 交易员使用状态 1启用，2 停用
    default_broker_map: {}
  };
};

export const fakeBondLite = (): FiccBondBasic => {
  return {
    option_date: fakeDate(),
    product_type: getRandomEnumValue(ProductType),
    code_market: faker.string.uuid(),
    has_option: faker.datatype.boolean(),
    time_to_maturity: '00Y',
    bond_code: faker.finance.accountNumber(),
    short_name: `21${faker.location.city()}行永续债01`,
    issuer_rating: getRandomEnumValue(Rating),
    rating: getRandomEnumValue(Rating),
    val_clean_price_exe: 0,
    val_yield_exe: random(1, 99),
    csi_clean_price_exe: 0,
    csi_full_price_exe: 0,
    csi_yield_exe: 0,
    val_clean_price_mat: 0,
    val_yield_mat: 0,
    csi_clean_price_mat: 0,
    csi_full_price_mat: 0,
    csi_yield_mat: 0,
    option_type: getRandomEnumValue(OptionType),
    listed_market: '',
    listed_date: fakeDate(),
    delisted_date: fakeDate(),
    bond_category: getRandomEnumValue(BondCategory),
    val_modified_duration: 0,
    redemption_no: 0,
    perp_type: getRandomEnumValue(PerpType),
    fr_type: getRandomEnumValue(FRType),
    issue_amount: 0,
    conversion_rate: 0,
    cbc_rating: getRandomEnumValue(Rating),
    maturity_date: fakeDate(),
    coupon_rate_current: 0,
    maturity_is_holiday: faker.datatype.boolean(),
    next_coupon_date: fakeDate(),
    is_cross_mkt: faker.datatype.boolean(),
    mkt_type: getRandomEnumValue(MktType),
    is_fixed_rate: faker.datatype.boolean(),
    fund_objective_category: '',
    fund_objective_sub_category: '总额',
    implied_rating: getRandomEnumValue(Rating),
    interest_start_date: fakeDate(),
    key_market: faker.string.uuid(),
    with_warranty: faker.datatype.boolean(),
    val_basis_point_value: 0,
    display_code: '',
    bond_key: '',
    repayment_method: getRandomEnumValue(RepaymentMethod),
    issuer_code: ''
  };
};

export const fakeTradeInfo = (): Counterparty => {
  return {
    inst: fakeInst(),
    trader: fakeTraderLite(),
    broker: fakeUser(),
    flag_modify_brokerage: faker.datatype.boolean(),
    confirm_status: getRandomEnumValue(BondDealStatus),
    brokerage_comment: getRandomEnumValue(ReceiptDealTradeInstBrokerageComment)
  };
};

export const fakeSpotPrice = (): BondDeal => {
  const spotStatus: BondDealStatus = getRandomEnumValue(BondDealStatus);
  const needInternalCode = [BondDealStatus.DealConfirmed, BondDealStatus.DealPartConfirmed].includes(spotStatus);

  return {
    deal_id: faker.string.uuid(),
    internal_code: needInternalCode ? random(10, false).toString() : '',
    create_time: faker.date
      .between({ from: new Date('2023-02-07'), to: new Date() })
      .getTime()
      .toFixed(0), // 点价时间
    update_time: fakeDate(),
    deal_type: getRandomEnumValue(DealType),
    source: getRandomEnumValue(OperationSource),
    flag_bridge: faker.datatype.boolean(),
    send_order_msg: '【请求】浦发银行(张扬)',
    bid_send_order_msg: '【请求】浦发银行(刘扬)',
    ofr_send_order_msg: '【请求】浦东银行(赵扬)',
    bond_basic_info: fakeBondLite(),
    confirm_volume: random(1, 9) * 1000,
    price_type: getRandomEnumValue(BondQuoteType),
    price: Number((Math.random() * 100).toFixed(2)), // 价格
    yield: Number((Math.random() * 100).toFixed(2)), // 收益率
    clean_price: Number((Math.random() * 100).toFixed(2)), // 净价
    full_price: Number((Math.random() * 100).toFixed(2)), // 全价
    return_point: Number((Math.random() * 100).toFixed(2)), // 返点值
    bid_settlement_type: [{ tag: LiquidationSpeedTag.Today, offset: 0 }],
    bid_traded_date: fakeDate(),
    bid_delivery_date: fakeDate(),
    ofr_settlement_type: [{ tag: LiquidationSpeedTag.Today, offset: 0 }],
    ofr_traded_date: fakeDate(),
    ofr_delivery_date: fakeDate(),
    flag_exchange: faker.datatype.boolean(),
    exercise_type: getRandomEnumValue(ExerciseType),
    deal_status: spotStatus,
    spot_pricinger: fakeTradeInfo(),
    spot_pricingee: fakeTradeInfo(),
    spot_pricing_record_id: faker.string.uuid(),
    bid_deal_read_status: DealReadStatus.Read,
    ofr_deal_read_status: DealReadStatus.Read,
    flag_internal: faker.datatype.boolean() // 是否暗盘
  };
};

const list = lodashRange(random(20, 30)).map(() => fakeSpotPrice());
export const fakeSpotPrices = list;

const fakeInstTiny = (): InstitutionTiny => {
  return {
    inst_id: '0002',
    standard_code: '0001',
    short_name_zh: faker.company.name().slice(0, 3),
    usage_status: UsageStatus.Using,
    biz_short_name_list: [
      {
        product: {
          product_code: '',
          product_id: '0',
          product_type: ProductType.BNC,
          desc: '',
          display_name: '',
          color: ''
        }
      }
    ]
  };
};

export const fakeDealInfo = (): DealParsing => {
  return {
    bond_basic: fakeBondLite(),
    ofr_trader: fakeTraderLite(),
    ofr_inst: fakeInstTiny(),
    bid_trader: fakeTraderLite(),
    bid_inst: fakeInstTiny(),
    bid_broker: fakeBroker(),
    price: 23,
    price_type: BondQuoteType.Yield,
    return_point: 0.23,
    volume: 2000,
    liquidation_speed_list: [{ tag: LiquidationSpeedTag.Friday, offset: 0 }]
  };
};

export const fakeSpotPricing = (): BondDeal => {
  const a: BondDeal = {
    deal_id: faker.string.uuid(),
    internal_code: faker.string.uuid(),
    create_time: fakeDate(),
    update_time: fakeDate(),
    deal_type: DealType.GVN,
    source: OperationSource.OperationSourceIdc,
    flag_bridge: Math.random() > 0.5,
    send_order_msg: '发单信息',
    bid_send_order_msg: 'bid发单信息',
    ofr_send_order_msg: 'ofr发单信息',
    bond_basic_info: fakeBondLite(),
    confirm_volume: 1000,
    price_type: BondQuoteType.Yield,
    price: 3.3,
    yield: 3.3,
    clean_price: 330,
    full_price: 333,
    return_point: SERVER_NIL,
    bid_settlement_type: [
      {
        tag: LiquidationSpeedTag.Today,
        offset: 1
      }
    ],
    bid_traded_date: fakeDate(),
    bid_delivery_date: fakeDate(),
    ofr_settlement_type: [
      {
        tag: LiquidationSpeedTag.Today,
        offset: 1
      }
    ],
    ofr_traded_date: fakeDate(),
    ofr_delivery_date: fakeDate(),
    flag_exchange: true,
    exercise_type: ExerciseType.Exercise,
    deal_status: BondDealStatus.DealConfirmed,
    spot_pricinger: fakeTradeInfo(),
    spot_pricingee: fakeTradeInfo(),
    spot_pricing_record_id: faker.string.uuid(),
    flag_internal: false,
    bid_deal_read_status: DealReadStatus.Read,
    ofr_deal_read_status: DealReadStatus.Read,
    operator: fakeUser()
  };
  return a;
};

export const fakeOperationLog = (): DealOperationLogV2 => {
  return {
    log_id: faker.string.uuid(),
    deal_id: faker.string.uuid(),
    operator: fakeUser(),
    operation_type: Math.random() > 0.5 ? DealOperationType.DOTAddBridge : DealOperationType.DOTChangeBridge,
    create_time: fakeDate()
  };
};

export const fakeAccessGrant: () => UserAccessGrant = () => {
  return {
    grantee: {
      user_id: faker.string.uuid(),
      job_status: JobStatus.OnJob,
      account_status: AccountStatus.Enable,
      name_cn: fakeCNName(),
      name_en: fakerEn.person.firstName() + fakerEn.person.lastName(),
      account: faker.internet.email(),
      email: faker.internet.email(),
      phone: '123',
      telephone: '123132',
      job_num: '123132',
      QQ: '1231231',
      department_id: '999', // 部门编号
      post: Post.Post_Broker // 岗位
    },
    granter_list: lodashRange(0, 23).map(() => fakeUser()),
    granter_access_list: lodashRange(0, 23).map(() => ({
      granter: fakeUser(),
      access_grant_list: []
    }))
  };
};

export const fakeOppositePriceNotifyLogic = (): OppositePriceNotifyLogic => ({
  notify_logic_type: getRandomEnumValue(OppositePriceNotifyLogicType),
  notify_logic_id: faker.string.uuid(),
  color: getRandomEnumValue(OppositePriceNotifyColor),
  turn_on: faker.datatype.boolean(),
  msg_template: faker.lorem.sentence(),
  notify_logic_name: faker.person.middleName(),
  copied: faker.datatype.boolean(),
  n_value: faker.number.int()
});

export const fakeOppositePriceBondFilter = (): OppositePriceBondFilter => ({
  bond_category_list: [getRandomEnumValue(BondCategory)],
  listed_market_list: [getRandomEnumValue(ListedMarket)],
  remain_days_list: [],
  bond_shortname_list: [getRandomEnumValue(BondShortName)],
  fr_type_list: [getRandomEnumValue(FRType)],
  maturity_is_holiday: faker.datatype.boolean(),
  bond_nature_list: [getRandomEnumValue(BondNature)]
});

export const fakeOppositePriceNotificationSetting = (): OppositePriceNotificationSetting => {
  const notifyLogicList = lodashRange(14).map(() => fakeOppositePriceNotifyLogic());
  return {
    broker_id: faker.string.uuid(),
    notify_logic: notifyLogicList,
    msg_fill_type: getRandomEnumValue(OppositePriceNotifyMsgFillType),
    bond_filter_logic: fakeOppositePriceBondFilter(),
    flag_valuation_for_cp_handicap: faker.datatype.boolean(),
    flag_issue_amount_for_cp_handicap: faker.datatype.boolean(),
    flag_maturity_date_for_cp_handicap: faker.datatype.boolean(),
    merge_msg_for_batch: faker.datatype.boolean(),
    display_limit: 100
  };
};

export const fakeReceiptDeal = (): ReceiptDeal => ({
  bond_basic_info: fakeFiccBondBasic(),
  receipt_deal_id: faker.string.uuid(),
  receipt_deal_status: getRandomEnumValue(ReceiptDealStatus),
  flag_bid_broker_confirmed: faker.datatype.boolean(),
  bid_broker_confirmed_time: fakeDate(),
  flag_ofr_broker_confirmed: faker.datatype.boolean(),
  ofr_broker_confirmed_time: fakeDate(),
  create_time: fakeDate(),
  update_time: fakeDate(),
  direction: getRandomEnumValue(Direction),
  deal_market_type: getRandomEnumValue(DealMarketType),
  flag_internal: faker.datatype.boolean(),
  flag_send_market: faker.datatype.boolean(),
  flag_urgent: faker.datatype.boolean(),
  price: random(1, 99),
  yield: random(1, 99),
  clean_price: random(1, 99),
  full_price: random(1, 99),
  volume: random(1000, 3000),
  spread: random(1, 99),
  return_point: random(0.1, 1),
  settlement_amount: random(1, 99),
  settlement_mode: getRandomEnumValue(SettlementMode),
  flag_rebate: faker.datatype.boolean(),
  is_exercise: faker.number.int(),
  traded_date: fakeDate(),
  delivery_date: fakeDate(),
  bid_trade_info: {},
  ofr_trade_info: {},
  other_detail: faker.lorem.sentence(),
  backend_msg: faker.lorem.sentence(),
  backend_feed_back: faker.lorem.sentence(),
  operator: fakeUser(),
  price_type: getRandomEnumValue(BondQuoteType),
  source: getRandomEnumValue(OperationSource),
  internal_code: random(1, 99).toString()
});

export const fakeReceiptDealUpdateTypeItem = (type: ReceiptDealUpdateType): ReceiptDealUpdateTypeItem => ({
  update_type: type,
  update_field_comment: faker.datatype.boolean() ? faker.lorem.sentence() : ''
});

export const fakeReceiptDealLog = (fields: number): ReceiptDealOperationLog => ({
  log_id: faker.string.uuid(),
  deal_id: faker.string.uuid(),
  operator: fakeUser(),
  operation_type: getRandomEnumValue(DealOperationType),
  before_receipt_deal_snapshot: fakeReceiptDeal(),
  after_receipt_deal_snapshot: fakeReceiptDeal(),
  update_types: lodashRange(0, fields).map(fakeReceiptDealUpdateTypeItem),
  create_time: fakeDate(),
  operation_source: getRandomEnumValue(OperationSource)
});

/** odm字段配置mock */
export const fakeOutBoundTag = (i: number): MarketNotifyTag => ({
  tag_id: i,
  tag_desc_cn: fakeUser().name_cn,
  tag_desc_en: fakeInst().short_name_en ?? 'english name'
});

export const fakeNCDPInfo = (): NCDPInfo => {
  const inst = fakeInstTiny();
  const operator = fakeUser();

  return {
    ncdp_id: faker.string.uuid(),
    inst_id: inst.inst_id,
    inst_name: inst?.short_name_zh ?? '',
    issuer_code: inst?.district_name ?? '',
    issuer_rating_current: getRandomEnumValue(Rating),
    maturity_date: getRandomEnumValue(MaturityDateType),
    fr_type: getRandomEnumValue(FRType),
    price: random(0, 99),
    price_changed: random(-50, 50),
    volume: random(1000, 3000),
    issuer_date: fakeDate(),
    issuer_type: getRandomEnumValue(IssuerDateType),
    comment: faker.finance.transactionDescription(),
    flag_internal: faker.datatype.boolean(),
    flag_brokerage: faker.datatype.boolean(),
    flag_full: faker.datatype.boolean(),
    operator: operator.user_id,
    operator_name: operator?.name_cn,
    // issuer_bank_type: getRandomEnumValue(BankType),
    update_time: fakeDate()
  };
};
