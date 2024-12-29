import { ipcMain } from 'electron';
import { UtilEventEnum } from '../types/IPCEvents';
import { WindowManager } from '../windows/models/windows-manager';

export const getLocalStorage = (key: string) => {
  return new Promise<any>((resolve, reject) => {
    const firstRenderer = WindowManager.getAll()[0];

    if (firstRenderer == null) reject(new Error('未找到渲染进程'));

    firstRenderer.getContent()?.postMessage(UtilEventEnum.GetLocalStorage, key);

    ipcMain.once(UtilEventEnum.GetLocalStorageResult, (_, result) => {
      try {
        resolve(JSON.parse(result));
      } catch (e) {
        reject(e);
      }
    });
  });
};
