import cx from 'classnames';
import { Radio, RadioGroup } from '@fepkg/components/Radio';
import { CommonTypeValue, TypeItem } from '../QuoteSettings/types';

type CommonRadioProps = {
  label: string;
  list: TypeItem[];
  value?: CommonTypeValue;
  onChange: (params: number) => void;
  className?: string;
  border?: boolean;
};

const CommonRadio = ({ label, value: initValue, list, onChange, className, border = true }: CommonRadioProps) => {
  const value = typeof initValue === 'number' ? initValue : Number(initValue);

  return (
    <div className={cx('pl-3', border && 'border border-solid border-gray-600 rounded-lg', className)}>
      <div className="flex h-[26px]">
        <div className={cx('mr-4 flex items-center', 'text-sm text-gray text-gray-200 font-medium')}>{label}</div>

        <RadioGroup
          className="!gap-4"
          value={[value]}
          onChange={val => {
            onChange(val[0] as number);
          }}
          key={label}
        >
          {list.map(item => {
            return (
              <div
                className="flex"
                key={`${item?.label}_${item?.value}`}
              >
                <Radio
                  value={item.value as number}
                  className={item.value === value ? 'text-white' : 'text-gray-200'}
                >
                  {item.label}
                </Radio>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};
export default CommonRadio;
