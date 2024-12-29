import { useMemo } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Checkbox, CheckboxChangeEvent } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Switch } from '@fepkg/components/Switch';
import { Side } from '@fepkg/services/types/enum';
import { useQuoteOper } from '../QuoteOper/QuoteOperProvider';
import { QUOTE_FLAG_OPTIONS } from '../constants';
import { useAlwaysOpen } from '../hooks/useAlwaysOpen';
import { useFlagValue } from '../providers/FlagProvider';

const options = QUOTE_FLAG_OPTIONS;

export type FooterProps = {
  disabled?: boolean;
};

export const Footer = ({ disabled }: FooterProps) => {
  const [alwaysOpen, setAlwaysOpen] = useAlwaysOpen();
  const { flagValue, updateFlagValue } = useFlagValue();
  const { updateQuoteFlags, disabled: disabledQuoteOper } = useQuoteOper();

  const flagCheckedKeys = useMemo(() => Object.keys(flagValue).filter(key => !!flagValue[key]), [flagValue]);

  const handleChange = (checked: boolean, evt: CheckboxChangeEvent) => {
    const { value } = evt.currentTarget;

    if (value === 'flag_internal' && checked) {
      if (!disabledQuoteOper[Side.SideBid]) updateQuoteFlags(Side.SideBid, { flag_star: 1 });
      if (!disabledQuoteOper[Side.SideOfr]) updateQuoteFlags(Side.SideOfr, { flag_star: 1 });
    }

    updateFlagValue(draft => {
      draft[value] = checked;
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Dialog.FooterItem>
        {options.map(opt => (
          <Checkbox
            disabled={disabled}
            key={String(opt.value)}
            checked={flagCheckedKeys.includes(String(opt.value))}
            value={opt.value}
            onChange={handleChange}
          >
            {opt.label}
          </Checkbox>
        ))}
      </Dialog.FooterItem>

      <Dialog.FooterItem label="常开">
        <Switch
          disabled={disabled}
          tabIndex={-1}
          checked={alwaysOpen}
          onChange={val => setAlwaysOpen(val)}
          onKeyDown={(_, evt) => {
            if (evt.key === KeyboardKeys.Enter) evt.preventDefault();
          }}
        />
      </Dialog.FooterItem>
    </div>
  );
};
