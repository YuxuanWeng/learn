// 主进程与渲染进程交互的事件
export enum DataLocalizationEvent {
  /** 数据处理流程开始 */
  Start = 'data-localization-start',
  /** 数据处理流程结束 */
  End = 'data-localization-end',
  /** 渲染进程获取端口 */
  NewPort = 'data-localization-new-port',
  /** 渲染进程关闭端口 */
  RemovePort = 'data-localization-remove-port',
  /** 检查本地化状态与信息 */
  CheckStatus = 'data-localization-check-status'
}

/** 数据处理流程 UtilityProcess 相关操作 */
export enum DataLocalizationAction {
  Start = 'start',
  End = 'end',
  NewPort = 'new-port',
  RemovePort = 'remove-port',
  /** 初始化进度更新 */
  InitSyncStateChange = 'init-sync-state-change',
  /** 实时同步状态更新 */
  RealtimeSyncStateChange = 'realtime-sync-state-change',
  /** 日志记录 */
  Log = 'log',
  /** 更新Token更新 */
  TokenUpdate = 'token-update',
  /** 向渲染进程推送更新 */
  LiveDataUpdate = 'live-data-update',

  /** 交易员模糊查询 */
  TraderSearch = 'trader-search',
  /** 根据traderIdList 获取交易员的相关数据 */
  TraderGetByIdList = 'trader-get-by-id-list',
  /** 获取机构下交易员 */
  InstTraderList = 'inst-trader-list',
  /** 经纪人模糊查询 */
  UserSearch = 'user-search',
  /** 机构模糊查询 */
  InstSearch = 'inst-search',
  /** 债券模糊查询 */
  BondSearch = 'bond-search',
  /** 根据keyMarketList 获取债券的相关数据 */
  BondGetByKeyMarketList = 'bond-get-by-key-market-list',
  /** 全局查询 */
  FuzzySearch = 'fuzzy-search',
  /** 根据KeyMarket搜索报价 */
  QuoteSearchByKeyMarket = 'quote-search-by-key-market',
  /** 根据KeyMarket搜索最优、次优报价 */
  QuoteSearchOptimalByKeyMarket = 'quote-search-optimal-by-key-market',
  /** 根据quote_id搜索报价 */
  QuoteSearchById = 'quote-search-by-id',
  /** 报价审核消息列表 */
  QuoteDraftMessageList = 'quote-draft-message-list',
  /** 获取成交记录 */
  DealRecordList = 'deal-record-list',
  /** 获取本地服务状态 */
  LocalServicesStatus = 'local-services-status',
  /** 获取重启本地服务 */
  ServiceRestart = 'service-restart',
  /** 获取本地本地化信息 */
  GetLocalDataInfo = 'get-local-data-info',
  /** 用于Map中的默认值 */
  Unknown = 'unknown'
}

export enum DataLocalizationDashBoardEnum {
  StartWsConnect = 'start_ws_connect',
  InitDataError = 'init_data_error',
  InitDataSuccess = 'init_data_success',
  SyncDataError = 'sync_data_error',
  SyncDisconnect = 'sync_disconnect',
  CheckSyncDataSuccess = 'check_sync_data_success',
  CheckSyncDataError = 'check_sync_data_error',
  WsTempConnectionLoss = 'ws_temp_connection_loss',
  WsResubscribe = 'ws_resubscribe'
}
