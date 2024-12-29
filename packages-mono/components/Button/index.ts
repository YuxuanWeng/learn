import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { BasicButton } from './Button';
import { Icon } from './Icon';
import { ButtonProps } from './types';

const Button = BasicButton as ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> & {
  Icon: typeof Icon;
};

Button.Icon = Icon;

export { Button };
export { type ButtonProps, type ButtonIconProps } from './types';
