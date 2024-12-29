/** 布局编辑相关IPC事件 */
export enum LayoutSettingsEnum {
  /** 根据缓存的数据恢复窗口 */
  LoadLayoutWindowV2 = 'layout-load-layout-window-v2'
  // /** 检测是否有主进程保存的窗口布局缓存数据 */
  // IsExistsWindowOpenedStorage = 'is-exists-window-opened-storage',
}

export type LayoutSettingsWinBounds = Electron.Rectangle & {
  /** 保存布局时窗口是否最大化状态 */
  isMaximized?: boolean;
  displayId?: number;
  scaleFactor?: number;
  displayBounds?: Electron.Rectangle;
};
