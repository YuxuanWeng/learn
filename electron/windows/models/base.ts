/* eslint-disable import/no-cycle */
import * as types from 'app/types/types';
import { WindowName } from 'app/types/window-v2';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  LoadURLOptions,
  OpenDevToolsOptions,
  Rectangle,
  dialog,
  screen
} from 'electron';
import log from 'electron-log';
import { join } from 'lodash-es';
import { readyURL } from '../utils';
import { WindowLifeCycleEnum } from './type';

// 最大化前的尺寸和位置
// 在如下的特殊场景使用：部分窗口根据存储的位置和尺寸恢复之后
// 若恢复为了最大化状态，则此时取消最大化无效
// 因此手动存储最大化前的尺寸和位置，并且在取消最大化时手动重置到保存的大小
export type BoundsBeforeMaximize = Rectangle & {
  // 当前存储的尺寸是否从存储中恢复的还是
  // 若是，则在取消最大化时恢复至此数值，并且清空存储
  // 若不是，则在存储窗口位置时将此数值一并存储
  isRestored: boolean;
};

export type CreateDialogParams = BaseWindowProps & {
  instantMessaging?: boolean;
  // 同一窗口数量上限
  numberLimit?: number;
};

export type BaseWindowProps = {
  /** 窗口名，生命周期内唯一 */
  name: string;
  /** 窗口类别 */
  category: types.WindowCategory;
  /** 窗口标题 */
  title?: string;
  /** 窗口url */
  url?: string;
  /** 全局锁定窗口：是否已取消锁定态 */
  unlocked?: boolean;
  /** 父窗口id */
  parentId?: number;
  /** 是否默认展示DevTools */
  defaultOpenDevTools?: boolean;
  /** 如果当前窗口被异常重启后，需要该值记录最近一次的重启时间戳 */
  lastRestartTimestamp?: number;
  /** 窗口最大化之前的尺寸 */
  boundsBeforeMaximize?: BoundsBeforeMaximize;
  /** 窗口行为配置 */
  custom: types.CustomProps;
  /** BrowserWindow 原生属性 */
  options?: BrowserWindowConstructorOptions;
  /** 窗口Ready后的回调 */
  onReadyShow?: (window?: BaseWindow) => void;
  /** 窗口达到创建上限后的回调 */
  reachLimit?: (text: string) => void;
};

export abstract class BaseWindow {
  /** 窗口名，生命周期内唯一 */
  name: string;

  /** 窗口类别 */
  category: types.WindowCategory;

  /** 窗口标题 */
  title?: string;

  /** 窗口url */
  url?: string;

  /** 是否为置顶 */
  isTop?: boolean;

  /** 全局锁定窗口：是否已取消锁定态 */
  unlocked?: boolean;

  /** 父窗口id */
  parentId?: number;

  /** 是否默认展示DevTools */
  defaultOpenDevTools?: boolean;

  /** 如果当前窗口被异常重启后，需要该值记录最近一次的重启时间戳 */
  lastRestartTimestamp?: number;

  /** loadUrl 失败次数 */
  loadFailureSum = 0;

  /** 是否正在重新加载、刷新页面，手动触发刷新时的flag */
  isRefreshing = false;

  /** 窗口最大化之前的尺寸 */
  boundsBeforeMaximize?: BoundsBeforeMaximize;

  /** 窗口行为配置 */
  custom: types.CustomProps;

  /** BrowserWindow 原生属性 */
  options: BrowserWindowConstructorOptions = {};

  /** 生命周期 */
  status: WindowLifeCycleEnum = WindowLifeCycleEnum.Initial;

  private readyPromise: Promise<void>;

  private readyPromiseResolve?: (value: void | PromiseLike<void>) => void;

  /** 窗口Ready后的回调 */
  onReadyShow?: (window?: BaseWindow) => void;

  /** 当前窗口实例对象 */
  private instance: BrowserWindow | null = null;

  private defaultIsEqualWindowCategory = false;

  resetAttribute(config: BaseWindowProps) {
    this.url = config.url;
    this.title = config.title;
    this.defaultOpenDevTools = config.defaultOpenDevTools;
    this.parentId = config.parentId;
    this.lastRestartTimestamp = config.lastRestartTimestamp;
    this.unlocked = config.unlocked ?? false;
    this.options = config.options ?? {};
    this.custom = config.custom;
    this.boundsBeforeMaximize = config.boundsBeforeMaximize;
    this.loadFailureSum = 0;
    this.onReadyShow = config.onReadyShow;
  }

  /**
   * 窗口基类
   * @param config BaseWindowProps 窗口基础属性
   */
  constructor(config: BaseWindowProps) {
    this.setStatus(WindowLifeCycleEnum.BeforeCreate);
    this.name = config.name;
    this.category = config.category;
    this.custom = config.custom;
    this.resetAttribute(config);
    this.readyPromise = new Promise(resolve => {
      this.readyPromiseResolve = resolve;
    });
  }

  /** 修改status后，主动触发一些回调 */
  private changeStatus() {
    switch (this.status) {
      case WindowLifeCycleEnum.Ready: {
        /** 不能直接调用 allowReady，会触发子类的 */
        this.readyPromiseResolve?.();
        break;
      }
      default: {
        break;
      }
    }
  }

  public setStatus(status: WindowLifeCycleEnum) {
    this.status = status;
    this.changeStatus();
  }

  allowReady() {
    this.readyPromiseResolve?.();
  }

  onReady(callback: () => void) {
    this.readyPromise.then(callback);
  }

  /** 是否是基本窗口 */
  isBasic() {
    return this.defaultIsEqualWindowCategory;
  }

  /** 是否是普通窗口 */
  isNormal() {
    return this.defaultIsEqualWindowCategory;
  }

  /** 是否是特殊窗口 */
  isSpecial() {
    return this.defaultIsEqualWindowCategory;
  }

  /** 判断当前窗口是否在池子中(普通窗口) */
  getIsInPool() {
    return this.defaultIsEqualWindowCategory;
  }

  /** 获取window对象 */
  get object() {
    if (this.isAlive()) return this.instance;
    return null;
  }

  /** 更新window对象 */
  set object(val: BrowserWindow | null) {
    this.instance = val;
  }

  /** 获取当前this */
  getInstance() {
    return this;
  }

  /**
   * 修改window的原生属性
   * @param value BrowserWindowConstructorOptions windows原生属性
   */
  updateOptions(value: BrowserWindowConstructorOptions) {
    this.options = { ...this.options, ...value };
  }

  /** 判断当前窗口是否活跃 */
  isAlive() {
    return this != null && this.instance && !this.instance.isDestroyed() && this.instance.webContents;
  }

  /** 当前窗口是否为首页 */
  isHome() {
    return this.name === WindowName.MainHome;
  }

  /**
   * 设置窗口的目标URL
   * @param url 目标url
   */
  setURL(url: string) {
    this.url = url;
  }

  /**
   * 创建窗口实例
   * @param url [optional] 窗口目标URL，以防没有在构造函数中提供它
   * */
  create(url?: string) {
    if (url) this.url = url;

    // 一些默认配置项
    // if (this.options?.resizable == null) this.options.resizable = true;
    if (this.options?.useContentSize == null) this.options.useContentSize = true;
    if (this.options?.x == null && this.options.y == null) this.options.center = true;

    // 使用传递的设置创建新的浏览器窗口实例
    this.object = new BrowserWindow(this.options);
    console.log(`Window "${this.name}" was created`);

    // 如果没有提供宽高
    const bounds = this.object.getBounds();
    if (!this.options.width) this.options.width = bounds.width;
    if (!this.options.height) this.options.height = bounds.height;

    // 打开窗口目标内容/url
    if (this.url) {
      this.loadURL(this.url).then(() => {
        if (this.options.backgroundColor) {
          this.object?.setBackgroundColor(this.options.backgroundColor);
        }
      });
    }

    // 设置窗口菜单(null表示根本没有菜单)
    if (this.custom?.menu !== undefined) {
      this.object.setMenu(this.custom.menu);
    }

    // 是否显示开发者工具
    if (this.defaultOpenDevTools) {
      this.object.webContents.openDevTools();
    }

    return this;
  }

  /**
   * 打开创建的窗口实例
   * @param url [optional] 窗口目标URL
   * @param hide [optional] 显示或隐藏新创建的窗口，默认为false
   * */
  open(url?: string, hide = false) {
    if (this.object && !hide) {
      // 如果存在窗口实例，则显示窗口
      this.object.show();
      this.object.focus();
    } else if (!this.object) {
      // 否则重新生成实例，并且open窗口
      this.create(url);
      this.open(url, hide);
    }
  }

  /**
   * 返回窗口的"webContents"对象
   * */
  getContent() {
    if (!this.isAlive()) return null;
    return this.instance?.webContents ?? null;
  }

  /**
   * 将URL加载到窗口中
   * @param url 目标url
   * @param options Electron.LoadURLOptions原生参数
   */
  loadURL(url: string, options?: LoadURLOptions) {
    return new Promise<boolean>(resolve => {
      if (!url && this.url) url = this.url;

      url = readyURL(url);

      // 加载传递的url
      this.getContent()
        ?.loadURL(url, options)
        .then(res => {
          console.log('loadURL success!! ', url, res);
          resolve(true);
        })
        .catch(err => {
          console.log('loadURL Error!! ', err);
          resolve(false);
        });
    });
  }

  /** 窗口获取焦点 */
  focus() {
    this.object?.focus();
  }

  /**
   * 将窗口的内容设置为HTML代码
   * @param code Html代码
   * @param options 选项值参阅：https://www.electronjs.org/zh/docs/latest/api/browser-window#winloadurlurl-options
   * */
  html(code: string, options?: LoadURLOptions) {
    this.getContent()?.loadURL(`data:text/html,${code}`, options);
  }

  /**
   * 触发负载失败回调。当目标内容不可用或不可访问时，将调用此方法。
   * 默认情况下，它将显示自定义消息，除非为窗口定义了自定义回调
   * */
  down() {
    const self = this.getInstance();
    this.loadFailureSum += 1;
    if (this.loadFailureSum > 2) {
      log.error(`-- 窗口 ${this.name} 进行 loadUrl 时出现错误，错误 url：${this.url}`);
      dialog
        .showMessageBox({
          title: '系统提示',
          message: '窗口创建失败，请稍后重试..',
          type: 'error'
        })
        .then(() => {
          self.close();
        });
      return;
    }
    // 窗口加载失败的默认文件
    this.getContent()?.loadURL(`file://${join(__dirname, '../src/out')}/loadFailure.html`);
  }

  /**
   * 重新加载窗口内容
   * @param ignoreCache boolean 默认情况下，页面缓存将被使用，在重新加载时传递TRUE来忽略此缓存
   * */
  reload(ignoreCache = false) {
    if (ignoreCache === true) {
      // 忽略缓存重新加载
      this.getContent()?.reloadIgnoringCache();
    } else {
      // 使用可用的缓存重新加载内容
      this.getContent()?.reload();
    }
  }

  /**
   * 返回窗口内当前页面的url
   * */
  getURL() {
    return this.getContent()?.getURL();
  }

  /**
   * 在创建的窗口上执行JS代码
   * @param code 要执行的 JS 代码
   */
  execute(code: string) {
    this.getContent()?.executeJavaScript(code);
  }

  /** 返回到上一页/url */
  goBack() {
    if (this.getContent()?.canGoBack()) this.getContent()?.goBack();
  }

  /** 关闭窗口 */
  close() {
    if (this.instance != null && !this.instance.isDestroyed()) this.instance.close();
  }

  /** 销毁一个窗口实例 */
  destroy() {
    this.object?.destroy();
  }

  /** 最小化窗口 */
  minimize() {
    this.object?.minimize();
  }

  /** 最大化窗口 */
  maximize() {
    if (!this.isAlive()) return;
    BrowserWindow.prototype.maximize.call(this.object);
    if (!BrowserWindow.prototype.isMaximized.call(this.object)) {
      this.object?.emit('maximize', { sender: this.object, preventDefault: () => {} });
    }
    // this.object?.setResizable(false);
  }

  /** 从最大化还原 */
  unmaximize() {
    if (!this.isAlive()) return;
    // const fromMaximized = BrowserWindow.prototype.isMaximized.call(this.object);
    BrowserWindow.prototype.unmaximize.call(this.object);
    if (this.options.transparent && !this.isMaximized()) {
      this.object?.emit('unmaximize', { sender: this.object, preventDefault: () => {} });
    }
    // this.object?.setResizable(resizable);
  }

  /** 是否最大化 */
  isMaximized(): boolean {
    const nativeIsMaximized = this.object?.isMaximized() ?? false;
    if (!this.options.transparent) return nativeIsMaximized;

    if (!nativeIsMaximized) {
      const bounds = this.object?.getBounds();
      if (!bounds) return false;
      const { workArea } = screen.getDisplayMatching(bounds);
      if (
        bounds.x <= workArea.x &&
        bounds.y <= workArea.y &&
        bounds.width >= workArea.width &&
        bounds.height >= workArea.height
      ) {
        return true;
      }
    }
    return nativeIsMaximized;
  }

  /** 恢复窗口焦点状态 */
  restore() {
    this.object?.restore();
  }

  /** 窗口全屏 */
  fullScreen() {
    this.object?.setFullScreen(true);
  }

  /**
   * 切换窗体开发者工具的显隐
   * @param detached [optional] 是否在单独的窗口中打开开发工具
   * */
  toggleDevTools(detached?: boolean) {
    const opts: OpenDevToolsOptions = { mode: detached ? 'detach' : 'bottom' };
    if (!this.getContent()?.isDevToolsOpened()) {
      this.getContent()?.openDevTools(opts);
    }
  }

  /** 获取窗口自身的属性 */
  getSelfProps() {
    return {
      name: this.name,
      category: this.category,
      title: this.title,
      url: this.url,
      parentId: this.parentId,
      unlocked: this.unlocked,
      defaultOpenDevTools: this.defaultOpenDevTools,
      lastRestartTimestamp: this.lastRestartTimestamp,
      boundsBeforeMaximize: this.boundsBeforeMaximize
    };
  }

  /**
   * 获取正常状态下的窗口边界信息
   * 注意：无论当前的窗口状态为：最大化、最小化或者全屏，都将得到窗口在正常显示状态下的边界信息。
   * 正常状态下，getBounds与getNormalBounds得到的边界信息一致。
   * @returns Electron.Rectangle
   */
  getNormalBounds() {
    if (!this.object) return undefined;
    if (!this.options.transparent) return this.object.getNormalBounds();
    let normalBounds = this.object.getNormalBounds ? this.object.getNormalBounds() : this.object.getBounds();
    if (!this.isMaximized()) {
      if (BrowserWindow.prototype.getNormalBounds) {
        normalBounds = BrowserWindow.prototype.getNormalBounds.call(this.object);
      } else {
        normalBounds = BrowserWindow.prototype.getBounds.call(this.object);
      }
    }
    return normalBounds;
  }

  /** 统一窗口大小设置，get使用getBounds，set使用setContentBounds */
  getBounds() {
    const bounds = this.object?.getBounds();
    if (!bounds) return undefined;
    const display = screen.getDisplayMatching(bounds);
    if (display.scaleFactor === 1.25) {
      bounds.width -= 1;
      bounds.height -= 1;
    }
    return bounds;
  }

  /** 统一窗口大小设置，get使用getBounds，set使用setContentBounds */
  setBounds(bounds: Electron.Rectangle, animate: boolean | undefined = false) {
    this.object?.setContentBounds(bounds, animate);
  }

  getContentSize() {
    if (this.object == null) return undefined;
    const sizes = this.object.getContentSize();
    if (!sizes) return undefined;
    const display = screen.getDisplayMatching(this.object.getContentBounds());
    if ((display.scaleFactor * 100) % 50 !== 0) {
      [sizes[0], sizes[1]] = [sizes[0] - 1, sizes[1] - 1];
    }
    return sizes;
  }

  setContentSize(width: number, height: number, animate: boolean | undefined = false) {
    this.object?.setContentSize(width, height, animate);
  }

  getPosition() {
    return this.object?.getPosition();
  }

  setPosition(x: number, y: number, animate: boolean | undefined = false) {
    this.object?.setPosition(x, y, animate);
  }
}
