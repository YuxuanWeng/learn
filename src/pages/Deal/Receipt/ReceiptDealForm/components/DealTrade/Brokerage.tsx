import cx from 'classnames';
import { BrokerageTypeOptions } from '@fepkg/business/constants/options';
import { Button } from '@fepkg/components/Button';
import { BrokerageType } from '@fepkg/services/types/enum';

type BrokerageProps = {
  /** 是否禁用 */
  disabled?: boolean;
  /** 当前选中的值 */
  value?: BrokerageType;
  /** 变化时的回调 */
  onChange?: (val: BrokerageType) => void;
};

export const Brokerage = ({ disabled, value, onChange }: BrokerageProps) => {
  return (
    <div className="flex items-center gap-1 p-[2px] bg-gray-600 rounded-lg">
      {BrokerageTypeOptions.map(v => {
        const checked = value === v.value;
        return (
          <Button.Icon
            type="orange"
            bright
            disabled={disabled}
            icon={<span>{v.label}</span>}
            checked={checked}
            key={v.value}
            className={cx('!w-6 !h-6 !p-0')}
            onClick={() => {
              if (disabled) return;
              onChange?.(v.value);
            }}
          />
        );
      })}
    </div>
  );
};
