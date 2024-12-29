import React, { Key, ReactNode } from 'react';

export type TabItem<T extends Key = Key> = {
  /** 唯一标识 */
  key: T;
  /** 文案内容 */
  label: string;
  /** Icon */
  icon?: ReactNode;
  /** Item className */
  className?: string;
};

export type TabsProps<T extends Key = Key> = {
  /** Container className */
  className?: string;
  /** 是否为朴素样式 */
  plain?: boolean;
  /** Tabs 渲染项数组 */
  items: TabItem<T>[];
  /** 默认选中项 Key */
  defaultActiveKey?: T;
  /** 选中项 Key */
  activeKey?: T;
  /** 选中项变更时的回调 */
  onChange?: (item: TabItem<T>) => void;
  /** 状态徽标 */
  badge?: { key: T; node?: React.ReactNode };
  /** 默认样式是否只有底线色，无背景色 */
  baseLine?: boolean;
};
