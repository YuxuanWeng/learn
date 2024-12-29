import cx from 'classnames';
import { RadioButton } from '@fepkg/components/Radio';
import { Side } from '@fepkg/services/types/enum';

const TAG_CLS = 'flex-1 h-7';

type SideSwitchProps = {
  value: Side;
  onChange?: (val: Side) => void;
  className?: string;
};

export const SideSwitch = ({ value, className, onChange }: SideSwitchProps) => {
  return (
    <div className={cx('flex def:bg-gray-700 items-center rounded-lg select-none gap-1 def:w-30', className)}>
      <RadioButton
        className={TAG_CLS}
        buttonType="orange"
        checked={value === Side.SideBid}
        onClick={() => {
          onChange?.(Side.SideBid);
        }}
      >
        BID
      </RadioButton>

      <RadioButton
        className={TAG_CLS}
        buttonType="secondary"
        checked={value === Side.SideOfr}
        onClick={() => {
          onChange?.(Side.SideOfr);
        }}
      >
        OFR
      </RadioButton>
    </div>
  );
};
