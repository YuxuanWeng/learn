import cx from 'classnames';
import { CP_NONE, getCP } from '@fepkg/business/utils/get-name';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconBID, IconOFR } from '@fepkg/icon-park-react';
import { Side } from '@fepkg/services/types/enum';
import { useProductParams } from '@/layouts/Home/hooks';
import { useMulBridge } from '../provider';
import { SwitchBridge } from './SwitchBridge';

const HeaderIcon = ({ side }: { side: Side }) => {
  const icon = side === Side.SideBid ? <IconBID /> : <IconOFR />;

  const { productType } = useProductParams();

  const { defaultRealTradeValue } = useMulBridge();
  const ofrDisplay = getCP({
    inst: defaultRealTradeValue?.ofrInst,
    productType,
    trader: defaultRealTradeValue?.ofrTrader,
    placeholder: CP_NONE
  });

  const bidDisplay = getCP({
    inst: defaultRealTradeValue?.bidInst,
    productType,
    trader: defaultRealTradeValue?.bidTrader,
    placeholder: CP_NONE
  });

  const display = side === Side.SideBid ? bidDisplay : ofrDisplay;
  const theme =
    side === Side.SideBid
      ? { text: 'text-orange-100', bg: 'bg-orange-700' }
      : { text: 'text-secondary-100', bg: 'bg-secondary-700' };

  return (
    <div className={cx('flex-center font-medium gap-1 ', theme.text, side === Side.SideBid && 'flex-row-reverse')}>
      <div className={cx('w-4 h-4 rounded flex-center', theme.bg)}>{icon}</div>
      <Tooltip
        truncate
        content={display}
      >
        <span className={cx('w-[148px] truncate', side === Side.SideBid && 'text-end')}>{display}</span>
      </Tooltip>
    </div>
  );
};

export const Header = () => {
  return (
    <div
      className={cx(
        'h-12 w-full flex flex-1 items-center justify-between px-3',
        'bg-gradient-to-r from-secondary-800 via-gray-800 to-orange-800',
        'border border-transparent border-b-gray-600 border-solid'
      )}
    >
      {/* ofr方向真实交易机构 */}
      <HeaderIcon side={Side.SideOfr} />

      {/* 切换桥 */}
      <SwitchBridge />

      {/* bid方向真实交易机构 */}
      <HeaderIcon side={Side.SideBid} />
    </div>
  );
};
