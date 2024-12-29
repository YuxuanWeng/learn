import { ReactNode } from 'react';
import { SelectProps } from '@fepkg/components/Select';

export type CascaderOption = {
  value: string | number;
  label?: string;
  disabled?: boolean;
  depth?: number;
  parent?: string | number;
  children?: CascaderOption[];
  checked?: boolean;
  indeterminate?: boolean;
};

export type CascaderItemProps = {
  option: CascaderOption;
  checkboxCls?: string;
  isExpend?: boolean;
  disabled?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  onClick?: () => void;
  onChange?: (val: boolean) => void;
};

export type CascaderListProps = {
  depth: number;
  className?: string;
  options?: CascaderOption[];
  expendDepth: number;
  /** 是否开启虚拟列表，默认为false */
  virtual?: boolean;
  setExpendDepth: (val: number) => void;
  onChange?: (val: boolean, option: CascaderOption) => void;
};

export type CascaderValue = (string | number)[] | null;

type TypeCascader = {
  options?: CascaderOption[];
  selectedOptions?: CascaderOption[];
  optionFilter?: boolean | ((opt: CascaderOption, keyword: string) => boolean);
  value?: CascaderValue;
  defaultValue?: CascaderValue;
  // onChange?: (val: SelectValue, opt?: CascaderOption, selected?: boolean, selectedOpts?: CascaderOption[]) => void;
  onChange?: (
    val: CascaderValue,
    opt?: CascaderOption | CascaderOption[],
    selected?: boolean,
    selectedOpts?: CascaderOption[]
  ) => void;
  optionRender?: (opt: CascaderOption, keyword: string) => ReactNode;
};

export type CascaderV2Props = Omit<SelectProps, keyof TypeCascader | 'multiple' | 'tags' | 'search'> & TypeCascader;
