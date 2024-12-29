import cx from 'classnames';
import { Switch } from '@fepkg/components/Switch';
import { TypeItem } from '../QuoteSettings/types';

type CommonSwitchProps = TypeItem & {
  border?: boolean;
  classNames?: string;
  onChange: (params: boolean) => void;
};

const CommonSwitch = ({ border = true, classNames, label, value: initValue, onChange }: CommonSwitchProps) => {
  const value = typeof initValue === 'boolean' ? initValue : initValue === 'true';
  return (
    <div
      className={cx(
        'flex items-center w-[280px] h-7 pl-3',
        border && 'border border-solid border-gray-600 rounded-lg',
        classNames
      )}
    >
      <Switch
        tabIndex={-1}
        checked={value}
        onChange={checked => {
          onChange(checked);
        }}
      />
      <span className="ml-2 text-sm text-gray-100 font-medium">{label}</span>
    </div>
  );
};

export default CommonSwitch;
