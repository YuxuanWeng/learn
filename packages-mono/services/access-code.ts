export enum AccessCode {
  DefaultCodeEnum,
  /** OMS-利率 */
  CodeOmsBNC,
  /** 利率行情模块 */
  CodeOmsBNCMkt,
  /** 利率行情菜单 */
  CodeOmsBNCMktMenu,
  /** 利率行情页面 */
  CodeOmsBNCMktPage,
  /** 利率报价及报价编辑 */
  CodeOmsBNCMktQuote,
  /** 利率成交 */
  CodeOmsBNCMktDeal,
  /** 利率债券详情 */
  CodeOmsBNCMktBond,
  /** 利率日志 */
  CodeOmsBNCMktLog,
  /** 利率协同报价模块 */
  CodeOmsBNCCollaboration,
  /** 利率协同报价 */
  CodeOmsBNCCollaborationMenu,
  /** 利率iQuote模块 */
  CodeOmsBNCIQuote,
  /** 利率iQuote菜单 */
  CodeOmsBNCIQuoteMenu,
  /** 利率行情追踪模块 */
  CodeOmsBNCTrace,
  /** 利率行情追踪菜单 */
  CodeOmsBNCTraceMenu,
  /** 利率计算器模块 */
  CodeOmsBNCCal,
  /** 利率计算器菜单 */
  CodeOmsBNCCalMenu,
  /** 利率点价模块 */
  CodeOmsBNCSpotPricing,
  /** 利率点价菜单 */
  CodeOmsBNCSpotPricingMenu,
  /** 利率点价板、成交记录 */
  CodeOmsBNCSpotPricingPage,
  /** 利率点价 */
  CodeOmsBNCSpotPricingAction,
  /** 利率refer */
  CodeOmsBNCSpotPricingRefer,
  /** 利率成交记录克隆、编辑、删除 */
  CodeOmsBNCSpotPricingRecordEdit,
  /** 利率成交记录发送 */
  CodeOmsBNCSpotPricingRecordSend,
  /** 利率成交记录操作日志 */
  CodeOmsBNCSpotPricingRecordLog,
  /** 利率历史记录 */
  CodeOmsBNCSpotPricingHistPage,
  /** 利率本人 */
  CodeOmsBNCSpotPricingHistSelf,
  /** 利率全部 */
  CodeOmsBNCSpotPricingHistAll,
  /** 利率明细 */
  CodeOmsBNCDealDetail,
  /** 利率明细 */
  CodeOmsBNCDealDetailMenu,
  /** 利率明细 */
  CodeOmsBNCDealDetailPage,
  /** 利率桥信息编辑 */
  CodeOmsBNCDealDetailBridgeEdit,
  /** 利率发单信息编辑 */
  CodeOmsBNCDealDetailSendEdit,
  /** 利率发送 */
  CodeOmsBNCDealDetailSend,
  /** 利率催单 */
  CodeOmsBNCDealDetailBuzz,
  /** @deprecated 利率桥机构列表 */
  CodeOmsBNCDealDetailBridgeInst,
  /** 利率新建桥机构 */
  CodeOmsBNCDealDetailBridgeInstAdd,
  /** 利率操作日志 */
  CodeOmsBNCDealDetailLog,
  /** 利率代付机构费率维护 */
  CodeOmsBNCDealDetailPayforRate,
  /** 利率过桥模块 */
  CodeOmsBNCBridge,
  /** 利率过桥菜单 */
  CodeOmsBNCBridgeMenu,
  /** 利率过桥页面 */
  CodeOmsBNCBridgePage,
  /** 利率本人 */
  CodeOmsBNCBridgeSelf,
  /** 利率全部 */
  CodeOmsBNCBridgeAll,
  /** 利率桥机构添加、删除、修改 */
  CodeOmsBNCBridgeInstEdit,
  /** 利率桥信息编辑 */
  CodeOmsBNCBridgeRecordEdit,
  /** 利率操作日志 */
  CodeOmsBNCBridgeLog,
  /** 利率成交单模块 */
  CodeOmsBNCReceiptDeal,
  /** 利率成交单菜单 */
  CodeOmsBNCReceiptDealMenu,
  /** 利率成交单页面 */
  CodeOmsBNCReceiptDealPage,
  /** 利率本人 */
  CodeOmsBNCReceiptDealSelf,
  /** 利率全部 */
  CodeOmsBNCReceiptDealAll,
  /** 利率成交录入、编辑 */
  CodeOmsBNCReceiptDealEdit,
  /** 利率成交确认、提交、毁单 */
  CodeOmsBNCReceiptDealSubmit,
  /** 利率操作日志 */
  CodeOmsBNCReceiptDealLog,
  /** 利率设置 */
  CodeOmsBNCSetting,
  /** 利率设置 */
  CodeOmsBNCSettingMenu,
  /** 利率指定授权人设置 */
  CodeOmsBNCSettingAssign,
  /** DTM */
  CodeDTM,
  /** DTM模块 */
  CodeDTMDTM,
  /** 审批列表菜单 */
  CodeDTMApprovalMenu,
  /** 审批列表页面 */
  CodeDTMApprovalPage,
  /** @deprecated 下载 */
  CodeDTMApprovalDownload,
  /** 操作日志 */
  CodeDTMApprovalLog,
  /** 历史查询菜单 */
  CodeDTMHistoryMenu,
  /** 历史查询页面 */
  CodeDTMHistoryPage,
  /** 打印 */
  CodeDTMHistoryPrint,
  /** 操作日志 */
  CodeDTMHistoryLog,
  /** 后台配置菜单 */
  CodeDTMSettingMenu,
  /** 后台配置页面 */
  CodeDTMSettingPage,
  /** 角色配置 */
  CodeDTMSettingRole,
  /** 角色添加、删除、修改 */
  CodeDTMSettingRoleEdit,
  /** 规则配置 */
  CodeDTMSettingRule,
  /** 编辑 */
  CodeDTMSettingRuleEdit,
  /** CRM */
  Crm,
  /** 信息管理 */
  CrmInfoManage,
  /** 机构列表 */
  CrmInstManage,
  /** 机构列表 */
  CrmInstList,
  /** 全部机构 */
  CrmProfileInstAll,
  /** 相关机构 */
  CrmProfileInstRelated,
  /** 机构添加 */
  CrmInstCreate,
  /** 业务产品变更 */
  CrmInstBusinessProductUpdate,
  /** 机构详情查询 */
  CrmInstDetailSearch,
  /** 全部机构 */
  CrmDetailInstAll,
  /** 相关机构 */
  CrmDetailInstRelated,
  /** 基本信息 */
  CrmInstBasicInfo,
  /** 编辑 */
  CrmInstBasicUpdate,
  /** 交易员 */
  CrmInstTrader,
  /** 编辑 */
  CrmInstTraderBrokerModify,
  /** 历史记录 */
  CrmInstHistory,
  /** 机构维护 */
  CrmInstMaintain,
  /** 交易员列表 */
  CrmTraderManage,
  /** 交易员列表 */
  CrmTraderList,
  /** 全部交易员 */
  CrmProfileTraderAll,
  /** 相关交易员 */
  CrmProfileTraderRelated,
  /** 业务产品变更 */
  CrmChangeProduct,
  /** 经纪人变更 */
  CrmChangeBroker,
  /** 交易员添加 */
  CrmTraderCreate,
  /** 交易员详情查询 */
  CrmTraderDetailSearch,
  /** 全部交易员 */
  CrmDetailTraderAll,
  /** 相关交易员 */
  CrmDetailTraderRelated,
  /** 经纪人 */
  CrmTraderBroker,
  /** 编辑 */
  CrmTraderBrokerEdit,
  /** 基本信息 */
  CrmTraderBasicInfo,
  /** 编辑 */
  CrmTraderUpdate,
  /** 历史记录 */
  CrmTraderOphistory,
  /** 事业路线 */
  CrmTraderInstHistory,
  /** 编辑 */
  CrmTraderInstHistoryUpdate,
  /** 交易员维护 */
  CrmTraderMaintain,
  /** 属性管理 */
  CrmBackstageManage,
  /** 地域查询 */
  CrmDistrictManage,
  /** 地域查询 */
  CrmDistrictSearch,
  /** 机构属性 */
  CrmInstTagManage,
  /** 机构属性 */
  CrmInstTagSearch,
  /** 机构类型 */
  CrmInstType,
  /** 编辑 */
  CrmInstTypeEdit,
  /** 机构级别 */
  CrmInstLevel,
  /** 编辑 */
  CrmInstLevelEdit,
  /** 资金类型 */
  CrmFundsType,
  /** 编辑 */
  CrmFundsTypeEdit,
  /** 业务产品 */
  CrmProductManage,
  /** 业务产品 */
  CrmProductSearch,
  /** 编辑 */
  CrmProductUpdate,
  /** 安全设置 */
  CrmSecuritySetting,
  /** 安全设置 */
  CrmGlobalSettingUpdate,
  /** 组织架构 */
  CrmIntracompanyManage,
  /** 部门管理 */
  CrmDepartmentManage,
  /** 部门列表 */
  CrmDepartmentSearch,
  /** 编辑 */
  CrmDepartmentEdit,
  /** 成员管理 */
  CrmUserManage,
  /** 成员列表 */
  CrmUserProfileSearch,
  /** 本人 */
  CrmUserSelf,
  /** 部门负责人 */
  CrmUserDepartmentHead,
  /** 部门成员 */
  CrmUserDepartmentMember,
  /** 全部成员 */
  CrmUserSearch,
  /** 添加成员 */
  CrmUserCreate,
  /** 业务产品维护 */
  CrmUserProductManage,
  /** 更多操作 */
  CrmUserMoreActions,
  /** 部门添加 */
  CrmUserDepCreate,
  /** 账号启用/停用 */
  CrmUserEnableMaintain,
  /** 成员入职/离职 */
  CrmUserMaintain,
  /** 成员详情查询 */
  CrmUserDetailSearch,
  /** 基本信息 */
  CrmUserBasicInfo,
  /** 编辑 */
  CrmUserBasicUpdate,
  /** 交易员 */
  CrmBrokerTrader,
  /** 编辑 */
  CrmBrokerTraderModify,
  /** 权限管理 */
  CrmUserAccessInfo,
  /** 编辑 */
  CrmUserAccessUpdate,
  /** 角色管理 */
  CrmRoleManage,
  /** 角色列表 */
  CrmRoleProfileSearch,
  /** 角色添加/删除 */
  CrmRoleEdit,
  /** 角色详情查询 */
  CrmRoleDetailSearch,
  /** 基本信息 */
  CrmRoleBasicInfo,
  /** 编辑 */
  CrmRoleBasicUpdate,
  /** 权限配置 */
  CrmRoleAccessInfo,
  /** 编辑 */
  CrmRoleAccessUpdate,
  /** 成员授权 */
  CrmRoleUserInfo,
  /** 编辑 */
  CrmRoleUserBind,
  /** 机构拓扑关系图 */
  CrmInstTree,
  /** 导出 */
  CodeDTMHistoryExport,
  /** DTM历史查询审核流程 */
  CodeDTMHistoryAudit,
  /** 外发数据管理 */
  CodeOdmManage,
  /** 外发数据管理 */
  CodeOdmManagePage,
  /** 外发数据看板 */
  CodeOdmDataBoard,
  /** 行情推送记录 */
  CodeOdmMsgLog,
  /** 行情推送配置 */
  CodeOdmConfig,
  /** 编辑 */
  CodeOdmUpdate,
  /** ODM */
  CodeOdm,
  /** 交易员列表页面交易员维护 */
  CrmTraderListMaintain,
  /** 成交查询菜单 */
  CodeDTMCompletedHistoryMenu,
  /** 成交查询页面 */
  CodeDTMCompletedHistoryPage,
  /** DTM成交查询打印 */
  CodeDTMCompletedHistoryPrint,
  /** DTM成交查询操作日志 */
  CodeDTMCompletedHistoryLog,
  /** OMS-信用 */
  CodeOmsBCO,
  /** 信用行情模块 */
  CodeOmsBCOMkt,
  /** 信用行情菜单 */
  CodeOmsBCOMktMenu,
  /** 信用行情页面 */
  CodeOmsBCOMktPage,
  /** 信用报价及报价编辑 */
  CodeOmsBCOMktQuote,
  /** 信用成交 */
  CodeOmsBCOMktDeal,
  /** 信用债券详情 */
  CodeOmsBCOMktBond,
  /** 信用日志 */
  CodeOmsBCOMktLog,
  /** 信用协同报价模块 */
  CodeOmsBCOCollaboration,
  /** 信用协同报价 */
  CodeOmsBCOCollaborationMenu,
  /** 信用iQuote模块 */
  CodeOmsBCOIQuote,
  /** 信用iQuote菜单 */
  CodeOmsBCOIQuoteMenu,
  /** 信用行情追踪模块 */
  CodeOmsBCOTrace,
  /** 信用行情追踪菜单 */
  CodeOmsBCOTraceMenu,
  /** 信用计算器模块 */
  CodeOmsBCOCal,
  /** 信用计算器菜单 */
  CodeOmsBCOCalMenu,
  /** 信用点价模块 */
  CodeOmsBCOSpotPricing,
  /** 信用点价菜单 */
  CodeOmsBCOSpotPricingMenu,
  /** 信用点价板、成交记录 */
  CodeOmsBCOSpotPricingPage,
  /** 信用点价 */
  CodeOmsBCOSpotPricingAction,
  /** 信用refer */
  CodeOmsBCOSpotPricingRefer,
  /** 信用成交记录克隆、编辑、删除 */
  CodeOmsBCOSpotPricingRecordEdit,
  /** 信用成交记录发送 */
  CodeOmsBCOSpotPricingRecordSend,
  /** 信用成交记录操作日志 */
  CodeOmsBCOSpotPricingRecordLog,
  /** 信用历史记录 */
  CodeOmsBCOSpotPricingHistPage,
  /** 信用本人 */
  CodeOmsBCOSpotPricingHistSelf,
  /** 信用全部 */
  CodeOmsBCOSpotPricingHistAll,
  /** 信用明细 */
  CodeOmsBCODealDetail,
  /** 信用明细 */
  CodeOmsBCODealDetailMenu,
  /** 信用明细 */
  CodeOmsBCODealDetailPage,
  /** 信用桥信息编辑 */
  CodeOmsBCODealDetailBridgeEdit,
  /** 信用发单信息编辑 */
  CodeOmsBCODealDetailSendEdit,
  /** 信用发送 */
  CodeOmsBCODealDetailSend,
  /** 信用催单 */
  CodeOmsBCODealDetailBuzz,
  /** 信用新建桥机构 */
  CodeOmsBCODealDetailBridgeInstAdd,
  /** 信用操作日志 */
  CodeOmsBCODealDetailLog,
  /** 信用代付机构费率维护 */
  CodeOmsBCODealDetailPayforRate,
  /** 信用过桥模块 */
  CodeOmsBCOBridge,
  /** 信用过桥菜单 */
  CodeOmsBCOBridgeMenu,
  /** 信用过桥页面 */
  CodeOmsBCOBridgePage,
  /** 信用本人 */
  CodeOmsBCOBridgeSelf,
  /** 信用全部 */
  CodeOmsBCOBridgeAll,
  /** 信用桥机构添加、删除、修改 */
  CodeOmsBCOBridgeInstEdit,
  /** 信用桥信息编辑 */
  CodeOmsBCOBridgeRecordEdit,
  /** 信用操作日志 */
  CodeOmsBCOBridgeLog,
  /** 信用成交单模块 */
  CodeOmsBCOReceiptDeal,
  /** 信用成交单菜单 */
  CodeOmsBCOReceiptDealMenu,
  /** 信用成交单页面 */
  CodeOmsBCOReceiptDealPage,
  /** 信用本人 */
  CodeOmsBCOReceiptDealSelf,
  /** 信用全部 */
  CodeOmsBCOReceiptDealAll,
  /** 信用成交录入、编辑 */
  CodeOmsBCOReceiptDealEdit,
  /** 信用成交确认、提交、毁单 */
  CodeOmsBCOReceiptDealSubmit,
  /** 信用操作日志 */
  CodeOmsBCOReceiptDealLog,
  /** 信用设置 */
  CodeOmsBCOSetting,
  /** 信用设置 */
  CodeOmsBCOSettingMenu,
  /** 信用指定授权人设置 */
  CodeOmsBCOSettingAssign,
  /** OMS-NCD二级 */
  CodeOmsNCD,
  /** NCD二级行情模块 */
  CodeOmsNCDMkt,
  /** NCD二级行情菜单 */
  CodeOmsNCDMktMenu,
  /** NCD二级行情页面 */
  CodeOmsNCDMktPage,
  /** NCD二级报价及报价编辑 */
  CodeOmsNCDMktQuote,
  /** NCD二级成交 */
  CodeOmsNCDMktDeal,
  /** NCD二级债券详情 */
  CodeOmsNCDMktBond,
  /** NCD二级日志 */
  CodeOmsNCDMktLog,
  /** NCD二级协同报价模块 */
  CodeOmsNCDCollaboration,
  /** NCD二级协同报价 */
  CodeOmsNCDCollaborationMenu,
  /** NCD二级计算器模块 */
  CodeOmsNCDCal,
  /** NCD二级计算器菜单 */
  CodeOmsNCDCalMenu,
  /** NCD二级明细 */
  CodeOmsNCDDealDetail,
  /** NCD二级明细 */
  CodeOmsNCDDealDetailMenu,
  /** NCD二级明细 */
  CodeOmsNCDDealDetailPage,
  /** NCD二级桥信息编辑 */
  CodeOmsNCDDealDetailBridgeEdit,
  /** NCD二级发单信息编辑 */
  CodeOmsNCDDealDetailSendEdit,
  /** NCD二级发送 */
  CodeOmsNCDDealDetailSend,
  /** NCD二级催单 */
  CodeOmsNCDDealDetailBuzz,
  /** NCD二级新建桥机构 */
  CodeOmsNCDDealDetailBridgeInstAdd,
  /** NCD二级操作日志 */
  CodeOmsNCDDealDetailLog,
  /** NCD二级代付机构费率维护 */
  CodeOmsNCDDealDetailPayforRate,
  /** NCD二级过桥模块 */
  CodeOmsNCDBridge,
  /** NCD二级过桥菜单 */
  CodeOmsNCDBridgeMenu,
  /** NCD二级过桥页面 */
  CodeOmsNCDBridgePage,
  /** NCD二级本人 */
  CodeOmsNCDBridgeSelf,
  /** NCD二级全部 */
  CodeOmsNCDBridgeAll,
  /** NCD二级桥机构添加、删除、修改 */
  CodeOmsNCDBridgeInstEdit,
  /** NCD二级桥信息编辑 */
  CodeOmsNCDBridgeRecordEdit,
  /** NCD二级操作日志 */
  CodeOmsNCDBridgeLog,
  /** NCD二级成交单模块 */
  CodeOmsNCDReceiptDeal,
  /** NCD二级成交单菜单 */
  CodeOmsNCDReceiptDealMenu,
  /** NCD二级成交单页面 */
  CodeOmsNCDReceiptDealPage,
  /** NCD二级本人 */
  CodeOmsNCDReceiptDealSelf,
  /** NCD二级全部 */
  CodeOmsNCDReceiptDealAll,
  /** NCD二级成交录入、编辑 */
  CodeOmsNCDReceiptDealEdit,
  /** NCD二级成交确认、提交、毁单 */
  CodeOmsNCDReceiptDealSubmit,
  /** NCD二级操作日志 */
  CodeOmsNCDReceiptDealLog,
  /** NCD二级设置 */
  CodeOmsNCDSetting,
  /** NCD二级设置 */
  CodeOmsNCDSettingMenu,
  /** NCD二级指定授权人设置 */
  CodeOmsNCDSettingAssign,
  /** OMS-NCD一级 */
  CodeOmsNCDP,
  /** NCD一级行情模块 */
  CodeOmsNCDPMkt,
  /** NCD一级行情菜单 */
  CodeOmsNCDPMktMenu,
  /** NCD一级行情页面 */
  CodeOmsNCDPMktPage,
  /** NCD一级报价及报价编辑 */
  CodeOmsNCDPMktQuote,
  /** NCD一级打开报表 */
  CodeOmsNCDPReport,
  /** NCD一级日志 */
  CodeOmsNCDPMktLog,
  /** 系统管理 */
  CrmSystemManage,
  /** NCDiQuote模块 */
  CodeOmsNCDIQuote,
  /** NCDiQuote菜单 */
  CodeOmsNCDIQuoteMenu,
  /** iMB语音播报 */
  CodeIMB,
  /** iMB语音播报菜单 */
  CodeIMBMenu,
  /** iMB系统 */
  CodeIMBSystem
}
