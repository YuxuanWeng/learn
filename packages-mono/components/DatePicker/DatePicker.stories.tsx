import { useState } from 'react';
import type { Moment } from 'moment';
import { CommonDatePicker } from './CommonPicker';
import { RangePicker } from './RangePicker';

type RangeValue = [Moment | null, Moment | null] | null;

export default {
  title: '基础组件/DatePicker',
  component: CommonDatePicker
};

export const BasicPicker = () => {
  return (
    <div className="bg-gray-750 pt-2 pb-2 pl-2">
      <CommonDatePicker prefix="标题" />
    </div>
  );
};
BasicPicker.storyName = '基本用法';

// export const Settlement = () => {
//   return <SettlementDatePicker />;
// };
// Settlement.storyName = 'SettlementDatePicker';

// export const RadioSquare = () => {
//   return (
//     <SettlementDatePicker
//       prefix="交易日"
//       pickerClassName="w-[208px]"
//       offsetMode="radio-square"
//     />
//   );
// };
// RadioSquare.storyName = 'SettlementDatePicker RadioSquare 模式';

// export const RadioRound = () => {
//   return <SettlementDatePicker offsetMode="radio-round" />;
// };
// RadioRound.storyName = 'SettlementDatePicker RadioRound 模式';

export const Range = () => {
  const [dates, setDates] = useState<RangeValue>(null);
  const [value, setValue] = useState<RangeValue>(null);
  const [hackValue, setHackValue] = useState<RangeValue>(null);

  const disabledDate = (current: Moment) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 14;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 14;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setHackValue([null, null]);
      setDates([null, null]);
    } else {
      setHackValue(null);
    }
  };

  return (
    <div className="bg-gray-750 pt-2 pb-2 pl-2">
      <RangePicker
        value={hackValue || value}
        disabledDate={disabledDate}
        onCalendarChange={val => setDates(val)}
        onChange={val => setValue(val)}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};
Range.storyName = '日期范围';

// export const Month = () => {
//   const disabledDate: RangePickerProps['disabledDate'] = current => {
//     return current && current < moment().endOf('day');
//   };

//   return (
//     <div className="bg-gray-750 pt-2 pb-2 pl-2">
//       <EnhancedDatePicker
//         picker="month"
//         disabledDate={disabledDate}
//       />
//     </div>
//   );
// };
// Month.storyName = '月';

// export const Year = () => {
//   const disabledDate: RangePickerProps['disabledDate'] = current => {
//     return current && current < moment().endOf('day');
//   };

//   return (
//     <div className="bg-gray-800 pt-2 pb-2 pl-2">
//       <EnhancedDatePicker
//         picker="year"
//         disabledDate={disabledDate}
//       />
//     </div>
//   );
// };
// Year.storyName = '年';

// export const ShowTime = () => {
//   return <DatePicker />;
// };

// ShowTime.storyName = '拓展时分秒';
