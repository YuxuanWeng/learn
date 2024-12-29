// 在渲染进程内，读取 localStorage 内的映射
import { resetRegisteredHotkeys } from '@fepkg/common/utils/hotkey';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { UserHotkeyFunction } from '@fepkg/services/types/bds-enum';
import { HotkeyScope, updateHotkeyByStorageData } from '.';
import { trackSpecialSlow } from '../logger/special';
import hotkeys from './hotkeys-js';
import { checkHotkeyByProductType } from './utils';

// localStorage 仅用于渲染进程间共享，每次登录时都会被请求数据覆盖
export const initUserHotkeys = (access: Set<AccessCode>, productType?: ProductType) => {
  hotkeys.setScope(HotkeyScope.main);
  hotkeys.unbind(); // 解绑所有快捷键
  resetRegisteredHotkeys(); // 清除已注册的快捷键

  try {
    const newVal = JSON.parse(localStorage.getItem('userHotkeys') ?? '') as Record<UserHotkeyFunction, string>;

    // 过滤该台子所需快捷键
    const allHotkeys = Object.fromEntries(
      Object.entries(newVal).filter(([key]) => checkHotkeyByProductType(Number(key), access, productType))
    );

    updateHotkeyByStorageData(allHotkeys);
  } catch (err) {
    trackSpecialSlow('用户快捷键配置解析失败', err);
  }
};

const userHotkeysChange = (e: StorageEvent) => {
  if (e.key !== 'userHotkeys' || e.newValue == null) return;

  try {
    const newVal = JSON.parse(e.newValue) as Record<string, string>;

    updateHotkeyByStorageData(newVal);
  } catch (err) {
    trackSpecialSlow('用户快捷键配置解析失败', err);
  }
};

export const userHotkeysChangeListener = () => {
  // 当其他渲染进程改变时更新
  window.addEventListener('storage', userHotkeysChange);
};
export const removeUserHotkeysChangeListener = () => {
  window.removeEventListener('storage', userHotkeysChange);
};
