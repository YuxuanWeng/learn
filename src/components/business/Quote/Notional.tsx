import cx from 'classnames';
import { Combination } from '@fepkg/components/Combination';
import { Unit } from './Unit';
import { Volume } from './Volume';
import { QuoteComponentProps } from './types';

export const Notional = ({
  className,
  volumeCls,
  unitCls,
  disabled,
  size = 'md',
  side,
  notional,
  unit,
  unitRender,
  onVolumeChange,
  onUnitChange,
  error
}: QuoteComponentProps.Notional) => {
  return (
    <Combination
      size={size}
      containerCls={className}
      disabled={disabled}
      prefixNode={
        <Volume
          error={error}
          side={side}
          className={cx(volumeCls)}
          label="券面总额"
          value={notional}
          defaultUnit={unit}
          disabled={disabled}
          onChange={onVolumeChange}
          placeholder="请输入"
        />
      }
      suffixNode={
        unitRender ?? (
          <Unit
            className={cx('flex-shrink-0 w-[118px]', unitCls)}
            label=""
            disabled={disabled}
            value={unit}
            onChange={onUnitChange}
          />
        )
      }
    />
  );
};
