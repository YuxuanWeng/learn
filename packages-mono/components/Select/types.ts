import { ReactNode } from 'react';
import { TypeOfUnion, UnionType } from '@fepkg/common/types';
import { SearchImperativeRef, SearchProps, SearchValue } from '../Search';

export type SelectImperativeRef = SearchImperativeRef;

export type SelectValue = SearchValue | UnionType<Exclude<SearchValue, null>>;

export type SelectOption<T = SearchValue> = {
  /** 选项展示的内容 */
  label: string;
  /** 选项的值 */
  value: T;
  /** 选项是否被禁用 */
  disabled?: boolean | undefined;
};

type OmitSearchPropsKey =
  | 'options'
  | 'optionRender'
  | 'padding'
  | 'inputValueRender'
  | 'defaultValue'
  | 'value'
  | 'onChange';

export type SelectProps<T extends SelectValue = SelectValue, O extends TypeOfUnion<T> = TypeOfUnion<T>> = Omit<
  SearchProps,
  OmitSearchPropsKey
> & {
  /** 是否为 search 模式，search 模式下可输入内容改变 input value */
  search?: boolean;
  /** 是否为多选模式，默认为 false */
  multiple?: boolean;
  /** 多选模式下是否展示已选项标签 */
  tags?: boolean;
  /** 已选的选项数据，用于 search 模式下，options 中可能没有已选项，需要使用属性 */
  selectedOptions?: SelectOption<O>[];
  /** 选项数据 */
  options?: SelectOption<O>[];
  /** 自定义 option 的渲染方式 */
  optionRender?: (opt: SelectOption<O>, keyword: string) => ReactNode;
  /** 自定义 option 的过滤方式，默认为 true，为 true 时使用 input value 进行过滤 */
  optionFilter?: boolean | ((opt: SelectOption<O>, keyword: string) => boolean);
  /** 默认选中的选项 */
  defaultValue?: T;
  /** 当前选中的选项，如传 undefined，会使组件变为不受控模式，组件显示内容可能会不受控，清空 Select 请传 null 或 [] */
  value?: T;
  /** 选中选项时的回调 */
  onChange?: (val: T, opt?: SelectOption<O>, selected?: boolean, selectedOpts?: SelectOption<O>[]) => void;
};
