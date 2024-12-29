import { RangePicker as OldRangePicker } from '@fepkg/components/DatePicker/RangePicker';
import { useNotify } from '@/providers/NotifyProvider';
import { isNil } from 'lodash-es';
import moment, { Moment } from 'moment';
import './index.less';

const dateConvert = (str?: string) => {
  if (isNil(str)) {
    return null;
  }
  return moment(Number(str));
};

export const RangePicker = () => {
  const { params, onFilterChange } = useNotify();
  const onDateRangeChange = (v: [Moment | null, Moment | null] | null) => {
    let range: [Moment | null, Moment | null];
    if (v?.[0] && v?.[1]) {
      range = v.sort((a, b) => {
        const timeA = a?.valueOf();
        const timeB = b?.valueOf();
        if (!timeA || !timeB) return 0;
        return timeA - timeB;
      });
      const [start, end] = range;
      onFilterChange({
        start_time: String(start?.valueOf()),
        end_time: String(end?.valueOf())
      });
    } else {
      const startTime = isNil(v?.[0]) ? undefined : String(v?.[0]?.valueOf());
      const endTime = isNil(v?.[1]) ? undefined : String(v?.[1]?.valueOf());
      onFilterChange({
        start_time: startTime,
        end_time: endTime
      });
    }
  };

  return (
    <section className="flex flex-shrink-0 gap-3 items-center w-[480px] h-8 bg-gray-800 rounded-lg">
      <span className="w-[72px] pl-3 text-gray-200 text-sm font-medium whitespace-nowrap">发送时间</span>
      <OldRangePicker
        className="rounded-l-none w-full odm-range-picker"
        placeholder={['开始时间', '结束时间']}
        dropdownClassName="odm-range-dropdown"
        showTime
        value={[dateConvert(params.start_time), dateConvert(params.end_time)]}
        onCalendarChange={onDateRangeChange}
      />
    </section>
  );
};
