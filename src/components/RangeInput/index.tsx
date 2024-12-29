import { FocusEventHandler, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { Button } from '@fepkg/components/Button';
import { CommonDatePicker } from '@fepkg/components/DatePicker/CommonPicker';
import { Input } from '@fepkg/components/Input';
import { Size } from '@fepkg/components/types';
import { IconCalendar, IconCloseCircleFilled, IconYD } from '@fepkg/icon-park-react';
import { useMemoizedFn } from 'ahooks';
import { debounce } from 'lodash-es';
import { Moment } from 'moment';
import styles from './style.module.less';

export type RangeInputValue = [string, string] | [Moment | null, Moment | null];

const InputRangeDefaultWidth = 214;

export type RangeInputProps = {
  value: RangeInputValue;
  onChange?: (v: RangeInputValue) => void;
  onDebounceChange?: (v: RangeInputValue) => void;
  debounceTime?: number;
  className?: string;
  centerElement?: ReactNode;
  suffix?: ReactNode;
  inputRegExp?: RegExp;
  placeholder1?: string;
  placeholder2?: string;
  disabled?: boolean;
  inputCount?: number;
  onBlur1?: FocusEventHandler<HTMLInputElement>;
  onBlur2?: FocusEventHandler<HTMLInputElement>;
  type?: 'string' | 'date';
  onClickCenter?: () => void;
  size?: Size;
  /** 组件状态，延用antd风格，值：error | warning | '' */
  status?: '' | 'error' | 'warning';
};

const inputCls = '!border-none !shadow-none flex-1 !bg-transparent';

const RangeInput = ({
  value,
  onChange,
  onDebounceChange,
  debounceTime = 618,
  className = '',
  centerElement = '≤ 筛选 ≤',
  suffix = <IconCloseCircleFilled className="text-primary-300 hover:text-primary-000" />,
  inputRegExp = /^\d*(\.\d*)?$/,
  placeholder1 = '请输入',
  placeholder2 = '请输入',
  inputCount = 0,
  onBlur1,
  onBlur2,
  type = 'string',
  disabled = false,
  onClickCenter,
  size = 'xs',
  status
}: RangeInputProps) => {
  const [focusState, setFocusState] = useState([false, false]);
  const [hover, setHover] = useState(false);
  const [clientSize, setClientSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });
  const [inputWidth, setInputWidth] = useState<number>(InputRangeDefaultWidth);

  useEffect(() => {
    if (inputCount && clientSize.width - 880 - InputRangeDefaultWidth * inputCount <= 0) {
      const width = (clientSize.width - 880) / inputCount;
      setInputWidth(width);
    } else setInputWidth(214);
  }, [clientSize, inputCount]);

  const onResize = useCallback(() => {
    setClientSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const [values, setValues] = usePropsValue<RangeInputValue>({
    defaultValue: ['', ''],
    value,
    onChange
  });

  const debounceChange = useMemo(
    () => debounce(v => onDebounceChange?.(v), debounceTime),
    [onDebounceChange, debounceTime]
  );

  const innerOnChange = (v: typeof value) => {
    setValues(v);
    debounceChange(v);
  };

  const isFocus = focusState.includes(true);

  const getBorderColor = useMemoizedFn(() => {
    if (status === 'error') {
      if (isFocus) return 'border-danger-100 bg-danger-700';
      if (hover) return 'border-danger-000 bg-gray-700';
      return 'border-danger-100 bg-gray-700';
    }
    if (disabled) return 'border-transparent bg-gray-600 cursor-not-allowed';
    if (isFocus) return 'border-primary-100 !bg-primary-700';
    return 'border-transparent bg-gray-700 hover:border-primary-000';
    /**
        ${isFocus && !disabled ? ' border-primary-100 !bg-primary-700' : ' border-transparent'} ${
        disabled ? 'bg-gray-600 cursor-not-allowed' : 'hover:border-primary-000 bg-gray-700'
      }
     */
  });

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cx(
        'flex items-center rounded-lg border-solid h-8 leading-[30px] px-3 border overflow:hidden',
        size === 'xs' ? 'text-xs' : 'text-sm',
        styles['range-input'],
        className,
        status === 'error' && styles['range-input-error'],
        getBorderColor()
      )}
      style={{ width: inputWidth }}
    >
      {type === 'string' ? (
        <Input
          className={cx('pr-2 pl-0 flex-shrink-0', inputCls)}
          placeholder={placeholder1}
          size={size}
          padding={[0, 11, 0, 0]}
          clearIcon={null}
          value={typeof values?.[0] === 'string' ? values?.[0] : ''}
          onFocus={() => setFocusState(prev => [true, prev[1]])}
          onBlur={e => {
            onBlur1?.(e);
            setFocusState(prev => [false, prev[1]]);
          }}
          onChange={val => {
            if (inputRegExp != null && !inputRegExp.test(val)) return;
            innerOnChange([val, values[1] as string]);
          }}
          disabled={disabled}
        />
      ) : (
        <CommonDatePicker
          allowClear={false}
          className={cx(inputCls, 'pr-2 pl-0 ', size === 'xs' ? 'child:child:!text-xs' : 'child:child:!text-sm')}
          placeholder={placeholder1}
          onFocus={() => setFocusState(prev => [true, prev[1]])}
          onBlur={e => {
            onBlur1?.(e);
            setFocusState(prev => [false, prev[1]]);
          }}
          disabledDate={current => {
            const end = values[1];
            if (current == null || end == null || typeof end === 'string') return false;

            current.hour(0);
            current.minute(0);
            current.second(0);

            return current >= end;
          }}
          value={typeof values?.[0] === 'string' ? null : (values?.[0] as Moment)}
          onChange={val => {
            innerOnChange([val, values[1] as Moment | null]);
          }}
          clearIcon={null}
          suffixIcon={null}
          disabled={disabled}
        />
      )}
      <div
        className={`${onClickCenter != null ? 'cursor-pointer' : ''} flex items-center flex-shrink-0 text-gray-200`}
        onClick={onClickCenter}
      >
        {type === 'string' ? centerElement : <IconCalendar />}
      </div>
      {type === 'string' ? (
        <Input
          className={cx(inputCls, 'px-2')}
          placeholder={placeholder2}
          size={size}
          padding={[0, 11, 0, 11]}
          clearIcon={null}
          value={typeof values?.[1] === 'string' ? values?.[1] : ''}
          onFocus={() => setFocusState(prev => [prev[0], true])}
          onBlur={e => {
            onBlur2?.(e);
            setFocusState(prev => [prev[0], false]);
          }}
          onChange={val => {
            if (inputRegExp != null && !inputRegExp.test(val)) return;
            innerOnChange([values[0] as string, val]);
          }}
          disabled={disabled}
        />
      ) : (
        <CommonDatePicker
          className={cx(inputCls, 'px-2', size === 'xs' ? 'child:child:!text-xs' : 'child:child:!text-sm')}
          placeholder={placeholder2}
          onFocus={() => setFocusState(prev => [prev[0], true])}
          onBlur={e => {
            onBlur2?.(e);
            setFocusState(prev => [prev[0], false]);
          }}
          disabledDate={current => {
            const begin = values[0];

            if (current == null || begin == null || typeof begin === 'string') return false;

            begin.hour(0);
            begin.minute(0);
            begin.second(0);

            return begin >= current;
          }}
          value={typeof values?.[1] === 'string' ? null : (values?.[1] as Moment)}
          onChange={val => innerOnChange([values[0] as Moment | null, val])}
          clearIcon={null}
          suffixIcon={null}
          disabled={disabled}
        />
      )}
      <Button
        className={cx(
          'flex !p-0 w-3.5 h-3.5 !gap-0 !leading-none !border-none !border-0 !bg-transparent rounded-full',
          (hover || isFocus) && !disabled && values.some(v => !!v) ? '' : '!opacity-0'
        )}
        onClick={() => innerOnChange?.(['', ''])}
      >
        {suffix}
      </Button>
    </div>
  );
};

export default RangeInput;

export const DateRangeInput = (props: RangeInputProps) => {
  const { inputRegExp = /^\d*[dDyY]?$/, centerElement = <IconYD />, ...rest } = props;

  const [type, setType] = useState<'string' | 'date'>('string');

  return (
    <RangeInput
      type={type}
      onClickCenter={() => {
        setType(type === 'string' ? 'date' : 'string');
        rest.onChange?.(type === 'string' ? ['', ''] : [null, null]);
      }}
      inputRegExp={inputRegExp}
      centerElement={centerElement}
      {...rest}
    />
  );
};
