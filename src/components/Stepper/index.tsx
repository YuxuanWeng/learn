import { HTMLProps, useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { IconAdd, IconMinus } from '@fepkg/icon-park-react';
import { isUndefined } from 'lodash-es';

interface IProps {
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
  btnClass?: string;
}
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

type ButtonDir = 1 | -1;

export default function Stepper({
  value,
  step = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  disabled = false,
  onChange,
  btnClass,
  ...rest
}: IProps & IDom) {
  const [num, setNum] = useState<number | undefined>(value);

  useEffect(() => setNum(value), [value]);

  const onClick = (dir: ButtonDir) => {
    if (disabled) return;
    setNum(n => {
      let newValue = (n || 0) + dir * step;
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      onChange?.(newValue);
      return newValue;
    });
  };

  return (
    <div
      {...rest}
      className={cx('inline-flex gap-3', rest?.className)}
    >
      <Button
        className={cx('w-8 h-8', btnClass)}
        type="gray"
        plain
        disabled={disabled || !num || (num <= min && !isUndefined(num))}
        icon={<IconMinus />}
        onClick={() => onClick(-1)}
      />
      <Button
        className={cx('w-8 h-8', btnClass)}
        type="gray"
        plain
        disabled={disabled || !num || (num >= max && !isUndefined(num))}
        icon={<IconAdd />}
        onClick={() => onClick(1)}
      />
    </div>
  );
}
