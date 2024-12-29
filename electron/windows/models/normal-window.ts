import { WindowCategory } from 'app/types/types';
import { BaseWindow, BaseWindowProps } from './base';

export class NormalWindow extends BaseWindow {
  /** 是否在窗口池中 */
  isInPool = true;

  /** 空白窗口是否就绪 */
  normalRouteIsReady = false;

  private isSelf = true;

  /**
   * 普通窗口, 来自于普通窗口池中的窗口
   * @param config BaseWindowProps 窗口属性
   */
  constructor(config: BaseWindowProps) {
    super({ ...config, category: WindowCategory.Normal });
  }

  /**
   * 当页面准备好时触发的回调
   * @param callback 页面准备好时触发的回调。这个回调函数被传递给两个参数: 第一个是窗口实例对象，第二个是窗口内容对象
   */
  onReady(callback: { call: (arg0: null, arg1: NormalWindow, arg2: () => void) => void }) {
    const instance = this.getInstance();
    const ready = () => {
      if (!this.isInPool) {
        if (this.options.backgroundColor) {
          this.object?.setBackgroundColor(this.options.backgroundColor);
        }
        callback.call(null, instance, () => {});
      }
    };
    const readyCallback = () => {
      super.onReady(ready);
    };
    this.getContent()?.removeAllListeners('did-navigate-in-page');
    this.getContent()?.on('did-navigate-in-page', readyCallback);
  }

  allowReady() {
    super.allowReady();
    this.isInPool = false;
  }

  isNormal() {
    return this.isSelf;
  }

  getIsInPool() {
    return this.isInPool;
  }
}
