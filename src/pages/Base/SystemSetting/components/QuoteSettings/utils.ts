import { parseJSON } from '@fepkg/common/utils/utils';
import { fetchUserSetting } from '@fepkg/services/api/user/setting-get';
import { UserSetting } from '@fepkg/services/types/common';
import { ProductType, UserSettingFunction } from '@fepkg/services/types/enum';
import { cloneDeep, isNil, omit } from 'lodash-es';
import { LocalStoragePrefix, mulUpsertUserSetting } from '@/common/services/api/user/setting-mul-upsert';
import { VolumeUnit } from '@/components/business/Quote/types';
import { miscStorage } from '@/localdb/miscStorage';
import { DefaultOptimalQuoteDisplayAmount } from './constants';
import {
  BrokerItemObj,
  BrokerObj,
  CommonTypeValue,
  EnumUserSettingsTypes,
  IUserSettingRawValue,
  IUserSettingValue
} from './types';

type IUserSettingNewValue = { [p in ProductType]?: CommonTypeValue };

const LocalStorageFunctionTypeNum = 'userSettings_functionTypeCount';
const ProductTypeList = [ProductType.BCO, ProductType.BNC, ProductType.NCD, ProductType.NCDP];

const getCommonSettingValue = (commonValue: CommonTypeValue) => {
  return ProductTypeList.reduce((acc, cur) => ({ ...acc, [cur]: commonValue }), {} as IUserSettingNewValue);
};
// 用户设置初始数据
const getDefaultSetting = (): { [k in UserSettingFunction]?: IUserSettingNewValue } => {
  return {
    [UserSettingFunction.UserSettingQuoteShortcutWaitTime]: getCommonSettingValue(false), // 价格快捷修改等待时间, 默认不勾选
    [UserSettingFunction.UserSettingAmountShortcutWaitTime]: getCommonSettingValue(false), // 数量快捷修改等待时间, 默认不勾选
    [UserSettingFunction.UserSettingQuoteAutoAddStar]: {
      [ProductType.BNC]: false,
      [ProductType.BCO]: true,
      [ProductType.NCD]: true,
      [ProductType.NCDP]: true
    }, // 报价自动加*, 信用默认开启，利率默认不开启
    [UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar]: getCommonSettingValue(false), // 单条报价识别默认加*, 默认均不开启
    [UserSettingFunction.UserSettingBatchParsingDefaultFlagStar]: getCommonSettingValue(false), // (设置里无)批量报价识别默认加*, 默认均不开启
    [UserSettingFunction.UserSettingValuationDecimalDigit]: getCommonSettingValue(4), // 估值小数位选择, 默认选择四位小数
    [UserSettingFunction.UserSettingCoQuoteVolume]: getCommonSettingValue({
      limit: { value: '5000', unit: VolumeUnit.TenThousand },
      target: { value: '5000', unit: VolumeUnit.TenThousand }
    }), // 协同报价-报价量设置，默认5000
    [UserSettingFunction.UserSettingOptimalQuoteCopyMethod]: {
      [ProductType.BNC]: 0,
      [ProductType.BCO]: 1,
      [ProductType.NCD]: 1,
      [ProductType.NCDP]: 1
    }, // 盘口复制方式， 利率默认alt+点击复制暗盘，信用默认点击复制暗盘
    [UserSettingFunction.UserSettingIncludeValuation]: getCommonSettingValue(false), // 复制内容设置-含估值, 默认均不选择
    [UserSettingFunction.UserSettingIncludeDuration]: getCommonSettingValue(false), // 复制内容设置-含久期, 默认均不选择
    [UserSettingFunction.UserSettingIncludeIssueAmount]: getCommonSettingValue(false), // 复制内容设置-含发行量, 默认均不选择
    [UserSettingFunction.UserSettingIncludeMaturityDate]: getCommonSettingValue(false), // 复制内容设置-含到期日, 默认均不选择
    [UserSettingFunction.UserSettingSortByTerm]: getCommonSettingValue(false), // 复制内容设置-按期限排序, 默认均不选择
    [UserSettingFunction.UserSettingOptimalQuoteDisplayAmount]: getCommonSettingValue(DefaultOptimalQuoteDisplayAmount), // 明/暗盘-实时盘口数量标识, 暗盘默认不开启, 明盘默认开启
    [UserSettingFunction.UserSettingDisplaySetting]: getCommonSettingValue(true), // 实时盘口-报价悬浮窗, 默认开启
    [UserSettingFunction.UserSettingInitSearchBond]: getCommonSettingValue(0), // 搜券联动带入, 默认不带入
    [UserSettingFunction.UserSettingTeamCollaboration]: getCommonSettingValue([]), // 团队协作, 默认显示一个空的下拉选
    [UserSettingFunction.UserSettingQuoteImportQMGroup]: getCommonSettingValue(false), // (老配置, 设置里无)报价导入QM群, 默认不勾选
    [UserSettingFunction.UserSettingLocationDisplay]: getCommonSettingValue(0), // (老配置, 设置里无)地点显示, 默认总部
    [UserSettingFunction.UserSettingDCSAutoFillBroker]: getCommonSettingValue(true), // (老配置, 设置里无)自动填充经纪人, 默认填充
    [UserSettingFunction.UserSettingDCSDefaultCommissionN]: getCommonSettingValue(true), // (老配置, 设置里无)默认佣金类型为N
    [UserSettingFunction.UserSettingDCSDefaultTPlusZero]: getCommonSettingValue(true) // (老配置, 设置里无)默认T+0
  };
};

/** 分台子取用户设置 */
export const getValueByProductType = (
  value: { [p in number]: CommonTypeValue } | CommonTypeValue,
  func: UserSettingFunction
): CommonTypeValue => {
  const { productType = ProductType.BNC } = miscStorage;
  const defaultValue = getDefaultSetting();

  // 无有效值时，使用默认值
  if (typeof value !== 'object' || Array.isArray(value) || value === null || !productType) {
    return defaultValue[func]?.[productType];
  }

  const newValue: CommonTypeValue = value[productType] ?? defaultValue[func]?.[productType];
  if (newValue !== undefined) {
    return newValue;
  }

  return value;
};

type CompatibleValue = { [p in ProductType]: CommonTypeValue } | CommonTypeValue;
/**
 * 通过types中的key，获取data中的部分数据
 */
function generateSettingsData(
  types: readonly EnumUserSettingsTypes[],
  data: IUserSettingValue<string>
): IUserSettingValue {
  return types.reduce((acc, key) => {
    acc[key] = data[key];

    return acc;
  }, {} as IUserSettingValue);
}

/**
 * 获取UserSettings  localStorage存储的key
 */
const getUserSettingsKey = (functionType: number) => {
  return LocalStoragePrefix + functionType;
};

/**
 *  从localStorage中获取用户设置单条记录
 */
const getOneUserSettingsValue = <T = CommonTypeValue>(functionType: number) => {
  const value = localStorage.getItem(getUserSettingsKey(functionType));
  if (value === null) return undefined;

  const json = parseJSON<CompatibleValue>(value);

  const formatValue = getValueByProductType(json, functionType);

  return formatValue as T;
};

export const getOneUserSettingsRawValue = (functionType: number) => {
  const value = localStorage.getItem(getUserSettingsKey(functionType));
  if (value === null) return undefined;
  return value;
};

/**
 * 从localStorage中获取用户设置全部记录，数组结构
 * @deprecated 用到的地方均将数据转为对象或用find搜索某个数据了，应该直接使用getUserSettingsInitData函数
 * 但由于目前使用的地方太多，且处理数据的方式都不太一致且复杂，无法一次全部替换，故暂时保留该函数
 */
const getUserSettingsInitDataArr = (list?: UserSettingFunction[]) => {
  const arr: UserSetting[] = [];

  const numStr = localStorage.getItem(LocalStorageFunctionTypeNum);
  const num = numStr ? Number(numStr) + 1 : 1;
  for (let i = 1; i < num; i += 1) {
    if (list === undefined || list.includes(i)) {
      const value = JSON.stringify(getOneUserSettingsValue(i));
      if (value !== undefined) {
        arr.push({
          function: i,
          value
        });
      }
    }
  }

  return arr;
};

/**
 * 从localStorage中获取用户设置全部记录, 对象结构
 */
const getUserSettingsInitData = (list?: UserSettingFunction[]) => {
  const initData: IUserSettingValue<string> = {};

  const numStr = localStorage.getItem(LocalStorageFunctionTypeNum);
  const num = numStr ? Number(numStr) + 1 : 1;
  for (let i = 1; i < num; i += 1) {
    if (list === undefined || list.includes(i)) {
      const value = getOneUserSettingsValue(i);

      if (value !== undefined) {
        initData[i] = value;
      }
    }
  }

  return initData;
};

/**
 * 提交前的数据处理  1.如果团队协作中存在空对象，则移除
 */

const dataBeforeCommit = (data: IUserSettingRawValue) => {
  const jsonBrokerList = data[UserSettingFunction.UserSettingTeamCollaboration];
  if (jsonBrokerList === undefined) {
    return data;
  }
  const m = new Map<ProductType, BrokerObj[]>();

  if (typeof jsonBrokerList === 'string') {
    const items: BrokerItemObj = JSON.parse(jsonBrokerList);
    items.forEach(item => {
      const arr: BrokerObj[] = [];
      item[1].forEach(v => {
        if (!isNil(v.brokerId)) {
          arr.push(v);
        }
      });
      m.set(item[0], arr);
    });
  }
  const tmp = cloneDeep(data);
  tmp[UserSettingFunction.UserSettingTeamCollaboration] = JSON.stringify([...m]);

  return tmp;
};

// 将本地默认数据和后端返回的数据整合成
const getUserSettingsData = async () => {
  const res = await fetchUserSetting({});
  const remoteData = res.setting_list || [];
  const map = new Map<number, UserSetting>();

  const localData = getDefaultSetting();

  Object.keys(localData).forEach(key => {
    const functionKey = Number(key);
    map.set(functionKey, {
      value: JSON.stringify(localData[key]),
      function: functionKey
    });
  });
  remoteData.forEach(item => {
    map.set(item.function, {
      value: item.value,
      function: item.function
    });
  });
  return [...map.values()];
};

/** 清空localStorage中保存的用户设置相关数据 */
const clearUSerSettingsDataInLocalStorage = () => {
  const numStr = localStorage.getItem(LocalStorageFunctionTypeNum);
  const num = numStr ? Number(numStr) + 1 : 1;
  for (let i = 1; i < num; i++) {
    localStorage.removeItem(getUserSettingsKey(i));
  }
};

/**
 * 将用户设置的数据初始化到localStorage中
 */
const initUserSettingsDataToLocalStorage = async () => {
  // 先清掉localStorage中存放的旧的用户设置相关的权限，避免同一台机器切换账号出现不符合权限的情况
  clearUSerSettingsDataInLocalStorage();

  const initData = await getUserSettingsData();
  let num = 0;
  for (const item of initData) {
    if (item.value === undefined) {
      localStorage.removeItem(getUserSettingsKey(item.function));
    } else {
      localStorage.setItem(getUserSettingsKey(item.function), String(item.value));
    }
    if (item.function > num) {
      num = item.function;
    }
  }
  localStorage.setItem(LocalStorageFunctionTypeNum, String(num));
};

/**
 * 用户设置保存
 */
const saveUserSettingsByProductType = (data: IUserSettingValue, productTypeList: ProductType[]) => {
  let formatData: IUserSettingValue = {};
  if (productTypeList.length) {
    const formatValue = Object.keys(data).reduce((acc, key) => {
      const funcKey: UserSettingFunction = Number(key);
      const rawValue = parseJSON(getOneUserSettingsRawValue(funcKey) ?? '');
      const curValue = productTypeList.reduce(
        (pre, cur) => {
          return {
            ...pre,
            [cur]: data[funcKey]
          };
        },
        {} as { [p in ProductType]?: CommonTypeValue }
      );

      if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
        const obj = { ...rawValue, ...curValue };
        // 去掉productType为0的无效设置
        acc[funcKey] = JSON.stringify(omit(obj, ProductType.ProductTypeNone));
      } else {
        acc[funcKey] = JSON.stringify({ ...curValue });
      }
      return acc;
    }, {} as IUserSettingValue);

    formatData = formatValue;
  } else {
    formatData = data;
  }

  // 更新indexDB信息
  const setting_list: UserSetting[] = [];
  Object.entries(formatData).forEach(([key, val]) => {
    setting_list.push({
      function: Number(key),
      value: String(val)
    });
  });

  return mulUpsertUserSetting({ setting_list });
};

/**
 *
 * 对比得到差异的数据
 */
const getDiffData = (curData: IUserSettingRawValue, oldData?: IUserSettingRawValue) => {
  if (oldData === undefined) {
    return curData;
  }

  const newData = dataBeforeCommit(curData);
  const diffData: IUserSettingRawValue<string> = {};
  Object.keys(newData).forEach(key => {
    if (newData[key] !== oldData[key]) {
      diffData[key] = String(newData[key]);
    }
  });
  return diffData;
};

export {
  generateSettingsData,
  getUserSettingsKey,
  getOneUserSettingsValue,
  getUserSettingsInitData,
  getUserSettingsInitDataArr,
  initUserSettingsDataToLocalStorage,
  saveUserSettingsByProductType,
  getDiffData
};
