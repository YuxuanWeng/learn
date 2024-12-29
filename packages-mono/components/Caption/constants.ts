import { Size } from '../types';

export const bgClsMap: Record<string, string> = {
  primary: 'bg-primary-100',
  secondary: 'bg-secondary-100',
  orange: 'bg-orange-100',
  danger: 'bg-danger-100'
};

export const boxShadowClsMap: Record<string, string> = {
  primary: 'rgba(31,212,158,0.4)',
  secondary: 'rgba(78,149,255,0.4)',
  orange: 'rgba(238,153,75,0.4)',
  danger: 'rgba(240,100,100,0.4)'
};
export const sizeClsMap: Record<Size, string> = {
  md: 'text-sm',
  sm: 'text-sm',
  xs: 'text-xs'
};
