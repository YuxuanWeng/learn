import { Select } from '@fepkg/components/Select';
import { QuoteComponentProps, VolumeUnit } from './types';

const UNITS = [
  { value: VolumeUnit.TenMillion, label: '千万' },
  { value: VolumeUnit.TenThousand, label: '万' }
];

export const Unit = ({
  size = 'md',
  label = '单位',
  clearIcon = null,
  defaultValue = VolumeUnit.TenThousand,
  disabled = false,
  className = '',
  ...restProps
}: QuoteComponentProps.Unit) => {
  return (
    <Select
      className={className}
      tabIndex={-1}
      size={size}
      label={label}
      clearIcon={clearIcon}
      destroyOnClose
      defaultValue={defaultValue}
      options={UNITS}
      disabled={disabled}
      {...restProps}
    />
  );
};
