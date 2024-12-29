import { parseJSON } from '@fepkg/common/utils';
import { WindowBounds } from 'app/types/types';
import { app } from 'electron';
import { existsSync, readFile, writeFile } from 'fs';
import path from 'path';

const storageFile = path.join(app.getPath('userData'), 'windowSize.json');

type BoundsStorageQueueParam = {
  res?: Promise<any>;
  resolve?: (value: unknown) => void;
  name?: string;
  bounds?: WindowBounds;
};
type BoundsStorageQueue = {
  cb?: (params: BoundsStorageQueueParam) => void;
  params: BoundsStorageQueueParam;
};

// 通过文件形式在主进程内存储窗口尺寸
// TODO: 优化读写频率
class WindowBoundsStorage {
  initPromise: Promise<any> | undefined;

  hasInit = false;

  data: Record<string, WindowBounds> = {};

  consumeTimer: NodeJS.Timeout | null = null;

  queue: BoundsStorageQueue[] = [];

  version = 'v3';

  init() {
    this.initPromise = this.innerInit();
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
            if (err) reject(err);
            this.data = {};
            const data = parseJSON<Record<string, WindowBounds>>(res) ?? {};
            for (const key in data) {
              if (data[key].version === this.version) {
                this.data[key] = data[key];
              }
            }
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

  consumeQueue() {
    if (!this.queue.length) return;
    const queueItem = this.queue.shift();
    if (queueItem == null) return;
    queueItem.cb?.(queueItem.params);
    queueItem.params.res?.then(() => {
      this.consumeQueue();
    });
  }

  queueThen(): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.queue.length) resolve(true);
      Promise.all(this.queue.map(item => item.params.res)).then(() => resolve(true));
    });
  }

  async set(name: string, bounds: WindowBounds) {
    const queueItem: BoundsStorageQueue = {
      params: {}
    };
    const res = new Promise((resolve, reject) => {
      if (this.initPromise == null) {
        reject(new Error('尚未初始化存储'));
        return;
      }

      try {
        queueItem.params = { ...queueItem.params, name, bounds, resolve };
        queueItem.cb = params => {
          this.initPromise?.then(() => {
            if (params?.name && params?.bounds) {
              this.data[params.name] = params.bounds;
              params.bounds.version = this.version;
            }
            if (params?.resolve) {
              writeFile(storageFile, JSON.stringify(this.data), { encoding: 'utf8' }, params.resolve);
            }
          });
        };
      } catch (err) {
        resolve(false);
        console.log('-- 保存时发生错误：--', err);
      }
      if (this.consumeTimer != null) clearTimeout(this.consumeTimer);
      this.consumeTimer = setTimeout(() => this.consumeQueue(), 120);
    });
    queueItem.params.res = res;
    this.queue.push(queueItem);
    return queueItem.params.res;
  }

  get(name: string) {
    return this.data[name];
  }

  getKeys() {
    return Object.keys(this.data);
  }

  /**
   * 清除指定的位置缓存数据
   * @returns void
   */
  clear() {
    return new Promise((resolve, reject) => {
      if (this.initPromise == null) {
        reject(new Error('尚未初始化存储'));
        return;
      }

      this.initPromise.then(() => {
        this.data = {};

        writeFile(storageFile, JSON.stringify(this.data), { encoding: 'utf8' }, resolve);
      });
    });
  }
}

/** 窗口边界（位置）缓存 */
export const windowBoundsStorage = new WindowBoundsStorage();
