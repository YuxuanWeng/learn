import { ProductType } from '@fepkg/services/types/enum';
import { miscStorage } from '@/localdb/miscStorage';

/** local-storage keys */
export enum LSKeys {
  /** oms版本号 */
  Version = 'version',
  /** 行情分组缓存信息  */
  MainGroup = 'main-group',
  /** 行情分组是否展开 */
  MainGroupUnfold = 'main-group-unfold',

  /** 单条报价 是否常开 */
  SingleQuoteAlwaysOpen = 'single-quote-always-open',
  /** 单条报价报价量单位 */
  SingleQuoteUnit = 'single-quote-unit',
  /** 交易员首选项 */
  TraderSelectedPreference = 'trader-selected-preference',
  /** 协同报价原始文本已读状态 */
  CoQuoteOriginalTextReadStatus = 'collaborative-quote-original-text-read-status',

  /** 债券详情 基本信息显示隐藏控制 */
  SingleBondDetailBondInfoFirstItemVisible = 'single-bond-detail-bond-info-first-item-visible',
  /** 债券详情 利率信息/债券日历显示隐藏控制 */
  SingleBondDetailBondInfoSecondItemVisible = 'single-bond-detail-bond-info-second-item-visible',
  /** 债券详情 流通市场信息/债项历史评级/表格显示隐藏日历显示隐藏控制 */
  SingleBondDetailBondInfoThirdItemVisible = 'single-bond-detail-bond-info-third-item-visible',

  /** 市场推荐页码数 */
  MarketDealRecommendPageSize = 'market-recommend-page-size',
  /** 市场推荐是否是本人 */
  MarketDealRecommendIsMy = 'market-recommend-is-my',
  /** 市场推荐是否置顶 */
  MarketDealRecommendIsTop = 'market-recommend-is-top',

  /** 桥列表总是置顶 */
  AlwaysOnTopBridgeList = 'always-on-top-bridge-list',
  /** 明细方向汇总 */
  DealDetailPreference = 'deal-detail-preference',

  /** 点价面板债券数 */
  BoardBondsSto = 'board-bonds-sto',
  /** 点价面板债券数(精简模式) */
  BoardBondsStoSimple = 'board-bonds-sto-simple',
  /** 点价结算方式日期筛选(精简模式) */
  BoardSpotDateStoSimple = 'board-spot-date-sto-simple',

  /** 过桥页面汇总高度 */
  BridgeSumHeight = 'bridge-sum-height',

  /** 不同台子 债券列表/实时盘口 结算筛选项  */
  SettlementFilter = 'settlement-filter',

  /** 不同台子 侧边栏结算方式快捷操作  */
  SettlementShortcut = 'settlement-shortcut',

  /** 协同报价 协同分组默认分组 */
  QuoteDraftCurrentBrokerID = 'quote-draft-current-broker-id',
  /**  行情追踪 */
  MarketTrackSpreadStatus = 'market-track-spread-status',
  /** 菜单数据 */
  NavigationMenu = 'navigation-menu',
  /** NCD一、二级是否展开收起 */
  NcdMenuOpen = 'ncd-menu-fold',
  /** NCDP 录入面板是否常开 */
  NCDPBatchFormAlwaysOpen = 'ncdp-batch-form-always-open',
  /** 报价日志 */
  QuoteOperationLogColumnSettings = 'quote-operation-log-column-settings',
  /** 成交日志 */
  MarketLogColumnSettings = 'market-log-column-settings',
  /** IQuote卡片浮窗数据共享 */
  IQuoteRawCards = 'iquote-raw-cards',
  IQuoteInnerCards = 'iquote-inner-cards',
  IQuoteScripts = 'iquote-scripts'
}

export enum CacheProductType {
  NCDALL = 100 // NCD的统一类型,因为首页NCD模式下是不区分一二级的，因此会用到
}

/** 获取本地缓存的 key 的统一方法 */
export const getLSKey = (key: LSKeys, productType: ProductType | CacheProductType) => {
  return `${miscStorage.userInfo?.user_id ?? 'userId'}-${key}-${productType}`;
};

/** 获取本地缓存的 key 的统一方法，不区分 productType */
export const getLSKeyWithoutProductType = (key: LSKeys) => {
  return `${miscStorage.userInfo?.user_id ?? 'userId'}-${key}`;
};
