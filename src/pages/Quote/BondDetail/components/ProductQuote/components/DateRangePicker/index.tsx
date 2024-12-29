import { Dispatch, FC, SetStateAction } from 'react';
import { RangePicker } from '@fepkg/components/DatePicker/RangePicker';
import moment, { Moment } from 'moment';
import { useForbidAllSelect } from '@/pages/Quote/BondDetail/hooks/useForbidAllSelect';
import { RangeValue } from '@/pages/Quote/BondDetail/type';

type Props = {
  dateRange?: RangeValue;
  setDateRange: Dispatch<SetStateAction<RangeValue>>;
};

const disabledDate = (curr: Moment) => {
  const sixMonthAgo = moment().add(-6, 'month');
  const now = moment();
  return curr.isBefore(sixMonthAgo) || curr.isAfter(now);
};
const DateRangePicker: FC<Props> = ({ dateRange, setDateRange }) => {
  const onChange = (val: RangeValue) => {
    setDateRange(val);
  };
  const [ref] = useForbidAllSelect();
  return (
    <div
      ref={ref}
      className="inline-block"
    >
      <RangePicker
        value={dateRange}
        disabledDate={disabledDate}
        onChange={onChange}
        allowClear={false}
        className="w-[240px] h-7 select-none"
      />
    </div>
  );
};

export default DateRangePicker;
