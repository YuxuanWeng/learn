import { HTMLProps, ReactNode, forwardRef } from 'react';
import cx from 'classnames';
import { Checkbox, CheckboxProps } from '../Checkbox';
import './index.less';

type BaseOptionProps = {
  /** 是否带多选框，默认不带 */
  checkbox?: boolean;
  /** 选项后缀元素，一般为删除按钮，或者下级展开icon */
  suffixNode?: ReactNode;
  /** 鼠标移到选项上时才展示后缀元素 */
  hoverShowSuffix?: boolean;
  /** 多选模式的参数 */
  checkboxProps?: CheckboxProps;
  /** 当前选项的活动状态，可能是hover了，也可能是键盘切换了选中状态 */
  active?: boolean;
  /** 是否使用hover样式 */
  hoverActive?: boolean;
  /** 是否禁用该选项 */
  disabled?: boolean;
  /** 是否选中 */
  selected?: boolean;
  /** 是否展开当前选项的子项——该属性需要伴随着checkbox使用，因为单选一般不会有二级选项 */
  expand?: boolean;
  /** option二级文案 */
  secondaryText?: string;
};

/**
 * 支持单选和多选
 * @returns 基础选项
 */
export const BaseOption = forwardRef<
  HTMLDivElement,
  BaseOptionProps & Omit<HTMLProps<HTMLDivElement>, 'ref' | keyof BaseOptionProps | 'checked'>
>((props, ref) => {
  const {
    checkbox,
    suffixNode,
    secondaryText,
    checkboxProps,
    children,
    active,
    hoverActive = false,
    disabled,
    expand,
    hoverShowSuffix,
    selected,
    className,
    ...rest
  } = props;

  // 默认单列单选展示
  let node = (
    <div className="w-full flex truncate overflow-x-hidden">
      {children}
      {secondaryText && <span className="s-base-option-secondary">{secondaryText}</span>}
    </div>
  );

  // 如果是多选
  if (checkbox) {
    node = (
      <Checkbox
        {...checkboxProps}
        disabled={disabled || checkboxProps?.disabled}
        className={cx('def:w-full overflow-x-hidden truncate h-full justify-start', checkboxProps?.className)}
      >
        {children}
        {secondaryText && <span className="s-base-option-secondary">{secondaryText}</span>}
      </Checkbox>
    );
  }

  const containerCls = cx(
    's-base-option-container',
    // 单列多列样式区分
    'flex',
    // 如果有传入active，就直接修改背景色
    active ? 's-base-option-active' : '',
    // 当option没有active状态时，就用hover的样式，hover的样式与active的样式是一致的
    hoverActive ? 's-base-option-hover-active' : '',
    disabled ? 's-base-option-disabled' : '',
    hoverShowSuffix ? 's-base-option-hover-for-suffix' : '',
    checkbox ? 's-base-option-multiple' : 's-base-option-single',
    // 半选样式等同全选
    (checkboxProps?.checked || checkboxProps?.indeterminate) && 's-base-option-multiple-checked',
    // 单选的选中样式和多选的展开样式是同一套
    (!checkbox && selected) || (checkbox && expand) ? 's-base-option-selected' : '',
    className
  );

  return (
    <div
      className={containerCls}
      ref={ref}
      {...rest}
    >
      {node}
      <div className="s-base-option-suffix">{suffixNode}</div>
    </div>
  );
});
