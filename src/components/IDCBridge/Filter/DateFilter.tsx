import { Combination } from '@fepkg/components/Combination';
import { CommonDatePicker } from '@fepkg/components/DatePicker/CommonPicker';
import { Select } from '@fepkg/components/Select';
import moment from 'moment';
import { DateParams, DateType } from '@/pages/Deal/Bridge/types';

type Props = {
  dateParams: DateParams;
  onChange: (val: DateParams) => void;
};

const options = [
  { value: DateType.RecordDay, label: '成交日' },
  { value: DateType.TradeDay, label: '交易日' }
];

export const DateFilter = ({ dateParams, onChange }: Props) => {
  return (
    <Combination
      containerCls="flex-row-reverse"
      size="sm"
      suffixNode={
        <Select
          className="w-[92px] !h-7"
          options={options}
          value={dateParams.type}
          clearIcon={null}
          onChange={val => {
            onChange({ ...dateParams, type: val });
          }}
        />
      }
      prefixNode={
        <CommonDatePicker
          className="w-[148px] !px-3 !h-7"
          onChange={val =>
            onChange({ ...dateParams, value: val?.hours(0)?.minute(0)?.seconds(0)?.milliseconds(0)?.format('x') || '' })
          }
          value={dateParams.value ? moment(Number(dateParams.value)) : undefined}
          placeholder="请选择"
        />
      }
    />
  );
};
