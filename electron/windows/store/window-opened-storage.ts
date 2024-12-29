import { LayoutSettingsProductItem } from 'app/types/types';
import { app } from 'electron';
import { existsSync, readFile, writeFile } from 'fs';
import path from 'path';

const storageFile = path.join(app.getPath('userData'), 'windowOpened.json');

export enum WindowOpenedStorageStatusEnum {
  /** 初始值 */
  Initial = 0,
  /** 初始化 */
  BeforeInitialize = 1,
  /** 完成初始化 */
  Initialized = 2,
  /** 保存之前 */
  BeforeSave = 3,
  /** 已保存 */
  Saved = 4
}

export interface WindowOpenedModule {
  keys: string[];
  items: LayoutSettingsProductItem[];
}

// 通过文件形式在主进程内存储窗口崩溃后的主窗口信息
// TODO: 优化读写频率
class WindowOpenedStorage {
  initPromise: Promise<any> | undefined;

  hasInit = false;

  data: Record<string, LayoutSettingsProductItem> = {};

  lastUpdateTime: number = Date.now();

  status: WindowOpenedStorageStatusEnum = WindowOpenedStorageStatusEnum.Initial;

  init() {
    this.status = WindowOpenedStorageStatusEnum.BeforeInitialize;
    this.initPromise = this.innerInit();
    this.initPromise.then(() => {
      this.status = WindowOpenedStorageStatusEnum.Initialized;
    });
  }

  private initEmpty = (onSuccess: (param: any) => void) => {
    writeFile(storageFile, JSON.stringify(this.data), { encoding: 'utf8' }, () => {
      this.hasInit = true;
      onSuccess(null);
    });
  };

  private async innerInit() {
    return new Promise((resolve, reject) => {
      if (existsSync(storageFile)) {
        readFile(storageFile, { encoding: 'utf8' }, (err, res) => {
          try {
            if (err) {
              reject(err);
            }

            this.data = JSON.parse(res);
            this.hasInit = true;
            resolve(null);
          } catch {
            this.initEmpty(resolve);
          }
        });
      } else {
        this.initEmpty(resolve);
      }
    });
  }

  set(name: string, _val: LayoutSettingsProductItem) {
    this.data[name] = _val;
  }

  setAndWrite(name: string, _val: LayoutSettingsProductItem) {
    return new Promise((resolve, reject) => {
      if (this.initPromise == null) {
        reject(new Error('尚未初始化存储'));
        return;
      }

      this.initPromise.then(() => {
        this.data[name] = _val;
        writeFile(storageFile, JSON.stringify(this.data), { encoding: 'utf8' }, resolve);
      });
    });
  }

  setStatus(status: WindowOpenedStorageStatusEnum) {
    this.status = status;
  }

  judgeWrite() {
    return !(this.status === WindowOpenedStorageStatusEnum.Saved && Date.now() - this.lastUpdateTime <= 3000);
  }

  writeAll() {
    this.status = WindowOpenedStorageStatusEnum.BeforeSave;
    const pro = new Promise((resolve, reject) => {
      if (this.initPromise == null) {
        reject(new Error('尚未初始化存储'));
        return;
      }

      this.initPromise.then(() => {
        writeFile(storageFile, JSON.stringify(this.data), { encoding: 'utf8' }, resolve);
      });
    });
    pro.then(() => {
      this.status = WindowOpenedStorageStatusEnum.Saved;
      this.lastUpdateTime = Date.now();
    });
    return pro;
  }

  get(name: string) {
    return this.data[name];
  }

  getKeys() {
    return Object.keys(this.data);
  }

  /**
   * 清除指定的布局缓存数据
   * @param version 当前版本号，会清除缓存中非当前版本号的缓存
   * @param excludeUserId 不包含某个用户的数据，用于批量保存前的清理
   * @returns void
   */
  clear(version?: string, excludeUserId?: string) {
    return new Promise((resolve, reject) => {
      if (this.initPromise == null) {
        reject(new Error('尚未初始化存储'));
        return;
      }

      this.initPromise.then(() => {
        const data: Record<string, LayoutSettingsProductItem> = {};
        for (const key of Object.keys(this.data)) {
          const item = this.data[key];
          if (item.userId != null && item.userId !== excludeUserId && item.version === version) {
            data[key] = item;
          }
        }
        this.data = data;

        writeFile(storageFile, JSON.stringify(this.data), { encoding: 'utf8' }, resolve);
      });
    });
  }
}

/** 布局缓存 */
export const windowOpenedStorage = new WindowOpenedStorage();
