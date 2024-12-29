import { ReactNode } from 'react';
import { InputProps } from '@fepkg/components/Input';

export type ActionInputProps = Omit<InputProps, 'onSubmit'> & {
  /** container className */
  containerCls?: string;
  /** display value className */
  displayCls?: string;
  /** 前缀，默认为 IconDecoration1  */
  prefix?: ReactNode;
  /** 后缀，默认没有 */
  suffix?: ReactNode;
  /** 触发按钮 Icon，默认为 IconEdit */
  triggerIcon?: ReactNode;
  /** 是否展示触发编辑按钮 */
  showTrigger?: boolean;
  /** 触发校验时的回调，onBlur & onEnterPress 时会触发校验 */
  onValidate?: (val: string) => Promise<boolean>;
  /** 触发提交时的回调，校验通过后会触发提交 */
  onSubmit?: (val: string) => void;
  /** 是否允许空格作为合法的value，默认不允许输入空格 */
  spaceLegal?: boolean;
  /** ActionInput默认最大长度为10，超出后不允许再输入 */
  maxLength?: number;
};
