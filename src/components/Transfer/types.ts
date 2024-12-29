import { ReactNode } from 'react';

export interface TransferOption {
  key: string;
  title: ReactNode;
  disabled?: boolean;
}

export type SortableOptionProps = {
  option: TransferOption;
  selected?: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  onClick?: (option: TransferOption, keyMode: KeyMode) => void;
};

export type OverlayOptionProps = {
  option?: TransferOption;
};

export type ContainerPlaceholderProps = {
  showPlaceholder: boolean;
  title?: string;
};

export type ContainerProps = {
  id: string;
  title?: string;
  position: Position;
  options: TransferOption[];
  keys: string[];
  selectedKeys?: string[];
  onClick?: (item: TransferOption, keyMode: KeyMode) => void;
};

export type TransferProps = {
  options: TransferOption[];
  sourceTitle?: string;
  targetTitle?: string;
  sourceKeys: string[];
  targetKeys: string[];
  disabled?: boolean;
  onChange: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
};

export enum KeyMode {
  None = 0,
  Ctrl = 1,
  Shift = 2
}

export enum Position {
  Left = 'left',
  Right = 'right'
}

export type ButtonGroupProps = {
  disabled?: boolean;
  toLeftDisabled: boolean;
  toRightDisabled: boolean;
  onOneToLeftClick: () => void;
  onOneToRightClick: () => void;
  onAllToLeftClick: () => void;
  onAllToRightClick: () => void;
};
