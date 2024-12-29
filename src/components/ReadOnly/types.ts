import React from 'react';

export type ReadOnlyOption = {
  label: string;
  value?: string | number;
  isTruncate?: boolean;
  enableCopy?: boolean;
  className?: string;
  suffix?: React.ReactNode;
  contentBold?: boolean;
};

export type ReadOnlyProps = {
  /** 选项 */
  options?: ReadOnlyOption[];
  /** 容器样式 */
  containerClassName?: string;
  /** 单个选项的样式 */
  optionsClassName?: string;
  /** label宽，默认85px */
  labelWidth?: number;
  /** 是否允许复制，默认false */
  enableCopy?: boolean;
  /** 每行显示多少个，默认3个 */
  rowCount?: number;
  /** 默认展示value文本 */
  defaultValue?: string;
};
