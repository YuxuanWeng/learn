import cx from 'classnames';
import { Size, Theme } from '../types';

type ThemeCls = {
  background: string;
  border: string;
  input: string;
  suffixIcon: string;
  clearIcon: string;
};

type SizeCls = {
  padding: [number, number];
  text: string;
  input: string;
  icon: string;
};

export const themeClsMap: Record<Theme, ThemeCls> = {
  light: {
    background: '',
    border: '',
    input: '',
    suffixIcon: '',
    clearIcon: ''
  },
  dark: {
    background: cx(
      'def:bg-gray-700',
      'focus-within:bg-primary-700',
      'aria-disabled:bg-gray-600',
      'aria-[invalid=true]:focus-within:bg-danger-700'
    ),
    border: cx(
      'def:border def:border-solid def:border-transparent',
      'hover:border-primary-000',
      'focus-within:border-primary-100',
      'aria-disabled:border-transparent',
      'aria-[invalid=true]:border-danger-100',
      'aria-[invalid=true]:hover:border-danger-000',
      'aria-[invalid=true]:focus-within:border-danger-100'
    ),
    input: cx(
      'text-gray-000 def:bg-transparent def:border-none def:outline-none',
      'def:font-medium placeholder:text-gray-300',
      'disabled:cursor-not-allowed'
    ),
    suffixIcon: cx('def:text-gray-300', 'hover:text-primary-000', 'peer-disabled/input:text-gray-400'),
    clearIcon: cx(
      'def:text-primary-300',
      'hover:text-primary-000',
      'aria-[invalid=true]:text-danger-300',
      'aria-[invalid=true]:hover:text-danger-000'
    )
  }
};

export const sizeClsMap: Record<Size, SizeCls> = {
  md: { padding: [4, 12], text: 'text-sm', input: 'mr-6', icon: 'right-3 w-4 h-4' },
  sm: { padding: [4, 12], text: 'text-sm', input: 'mr-6', icon: 'right-3 w-4 h-4' },
  xs: { padding: [3, 7], text: 'text-sm', input: 'mr-4', icon: 'right-2 w-3 h-3' }
};

export const iconCls = 'absolute top-1/2 -translate-y-1/2 leading-0 cursor-pointer';

export const loginInputCls = 'bg-white/4 aria-disabled:bg-white/10 border-white/6';
