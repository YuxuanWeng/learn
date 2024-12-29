import cx from 'classnames';
import { Checkbox } from '@fepkg/components/Checkbox';
import { TypeItem } from '../QuoteSettings/types';

type CommonCheckBoxProps = TypeItem & {
  classNames?: string;
  onChange: (params: boolean) => void;
};

const CommonCheckBox = ({ classNames, label, value: initValue, onChange }: CommonCheckBoxProps) => {
  const value = typeof initValue === 'boolean' ? initValue : initValue === 'true';
  return (
    <div className={cx('flex', classNames)}>
      <Checkbox
        tabIndex={-1}
        checked={value}
        onChange={checked => {
          onChange(checked);
        }}
      >
        {label}
      </Checkbox>
    </div>
  );
};

export default CommonCheckBox;
