import { CustomProps } from '../types/types';
import { WindowName } from '../types/window-v2';
import { BaseWindowProps } from './models/base';

/** 窗口默认宽 */
export const DEFAULT_WINDOW_WIGHT = 900;
/** 窗口默认高 */
export const DEFAULT_WINDOW_HEIGHT = 600;

export const SHOW_AFTER_CREATE_BASIC_WINDOWS = [
  WindowName.LoadingWindow,
  WindowName.UpdateDownload,
  WindowName.MainLogPage
];

/** 需要缓存边界信息的窗口 */
export const NEED_CACHE_BONDS_WINDOWS = [
  WindowName.MainHome,
  WindowName.SingleQuoteV2,
  WindowName.BatchQuote,
  WindowName.MarketDeal,
  WindowName.MarketRecommend,
  WindowName.WatchQuoteRemindDialog,
  WindowName.CollaborativeQuote,
  WindowName.IQuote,
  WindowName.Calculator,
  WindowName.ReceiptDealPanel,
  WindowName.DealDetail,
  WindowName.ReceiptDealForm,
  WindowName.Bridge,
  WindowName.BNCIdcHome,
  WindowName.ReceiptDealBatchForm,
  WindowName.NCDPBatchForm
];

/** 无边框窗体的默认配置项 */
export const FRAME_WINDOW_CONFIG: Pick<BaseWindowProps, 'options' | 'defaultOpenDevTools'> = {
  // 窗口原生属性
  options: {
    /** 透明 */
    transparent: true,
    /** 是否在任务栏显示窗口 */
    skipTaskbar: false,
    /** 大小是否可调整 */
    resizable: true,
    /** 背景色 */
    backgroundColor: '#00000000',
    /** 是否为有边框窗体 */
    frame: false,
    /** 无边框态，是否在mac下显示为圆角 */
    roundedCorners: true,
    /** 去除窗口动画 */
    thickFrame: false,
    /** 窗口是否居中 */
    center: true,
    /** 窗口默认宽 */
    width: DEFAULT_WINDOW_WIGHT,
    /** 窗口默认高 */
    height: DEFAULT_WINDOW_HEIGHT,
    /** 默认不显示窗口 */
    show: false,
    /** 是否为模态窗口，没设置parent时不生效 */
    modal: false
  },

  /** 是否展示devTools, 开发环境也默认不显示调试工具，否则会被强制带背景 */
  defaultOpenDevTools: false
};

/** 获取窗口默认属性 */
export const DEFAULT_CUSTOM_WINDOW_PROPS: CustomProps = {
  baseRoutePath: '#',
  route: '/',
  urlParams: '',
  filename: 'index.html',
  isFullScreen: false, // 是否全屏
  isTop: false, // 是否置顶
  routePathParams: []
};

/** idc 主页窗口名 (BCO,BNC) */
export const IDC_HOMES: string[] = [WindowName.BNCIdcHome, WindowName.BCOIdcHome];

/** idc 债券详情 (BCO,BNC) */
export const IDC_BOND_DETAILS = [WindowName.IdcBondDetail];

/** idc 点击 (BCO,BNC) */
export const IDC_SPOTS = [WindowName.IdcSpot];
