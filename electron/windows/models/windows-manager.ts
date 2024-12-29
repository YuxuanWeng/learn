import { WindowCategory } from 'app/types/types';
import { WindowInstance } from 'app/types/window-type';
import { BrowserWindow } from 'electron';
import { join } from 'path';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIGHT } from '../constants';
import { BaseWindowProps } from './base';
import { BasicWindow } from './basic-window';
import { NormalWindow } from './normal-window';
import { SpecialWindow } from './special-window';

export const WindowInstances: { [key: string]: WindowInstance } = {};

export const WindowManager = {
  /** 存放window实例 */
  windows: new Map<string, WindowInstance>(),

  /**
   * 页面加载失败后的回调函数
   * @param window WindowInstance
   */
  onLoadFailure(window: WindowInstance) {
    // 窗口加载失败的默认文件
    window.getContent()?.loadURL(`file://${join(__dirname, '../src/out')}/loadFailure.html`);
  },

  /**
   * 移除指定name窗口实例
   * @param name 全局唯一窗口名
   */
  delete(name: string) {
    console.log('移除指定name窗口实例', name);
    this.windows.delete(name);
  },

  /**
   * 新增窗口实例
   * @param name 窗口名
   * @param window 窗口实例
   */
  add(name: string, window: WindowInstance) {
    console.log('新增窗口实例: ', name);
    this.windows.set(name, window);
  },

  /** 清除不合法的窗口 */
  clearInvalidWindows() {
    this.windows.forEach((window, name) => {
      if (!window || !window.isAlive()) {
        console.log('清除不合法的窗口', name);
        this.delete(name);
      }
    });
  },

  /**
   * 按名称获取一个窗体实例
   * @param name 窗口名
   */
  get(name: string) {
    const win = this.windows.get(name);
    if (!win || (win.constructor === NormalWindow && win.isInPool)) {
      // console.log(`WindowInstance ${name} doesn't exist!`);
      return null;
    }

    return win;
  },

  /**
   * 根据name指定某窗体获取焦点
   * @param name 窗口名
   */
  focus(name: string) {
    const win = this.windows.get(name);
    if (win?.object?.isMinimized()) win.restore();
    if (win?.object?.isVisible() === false) win.object.show();
    win?.focus();
  },

  /**
   * 创建一个window的实例
   * @param config BaseWindowProps 配置属性
   * @returns WindowInstance | null
   */
  create(config: BaseWindowProps) {
    if (this.windows.get(config.name)) {
      // 转移焦点到当前新创建的
      this.focus(config.name);
      return this.windows.get(config.name);
    }

    let window: WindowInstance | null = null;

    if (config.category === WindowCategory.Special) window = new SpecialWindow(config);
    else if (config.category === WindowCategory.Basic) window = new BasicWindow(config);
    else window = new NormalWindow(config);

    // 创建BrowserWindow实例
    window?.create();

    if (window) this.add(window.name, window);
    const windowNames: string[] = [];
    this.windows.forEach(item => windowNames.push(item.name));
    console.log('windows集合', this.windows.size, windowNames.join(', '));
    return window;
  },

  /**
   * 根据id获取一个窗体实例
   * @param id number 窗口原生属性的id
   * @returns WindowInstance | null
   */
  getById(id: number): WindowInstance | null {
    let instance: WindowInstance | null = null;

    this.windows.forEach(window => {
      if (window.object?.id === id) instance = window;
    });

    return instance;
  },

  /**
   * 根据 WebContents.id 获取当前所在的 WindowInstance 对象
   * @param id webContents-id
   * @returns WindowInstance
   */
  getByContentsId(id: number): WindowInstance | null {
    let instance: WindowInstance | null = null;

    this.windows.forEach(window => {
      if (window.getContent()?.id === id) instance = window;
    });

    return instance;
  },

  /** 获取当前焦点所在窗体对象 */
  getCurrent() {
    const thisWindow = BrowserWindow.getFocusedWindow();
    if (!thisWindow) return null;
    return this.getById(thisWindow.id);
  },

  /**
   * 获取当前打开的窗口列表
   * @param category 窗口类型
   * @returns WindowInstance[]
   */
  getWindows(category?: WindowCategory): WindowInstance[] {
    const wins = Array.from(this.windows.values());
    if (!category) {
      return wins;
    }
    return wins.filter(window => window.category === category);
  },

  /**
   * 根据前缀获取当前打开的窗口列表
   * @param prefix 名称前缀
   * @returns WindowInstance[]
   */
  getWindowsByPrefix(prefix?: string): WindowInstance[] {
    const wins = Array.from(this.windows.values());
    if (!prefix) {
      return wins;
    }
    return wins.filter(window => window.name.startsWith(prefix));
  },

  /** 获取当前打开的窗口列表，排除窗口池； */
  getAll(): WindowInstance[] {
    const windows: WindowInstance[] = [];

    this.windows.forEach(window => {
      // TODO: 后面测测能不能删了
      if (!window?.object) return;

      const isAliveBasic = window.isBasic();
      const isAliveNormal = window.constructor === NormalWindow && !window.isInPool;
      const isAliveSpecial = window.isSpecial() && window.object.isVisible();

      if (isAliveBasic || isAliveNormal || isAliveSpecial) {
        windows.push(window);
      }
    });
    return windows;
  },

  /** 获取活跃窗口数量 */
  size(): number {
    return this.getAll().length;
  },

  /**
   * 根据名称关闭窗口
   * @param name 窗口名称
   */
  close(name: string) {
    const win = this.windows.get(name);
    if (win?.isAlive()) win.close();
    console.log('根据名称关闭窗口: ', name);
    this.delete(name);
  },

  /** 关闭当前活动窗体 */
  closeCurrent() {
    const current = this.getCurrent();
    console.log('关闭当前活动窗体', current?.name);
    if (current) this.close(current.name);
  },

  /**
   * 根据名称注销窗体
   * @param name 窗口名称
   */
  destroy(name: string) {
    console.log('根据名称注销窗体', name);
    this.windows.get(name)?.destroy();
    this.delete(name);
  },

  /** 关闭所有窗体 */
  closeAll(excludes: string[] = []) {
    console.log('关闭所有窗体');
    this.windows.forEach((_, name) => {
      if (!excludes.includes(name)) this.close(name);
    });
  },

  /**
   * 按名称最大化窗口
   * */
  maximize(name: string) {
    this.get(name)?.maximize();
  },

  /**
   * 按名称最小化窗口
   * */
  minimize(name: string) {
    this.get(name)?.minimize();
  },

  /**
   * 按名称还原窗口
   * */
  restore(name: string) {
    this.get(name)?.object?.restore();
  },

  /**
   * 父窗口获取焦点
   * windows系统环境下，由于特殊池子中的窗口只是hide，不是close
   * 有可能会导致父级窗口不能正常获取到焦点，需要手动设置
   * @param parentId 父窗口webContentsId
   * @returns
   */
  focusParentWindow(parentId?: number) {
    // parentWindowFocus
    if (!parentId) return;
    const parent = this.getByContentsId(parentId);
    parent?.object?.focus();
  },

  /**
   * 获取窗口显示大小
   * @param name 窗口名
   */
  getWindowDisplaySize(name: string) {
    const window = this.get(name);
    return [window?.options.width || DEFAULT_WINDOW_WIGHT, window?.options.height || DEFAULT_WINDOW_HEIGHT];
  },

  /**
   * 判断窗口是否在窗口池中，若传入的窗口名不属于普通窗口，则返回false
   * @param name 窗口名
   * @returns boolean
   */
  isInPool(name: string) {
    const window = this.windows.get(name);
    if (window?.constructor === NormalWindow) return window.isInPool;
    return false;
  },

  /**
   * 管道工具函数，接收一个异步队列，依次执行，完成后返回 Promise.then(boolean);
   * @param queue 异步函数队列
   * @returns Promise<boolean>
   */
  pipe(queue: (() => Promise<any>)[] = []): Promise<boolean> {
    const consumptionQueue = async (
      resolve: (value: boolean | PromiseLike<boolean>) => void,
      reject: (reason?: unknown) => void
    ) => {
      try {
        for (const item of queue) {
          if (typeof item === 'function') {
            // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
            await item?.();
          }
        }
        resolve(true);
      } catch (er) {
        reject(er);
      }
    };
    return new Promise((resolve, reject) => {
      if (!queue?.length) {
        resolve(true);
        return;
      }
      consumptionQueue(resolve, reject);
    });
  }
};
