import { ButtonHTMLAttributes, ReactNode } from 'react';
import { TooltipProps } from '../Tooltip';
import { Size } from '../types';

// TODO: 后面PM会拍一个默认时间
export const DEFAULT_THROTTLE_WAIT = 300;
export const DEFAULT_KEY_DOWN_THROTTLE_WAIT = 500; // 300在老机器和弱网环境下还是会重复提交

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'orange'
  | 'green'
  | 'gray'
  | 'danger'
  | 'transparent'
  | 'yellow'
  | 'purple';
export type ButtonPlainType = boolean | 'primary' | 'orange';

export type BasicButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  /** 按钮类型，默认为 primary */
  type?: ButtonType;
  /** 是否将宽度调整为其父宽度，默认为 false */
  block?: boolean;
  /** Button 原生的 type 值 */
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** 按钮大小，默认为 xs */
  size?: Size;
  /** Icon */
  icon?: ReactNode;
  /** Tooltip 组件 props，若 tooltip.content 不为 undefined，则展示 tooltip */
  tooltip?: TooltipProps;
  /** 是否为幽灵按钮 */
  ghost?: boolean;
  /** 是否为文字按钮 */
  text?: boolean;
  /** 是否为朴素按钮 */
  plain?: ButtonPlainType;
  /** 是否开启节流模式，默认true, 如果传入throttleWait，则也认为开启节流模式 */
  enableThrottle?: boolean;
  /** 节流等待时间，默认300毫秒 */
  throttleWait?: number;
};

export type ButtonProps = BasicButtonProps & {
  /** 是否 loading 状态 */
  loading?: boolean;
};

export type ButtonIconProps = BasicButtonProps & {
  /** 是否为点亮式按钮 */
  bright?: boolean;
  /** 是否选中，仅在点亮式按钮时生效 */
  checked?: boolean;
  /** 是否为透明按钮 */
  transparent?: boolean;
};
