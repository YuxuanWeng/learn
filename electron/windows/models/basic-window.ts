import { resetAppStatusByReady } from 'app/models/oms-application';
import { WindowCategory } from 'app/types/types';
import { BaseWindow, BaseWindowProps } from './base';
import { WindowLifeCycleEnum } from './type';

export class BasicWindow extends BaseWindow {
  private isSelf = true;

  /** 是否已完成布局保存 */
  layoutCacheSaved = false;

  /**
   * 基础窗口, eg: login、loading、updateDownload、home
   * @param config BaseWindowProps 窗口属性
   */
  constructor(config: BaseWindowProps) {
    super({ ...config, category: WindowCategory.Basic });
  }

  // ... 实现私有成员函数

  /**
   * 当页面准备好时触发的回调
   * @param callback 页面准备好时触发的回调。这个回调函数被传递给两个参数: 第一个是窗口实例对象，第二个是窗口内容对象
   */
  onReady(callback: { call: (arg0: null, arg1: BasicWindow, arg2: () => void) => void }) {
    const instance = this.getInstance();
    const readyCallback = () => {
      if (instance.isRefreshing) return;
      resetAppStatusByReady(instance.name);
      instance.setStatus(WindowLifeCycleEnum.Ready);
      callback.call(null, instance, () => {});
    };
    this.object?.on('ready-to-show', readyCallback);
  }

  isBasic() {
    return this.isSelf;
  }
}
