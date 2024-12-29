import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Dropdown, InputNumber } from 'antd';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconCalendar } from '@fepkg/icon-park-react';
import { Moment } from 'moment';
import { PickerPanel } from 'rc-picker';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import zhCH from 'rc-picker/lib/locale/zh_CN';
import { useClickOut } from './useClickOut';
import { formatTime, getNow } from './utils';
import './style.module.less';

type DatePickerProps = {
  value?: Moment | null;
  onChange?: (date: Moment | null, dateString: string) => void;
  defaultValue?: Moment;
  disabledDate?: (date: Moment) => boolean;
  label?: string;
  inputCls?: string;
  dropdownCls?: string;
  showNow?: boolean;
  showTime?: boolean;
};

const formatStr = 'YYYY-MM-DD HH:mm:ss';

const inputNumberProps = {
  className: 'w-[40px] h-6 bg-gray-700 border-none text-xs',
  type: 'number',
  formatter: formatTime,
  min: 0,
  step: 1,
  controls: false
};

/**
 * DatePicker 选择扩展
 * @description 解决自定义时间输入框问题
 */
export function ShowTimeDatePicker(props: DatePickerProps) {
  const {
    value,
    onChange,
    defaultValue,
    disabledDate,
    label,
    inputCls,
    dropdownCls,
    showNow = true,
    showTime = true
  } = props;
  const [isOpen, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState<Moment | null>(null);
  const [tmpValue, setTmpValue] = useState<Moment | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);

  // 外部传入数据变更时及时更新
  useEffect(() => {
    setInnerValue(value ?? null);
    setTmpValue(value ?? null);
  }, [value]);

  // 更改日期和时间时，及时更改tmpValue以更新输入框内容
  useEffect(() => {
    setHour(tmpValue?.hour() ?? null);
    setMinute(tmpValue?.minute() ?? null);
    setSecond(tmpValue?.second() ?? null);
  }, [tmpValue]);

  // 鼠标点击区域离开组件时关闭面板，并回到之前的值
  useClickOut(containerRef, dropdownRef, isOpen, () => {
    setOpen(false);
    setTmpValue(innerValue);
  });

  const overlay = (
    <div ref={dropdownRef}>
      <PickerPanel<Moment>
        tabIndex={-1}
        generateConfig={momentGenerateConfig}
        defaultValue={defaultValue}
        disabledDate={disabledDate}
        locale={zhCH}
        picker="date"
        value={tmpValue}
        onChange={v => {
          setTmpValue(v);
        }}
      />
      {showTime && (
        <div className="flex justify-center h-10 items-center gap-1 border border-b-0 border-x-0 border-gray-400 border-dashed">
          <InputNumber
            {...inputNumberProps}
            value={hour}
            defaultValue={defaultValue?.hour()}
            max={23}
            controls={false}
            onChange={num => {
              if (num !== null) {
                tmpValue?.set('hour', num);
                setHour(num);
              }
            }}
            onFocus={event => {
              event.target.select();
            }}
          />
          :
          <InputNumber
            {...inputNumberProps}
            value={minute}
            defaultValue={defaultValue?.minute()}
            max={59}
            onChange={num => {
              if (num !== null) {
                tmpValue?.set('minute', num);
                setMinute(num);
              }
            }}
            onFocus={event => {
              event.target.select();
            }}
          />
          :
          <InputNumber
            {...inputNumberProps}
            value={second}
            defaultValue={defaultValue?.second()}
            max={59}
            onChange={num => {
              if (num !== null) {
                tmpValue?.set('second', num);
                setSecond(num);
              }
            }}
            onFocus={event => {
              event.target.select();
            }}
          />
        </div>
      )}

      <div
        className={cx(
          'flex py-1.5 px-6 border border-b-0 border-x-0 border-gray-400 border-solid',
          showNow ? 'justify-between' : 'justify-center'
        )}
      >
        {showNow && (
          <Button
            type="primary"
            ghost
            onClick={() => {
              setTmpValue(getNow());
            }}
          >
            此刻
          </Button>
        )}

        <Button
          type="primary"
          onClick={() => {
            onChange?.(tmpValue, tmpValue?.format(formatStr) ?? '');
            setInnerValue(tmpValue);
            setOpen(false);
          }}
        >
          确定
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={overlay}
      visible={isOpen}
      transitionName=""
      overlayClassName={cx(dropdownCls, 'bg-gray-600 border border-gray-400 border-solid')}
      overlayStyle={{ minWidth: '286px' }}
    >
      <div ref={containerRef}>
        <Input
          tabIndex={-1}
          label={label}
          className={inputCls}
          suffixIcon={<IconCalendar />}
          placeholder="请选择日期"
          readOnly
          value={tmpValue?.format(formatStr) ?? ''}
          onClick={() => {
            if (!tmpValue) setTmpValue(getNow());
            setOpen(true);
          }}
        />
      </div>
    </Dropdown>
  );
}
