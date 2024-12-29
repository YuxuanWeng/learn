export enum WindowName {
  /** 首页 */
  MainHome = 'main_home',
  /** 行情看板 - 次级首页，，首页、次级首页比较特殊，为区分，使用下划线而非横线作为分隔符 */
  ProductPanel = 'product_panel',
  /** 计算器 */
  Calculator = 'calculator',
  /** 协同报价 */
  CollaborativeQuote = 'collaborative-quote',
  /** BCO idc首页 */
  BCOIdcHome = 'idc-BCO',
  /** BNC idc首页 */
  BNCIdcHome = 'idc-BNC',
  /** 点价 */
  IdcSpot = 'idc-spot',
  /** 指定点价 */
  IdcAppointSpot = 'idc-appoint-spot',
  /** 债券详情 */
  IdcBondDetail = 'idc-bond-detail',
  LoadingWindow = 'loading-window',
  /** 版本更新 */
  UpdateDownload = 'update-download',
  /** 登录 */
  Login = 'login',
  /** 单条报价 V2 */
  SingleQuoteV2 = 'single-quote-v2',
  /** 批量报价 */
  BatchQuote = 'batch-quote',
  /** 快捷键 */
  ShortCut = 'short-cut',
  /** 系统管理 */
  SystemManage = 'system-manage',
  /** 操作日志 */
  QuoteOperationLog = 'quote-log',
  /** 单券详情 */
  SingleBond = 'single-bond',
  /** 市场成交 */
  MarketDeal = 'market-deal',
  /** 市场成交操作日志 */
  MarketOperationLog = 'market-log',
  /** 市场成交悬浮窗 */
  MarketRecommend = 'market-recommend',
  /** 市场成交悬浮窗设置 */
  MarketRecommendSetting = 'market-recommend-setting',
  NetworkError = 'network-error',
  /** 点价提示 */
  SpotPricingHint = 'spot-pricing-hint',
  /** 过桥 */
  Bridge = 'bridge',
  /** 成交明细 */
  DealDetail = 'deal-detail',
  /** 主进程日志页 */
  MainLogPage = 'main-log-page',
  /** 信用推券 */
  BcoBondRecommend = 'bco-bond-recommend',
  /** iquote */
  IQuote = 'iquote',
  /** iquote 悬浮卡片 */
  IQuoteCard = 'iquote-card',
  /** 对价提醒 */
  WatchQuoteRemindDialog = 'watch-quote-remind-dialog',

  /** 成交单看板 */
  ReceiptDealPanel = 'receipt-deal-panel',
  /** 成交单录入表单 */
  ReceiptDealForm = 'receipt-deal-form',
  /** 成交单录入表单 */
  ReceiptDealBatchForm = 'receipt-deal-batch-form',
  /** 成交单录入 */
  ReceiptDealLog = 'receipt-deal-log',
  /** 过桥明细操作日志 */
  DealDealLog = 'deal-detail-log',
  /** 点价历史记录 */
  SpotHistoryRecords = 'spot-history-records',
  /** NCDP 操作日志 */
  NCDPOperationLog = 'ncdp-operation-log',
  /** NCDP 录入表单 */
  NCDPBatchForm = 'ncdp-batch-form'
}

export enum CommonRoute {
  /** 根路由 */
  Root = '/',
  /** 登录页 */
  Login = '/login',
  /** 下载更新页面 */
  UpdateDownload = '/update-download',
  /** 首页 */
  Home = '/home',
  /** 行情看板 */
  ProductPanel = '/product-panel',
  /** 首页 - 成交单看板 */
  HomeReceiptDealPanel = '/home/receipt-deal-panel',
  /** 单条报价 */
  SingleQuote = '/dialog/single-quote',
  /** 债券详情 */
  BondDetail = '/dialog/bond-detail',
  /** 操作日志 */
  QuoteOperationLog = '/dialog/quote-log',
  /** iQuote（原快聊） */
  IQuote = '/dialog/algo/iQuote',
  IQuoteCard = '/dialog/algo/iquote-card',
  /** 计算器 */
  Calculator = '/dialog/calculator',
  /** 协同报价 */
  CollaborativeQuote = '/dialog/collaborative-quote',
  /** 空白路由页，用于窗口池快速切换路由使用 */
  PreparedWindow = '/prepared-window',
  /** debug详细信息页 */
  DebugDetailPage = '/dialog/debug-detail-page',
  /** 批量报价 */
  BatchQuote = '/dialog/batch-quote',
  /** 利率点价首页 */
  SpotPanel = '/spot/panel',
  /** 利率点价删除记录 */
  SpotDeleteRecords = '/spot/deleted-records',
  /** 点价提示 */
  SpotPricingHint = '/spot-pricing-hint',
  /** 点价窗口 */
  SpotModal = '/dialog/spot-modal',
  /** 点价历史记录 */
  SpotHistoryRecords = '/dialog/spot/history-records',
  /** 指定模式点价窗口 */
  SpotAppointModal = '/dialog/spot-appoint-modal',
  /** 单券详情 */
  SpotBondDetail = '/dialog/spot-bond-detail',
  /** 操作记录 */
  SpotOperRecord = '/dialog/spot-operation-record',
  /** 市场成交录入弹窗 */
  MarketDeal = '/dialog/market-deal',
  /** 市场成交操作日志 */
  MarketOperationLog = '/dialog/market-log',
  /** 市场成交悬浮窗 */
  MarketRecommend = '/dialog/market-recommend',
  /** 市场成交悬浮窗设置 */
  MarketRecommendSetting = '/dialog/market-recommend/setting',
  /** 推券 */
  BondRecommend = '/dialog/algo/bond-recommend',
  /** 行情追踪 */
  MarketTrack = '/dialog/algo/market-track',
  /** 成交明细 */
  DealDetail = '/dialog/deal-details',
  /** 过桥 */
  Bridge = '/dialog/bridge',
  /** 成交单看板 */
  ReceiptDealPanel = '/dialog/receipt-deal-panel',
  /** 成交单录入表单 */
  ReceiptDealForm = '/dialog/receipt-deal-form',
  /** 成交单批量录入 */
  ReceiptDealBatchForm = '/dialog/receipt-deal-batch-form',
  /** 成交单录入 */
  ReceiptDealLog = '/dialog/receipt-deal-log',
  /** 过桥/成交明细日志 */
  DealDetailLog = '/dialog/deal-detail-log',
  /** NCDP 操作日志 */
  NCDPOperationLog = '/dialog/ncdp-operation-log',
  /** NCDP 录入表单 */
  NCDPBatchForm = '/dialog/ncdp-batch-form'
}

export enum WindowCrashedEnum {
  /** 前端触发崩溃级错误，进入sentry-onError后，发送的事件 */
  PageError = 'window-page-error',
  PageErrorCallback = 'window-page-error-callback',
  TestSystemCrash = 'test-system-crash'
}
