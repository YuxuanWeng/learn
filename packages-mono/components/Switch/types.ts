import { HTMLProps, KeyboardEvent, MouseEvent } from 'react';

export type SwitchChangeEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;

export type SwitchProps = Omit<HTMLProps<HTMLButtonElement>, 'ref' | 'onClick' | 'onChange' | 'onKeyDown'> & {
  /** 是否被禁用 */
  disabled?: boolean;
  /** 默认是否选中 */
  defaultChecked?: boolean;
  /** 是否选中 */
  checked?: boolean;
  /** 切换选中的回调 */
  onChange?: (val: boolean, evt: SwitchChangeEvent) => void;
  /** 按下键盘时的回调 */
  onKeyDown?: (val: boolean, evt: KeyboardEvent<HTMLButtonElement>) => void;
};
