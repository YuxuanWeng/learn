/** tabs相关enum */
export enum TabsEventEnum {
  /** 开始拖拽 */
  DragStart = 'tab-drag-start',
  /** 鼠标进入tabs-panel区域 */
  DragMouseEnter = 'tab-drag-mouse-enter',
  /** 鼠标离开tabs-panel区域 */
  DragMouseLeave = 'tab-drag-mouse-leave',
  /** 鼠标进入虚拟tab区域 */
  DragVirtualEnter = 'tab-drag-virtual-enter',
  /** 鼠标离开虚拟tab区域 */
  DragVirtualLeave = 'tab-drag-virtual-leave',
  /** 结束拖拽 */
  DragEnd = 'tab-drag-end',
  /** 拖拽生成窗体 */
  CreateWindow = 'tab-create-window',
  /** 拖拽起某个tab后，其他窗体触发的创建虚拟tab事件 */
  AddVirtual = 'tab-add-virtual',
  /** 放置tab后，其他窗体触发的删除虚拟tab事件 */
  DelVirtual = 'tab-del-virtual',
  /** 放置事件回调 */
  DropCallback = 'tab-drop-callback',
  /** 放置tab后，如果源窗体中存在多个tab，触发的删除源tab回调 */
  DropDelSourceTab = 'tab-drop-del-source-tab',
  /** tab拖拽时，如果为创建窗口的异常情况回调函数 */
  DragEndToCreateErrCallback = 'drag-end-create-error-callback'
}

/** 窗体级别的事件定义 */
enum IPCEventEnum {
  /** 最小化 */
  Minimize = 'minimize',
  /** 最大化 */
  Maximize = 'maximize',
  /** 切换最大化、还原 */
  ToggleMaximize = 'toggle-maximize',
  GetIsMaximized = 'window-get-is-maximized',
  ResetWindowIsMaximized = 'window-reset-is-maximized',
  /** 关闭 */
  Close = 'close',
  /** 关闭全部弹窗并退出 */
  QuitSystem = 'quit-system',
  /** 创建指定路由窗体 */
  CreateRouteWindow = 'create-route-window',
  /** 获取当前窗体对应的name */
  GetWindowName = 'get-window-name',
  /** 触发当前窗体聚焦 */
  TriggerWindowFocus = 'trigger-window-focus',
  /** 窗体的焦点事件 */
  WindowFocus = 'window-focus',
  WindowBlur = 'window-blur',
  /** 窗体改变大小 */
  ResizeWindow = 'resize-window',
  /** 窗口关闭回传 */
  BeforeWindowClose = 'before-window-close',
  /** 窗口ready并且显示 */
  AfterWindowReadyToShow = 'after-window-ready-show',
  /** 前端导航完成 */
  DidNavigateInPage = 'did-navigate-in-page',
  /** 因崩溃导致的应用重启时，发送的通知 */
  BeforeAppRestartByCrash = 'before-app-restart-crash',
  /** 应用重启 */
  appRestart = 'app-restart',
  /** 前端走完完整的退登重启流程后，通知主进程重启 */
  afterLogoutFromAppRestart = 'after-logout-from-app-restart',

  /** 空白路由窗口准备完毕 */
  NormalRouteWindowReady = 'normal-route-window-ready',

  /** 设置窗口启用 */
  SetWindowIsEnable = 'set-window-is-enable',
  /** 点击其他窗口的遮罩层后，焦点返回到锁定窗口 */
  SetLockWindowFocus = 'set-lock-window-focus',
  /** 设置当前 Ant 弹窗所在窗口为全局锁定窗口 */
  LockCurrentWindow = 'lock-current-window',
  /** 取消当前窗口的锁定态 */
  UnLockCurrentWindow = 'unlock-current-window',

  /** 配置级弹窗window相关事件 start */
  CreateDialogWindow = 'create-dialog-window',
  // createSettingPresetWindow = 'create-setting-preset-window'
  NavigationWindow = 'window-navigation',
  /** 隐藏最小化按扭 */
  HideMinimizeBtn = 'hide-minimize-btn',

  /** 窗口拖拽中.. start */
  WindowMoving = 'window-moving',
  /** 窗口开始拖动 */
  WindowWillMove = 'window-will-move',
  /** 窗口拖拽 end */
  WindowMoveEnd = 'window-move-end',
  /** 配置级弹窗window相关事件 end */

  /** 窗口开始resize */
  WindowWillResize = 'window-will-resize',
  /** 窗口resize结束 */
  WindowResized = 'window-resized',
  /** 调试：重置自动退登 */
  ResetAutoLogoutTimer = 'reset-auto-logout-timer',
  ResettingAutoLogoutTimer = 'resetting-auto-logout-timer',
  /** 切换台子 */
  SwitchProductType = 'switch-product-type'
}
export default IPCEventEnum;

/** dialog */
export enum DialogEvent {
  /** 弹窗的确认事件 */
  Confirm = 'dialog-confirm',
  /** 窗口的取消事件 */
  Cancel = 'dialog-cancel',
  /** 根据窗口名称关闭 */
  CloseByName = 'dialog-close-by-name',
  /** 获取上下文数据 */
  GetContext = 'dialog-get-context',
  /** 设置窗口禁用 */
  SetEnabled = 'dialog-set-enabled',
  /** 弹窗置顶 */
  SetDialogAlwaysOnTop = 'dialog-nail',
  /** 修改弹窗的context */
  UpdateDialogContext = 'dialog-update-context',
  ResendChildContext = 'dialog-resend-child-context',
  /** 设置窗口宽高 */
  SetWindowSize = 'set-window-size',
  /** 子窗口非正常关闭、从布局恢复打开的子窗口，关闭时主动给父窗口发送通知 */
  ChildWindowClosed = 'child-window-closed',
  /** 当行情看板页发生变化时（打开/关闭），主动给首页窗口发送通知 */
  ProductPanelChange = 'productPanelChange',
  /** 首页窗口加载前，主动获取一次当前准备恢复的行情看板窗口 */
  GetProductPanelCacheWindows = 'get-product-panel-windows',
  /** 当iquote卡片发生变化时（打开/关闭），主动给首页窗口发送通知 */
  IQuoteCardChange = 'iquote-card-change',
  IQuoteCardFocus = 'iquote-card-focus',
  IQuoteCardCloaseAll = 'iquote-card-close-all',
  GetIQuoteCardFocusStatus = 'get-iquote-card-focus-status'
}

/** 登录事件 */
// 登录过程中操作窗口
export enum LoginEventEnum {
  OnLogin = 'on-login',
  ChangeMeta = 'change-meta',
  BeforeLogin = 'before-login',
  LoginError = 'login-error',
  AfterLogin = 'after-login',
  AfterLogout = 'after-logout',
  // before logout 指弹出登出提示弹框时
  BeforeLogout = 'before-logout',
  UserLogout = 'user-logout',
  SetToken = 'set-token',
  AutoLogout = 'auto-logout',
  RendererBeforeLogout = 'renderer-before-logout'
}

/** 初始化事件 */
export enum InitEventEnum {
  AppPerformance = 'app-performance'
}

/** Util事件定义 */
export enum UtilEventEnum {
  // 唤醒当前窗口
  FocusOnSelf = 'focus-on-self',
  // 唤醒某个特定窗口
  FocusByWindowName = 'focus-on-by-window-name',
  // 打开外部浏览器
  OpenExternal = 'open-external',
  // 复制
  Copy = 'copy',
  // 获取 appConfig
  GetAppConfig = 'get-app-config',
  // 获取softLifecycleId
  GetSoftLifecycleId = 'get-soft-lifecycle-id',
  // 获取deviceId
  GetDeviceId = 'get-deviceId',
  // 主进程向渲染进程发送，试图获取 localStorage
  GetLocalStorage = 'get-local-storage',
  // 渲染进程返回主进程的 localStorage
  GetLocalStorageResult = 'get-local-storage-result',
  // 在渲染进程中显示主进程发出的错误
  MainProcessError = 'main-process-error',
  // 获取项目各特殊目录地址
  GetAppPath = 'get-app-path',
  // 更新token
  UpdateToken = 'update-token',
  // 更新用户信息
  UpdateUserInfo = 'update-user-info',
  /** 获取某个窗口是否存在 */
  GetWindowIsExist = 'get-window-is-exist',
  /** 获取第一个有效首页窗口的name */
  GetFirstMainName = 'get-first-main-name',
  /** 获取当前所有已创建窗口 */
  GetAllWindows = 'get-all-windows',
  /** 获取当前所有已缓存窗口 */
  GetCachedWindows = 'get-cached-windows',
  /** 当前程序 */
  AutoLaunch = 'auto-launch'
}

/** loading窗口相关 */
export enum LoadingEventEnum {
  getShouldCloseLoading = 'get-should-close-loading'
}

/** 自动升级事件 */
export enum AutoUpdateEventEnum {
  CheckUpdate = 'check-update',
  QuitAndInstall = 'quit-and-install',
  DownloadUpdate = 'download-update',
  UpdateError = 'update-error',
  DownloadUpdateProgress = 'download-update-progress',
  UpdateDownloaded = 'update-downloaded',
  OpenUpdateDownload = 'open-update-download',
  GetUpdateLogs = 'get-update-log',
  AbortUpdate = 'abort-update',
  GetUpdateInfo = 'get-update-info',
  RefreshUpdateInfo = 'refresh-update-info'
}

/** 消息通道 */
export enum WindowChannelEventEnum {
  ParentChannel = 'window-channel-parent',
  ChildChannel = 'window-channel-child',
  /** utility-process初始化事件 主进程用渲染进程发给preload */
  AddUtilityProcessPort = 'add-utility-process-port',
  /** 用于preload把utility-process转发到渲染进程的事件  */
  UtilityProcessPortToBrowser = 'utility-process-port-to-browser',
  /** preload 吐到 渲染进程的事件 */
  ParentChannelToBrowser = 'window-channel-parent-to-browser',
  ChildChannelToBrowser = 'window-channel-child-to-browser'
}

export interface WindowChannelEmitter {
  portMsg: string;
  parentName?: string;
  parentPort?: Electron.MessagePortMain | null;
  winName?: string;
  winPort?: Electron.MessagePortMain | null;
}

/** 网络相关事件 */
export enum NetworkEventEnum {
  /** 登录后启动网络检测 */
  StartCheckUrlIsReachable = 'start-check-url-is-reachable',
  /** 退登后停止网络检测 */
  StopCheckUrlIsReachable = 'stop-check-url-is-reachable',
  /** 通知前端 url 连接状态变更 */
  NetworkUrlIsReachable = 'network-url-is-reachable',
  /** 暂无网络提示显示状态的变更 */
  OfflineTipVisibleChange = 'offline-tip-visible-change'
}

export enum ABRuleEventEnum {
  /** 设置是否允许在生产环境打开 DevTools */
  SetDevToolsRule = 'set-dev-tools-rule',
  /** 设置需要展示提示内容的最大失败次数 */
  SetMaxShowOfflineTipFailuresRule = 'set-max-show-offline-tip-failures-rule',
  /** 设置检测网络时 Ping 的超时时间 */
  SetNetworkPingTimeoutRule = 'set-network-ping-timeout-rule',
  /** 设置重新检测网络时间间隔 */
  SetNetworkRecheckTimeoutRule = 'set-network-recheck-timeout-rule',
  /** 布局恢复是否需要对二级、二级以下页面进行恢复 */
  IsLayoutOfSecondaryPage = 'is-layout-of-secondary-page'
}

export enum MemoInfoEnum {
  GetMainMemoInfo = 'getMainMemoInfo'
}

export type IPCEventResponse = {
  status: boolean;
  data?: unknown;
};

export enum SpotPricingHintEnum {
  Focus = 'spot-pricing-hint-focus',
  ToggleClickThrough = 'spot-pricing-hint-toggle-click-through',
  Resize = 'spot-pricing-hint-resize',
  UpdateRendererSize = 'spot-pricing-hint-update-renderer-size',
  NewMessage = 'spot-pricing-hint-new-message',
  NewManualMessage = 'spot-pricing-hint-new-manual-message',
  StartPolling = 'spot-pricing-hint-start-polling',
  EndPolling = 'spot-pricing-hint-end-polling',
  GetScreenSize = 'spot-pricing-hint-get-screen-size',
  ShowErrorInParent = 'spot-pricing-hint-show-error-in-parent'
}

export enum IMHelperEventEnum {
  SendQQ = 'send-qq',
  IMConnectionUpdate = 'im-connection-update',
  GetIMConnection = 'get-im-connection'
}

/** LOG相关事件 */
export enum LogEventEnum {
  /** 批量记录business日志事件 */
  BatchBusinessLog = 'batch-business-log',
  /** 记录performance日志事件 */
  PerformanceLog = 'performance-log',
  /** 上传business日志事件 */
  PutBusinessLog = 'put-business-log',
  /** 打印主进程日志 */
  PrintMainLog = 'print-main-log',
  /** 主进程的日志接收窗口就绪 */
  PrintWindowReady = 'print-window-ready',
  /** 接收来自渲染进程的日志，并推送到主进程日志窗口 */
  SendLogToMainLog = 'send-log-to-main-log'
}

export enum CycleEventEnum {
  /** 用户主动点击首页关闭 */
  UserHomeClose = 'user-home-close'
}

export enum SystemEventEnum {
  /** 还原本地设置 */
  FactoryReset = 'factory-reset',
  LocalDBReset = 'local-db-reset',
  /** 开发者使用：强制打开开发者工具（devTools） */
  ForceOpenDevTools = 'force-open-dev-tools'
}
