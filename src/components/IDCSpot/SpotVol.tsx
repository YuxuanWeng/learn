import { FC, HTMLProps, MutableRefObject, useRef } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { formatIntegerInput } from '@fepkg/common/utils';
import { Input } from '@fepkg/components/Input';
import { isNumber } from 'lodash-es';
import Stepper from '@/components/Stepper';

type IProps = {
  value?: number;
  onChange?: (vol: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  inputClass?: string;
  inputSuffixClass?: string;
  stepperClass?: string;
  stepperBtnCls?: string;
  /** 是否为轻量版 */
  autoFocus?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  onSubmit?: () => void;
};
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

const getValueWithLimit = (value?: number, limit?: number) => {
  if (value === undefined) return undefined;
  if (!limit) return value;
  return Math.min(limit, value);
};

const SpotVol: FC<IProps & IDom> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  inputClass,
  inputSuffixClass,
  stepperClass,
  stepperBtnCls,
  autoFocus,
  inputRef,
  onSubmit,
  ...rest
}) => {
  // 用于处理自动聚焦事件
  const isFocusingFinished = useRef(false);

  const [spotVol, setSpotVol] = usePropsValue({
    defaultValue: getValueWithLimit(value, max),
    value: getValueWithLimit(value, max)
  });

  const updateSpotVol = (val: string) => {
    let ev: string | number | undefined = val;
    ev = formatIntegerInput(ev);
    if (ev !== undefined) {
      if (ev > max) ev = String(ev).slice(0, Math.max(0, String(max).length));
      if (Number(ev) > max) {
        ev = max;
      }
      if (Number(ev) < min) {
        ev = spotVol;
      }
      ev = formatIntegerInput(ev);
    }
    setSpotVol(ev);
    onChange?.(ev!);
  };

  let inputValue = isNumber(spotVol) ? String(spotVol) : spotVol;
  if (inputValue === undefined) inputValue = '';

  return (
    <div
      {...rest}
      className={cx('flex justify-between items-center gap-3', rest?.className)}
    >
      <label className={cx('inline-flex items-end text-white')}>
        <Input
          ref={node => {
            if (!node) return;
            if (inputRef) {
              inputRef.current = node;
            }
            if (isFocusingFinished.current || !autoFocus) return;
            isFocusingFinished.current = true;
            node.focus();
            node.select();
          }}
          error={!inputValue}
          disabled={disabled}
          className={cx('h-8 !rounded-r-none flex-1', inputClass)}
          clearIcon={null}
          value={inputValue}
          onChange={updateSpotVol}
          onEnterPress={(val, evt) => {
            evt.stopPropagation();
            onSubmit?.();
          }}
        />
        <span
          className={cx(
            'w-12 h-8 flex justify-center items-center text-gray-000 rounded-r-lg border border-solid border-l-0',
            disabled ? 'bg-gray-700 cursor-not-allowed border-gray-600' : 'bg-gray-600 border-gray-700',
            inputSuffixClass
          )}
        >
          kw
        </span>
      </label>
      <Stepper
        disabled={disabled}
        value={spotVol}
        min={min}
        max={max}
        className={cx('select-none', stepperClass)}
        onChange={num => updateSpotVol(String(num))}
        btnClass={stepperBtnCls}
      />
    </div>
  );
};

export default SpotVol;
