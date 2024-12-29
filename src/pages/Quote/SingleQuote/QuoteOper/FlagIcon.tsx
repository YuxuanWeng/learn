import { MouseEvent } from 'react';
import { Button } from '@fepkg/components/Button';
import { ButtonType } from '@fepkg/components/Button/types';
import {
  IconArithmetic,
  IconBID,
  IconExchange,
  IconInterior,
  IconOFR,
  IconOco,
  IconPack,
  IconProps,
  IconStar,
  IconStar2,
  IconZhai,
  IconZheng
} from '@fepkg/icon-park-react';
import { Side } from '@fepkg/services/types/enum';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';

export enum FlagIconType {
  SingleStar,
  DoubleStar,
  Intention,
  Oco,
  Exchange,
  Pack,
  Zhai,
  Zheng,
  Calc,
  Inner
}

type FlagIconProps = {
  side?: Side;
  active?: boolean;
  type: FlagIconType;
  disabled?: boolean;
  flagRef?: React.RefObject<HTMLButtonElement>;
  onMouseDown?: (evt: MouseEvent<HTMLButtonElement>) => void;
  onClick: () => void;
  className?: string;
} & IconProps;

export const FlagIcon = ({
  side = Side.SideNone,
  type,
  disabled,
  flagRef,
  active = false,
  onClick,
  onMouseDown,
  className = '',
  ...iconProps
}: FlagIconProps) => {
  let icon: React.ReactNode = null;

  const IntentionMap = {
    [Side.SideBid]: <IconBID {...iconProps} />,
    [Side.SideOfr]: <IconOFR {...iconProps} />
  };

  switch (type) {
    case FlagIconType.SingleStar:
      icon = <IconStar {...iconProps} />;
      break;
    case FlagIconType.DoubleStar:
      icon = <IconStar2 {...iconProps} />;
      break;
    case FlagIconType.Intention:
      icon = IntentionMap[side];
      break;
    case FlagIconType.Oco:
      icon = <IconOco {...iconProps} />;
      break;
    case FlagIconType.Pack:
      icon = <IconPack {...iconProps} />;
      break;
    case FlagIconType.Exchange:
      icon = <IconExchange {...iconProps} />;
      break;
    case FlagIconType.Zhai:
      icon = <IconZhai {...iconProps} />;
      break;
    case FlagIconType.Zheng:
      icon = <IconZheng {...iconProps} />;
      break;
    case FlagIconType.Calc:
      icon = <IconArithmetic {...iconProps} />;
      break;
    case FlagIconType.Inner:
      icon = <IconInterior {...iconProps} />;
      break;
    default:
      break;
  }

  const hiddenContainerBg = [FlagIconType.Zhai, FlagIconType.Zheng, FlagIconType.Calc].includes(type);

  let buttonType: ButtonType = 'green';
  if (type === FlagIconType.Intention) {
    if (side === Side.SideBid) buttonType = 'orange';
    if (side === Side.SideOfr) buttonType = 'secondary';
  }

  return (
    <Button.Icon
      ref={flagRef}
      type={buttonType}
      bright
      ghost={hiddenContainerBg}
      checked={active}
      disabled={disabled}
      onMouseDown={onMouseDown}
      className={className}
      icon={icon}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      onKeyDown={preventEnterDefault}
    />
  );
};
