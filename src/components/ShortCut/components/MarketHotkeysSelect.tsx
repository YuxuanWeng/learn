import { Select } from '@fepkg/components/Select';

type HotkeyProps = {
  marketValue?: string;
  /** 线下成交和报价窗口的权限 */
  onMarketHotkeyChange: (val: string) => void;
};

/** 行情切换快捷键options */
const marketOptions = [
  { value: 'tab', label: 'Tab' },
  { value: 'ctrlKey', label: 'Ctrl' }
];

export const MarketHotkeysSelect = ({ marketValue, onMarketHotkeyChange }: HotkeyProps) => {
  return (
    <Select
      label="行情切换"
      labelWidth={120}
      className="w-[280px] h-7"
      clearIcon={null}
      destroyOnClose
      options={marketOptions}
      value={marketValue}
      onChange={value => onMarketHotkeyChange(value)}
    />
  );
};
