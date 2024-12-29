import { Ref } from 'react';
import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic, InputFilter, InstitutionTiny, Trader, User } from '@fepkg/services/types/common';
import { FuzzySearchType, ProductType } from '@fepkg/services/types/enum';

export enum GlobalSearchOptionType {
  INST,
  TRADER,
  BROKER,
  BOND
}

export type GlobalSearchOption = (
  | (InstitutionTiny & { search_option_type: GlobalSearchOptionType.INST })
  | (Trader & { search_option_type: GlobalSearchOptionType.TRADER })
  | (User & { search_option_type: GlobalSearchOptionType.BROKER })
  | (FiccBondBasic & { search_option_type: GlobalSearchOptionType.BOND })
) & {
  /** 是否为下一个类型的相邻选项 */
  is_sibling_option?: boolean;
};

export type GlobalSearchProps = {
  /** Container className */
  className?: string;
  /** 台子类型 */
  productType: ProductType;
  /** 搜索类型 */
  searchType: FuzzySearchType;
  /** input ref */
  inputRef?: Ref<HTMLInputElement>;
  /** 包含无效数据 */
  needInvalid?: boolean;
  /** Search value */
  value?: InputFilter;
  /** 触发搜索时的回调 */
  onSearch?: (val: InputFilter, opt?: SearchOption<GlobalSearchOption> | null) => void;
  /** 清空搜索条件时的回调 */
  onClear?: () => void;
  /** 占位符 */
  placeholder?: string;
  /** 只使用远端接口 */
  onlyRemote?: boolean;
  /** 是否可以搜索已下市债券 */
  bondUnlimited?: boolean;
};
