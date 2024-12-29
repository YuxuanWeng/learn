import { useState } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import { RangeValue } from '@/pages/Quote/BondDetail/type';
import { useHistoryRecords } from './provider';

const prev14Date = moment().subtract(14, 'days');

export default function useDateRange() {
  const [dateRange, setDateRange] = useState<RangeValue | undefined>([
    moment().startOf('days'),
    moment().endOf('days')
  ]);

  const { onFilterChange, filterData, initEndStr, initStartStr } = useHistoryRecords();
  const onDateRangeChange = (v: RangeValue) => {
    let range: RangeValue;
    if (v) {
      range = v.sort((a, b) => {
        const timeA = a?.valueOf();
        const timeB = b?.valueOf();
        if (!timeA || !timeB) return 0;
        return timeA - timeB;
      });
      const [start, end] = range;
      if (start && end) {
        range[0] = start.startOf('days');
        range[1] = end.endOf('days');
      }
      onFilterChange({
        ...filterData,
        create_start_time: String(range[0]?.valueOf()),
        create_end_time: String(range[1]?.valueOf())
      });
    } else {
      onFilterChange({
        ...filterData,
        create_start_time: initStartStr,
        create_end_time: initEndStr
      });
    }

    setDateRange(undefined);
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    const nextDay = moment().endOf('days');
    return (current && current.isBefore(prev14Date)) || (current && current.isAfter(nextDay));
  };

  return {
    dateRange,
    disabledDate,
    onDateRangeChange,
    prev14Date
  };
}
