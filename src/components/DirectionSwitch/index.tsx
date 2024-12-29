import cx from 'classnames';
import { usePropsValue } from '@fepkg/common/hooks';
import { Direction } from '@fepkg/services/types/enum';

export type DirectionTabsProps = {
  disabled?: boolean;
  defaultValue?: Direction;
  value?: Direction;
  onChange?: (val: Direction) => void;
};

const directions = [
  { label: 'GVN', value: Direction.DirectionGvn },
  { label: 'TKN', value: Direction.DirectionTkn },
  { label: 'TRD', value: Direction.DirectionTrd }
];

const directionClsMap: Record<Direction, string> = {
  [Direction.DirectionNone]: '',
  [Direction.DirectionGvn]: '!bg-orange-100',
  [Direction.DirectionTkn]: '!bg-secondary-100',
  [Direction.DirectionTrd]: '!bg-purple-100'
};

export const DirectionSwitch = ({
  disabled,
  defaultValue = Direction.DirectionGvn,
  value,
  onChange
}: DirectionTabsProps) => {
  const [direction, setDirection] = usePropsValue({ defaultValue, value, onChange });

  const selectedCls = directionClsMap[direction];

  return (
    <div
      className={cx(
        'grid grid-cols-3 gap-x-0.5 w-[268px] flex-shrink-0 h-7 bg-gray-800 rounded-lg select-none',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      {directions.map(item => {
        const selected = direction === item.value;

        return (
          <div
            key={item.label}
            className={cx(
              'flex-center rounded-lg',
              selected ? `${selectedCls} text-gray-000` : 'text-gray-100',
              disabled ? 'def:text-gray-300' : 'hover:bg-gray-600 '
            )}
            onClick={() => {
              if (disabled) return;
              setDirection(item.value);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};
