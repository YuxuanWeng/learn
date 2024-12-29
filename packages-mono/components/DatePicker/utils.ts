import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Size } from '@fepkg/components/types';
import moment from 'moment';

export function getNow() {
  return moment().set('millisecond', 0);
}

export function formatTime(v?: number) {
  if (v === undefined) return '';
  let result = v.toString().replace(/[^0-9]/g, '');
  result = result.replace(/\b\d$/g, '0$&');
  return result;
}

export const transform2AntSize = (size: Size): SizeType => {
  return {
    md: 'middle',
    sm: 'middle',
    xs: 'small'
  }[size] as SizeType;
};
