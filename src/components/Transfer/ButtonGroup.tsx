import { Button } from '@fepkg/components/Button';
import { IconLeft, IconLeftDouble, IconRight, IconRightDouble } from '@fepkg/icon-park-react';
import { ButtonGroupProps } from './types';

export const ButtonGroup = ({
  disabled,
  toRightDisabled,
  toLeftDisabled,
  onOneToRightClick,
  onOneToLeftClick,
  onAllToRightClick,
  onAllToLeftClick
}: ButtonGroupProps) => {
  return (
    <div className="flex-center flex-col mx-3">
      <Button.Icon
        icon={<IconRightDouble />}
        disabled={disabled || toRightDisabled}
        onClick={() => {
          if (!disabled && !toRightDisabled) {
            onAllToRightClick();
          }
        }}
      />
      <Button.Icon
        className="mt-2"
        icon={<IconRight />}
        disabled={disabled || toRightDisabled}
        onClick={() => {
          if (!disabled && !toRightDisabled) {
            onOneToRightClick();
          }
        }}
      />
      <Button.Icon
        className="mt-5"
        icon={<IconLeft />}
        disabled={disabled || toLeftDisabled}
        onClick={() => {
          if (!disabled && !toLeftDisabled) {
            onOneToLeftClick();
          }
        }}
      />
      <Button.Icon
        className="mt-2"
        icon={<IconLeftDouble />}
        disabled={disabled || toLeftDisabled}
        onClick={() => {
          if (!disabled && !toLeftDisabled) {
            onAllToLeftClick();
          }
        }}
      />
    </div>
  );
};
