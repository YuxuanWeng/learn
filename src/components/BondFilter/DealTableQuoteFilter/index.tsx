import { RangePickerProps } from 'antd/lib/date-picker';
import { DateTypeOptions } from '@fepkg/business/constants/options';
import { useImmerPropsValue } from '@fepkg/common/hooks';
import { formatDate } from '@fepkg/common/utils/date';
import { Checkbox } from '@fepkg/components/Checkbox';
import { RangePicker } from '@fepkg/components/DatePicker/RangePicker';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { Select } from '@fepkg/components/Select';
import { RangeTime } from '@fepkg/services/types/common';
import { DealDateType } from '@fepkg/services/types/enum';
import moment, { Moment } from 'moment';
import { DEFAULT_MARKET_DEAL_FILTER_VALUE } from '@/common/constants/filter';
import { usePrevWorkingDate } from '@/common/services/hooks/usePrevWorkingDate';
import { TableQuoteFilterProps } from '@/components/BondFilter/types';
import { miscStorage } from '@/localdb/miscStorage';

const internalOptions = [
  { label: '内部成交', value: true },
  { label: '非内部成交', value: false }
];

const nothingDoneOptions = [
  { label: 'N.D', value: true },
  { label: '非N.D', value: false }
];

export const DealTableQuoteFilter = ({ value, onChange }: TableQuoteFilterProps) => {
  const userId = miscStorage?.userInfo?.user_id;
  const softLifecycleId = miscStorage?.softLifecycleId;
  // 获取前 11 个工作日
  const [prev11WorkingDate] = usePrevWorkingDate(11);

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    const lastDay = prev11WorkingDate ?? moment().subtract(12, 'days');
    return current && current < lastDay;
  };

  const [filterValue, updateFilterValue] = useImmerPropsValue({
    defaultValue: value ?? DEFAULT_MARKET_DEAL_FILTER_VALUE,
    value,
    onChange
  });

  const toggleInternalValue = (val: boolean[]) => {
    updateFilterValue(draft => {
      draft.flag_internal = val.length === 1 ? val.at(0) : undefined;
    });
  };

  const toggleNothingDoneValue = (val: boolean[]) => {
    updateFilterValue(draft => {
      draft.nothing_done = val.length === 1 ? val.at(0) : undefined;
    });
  };

  /** 切换我的订单时处理 broker_id_list */
  const toggleMyQuoteValue = (checked: boolean) => {
    updateFilterValue(draft => {
      if (userId) {
        draft.broker_id_list = checked ? [userId] : [];
      } else {
        draft.broker_id_list = [];
      }
    });
  };

  const handleDateTypeSelect = (val: DealDateType | undefined) => {
    updateFilterValue(draft => {
      draft.date_type = val;
      draft.date_type_soft_lifecycleId = softLifecycleId;
      if (!val) {
        draft.date_type = DealDateType.DealTime;
        draft.date_type_soft_lifecycleId = softLifecycleId;
      }
    });
  };

  const handleDateSelect = (dates: [Moment | null, Moment | null] | null) => {
    if (dates === null) {
      updateFilterValue(draft => {
        draft.date_range = void 0;
        draft.time_soft_lifecycleId = softLifecycleId;
      });
      return;
    }
    const date_range: RangeTime = {};
    if (dates?.[0]) {
      date_range.start_time = moment(dates[0]).startOf('day').valueOf().toString();
    } else {
      date_range.start_time = undefined;
    }
    if (dates?.[1]) {
      date_range.end_time = moment(dates[1]).endOf('day').valueOf().toString();
    } else {
      date_range.end_time = undefined;
    }
    updateFilterValue(draft => {
      draft.date_range = date_range;
      draft.time_soft_lifecycleId = softLifecycleId;
    });
  };

  const getDateType = () => {
    if (filterValue.date_type_soft_lifecycleId != softLifecycleId) {
      return DealDateType.DealTime;
    }
    return filterValue.date_type ?? DealDateType.DealTime;
  };

  const getDateValue = (): [Moment | null, Moment | null] => {
    if (filterValue.time_soft_lifecycleId != softLifecycleId) {
      return [moment().startOf('day'), moment().endOf('day')];
    }
    return filterValue.date_range
      ? [
          filterValue.date_range.start_time ? moment(Number(filterValue.date_range.start_time)) : null,
          filterValue.date_range.end_time ? moment(Number(filterValue.date_range.end_time)) : null
        ]
      : [null, null];
  };

  return (
    <div className="flex items-center gap-3 pl-3 py-2 bg-gray-800 select-none overflow-hidden">
      <RadioIndeterminateGroup
        className="bg-gray-700 rounded-lg [&_.s-radio-wrapper]:h-7"
        options={internalOptions}
        otherCancel
        value={typeof filterValue.flag_internal === 'boolean' ? [filterValue.flag_internal] : []}
        onChange={val => {
          toggleInternalValue(val as boolean[]);
        }}
      />

      <RadioIndeterminateGroup
        className="bg-gray-700 rounded-lg [&_.s-radio-wrapper]:h-7"
        options={nothingDoneOptions}
        value={typeof filterValue.nothing_done === 'boolean' ? [filterValue.nothing_done] : []}
        onChange={val => {
          toggleNothingDoneValue(val as boolean[]);
        }}
      />

      <section className="flex flex-shrink-0 items-center gap-4 h-7 px-3 bg-gray-700 rounded-lg">
        <Checkbox
          checked={!!filterValue.broker_id_list?.length}
          onChange={isChecked => toggleMyQuoteValue(isChecked)}
        >
          我的订单
        </Checkbox>
      </section>

      <section className="flex items-center h-7">
        <Select
          className="w-[118px] !h-7 flex-shrink-0 bg-gray-600 rounded-r-none"
          clearIcon={null}
          destroyOnClose
          options={DateTypeOptions}
          value={getDateType()}
          onChange={handleDateTypeSelect}
        />
        <RangePicker
          className="w-[248px] rounded-l-none bg-gray-700 h-7"
          allowEmpty={[false, true]}
          disabled={!getDateType()}
          disabledDate={disabledDate}
          value={getDateValue()}
          placeholder={[formatDate(prev11WorkingDate), '结束日期']}
          onChange={handleDateSelect}
        />
      </section>
    </div>
  );
};
