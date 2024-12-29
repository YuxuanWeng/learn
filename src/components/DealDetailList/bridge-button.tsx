import { forwardRef } from 'react';
import cx from 'classnames';
import { Button, ButtonProps } from '@fepkg/components/Button';
import { IconBridgeText } from '@fepkg/icon-park-react';

type BridgeIconButtonProps = ButtonProps & { active?: boolean };

export const BridgeIconButton = forwardRef<HTMLButtonElement, BridgeIconButtonProps>((props, ref) => {
  const { active, ...rest } = props;
  return (
    <Button.Icon
      ref={ref}
      type="gray"
      plain
      icon={<IconBridgeText size={20} />}
      {...rest}
      className={cx('border-none', active && '!bg-purple-700 hover:!bg-purple-600 !text-purple-100', props.className)}
    />
  );
});
