import { Component, forwardRef } from 'react';
import cx from 'classnames';
import { DatePicker } from 'antd';
import { PickerProps } from 'antd/es/date-picker/generatePicker';
import { Size } from '@fepkg/components/types';
import {
  IconCalendar,
  IconCloseCircleFilled,
  IconLeft,
  IconLeftDouble,
  IconRight,
  IconRightDouble
} from '@fepkg/icon-park-react';
import { Moment } from 'moment';
import { transform2AntSize } from './utils';

type CommonDatePickerProps = Omit<PickerProps<Moment>, 'size'> & { prefix?: string; size?: Size };

/**
 * RangePicker 范围日期选择器扩展
 * @description 解决样式等问题
 */

export const CommonDatePicker = forwardRef<Component<PickerProps<Moment>>, CommonDatePickerProps>((props, ref) => {
  const { disabled, prefix, size = 'md', className, ...restProps } = props;
  return (
    <DatePicker
      ref={ref}
      suffixIcon={<IconCalendar className="text-gray-200" />}
      size={transform2AntSize(size)}
      clearIcon={<IconCloseCircleFilled />}
      prevIcon={<IconLeft className="mt-3" />}
      superPrevIcon={<IconLeftDouble className="mt-3" />}
      nextIcon={<IconRight className="mt-3" />}
      superNextIcon={<IconRightDouble className="mt-3" />}
      className={cx(
        // 这个边距导致RangeInput里面的日期选择器被遮挡
        // '!px-3',
        prefix &&
          'before:flex-shrink-0 before:content-[var(--date-picker-prefix)] before:!w-18 before:text-sm before:text-gray-200',
        prefix && size === 'xs' && '!before:text-xs',
        size === 'sm' && '!h-7',
        size === 'xs' && '!text-xs',
        className
      )}
      style={{
        // @ts-ignore
        '--date-picker-prefix': `'${prefix}'`
      }}
      disabled={disabled}
      {...restProps}
    />
  );
});
