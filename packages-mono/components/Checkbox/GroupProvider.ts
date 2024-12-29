import { createContext, useContext } from 'react';
import { CheckboxChangeEvent, CheckboxValue } from './types';

export type CheckboxGroupContextType = {
  /** Group name */
  name?: string;
  /** Group 内所所有 checkbox 是否能通过按下 ctrl 或 command 键时切换状态 */
  ctrl?: boolean;
  /** Group 内所所有 checkbox 是否点击时是否取消选中其他选项 */
  otherCancel?: boolean;
  /** Group 内所有 checkbox 默认的 input value */
  defaultValue?: CheckboxValue[];
  /** Group 内所有 checkbox input value */
  value?: CheckboxValue[];
  /** 注册子 checkbox 的 value */
  registerValue: (val?: CheckboxValue) => void;
  /** 注销子 checkbox 的 value */
  unregisterValue: (val?: CheckboxValue) => void;
  /** Group 内所有 checkbox 切换选中的时回调 */
  onChange?: (checked: boolean, val: CheckboxValue, evt: CheckboxChangeEvent) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextType | null>(null);

export const CheckboxGroupProvider = CheckboxGroupContext.Provider;
export const useCheckboxGroup = () => useContext(CheckboxGroupContext);
