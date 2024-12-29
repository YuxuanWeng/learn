import { useMemo } from 'react';
import cx from 'classnames';
import { Input } from '@fepkg/components/Input';
import { TypeItem } from '../QuoteSettings/types';

type CommonInputProps = TypeItem & {
  className?: string;
  inputCls?: string;
  max?: number;
  min?: number;
  labelWidth?: number;
  pointNum?: number;
  onChange: (params?: string) => void;
  disabled: boolean;
};

const CommonInput = ({
  className,
  inputCls,
  labelWidth,
  max = Infinity,
  min = 0,
  pointNum = 2,
  label,
  value: initValue,
  onChange,
  disabled = false
}: CommonInputProps) => {
  const value = useMemo(() => {
    if (initValue === 'undefined' || initValue === undefined || Number.isNaN(Number(initValue))) {
      return undefined;
    }
    return String(initValue);
  }, [initValue]);

  const handleChange = (val: string) => {
    const { length } = val;
    // 数值型
    const pointIndex = val.indexOf('.');
    const num = Number.parseFloat(val);
    // 空值判定 非数值型
    if (val === '' || val === undefined || (Number.isNaN(Number(val)) && val !== '.')) {
      onChange('');
    } else if (val == '.') {
      onChange('0.');
    } else if (pointIndex === -1) {
      // 整型
      if (length > 1 && val.startsWith('0')) {
        onChange(val.slice(1));
      } else if (num > max) {
        onChange(val.slice(0, length - 1));
      } else if (num < min) {
        onChange(String(min));
      } else {
        onChange(val);
      }
    } else {
      // 浮点型
      const maxIntegerLength = String(max).length - pointNum - 1;
      const arr = val.split('.');
      const n1 = Number(arr[0]) <= max ? arr[0] : arr[0].slice(0, maxIntegerLength);
      const n2 = arr[1].length > pointNum ? arr[1].slice(0, pointNum) : arr[1];
      if (pointNum > 0 && (n2.length > 0 || val.endsWith('.'))) {
        onChange(`${n1}.${n2}`);
      } else {
        onChange(n1);
      }
    }
  };

  return (
    <div className={cx('relative flex', className)}>
      <Input
        labelWidth={labelWidth}
        label={label}
        placeholder="请输入"
        value={value ?? null}
        className={inputCls}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
};

export default CommonInput;
