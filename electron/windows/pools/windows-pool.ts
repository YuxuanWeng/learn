import { WindowName } from 'app/types/window-v2';
import { NormalWindow } from '../models/normal-window';
import { SpecialWindow } from '../models/special-window';
import { WindowManager } from '../models/windows-manager';

/** 窗口虚拟池，用于优化 Electron 窗口启动速度 */
export const windowPoolsLen = 2;

/** 普通窗口池维护 */
export const normalWindowPools = new Map<string, NormalWindow>();

/** 特殊的窗口池维护 */
export const specialWindowPools = new Map<string, SpecialWindow>();

/** 窗口可能不存在时，可以通过keys来判断 */
export const specialPoolKeys: string[] = [WindowName.SingleQuoteV2];

/** 获取特殊窗口池的配置 */
export const getSpecialPoolConfig = () => {};

/** 获取普通池子长度 */
export const getNormalPoolsLen = () => normalWindowPools.size;
/** 获取普通池子中的有效窗口的数量 */
export const getEffectiveNormalPoolsLen = () => {
  let len = 0;
  normalWindowPools.forEach(item => {
    if (item.isAlive() && item.normalRouteIsReady) {
      len += 1;
    }
  });
  return len;
};

/** 获取特殊池子长度 */
export const getSpecialPoolsLen = () => specialWindowPools.size;

/** 判断key是否存在 */
export const hasInSpecialPools = (key: string) => specialWindowPools.has(key);

/** 获取普通池子第一个内容的key */
export const getNormalFirstKey = () => normalWindowPools.keys().next().value;

/** 获取特殊池子第一个内容的key */
export const getSpecialFirstKey = () => specialWindowPools.keys().next().value;

/** 获取普通池中的窗口实例 */
export const getNormalWindow = (key: string) => normalWindowPools.get(key);

/** 获取特殊池中的窗口实例 */
export const getSpecialWindow = (key: string) => specialWindowPools.get(key);

/** 根据key删除普通池中的窗口实例 */
export const deleteNormalWindow = (key: string) => normalWindowPools.delete(key);

/** 根据key删除特殊池中的窗口实例 */
export const deleteSpecialWindow = (key: string) => specialWindowPools.delete(key);

/** 校验窗口是否活跃 */
const delayTools = (
  win: NormalWindow,
  resolve: (value: NormalWindow | PromiseLike<NormalWindow | null> | null) => void,
  reconnection: number
) => {
  if (win.normalRouteIsReady) {
    resolve(win);
    return;
  }
  if (reconnection < 0) {
    WindowManager.close(win.name);
    resolve(null);
    return;
  }
  setTimeout(() => delayTools(win, resolve, reconnection - 1), 100);
};

/**
 * 尝试弹出一个就绪状态的窗口池窗口
 * @param reconnection 若未处于就绪状态，尝试重连次数，默认 100次（10秒）
 * @returns Promise<CurWindow | null>
 */
export const unshiftNormalWindow = (reconnection = 100): Promise<NormalWindow | null> => {
  return new Promise(resolve => {
    const name = getNormalFirstKey();
    const win = getNormalWindow(name);

    deleteNormalWindow(name);

    if (win) delayTools(win, resolve, reconnection);
    else resolve(null);
  });
};

/** 遍历普通池子 */
export const eachNormalPools = (callback: (win: NormalWindow) => void) =>
  normalWindowPools.forEach(win => callback(win));

/** 遍历特殊池子 */
export const eachSpecialPools = (callback: (win: SpecialWindow) => void) =>
  specialWindowPools.forEach(win => callback(win));

/** 设置普通池子 */
export const setNormalWindow = (name: string, win: NormalWindow) => normalWindowPools.set(name, win);

/** 设置特殊池子 */
export const setSpecialWindow = (name: string, win: SpecialWindow) => specialWindowPools.set(name, win);

/** 清除普通池子中已被关闭的窗口 */
export const clearNormal = (pools: Map<string, NormalWindow>) => {
  pools.forEach(item => {
    // 注意: 下面的'?'不能省略, 窗口有可能在外部被关闭或销毁，此时pools里还没有被清除，那么window实例已经被销毁
    if (!item?.isAlive()) {
      WindowManager.destroy(item?.name);
      pools.delete(item?.name);
    }
  });
};

/** 清除特殊池子中已被关闭的窗口 */
export const clearSpecial = (pools: Map<string, SpecialWindow>) => {
  pools.forEach(item => {
    // 注意: 下面的'?'不能省略, 窗口有可能在外部被关闭或销毁，此时pools里还没有被清除，那么window实例已经被销毁
    if (!item?.isAlive()) {
      WindowManager.destroy(item?.name);
      pools.delete(item?.name);
    }
  });
};

/** 清除窗口池中非活跃状态的窗口 */
export const clearUnAliveWindowPools = () => {
  // checkWindowPools
  clearNormal(normalWindowPools);
  clearSpecial(specialWindowPools);
};

const clearPools = (pools: Map<string, NormalWindow | SpecialWindow>) => {
  pools.forEach(win => {
    win.close();
    WindowManager.delete(win.name);
  });
  pools.clear();
};

/** 清除普通池子 */
export const clearNormalPools = () => clearPools(normalWindowPools);

/** 清除特殊池子 */
export const clearSpecialPools = () => clearPools(specialWindowPools);

/** 清除全部池子 */
export const clearWindowPools = () => {
  clearNormalPools();
  clearSpecialPools();
};
