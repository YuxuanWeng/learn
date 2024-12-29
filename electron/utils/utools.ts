import { nativeImage } from 'electron';
import { isUndefined } from 'lodash-es';
import os from 'os';

const nativeIsArray = Array.isArray;
const nativeKeys = Object.keys;

const { toString, hasOwnProperty } = Object.prototype;

const MAX_ARRAY_INDEX = 2 ** 53 - 1;

const tagTester = (name: string) => (obj: unknown) => toString.call(obj) === `[object ${name}]`;

const shallowProperty = (key: string) => (obj: any) => (obj == null ? undefined : obj[key]);

const getLength = shallowProperty('length');

export const isString = tagTester('String');

export const isFunctionTool = tagTester('Function');

export const isPromiseTool = tagTester('Promise');

export const isArrayTool = nativeIsArray || tagTester('Array');

export const isArguments = tagTester('Arguments');

export const isObjectTool = tagTester('Object');

function has$1(obj: object, key: string) {
  return obj != null && hasOwnProperty.call(obj, key);
}

export function keys(obj: object) {
  if (!isObjectTool(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  const list: string[] = [];
  for (const key in obj) if (has$1(obj, key)) list.push(key);
  return list;
}

export function isEmptyTool(obj: object) {
  if (obj == null) return true;
  const length = getLength(obj);
  if (typeof length == 'number' && (isArrayTool(obj) || isString(obj) || isArguments(obj))) return length === 0;
  return getLength(keys(obj)) === 0;
}

function optimizeCb(func: any, context: any, argCount?: any) {
  if (context === undefined) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return (value: any) => {
        return func.call(context, value);
      };
    case 3:
      return (value: any, index: number, collection: any) => {
        return func.call(context, value, index, collection);
      };
    case 4:
      return (accumulator: any, value: any, index: any, collection: any) => {
        return func.call(context, accumulator, value, index, collection);
      };
    default:
      return (...args: any) => {
        return func.apply(context, args);
      };
  }
}

function createSizePropertyCheck(getSizeProperty: any) {
  return (collection: any) => {
    const sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
  };
}

const isArrayLike = createSizePropertyCheck(getLength);

export function each(obj: any, iteratee: any, context?: any) {
  iteratee = optimizeCb(iteratee, context);
  let i;
  let length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    const keyList = keys(obj);
    for (i = 0, length = keyList.length; i < length; i++) {
      iteratee(obj[keyList[i]], keyList[i], obj);
    }
  }
  return obj;
}

export function arraify<T>(target: T | T[]): T[] {
  return isArrayTool(target) ? target : [target];
}

function mergeConfigRecursively<T extends Record<string, any>>(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  rootPath: string
): T {
  const merged: Record<string, any> = { ...defaults };
  for (const key in overrides) {
    if (!Object.prototype.hasOwnProperty.call(overrides, key)) {
      continue;
    }
    const value = overrides[key];
    if (value == null) {
      continue;
    }

    const existing = merged[key];
    if (
      existing == null ||
      isFunctionTool(value) ||
      (!isEmptyTool(value) && !isArrayTool(value) && !isObjectTool(value))
    ) {
      merged[key] = value;
      continue;
    }

    if (isArrayTool(existing) || isArrayTool(value)) {
      merged[key] = [...arraify(existing ?? []), ...arraify(value ?? [])];
      continue;
    }
    if (isObjectTool(existing) && isObjectTool(value)) {
      merged[key] = mergeConfigRecursively(existing, value, rootPath ? `${rootPath}.${key}` : key);
      continue;
    }

    merged[key] = value;
  }
  return merged as T;
}

export function mergeConfig<T extends Record<string, any>>(defaults: T, overrides: T, isRoot = true): T {
  return mergeConfigRecursively(defaults, overrides, isRoot ? '' : '.');
}

export const isMac = process.platform === 'darwin';
export const isWin7 = process.platform === 'win32' && os.release().startsWith('6.1');

/**
 * logo图的base64
 * 目前electron侧只需要一张logo，其他暂不需要
 */
export function getLogoImgBase64() {
  return 'data:image/png;base64,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';
}

/**
 * 获取logo图的nativeImage对象
 * @param width 宽度，默认33
 * @param height 高度，默认24
 * @returns logo图nativeImage对象
 */
export function getLogoByNativeImage(width = 33, height = 24) {
  const logo = getLogoImgBase64();
  const img = nativeImage.createFromDataURL(logo);
  return img.resize({ width, height });
}

/**
 * 传入需要测试的 Promise 对象，将对应结果返回
 * @param promise 需要测试的 Promise 对象
 * @return {Promise<string>}
 */
export const getPromiseState = (promise: unknown): Promise<'fulfilled' | 'pending' | 'rejected'> => {
  const target = {};
  return Promise.race([promise, target]).then(
    value => (value === target ? 'pending' : 'fulfilled'),
    () => 'rejected'
  );
};

export const isPromise = (promise: any) => {
  return (
    isPromiseTool(promise) || (!isUndefined(promise) && isFunctionTool(promise?.then) && isFunctionTool(promise?.catch))
  );
};

export const delayHelper = (delay = 100): (() => Promise<boolean>) => {
  return () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, delay);
    });
};
