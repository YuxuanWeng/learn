import { AppEnv } from '@fepkg/common/types';
import { parseJSON } from '@fepkg/common/utils/index';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { User } from '@fepkg/services/types/common';
import { captureMessage } from '@sentry/react';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { ABRule } from '@/common/ab-rules/types';
import { LoginFormData, UserLoginForm } from '@/pages/Base/Login/types';

// 杂项直接使用 localStorage 存储
export type MiscStorage = {
  token?: string;
  apiEnv?: AppEnv;
  userInfo?: User;
  softLifecycleId?: string; // 用于日志判断上下文，每次initAppOnce时会随机生成
  deviceId?: string; // 用于日志、sentry，从主进程传过来
  savedLoginFormData?: LoginFormData;
  offset?: number; // 客户端服务端时间偏移量
  abRules?: ABRule[];
  accessCodeList?: AccessCode[];
  deviation?: Record<string, number | undefined>; // 估值偏离，暗用户存储，暂时只用于快聊，后期预计会全局共用
  isTradeBoardSimple?: boolean;
  productType?: ProductType;
  /** 由于目前oms判断用户拥有的台子权限需要同时校验user.product_list和access_code_list，这里方便大家直接获取计算后的结果，每次登录时重新赋值（已编辑） */
  availableProductTypeList?: ProductType[];
  localServerPort?: number;
  localServerAvailable?: boolean;
};

const miscStorageKeys: (keyof MiscStorage)[] = [
  'token',
  'apiEnv',
  'softLifecycleId',
  'deviceId',
  'savedLoginFormData',
  'userInfo',
  'offset',
  'abRules',
  'accessCodeList',
  'deviation',
  'isTradeBoardSimple',
  'productType',
  'availableProductTypeList',
  'localServerPort',
  'localServerAvailable'
];

const memoryStorage: MiscStorage = {
  token: undefined,
  apiEnv: 'dev',
  offset: undefined,
  productType: ProductType.BNC,
  isTradeBoardSimple: true,
  localServerPort: undefined,
  localServerAvailable: false
};

const initMiscStorage = () => {
  for (const key of miscStorageKeys) {
    const stored = localStorage.getItem(key);

    if (stored == null) continue;

    try {
      memoryStorage[key] = parseJSON(stored);
    } catch (err) {
      captureMessage('initMiscStorage Error', { extra: { err } });
    }
  }

  window.addEventListener('storage', e => {
    if (!miscStorageKeys.includes(e.key as any)) return;
    if (e.key == null) return;

    memoryStorage[e.key] = e.newValue && parseJSON(e.newValue);
  });
};

initMiscStorage();

export const miscStorage: MiscStorage = new Proxy(memoryStorage, {
  set: (memo, key: string, value: unknown) => {
    if (value == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }

    memo[key] = value;

    if (key === 'token') {
      window.Main.sendMessage(UtilEventEnum.UpdateToken, value);
    }

    return true;
  },
  get: (memo, key: string) => {
    return memo[key];
  }
});

export const setStorageDeviation = (val?: number) => {
  if (miscStorage.userInfo == null) return;

  miscStorage.deviation = { ...miscStorage.deviation, [miscStorage.userInfo.user_id]: val };
};

/** 获取当前环境本地存储的登录账户 */
export const getCurrentSavedLoginFormList = () => {
  const env = window.appConfig.channel || miscStorage.apiEnv || 'dev';
  return miscStorage.savedLoginFormData?.[env];
};

/** 更新本地存储的登录账户 */
export const upsertSavedLoginFormList = (form: UserLoginForm) => {
  const env = window.appConfig.channel || miscStorage.apiEnv || 'dev';
  if (!miscStorage.savedLoginFormData?.[env]?.length) {
    miscStorage.savedLoginFormData = { ...miscStorage.savedLoginFormData, [env]: [form] };
    return [form];
  }
  const tmp = [...(miscStorage.savedLoginFormData?.[env] ?? [])];
  const index = tmp.findIndex(f => f.userId === form.userId);
  // 缓存中有该账户则更新后置为第一个
  if (index >= 0) {
    tmp.splice(index, 1);
    tmp.unshift(form);
  } else if (tmp.length < 5) {
    tmp.unshift(form);
  } else {
    // 缓存数量大于5则删除最后一个
    tmp.unshift(form);
    tmp.pop();
  }
  miscStorage.savedLoginFormData = { ...miscStorage.savedLoginFormData, [env]: tmp };
  return tmp;
};

export const deleteSavedLoginFormList = (userId: string) => {
  const env = window.appConfig.channel || miscStorage.apiEnv || 'dev';
  if (!miscStorage.savedLoginFormData?.[env]?.length) {
    return [];
  }
  const tmp = [...(miscStorage.savedLoginFormData?.[env] ?? [])].filter(f => f.userId !== userId);
  miscStorage.savedLoginFormData = { ...miscStorage.savedLoginFormData, [env]: tmp };
  return tmp;
};
