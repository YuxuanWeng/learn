import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconFlagB, IconFlagO, IconPayfor } from '@fepkg/icon-park-react';
import { Side } from '@fepkg/services/types/bds-enum';

export type InstTraderProps = {
  side: Side;
  className?: string;
  traderNameCls?: string;
  payForAlign?: 'left' | 'right';
  withPayFor?: boolean;
  bridgeInst?: string;
  realityTrade?: string;
  selected?: boolean;
  noBackground?: boolean;
  onPayForClick?: () => void;
};

type InstNameProps = Pick<InstTraderProps, 'bridgeInst' | 'selected' | 'withPayFor' | 'payForAlign' | 'onPayForClick'>;
type RealityTradeProps = Pick<InstTraderProps, 'traderNameCls' | 'side' | 'realityTrade'>;

const InstName = (props: InstNameProps) => {
  const { bridgeInst, selected, withPayFor, payForAlign = 'left', onPayForClick } = props;

  const isLeft = payForAlign === 'left' && withPayFor;
  const isRight = payForAlign === 'right' && withPayFor;

  return (
    <div className="flex items-center justify-center gap-2 z-modal relative w-full font-bold">
      {isLeft && (
        <Button.Icon
          icon={<IconPayfor size={20} />}
          type="danger"
          className="!w-5 !h-5 absolute left-2"
          bright
          checked={selected}
          onClick={onPayForClick}
        />
      )}

      <div className={cx('flex justify-center w-[calc(100%-76px)]')}>
        <Tooltip
          truncate
          content={bridgeInst}
        >
          <span className="truncate text-gray-100 text-sm text-center">{bridgeInst || '机构待定'}</span>
        </Tooltip>
      </div>

      {isRight && (
        <Button.Icon
          icon={<IconPayfor size={20} />}
          type="danger"
          className="!w-5 !h-5 absolute right-2"
          bright
          checked={selected}
          onClick={onPayForClick}
        />
      )}
    </div>
  );
};

const RealityTrade = ({ realityTrade, side, traderNameCls }: RealityTradeProps) => {
  return (
    <Tooltip
      truncate
      content={realityTrade}
    >
      <span
        className={cx(
          side === Side.SideOfr && 'text-secondary-100',
          side === Side.SideBid && 'text-orange-100',
          'truncate text-gray-100 text-xs text-center font-bold',
          traderNameCls
        )}
      >
        {realityTrade || '-'}
      </span>
    </Tooltip>
  );
};

const BASE_CLS = cx(
  'flex flex-1 flex-col items-center justify-center gap-1',
  'h-16 rounded-lg bg-gradient-to-b to-transparent relative overflow-hidden'
);

export const Bridge = (props: InstTraderProps) => {
  const { side, className = 'w-[192px]' } = props;

  return (
    <div
      className={cx(
        BASE_CLS,
        side === Side.SideOfr && 'from-secondary-700',
        side === Side.SideBid && 'from-orange-700',
        side === Side.SideNone && 'from-gray-700',
        className
      )}
    >
      {side === Side.SideOfr && (
        <div className={cx('absolute top-0 left-0')}>
          <IconFlagO
            size={24}
            className="text-secondary-200"
          />
        </div>
      )}

      {side === Side.SideBid && (
        <div className={cx('absolute top-0 right-0')}>
          <IconFlagB size={24} />
        </div>
      )}

      <InstName {...props} />

      <RealityTrade {...props} />
    </div>
  );
};
