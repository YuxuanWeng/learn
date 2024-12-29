import { Component, forwardRef } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import {
  IconCalendar,
  IconCloseCircleFilled,
  IconLeft,
  IconLeftDouble,
  IconRight,
  IconRightDouble
} from '@fepkg/icon-park-react';
import { Moment } from 'moment';
import { Size } from '@fepkg/components/types';
import { transform2AntSize } from './utils';

const { RangePicker: AntRangePicker } = AntDatePicker;

/**
 * RangePicker 范围日期选择器扩展
 * @description 解决样式等问题
 */
export const RangePicker = forwardRef<Component<RangePickerProps<Moment>>, RangePickerProps<Moment> & { size?: Size }>(
  (props, ref) => {
    const { className, size = 'sm', ...restProps } = props;
    return (
      <AntRangePicker
        ref={ref}
        size={transform2AntSize(size)}
        className={className}
        separator={<IconCalendar className="text-gray-200" />}
        prevIcon={<IconLeft className="mt-3" />}
        superPrevIcon={<IconLeftDouble className="mt-3" />}
        nextIcon={<IconRight className="mt-3" />}
        superNextIcon={<IconRightDouble className="mt-3" />}
        clearIcon={<IconCloseCircleFilled />}
        suffixIcon={null}
        {...restProps}
      />
    );
  }
);
