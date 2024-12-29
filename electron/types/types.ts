import { ProductType } from '@fepkg/services/types/bdm-enum';
// eslint-disable-next-line import/no-cycle
import { BaseWindowProps, BoundsBeforeMaximize } from 'app/windows/models/base';
import { Menu } from 'electron';

export enum WindowCategory {
  Basic,
  Normal,
  Special
}

export type WindowManagerInitConfig = {
  /** 应用程序目录的完整路径 */
  appBase?: string;
  /** 打开/关闭开发模式 */
  devMode?: boolean;
};

export type LoginCreateParam = { isFirst: boolean; showLoading: boolean };

/** 用户自定义属性 */
export type CustomProps = {
  menu?: Menu;
  route: string;

  isFirst?: boolean;
  isTop?: boolean;
  isLock?: boolean;
  isModal?: boolean;
  filename?: string;

  /** 路由参数传递 */
  routePathParams?: string[];
  urlParams?: string;
  useLayout?: boolean;

  /** 全屏 */
  isFullScreen?: boolean;

  /** 高满屏 */
  isFullHeight?: boolean;

  /** 宽满屏 */
  isFullWidth?: boolean;

  baseRoutePath?: string;

  context?: unknown;
};

export type LayoutBaseParams = {
  /** 保存布局时窗口是否最大化状态 */
  isMaximized?: boolean;
  displayId?: number;
  scaleFactor?: number;
  displayBounds?: Electron.Rectangle;
  userId?: string;
  version?: string;
};

export type LayoutSettingsWinBounds = Electron.Rectangle & LayoutBaseParams;

export type LayoutSettingsProductItem = BaseWindowProps & {
  winBounds?: LayoutSettingsWinBounds;
  version?: string;
  userId?: string;
  productType?: ProductType;
};

export type WindowBounds = {
  width: number;
  height: number;
  x?: number;
  y?: number;
  boundsBeforeMaximize?: BoundsBeforeMaximize;
  fromCache?: boolean;
} & LayoutBaseParams;
