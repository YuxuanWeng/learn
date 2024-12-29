import { Key, RefObject } from 'react';
import { TabItem, TabsProps } from '@fepkg/components/Tabs';

type BaseType<T extends Key = Key> = {
  /** 默认样式是否只有底线色，无背景色 */
  baseLine?: boolean;
  /** 输入框允许的最大输入字符长度 */
  maxLength?: number | false;
  /** 错误状态 */
  error?: boolean;
  /** 编辑状态 */
  isEditing?: boolean;
  /** input ref */
  inputRef?: RefObject<HTMLInputElement>;
  /** 选中项变更时的回调 */
  onChange?: (item: TabItem<T>) => void;
  /** 名称变化时候的回调 */
  onRename?: (item: TabItem<T>) => boolean;
};

export type RenameTabsProps<T extends Key = Key> = TabsProps<T> & BaseType<T>;

export type TabProps<T extends Key = Key> = BaseType<T> & {
  /** 名称变化时候的回调 */
  onRename?: (item: TabItem<T>) => boolean;

  item: TabItem<T>;
  /** 是否活跃 */
  active: boolean;
};
