import { WindowCategory } from 'app/types/types';
import { BaseWindow, BaseWindowProps } from './base';
import { WindowLifeCycleEnum } from './type';

export class SpecialWindow extends BaseWindow {
  private isSelf = true;

  /**
   * 特殊窗口, 来自于特殊窗口池中的窗口， eg: 单条报价
   * @param config BaseWindowProps 窗口属性
   */
  constructor(config: BaseWindowProps) {
    super({ ...config, category: WindowCategory.Special });
  }

  /**
   * 当页面准备好时触发的回调
   * @param callback 页面准备好时触发的回调。这个回调函数被传递给两个参数: 第一个是窗口实例对象，第二个是窗口内容对象
   */
  onReady(callback: { call: (arg0: null, arg1: SpecialWindow, arg2: () => void) => void }) {
    const instance = this.getInstance();
    const readyCallback = () => {
      if (instance.isRefreshing) return;
      instance.setStatus(WindowLifeCycleEnum.Ready);
      callback.call(null, instance, () => {});
    };
    this.object?.on('ready-to-show', readyCallback);
  }

  isSpecial() {
    return this.isSelf;
  }
}
