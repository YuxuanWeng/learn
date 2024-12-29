import { DialogCacheModule } from '../../types/dialog-v2';

/**
 * 缓存dialog的resolve
 * 这里依赖了 Map 的有序性: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export const dialogCacheMap = new Map<number, DialogCacheModule>();

export const getDialogCache = (contentId: number) => {
  return dialogCacheMap.get(contentId);
};

export const getChildDialogCache = (parentId: number) => {
  const caches: DialogCacheModule[] = [];
  dialogCacheMap.forEach((item: DialogCacheModule) => {
    if (item.parentId === parentId) caches.push(item);
  });
  return caches;
};

/**
 * Promise进入已决状态，删除缓存的窗体数据
 * @param contentId 窗体对象的webContentsId
 */
export const removeDialogCache = (contentId: number) => {
  dialogCacheMap.delete(contentId);
};

export const setDialogCache = (module: DialogCacheModule) => {
  dialogCacheMap.set(module.webContentsId, module);
};
