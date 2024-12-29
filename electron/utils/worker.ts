import path from 'path';
import Worker from 'web-worker';
import { isMac } from './utools';

/**
 * @description 创建一个 Web worker
 * @param dirname 一般来说填 __dirname 即可
 * @param jsFilename worker js 的文件名（worker 可以用 ts 写，但是实例化需要一个编译后的 js 文件）
 */
export const createWebWorker = (dirname: string, jsFilename: string) => {
  if (isMac) {
    return new Worker(path.join('file://', dirname, jsFilename));
  }
  return new Worker(path.win32.join('file://', dirname, jsFilename));
};
