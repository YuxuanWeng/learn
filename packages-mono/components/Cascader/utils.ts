import { omit } from 'lodash-es';
import { CascaderOption } from './types';

/**
 * 筛选并格式化入参，为每个节点添加当前选中状态，递归调用，得到可用的树状数据
 * emitTopData 已选项values是否为仅含顶级有效节点模式
 * */
export const formatCascader = (param: {
  option: CascaderOption;
  keyword: string;
  values: (string | number)[];
  parentChecked?: boolean;
}): CascaderOption | undefined => {
  const { option, keyword, values, parentChecked } = param;
  const selfChecked = values.includes(option.value);
  const selfMatch = option.label?.toString().includes(keyword);
  if (!option.children) {
    // 使用includes搜索过滤
    if (selfMatch) {
      return { ...option, checked: parentChecked || selfChecked, indeterminate: false };
    }
    return void 0;
  }

  const children = option.children
    .map(item => {
      const child = formatCascader({
        option: item,
        keyword,
        values,
        parentChecked: selfChecked || parentChecked
      });
      if (child) {
        return { ...child, parent: option.value };
      }
      return void 0;
    })
    .filter(Boolean);

  if (!children.length && !selfMatch) {
    return void 0;
  }

  return {
    ...option,
    children,
    checked: parentChecked || selfChecked,
    indeterminate: !(parentChecked || selfChecked) && children.some(o => o.checked || o.indeterminate)
  };
};

/** 递归获取本身和子节点的所有value */
const getChildValues = (option: CascaderOption): (string | number)[] => {
  if (!option.children) {
    return [option.value];
  }
  return [option.value, ...option.children.flatMap(getChildValues)];
};

/** 递归获取平铺的节点数据 */
export const getFlatOptions = (option: CascaderOption): CascaderOption[] => {
  if (!option.children) {
    return [option];
  }
  return [omit(option, 'children'), ...option.children.flatMap(getFlatOptions)];
};

/**
 * 从平铺数据获取节点的所有兄弟节点
 * @param flatOptions 平铺节点
 * @param parentValue 父节点value
 * @param exclude 传入selfValue排除自己
 * */
const getSiblingValues = (
  flatOptions: CascaderOption[],
  parentValue?: string | number,
  exclude?: string | number
): (string | number)[] => {
  return parentValue ? flatOptions.filter(o => o.parent === parentValue && o.value !== exclude).map(o => o.value) : [];
};

const getParent = (flatOptions: CascaderOption[], parentValue?: string | number): CascaderOption | undefined => {
  return parentValue ? flatOptions.find(o => o.value === parentValue) : void 0;
};

/**
 * emitTopData = true 时处理选中选项时的合并/删除不必要节点
 */
const formatTopCheckedValue = (
  values: (string | number)[],
  option: CascaderOption,
  flatOptions: CascaderOption[]
): { add: string | number; remove?: (string | number)[] } => {
  if (option.indeterminate) {
    const [, ...children] = getChildValues(option);
    return { add: option.value, remove: children };
  }
  const siblings = getSiblingValues(flatOptions, option.parent, option.value);
  if (!siblings.length || siblings.every(v => values.includes(v))) {
    const parent = getParent(flatOptions, option.parent);
    if (parent) {
      const result = formatTopCheckedValue(values, parent, flatOptions);
      return { add: result.add, remove: result.remove ? [...siblings, ...result.remove] : siblings };
    }
  }
  return { add: option.value };
};

/**
 * emitTopData = true 时处理删除选项时的合并/删除不必要节点
 */
const formatTopUnCheckedValue = (
  values: (string | number)[],
  flatOptions: CascaderOption[],
  option?: CascaderOption
): { add?: (string | number)[]; remove?: (string | number)[] } => {
  if (!option) return {};
  if (values.includes(option.value)) {
    return { remove: [option.value] };
  }
  const parent = getParent(flatOptions, option.parent);
  if (parent?.checked) {
    const siblings = getSiblingValues(flatOptions, option.parent, option.value);
    const { add: parentAdd, remove: parentRemove } = formatTopUnCheckedValue(values, flatOptions, parent);
    return {
      add: parentAdd ? [...siblings, ...parentAdd] : siblings,
      remove: parentRemove ? [option.value, ...parentRemove] : [option.value]
    };
  }
  return { remove: [option.value] };
};

/**
 * 返回选中/取消节点后更新的结果value
 */
export const onCheckedResult = (params: {
  emitTopData: boolean;
  flatOptions: CascaderOption[];
  values: (string | number)[];
  checked: boolean;
  option: CascaderOption;
}) => {
  const { emitTopData, flatOptions, values, checked, option } = params;
  const resultSet = new Set<string | number>(values);

  if (checked) {
    if (emitTopData) {
      // 增加本节点，或最近的全部子项被选中的父节点，并去除多余key
      const { add, remove } = formatTopCheckedValue(values, option, flatOptions);
      resultSet.add(add);
      if (remove) for (const k of remove) resultSet.delete(k);
    } else {
      // 删除本节点及所有子节点
      for (const v of getChildValues(option)) resultSet.delete(v);
      // 增加本节点
      resultSet.add(option.value);
    }
  } else {
    if (emitTopData) {
      const { add, remove } = formatTopUnCheckedValue(values, flatOptions, option);
      if (add) for (const k of add) resultSet.add(k);
      if (remove) for (const k of remove) resultSet.delete(k);
    }
    // 删除本节点及所有子节点
    for (const v of getChildValues(option)) resultSet.delete(v);
  }
  const resultValues = [...resultSet];
  const resultOptions = resultValues.map(v => flatOptions.find(o => o.value === v)).filter(Boolean);

  return {
    resultValues,
    resultOptions
  };
};

/**
 * @description 获得第一层与第二层选择的数据
 */
export const getBothDepthData = (val: CascaderOption | CascaderOption[]) => {
  const selected = Array.isArray(val) ? val : [];

  const firstDepthData: string[] = [];
  const secondDepthData: string[] = [];

  for (const opt of selected) {
    const sector = opt?.value?.toString() ?? '';

    if (opt.depth === 1) {
      firstDepthData.push(sector);
    } else if (opt.depth === 2) {
      secondDepthData.push(sector);
    }
  }

  return [firstDepthData, secondDepthData];
};
