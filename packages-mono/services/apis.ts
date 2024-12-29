export const APIs = {
  /** 鉴权相关接口 */
  auth: {
    /** 登录 */
    login: '/auth_api/login',
    /** 检查登录状态 */
    checkLogin: '/auth_api/check_login',
    /** 退出 */
    logout: '/auth_api/logout',
    /** 修改密码 */
    updatePassword: '/auth_api/password/update',
    /** 获取当前用户权限列表 */
    getUserAccess: '/crm/api/access/user/info',
    /** 管理员批量获取用户权限列表 */
    getMulUserAccess: '/crm/api/access/user/mul_get'
  },
  /** 算法相关接口 */
  algo: {
    /** 信用债获取推券 */
    bcoGetRecommendBond: '/bond_rec/recommend_api/bds/get_recommend_bond',
    /** 信用债发送推券 */
    bcoSendRecommendBond: '/bond_rec/recommend_api/bds/send_recommend_bond',
    /** 信用债更新推券 */
    bcoUpdateRecommendBond: '/bond_rec/recommend_api/bds/update_recommend_bond',
    /** 信用债根据主体机构名称获取机构信息 */
    getInstByName: '/bond_rec/recommend_api/bds/get_inst_by_name',
    /** 信用债上传客户推荐名单 */
    uploadIssuerList: '/bond_rec/recommend_api/bds/upload_issuer_list',
    /** 信用债推券获取模版配置 */
    bcoBondRecommendGetConfig: '/bond_rec/recommend_api/bds/get_config',
    /** 信用债推券更新模板配置规则 */
    bcoBondRecommendUpdateConfig: '/bond_rec/recommend_api/bds/update_config',
    /** 信用债推券删除模板配置规则 */
    bcoBondRecommendDeleteConfig: '/bond_rec/recommend_api/bds/delete_config',
    /** 信用债推券设置模版配置规则 */
    bcoBondRecommendEnableConfig: '/bond_rec/recommend_api/bds/enable_config',
    /** 信用债推券设置基本配置 */
    bondRecSetBaseConfig: '/bond_rec/recommend_api/bds/set_base_config',
    /** 信用债推券获取基本配置 */
    bondRecGetBaseConfig: '/bond_rec/recommend_api/bds/get_base_config',

    /** 上传qq聊天消息 */
    messageFlowQQChatStream: '/abase/message_flow/qq_chat_stream',

    /** 快聊获取聊天列表 */
    getChatList: '/helper/quick_chat_api/chat_list_get',
    /** 获取快聊卡片信息 */
    getCardsInfo: '/helper/quick_chat_api/cards_info_get',
    /** 获取交易员配置列表 */
    getTraderConfigList: '/helper/quick_chat_api/get_trader_config_list',
    /** 通知后端room已读 */
    updateRoomReadied: '/helper/quick_chat_api/room_read',
    /** 获取估值配置 */
    getValConfig: '/helper/quick_chat_api/val_config_get',
    /** 重置broker 所有绑定的trader的配置 */
    resetTraderConfig: '/helper/quick_chat_api/reset_broker_all_trader_config',
    /** 修改估值配置 */
    updateValConfig: '/helper/quick_chat_api/val_config_update',
    /** 修改交易员配置 */
    updateTraderConfig: '/helper/quick_chat_api/update_trader_config',
    /** 模糊查询 */
    fuzzySearch: '/helper/quick_chat_api/fuzzy_search',
    /** 获取自动发话术配置 */
    getChatScript: 'helper/quick_chat_api/chat_script_get',
    /** 更新自动发话术配置 */
    updateChatScript: '/helper/quick_chat_api/chat_script_update',

    /** 卡片点击删除/提交 */
    doCardsOperation: '/helper/quick_chat_api/cards_operation',
    /** 卡片全部点击删除/提交 */
    doCardsOperationAll: '/helper/quick_chat_api/cards_all_operation',

    /** 拉取历史消息 */
    getHistoryMsgList: '/helper/quick_chat_api/history_msg_list',
    /** 获取快聊房间已读信息 */
    getLastRoomReadStatus: '/helper/quick_chat_api/room_read_status_get',
    /** 获取房间全量数据 */
    getIQuoteFullRoom: '/helper/quick_chat_api/room_get_all'
  },
  /** base */
  base: {
    /**  获取当前 bds server 毫秒时间戳 */
    currentTimestamp: '/base/current_timestamp',
    /**  批量埋点上报 */
    tracking: '/base/tracking',
    /** 市场闭市时间设置 */
    closingTimeUpsert: '/base/market_closing_time/upsert',
    /** 获取市场闭市时间 */
    closingTimeGet: '/base/market_closing_time/get',
    /** qq消息发送回调 */
    qqSendCallback: '/base/qq/send_msg_callback'
  },
  baseData: {
    /** 债券基准利率查询 */
    bondBenchMarkRateGet: '/base_data/bond_benchmark_rate/get',
    /** 根据债券唯一标识查询流通市场 */
    bondMget: '/base_data/bond/mget',
    /** 债券基准利率查询 */
    bondRatingGet: '/base_data/bond_rating/get',
    /** 债券筛选查询 */
    bondSearch: '/base_data/bond/search',
    /** 搜索发行人/担保人 */
    instInfoSearch: '/base_data/inst_info/search',
    /** 根据发行商代码查询债券 */
    issuerCodeGet: '/base_data/bond/filter',
    /** 根据发行商代码查询发行人信息 */
    issuerInstMulGet: '/base_data/issuer_inst/mul_get',
    /** 根据发行商代码批量查询发行人信息 */
    issuerInstMulSearch: '/base_data/issuer_inst/mul_search',
    /** 根据债券唯一标识查询债券 */
    keyMarketGet: '/base_data/bond/get_by_key_market',
    /** 计算器 */
    mulCalculate: '/base_data/mul_calculate',
    /** 获取某日后的第一个工作日 */
    nextWeekdayGet: '/base_data/next_weekday/get',
    /** 批量获取某日后的前n个工作日，默认不包括当日 */
    nextWeekdayListMulGet: '/base_data/next_weekday_list/mul_get',
    /** 批量获取某日后的第一个工作日，默认不包括当日 */
    nextWeekdayMulGet: '/base_data/next_weekday/mul_get',
    /** 获取今日后的一周期间的第一个工作日 */
    nextWeeklyWeekdayGet: '/base_data/next_weekday/weekly/get',
    /** 获取台子+数据类型对应的同步数据channel，用于同步报价/成交数据 */
    syncDataChannelGet: '/base_data/sync_data_channel/get',
    /** 获取台子+数据类型+开始时间+结束时间（可选）对应的数据ID+版本 */
    syncDataInfoGet: '/base_data/sync_data_info/get',
    /** 根据用户输入模糊查询债券,机构,交易员,经纪人列表 */
    search: '/base_data/search',
    /** 获取某日后n天内的工作日列表 */
    weekdayListGet: '/base_data/weekday_list/get',
    /** 获取批量获取 trader */
    traderMulGet: '/base_data/trader/mul_get',
    /** 基础数据同步接口 */
    baseSyncDataScan: '/base_data/base_sync_data/scan',
    /** 基础数据同步接口 （pb 协议版本） */
    baseSyncDataScanPb: '/pb/base_data/base_sync_data/scan',
    /** 业务数据同步接口 */
    syncDataScan: '/base_data/sync_data/scan',
    /** 基础数据同步接口 （pb 协议版本） */
    syncDataScanPb: '/pb/base_data/sync_data/scan',
    /** 拉取发行人信息 */
    getAllIssuerInst: '/base_data/issuer_inst/get_all',
    /** 本地化根据id拉取基础数据 */
    mulGetById: '/base_data/mul_get_by_id'
  },
  /** 最优报价相关接口 */
  bondOptimalQuote: {
    /** 根据bondId获取最优报价 */
    filter: '/bond_optimal_quote/filter',
    /** 根据key_market获取最优报价的最优价格(精简版) */
    getOptimalPrice: '/bond_optimal_quote/get_optimal_price',
    /** 通过筛选条件获取最优报价 */
    search: '/bond_optimal_quote/search'
  },
  /** 报价相关接口 */
  bondQuote: {
    /** 根据报价 ID 获取报价日志 */
    getOperationLog: '/bond_quote/get_operation_log',
    /** 批量新增报价 */
    mulCreate: '/bond_quote/mul_create',
    /** 批量撤销操作 */
    mulDelete: '/bond_quote/mul_delete',
    /** 批量获取报价详情 */
    mulGet: '/bond_quote/mul_get',
    /** 批量手动撤单 */
    mulRef: '/bond_quote/mul_ref',
    /** 批量更新报价到同一值 */
    mulUpdateByIds: '/bond_quote/mul_update_by_ids',
    /** 批量修改操作 */
    mulUpdate: '/bond_quote/mul_update',
    /** 通过筛选条件获取报价 */
    search: '/bond_quote/search',
    /** 数据同步相关接口 */
    syncData: {
      /** 批量获取报价详情 */
      get: '/bond_quote/sync_data/get',
      /** 根据时间批量获取报价详情 */
      get_by_time: '/bond_quote/sync_data/get_by_time'
    },
    /** 存单一级相关接口 */
    ncdp: {
      /** 通过id批量获取ncd一级 */
      mulGetById: '/bond_quote/ncdp/mul_get_by_id',
      /** 删除NCD一级 */
      delete: '/bond_quote/ncdp/delete',
      /** 根据存单ID获取存单日志 */
      getOperationLog: '/bond_quote/ncdp/get_operation_log',
      /** 批量新增NCD一级 */
      mulCreate: '/bond_quote/ncdp/mul_create',
      /** 通过筛选条件获取ncd一级 */
      search: '/bond_quote/ncdp/search',
      /** 更新NCD一级 */
      update: '/bond_quote/ncdp/update'
    },
    /** 存单二级相关接口 */
    ncd: {}
  },
  /** 协同报价相关接口 */
  bondQuoteDraft: {
    /** 新增报价草稿 */
    add: '/bond_quote_draft/add',
    /** 新增报价审核详情 */
    detailCreate: '/bond_quote_draft/detail/create',
    /** 批量修改草稿 */
    detailMulUpdate: '/bond_quote_draft/detail/mul_update',
    /** 根据id批量修改草稿 */
    detailMulUpdateById: '/bond_quote_draft/detail/mul_update_by_id',
    /** 修改报价审核消息 */
    messageUpdate: '/bond_quote_draft/message/update',
    /** 修改忽略草稿 */
    mulConfirm: '/bond_quote_draft/mul_confirm',
    /** 修改忽略草稿 */
    mulIgnore: '/bond_quote_draft/mul_ignore',
    /** 协同报价轮询接口 */
    search: '/bond_quote_draft/search'
  },
  /** 配置文件相关接口 */
  config: {
    /** 获取namespace下全部配置 */
    getAllByNamespace: '/config/get_all_by_namespace',
    /** 获取配置 */
    get: '/config/get',
    /** 设置配置 */
    set: '/config/set'
  },
  /** CRM 相关接口 */
  crm: {
    /** 获取机构列表 */
    instList: '/crm/api/inst/list'
  },
  /** 成交单相关接口 */
  deal: {
    /** 催单 */
    childDealUrge: '/deal/child_deal/urge',
    /** 根据筛选条件筛选成交明细 */
    detailList: '/deal/detail/list',
    /** 合并分组列表 */
    groupCombinationList: '/deal/group_combination/list',
    /** 增加合并分组 */
    groupCombinationAdd: '/deal/group_combination/add',
    /** 更改合并分组信息 */
    groupCombinationUpdate: '/deal/group_combination/update',
    /** 成交单移交 */
    recordHandOver: '/deal/record/hand_over',
    /** 历史/删除成交单列表 */
    recordSearch: '/deal/record/search',
    /** 成交克隆 */
    recordClone: '/deal/record/clone',
    /** 成交确认 */
    recordConfirm: '/deal/record/confirm',
    /** 查询成交列表 */
    recordGetByFilter: '/deal/record/get_by_filter',
    /** 创建成交单 */
    recordCreate: '/deal/record/create',
    /** 校验n秒内有没有成交记录 */
    recordCheck: '/deal/record/check',
    /** 单条修改 */
    recordUpdate: '/deal/record/update',
    /** 发送消息通知 */
    recordSendMsgCallback: '/deal/record/send_msg_callback',
    /** 线下成交录入 */
    offlineDealMulCreate: '/deal/offline_deal/mul_create',
    /** 根据成交ID获取成交日志 */
    operationLogSearch: '/deal/operation_log/search',
    /** 获取代付机构列表 */
    payForInstGet: '/deal/pay_for_inst/get',
    /** 更新是否为代付机构状态 */
    payForInstStatusUpdate: '/deal/pay_for_inst/status_update',
    /** 获取机构费用设置 */
    payForInstFeeGet: '/deal/pay_for_inst/fee_get',
    /** 创建/更新代付机构费用设置 */
    payForInstFeeUpdate: '/deal/pay_for_inst/fee_update',
    /** 获取所有未读提示通知 */
    notifyUnreadGetAll: '/deal/notify/unread/get_all',
    /** 获取idc成交详情 */
    spotPricingDetailGet: '/deal/spot_pricing_detail/get',
    /** 标记提示通知已读 */
    notifyMarkRead: '/deal/notify/mark_read',
    /** 将某方修改变更设置为已知 */
    dealInfoMarkReadStatus: '/deal/deal_info/mark_read_status',
    /** 同步发送IM信息 */
    syncImMessageStatus: '/deal/sync_im_message_status',
    /** 根据成交 Id 获取成交明细/过桥日志 */
    detailOperationLogSearch: '/deal/detail_operation_log/search'
  },
  /** 地区相关接口 */
  districtInfo: {
    /** 获取地区信息 */
    get: '/district_info/get',
    /** 更新地区信息 */
    update: '/district_info/update'
  },
  /** 筛选分组相关接口 */
  filterGroup: {
    /** 删除筛选分组 */
    delete: '/filter_group/delete',
    /** 根据 broker_id 获取筛选分组 */
    get: '/filter_group/get',
    /** 更新筛选分组 */
    update: '/filter_group/update',
    /** 根据 broker_id 获取筛选分组 */
    orderUpdate: '/filter_group/order/update'
  },
  /** 消息推送相关接口 */
  frontendSyncMsg: {
    /** 拉取channel中缺失的消息 */
    scan: '/frontend_sync_msg/scan'
  },
  /** 机构相关接口 */
  inst: {
    /** 根据用户输入模糊查询机构列表 */
    fuzzySearch: '/inst/fuzzy_search',
    /** 查询机构下属于某台子的交易员列表 */
    traderList: '/inst/trader/list',
    /** 根据用户输入模糊查询机构列表（包括所属所有交易员） */
    fuzzySearchWithTraders: '/inst/with_traders/fuzzy_search'
  },
  /** 机构交易员相关接口 */
  instTrader: {
    /** 机构交易员模糊查询 */
    search: '/inst_trader/search'
  },
  /** 市场成交相关接口 */
  marketDeal: {
    /** 根据市场成交ID获取市场成交日志 */
    getOperationLog: '/market_deal/get_operation_log',
    /** 市场成交-新增市场成交（支持批量） */
    mulCreate: '/market_deal/mul_create',
    /** 市场成交- 右边栏批量更新到同一值 */
    mulUpdateByIds: '/market_deal/mul_update_by_ids',
    /** 市场成交-修改市场成交，包含Undo（支持批量） */
    mulUpdate: '/market_deal/mul_update',
    /** 市场成交- 获取市场成交详情 */
    mulGet: '/market_deal/mul_get',
    /** 通过筛选条件获取市场成交 */
    search: '/market_deal/search'
  },
  /** 外发数据管理相关 */
  marketNotify: {
    /** odm-获取消息字段内容 */
    tagGetAll: '/market_notify/tag/get_all',
    /** odm-查询外发数据 */
    msgSearch: '/market_notify/msg/search'
  },
  /** 对价提醒 */
  oppositePriceNotification: {
    /** 根据当前经纪人批量获取对价提醒 */
    get: '/opposite_price_notification/get',
    /** 批量删除对价提醒 */
    mulDelete: '/opposite_price_notification/mul_delete',
    /** 批量更新当前经纪人对价提醒发送状态 */
    mulUpdate: '/opposite_price_notification/mul_update',
    setting: {
      /** 根据当前经纪人获取对价提醒设置 */
      get: '/opposite_price_notification/setting/get',
      /** 修改当前经纪人对价提醒设置，只传入需要修改的值;如果当前用户无配置，则转为新增，无值字段取默认值 */
      upsert: '/opposite_price_notification/setting/upsert'
    },
    traderSetting: {
      /** 根据经纪人id获取对价提醒-交易员渠道信息 */
      get: '/opposite_price_notification/trader_setting/get',
      /** 修改经纪人对价提醒-交易员渠道信息 */
      update: '/opposite_price_notification/trader_setting/update'
    }
  },
  handicap: {
    /** 债券代码批量获取报价&成交盘口信息&债券基础信息 */
    getByBond: '/handicap/get_by_bond'
  },
  /** 识别相关接口 */
  parsing: {
    /** 单条报价：https://shihetech.feishu.cn/docx/MhQwdOk8So6SMfx8uXpcvidknP2 */
    quoteInfo: '/parsing/quote_info',
    /** 线下成交单识别 */
    dealInfo: '/parsing/deal_info',
    /** 结算方式识别 */
    clearSpeed: '/parsing/clear_speed',
    /** ncd二级录入文本识别筛选项 */
    ncdFilter: '/parsing/ncd_filter',
    /** ncd一级录入文本识别 */
    ncdpInfo: '/parsing/ncdp_info'
  },
  /** 行业信息接口 */
  swSectorInfo: {
    /** 获取行业信息 */
    get: '/sw_sector_info/get'
  },
  /** 模版(redis读取)相关接口 */
  template: {
    /** 获取模版(redis读取) */
    get: '/template/get',
    /** 更新模版(redis写入) */
    set: '/template/set'
  },
  /** 交易员相关接口 */
  trader: {
    /** 根据用户输入模糊搜索交易员列表 */
    search: '/trader/search',
    /** 根据交易员id查询交易员 */
    getById: '/trader/get_by_id'
  },
  /** 用户相关接口 */
  user: {
    /** 查看个人信息 */
    getInfo: '/user/info/get',
    /** 获取个人快捷键列表 */
    hotkeyGet: '/user/hotkey/get',
    /** 新建/更新个人快捷键 */
    hotkeyMulUpsert: '/user/hotkey/mul_upsert',
    /** 根据台子搜索所有用户列表 */
    list: '/user/list',
    /** 删除个人设置 */
    settingDelete: '/user/setting/delete',
    /** 获取用户个人设置 */
    settingGet: '/user/setting/get',
    /** 获取搜索首选项 */
    preferenceGet: '/user/preference/get',
    /** 批量更新搜索首选项 */
    preferenceMulUpsert: '/user/preference/mul_upsert',
    /** 批量新建/更新个人设置 */
    settingMulUpsert: '/user/setting/mul_upsert',
    /** 编辑个人信息 */
    updateInfo: '/user/info/update',
    /** 更新密码 */
    updatePassword: '/user/password/update',
    /** 获取用户授权列表 */
    getUserAccessGrant: '/user/access_grant/get',
    /** 批量创建被授权人 */
    mulCreateGrantee: '/user/access_grant/grantee_mul_create',
    /** 批量删除被授权人 */
    mulDeleteGrantee: '/user/access_grant/grantee_mul_delete',
    /** 更新某个被授权人信息 */
    updateGrantee: '/user/access_grant/grantee_update',
    /** 用户信息 */
    setting: {
      /** 获取用户个人高级筛选分组设置 */
      getFilterGroup: '/user/setting/filter_group/get',
      /** 删除用户个人高级筛选分组设置 */
      deleteFilterGroup: '/user/setting/filter_group/delete',
      /** 创建用户个人高级筛选分组设置 */
      upsertFilterGroup: '/user/setting/filter_group/upsert'
    }
  },
  bridge: {
    /** 添加桥机构 */
    instAdd: '/bridge/inst/add',
    /** 删除桥机构 */
    instDel: '/bridge/inst/del',
    /** 添加过桥记录 */
    instSearch: '/bridge/inst/search',
    /** 修改桥机构 */
    instUpdate: '/bridge/inst/update',
    /** 编辑桥 */
    updateBridge: '/receipt_deal/bridge/update',
    /** 编辑桥V2 */
    updateBridges: '/receipt_deal/bridge/update_v2',
    /** 无桥成交单编辑 */
    updateNoneBridge: '/receipt_deal/non_bridge/update',
    /** 批量编辑桥 */
    mulUpdateBridge: '/receipt_deal/bridge/mul_update',
    /** 重置桥信息 */
    resetBridgeInfo: '/receipt_deal/reset_bridge_info',
    /** 批量重置桥信息 */
    mulResetBridgeInfo: '/receipt_deal/mul_reset_bridge_info',
    /** 批量修改成交单待加桥状态 */
    mulUpdateNeedBridge: '/receipt_deal/update_need_bridge'
  },
  receiptDeal: {
    /** 成交单批量录入 */
    mul_add: '/receipt_deal/mul_add',
    /** 成交单确认 */
    confirm: '/receipt_deal/confirm',
    /** 成交单批量确认 */
    mulConfirm: '/receipt_deal/mul_confirm',
    /** 成交单查询（通过源成交单，可查询桥相关成交单） */
    getByParent: '/receipt_deal/get_by_parent',
    /** 成交单删除 */
    delete: '/receipt_deal/delete',
    /** 给成交单加桥 */
    bridgeAdd: '/receipt_deal/bridge/add',
    /** 给成交单换桥 */
    bridgeChange: '/receipt_deal/bridge/change',
    /** 成交单关联桥 */
    bridgeAssociate: '/receipt_deal/bridge/associate',
    /** 成交单删除桥 */
    bridgeDelete: '/receipt_deal/bridge/delete',
    /** 修改成交单发单信息 */
    updateSendOrderInfo: '/receipt_deal/update_send_order_info',
    /** 成交单提交 */
    submit: '/receipt_deal/submit',
    /** 成交单编辑 */
    update: '/receipt_deal/update',
    /** 成交单加急 */
    urgent: '/receipt_deal/urgent',
    /** 成交单毁单 */
    destroy: '/receipt_deal/destroy',
    /** 根据成交单 Id查询 */
    mulGetById: '/receipt_deal/mul_get_by_id',
    /** 根据成交 Id 获取成交日志 */
    getOperationLog: '/receipt_deal/get_operation_log',
    /** 批量移交 */
    mulHandOver: '/receipt_deal/mul_hand_over',
    /** 成交单列表反挂 */
    quoteUnrefer: '/receipt_deal/quote/unrefer',
    /** 成交单查询 轮询接口 */
    search: '/receipt_deal/search',
    /** 成交单查询 轮询接口 */
    search_v2: '/receipt_deal/search_v2',
    /** 成交单查询 明细轮询接口 */
    dealDetailSearch: 'receipt_deal/detail/search',
    /** 按条件获取过桥记录 */
    dealDetailSearchByInst: '/receipt_deal/detail/search_by_bridge_inst',
    /** 历史成交单查询 */
    historyDealSearch: '/receipt_deal/real_parent_deal/search',
    /** 更新找桥配置 */
    updateDefaultBridgeConfig: '/receipt_deal/update_default_bridge_config',
    /** 查询当前用户对于成交单的上次确认数据 */
    getReceiptDealConfirmData: '/receipt_deal/get_confirm_data'
  },
  /** 成交审批相关接口 */
  receiptDealApproval: {
    /** 审批列表 */
    search: '/receipt_deal/approval/search',
    /** 历史查询 */
    searchHistory: '/receipt_deal/approval/search_history',
    history: {
      /** 获取成交审批历史是否需要更新 */
      checkUpdate: '/receipt_deal/approval/history/check_update',
      /** 导出成交审批 */
      export: '/receipt_deal/approval/history/export'
    },
    /** 审批流程更新 */
    update: '/receipt_deal/approval/update',
    role: {
      /** 批量创建/更新审批角色 */
      mulUpsert: '/receipt_deal/approval_role/mul_upsert',
      /** 获取审批角色 */
      getAll: '/receipt_deal/approval_role/get_all',
      /** 删除审批角色 */
      mulDelete: '/receipt_deal/approval_role/mul_delete'
    },
    rule: {
      /** 批量创建/更新审批规则 */
      mulUpsert: '/receipt_deal/approval_rule/mul_upsert',
      /** 获取所有审批规则 */
      getAll: '/receipt_deal/approval_rule/get_all'
    },
    /** 打印成交单 */
    print: '/receipt_deal/print',
    /** 获取审批流程 */
    processGet: '/receipt_deal/approval/process/get'
  },
  /** 上传相关接口 */
  upload: {
    /** 预签名上传链接 */
    preSignPut: '/upload/pre_sign_put'
  },
  /** im相关接口 */
  im: {
    /** 上传群消息 */
    groupMsgAdd: '/im/qq_group_msg_add'
  },
  /** 消息中心相关接口 */
  message: {
    /** 获取消息列表，返回最近两天内的近200条，若这200条有n条被删除，返回200-n条 */
    mulGet: '/message/mul_get',
    /** 删除消息 */
    mulDelete: '/message/mul_delete',
    /** 消息置为已读 */
    mulRead: '/message/mul_read'
  }
};
