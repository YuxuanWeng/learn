import { DatePicker, DatePickerProps } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';

/**
 * DatePicker 选择扩展
 * @description 解决自定义当前月/年样式等问题
 */
export function EnhancedDatePicker(props: DatePickerProps) {
  const cellRender = (current: Moment) => {
    const now = moment();
    let cls = 'ant-picker-cell-inner';
    if (current.year() === now.year() && current.month() === now.month()) {
      cls += ' current-month';
    }
    const month = `${current.month() + 1}月`;
    return <div className={cls}>{month}</div>;
  };

  const { picker } = props;

  const enhProps: DatePickerProps = {};
  if (picker === 'year') {
    enhProps.dropdownClassName = `year-${moment().year()}`;
  }
  if (picker === 'month') {
    enhProps.monthCellRender = cellRender;
  }

  return (
    <DatePicker
      {...enhProps}
      {...props}
    />
  );
}
