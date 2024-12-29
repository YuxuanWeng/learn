import { ReactNode } from 'react';
import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { GlobalSearchOption, GlobalSearchOptionType } from './types';

/** 特殊标识符号正则 */
export const flagRegex = /^[BTC][J]?[:]/;
/** 粘贴内容正则 */
export const spiltRegex = /\s/;

export const getOptions = <T>(
  type: GlobalSearchOptionType,
  list: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  restLen = 0
) => {
  const options: SearchOption<GlobalSearchOption>[] = [];
  const len = list?.length;
  if (len) {
    list.forEach((item, i) => {
      options.push({
        label: item[labelKey] as unknown as ReactNode,
        value: String(item[valueKey]),
        original: {
          is_sibling_option: i === len - 1 && restLen !== 0,
          search_option_type: type,
          ...item
        } as unknown as GlobalSearchOption
      });
    });
  }
  return options.filter(Boolean);
};

export const transform2InputValue = (opt: SearchOption<GlobalSearchOption>) => {
  const { search_option_type } = opt.original;

  switch (search_option_type) {
    case GlobalSearchOptionType.BOND:
      return opt.original.short_name;
    case GlobalSearchOptionType.INST:
      return `CJ:${opt.original.short_name_zh?.toLocaleUpperCase()}`;
    case GlobalSearchOptionType.TRADER:
      return `TJ:${opt.original.name_zh.toLocaleUpperCase()}`;
    case GlobalSearchOptionType.BROKER:
      return `BJ:${opt.original.name_cn.toLocaleUpperCase()}`;
    default:
      return '';
  }
};

export const getBondKeyList = (bondList?: FiccBondBasic[]) => {
  return bondList?.map(bond => bond.bond_key) ?? [];
};
