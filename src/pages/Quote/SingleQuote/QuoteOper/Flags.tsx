import { useRef } from 'react';
import { IconProvider } from '@fepkg/icon-park-react';
import { Side } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useBrokerSearch } from '@/components/business/Search/BrokerSearch';
import { useInstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { useHotkeyRefs } from '../hooks/useHotkeyRefs';
import { FlagIcon, FlagIconType } from './FlagIcon';
import { useQuoteOper } from './QuoteOperProvider';
import { BondValuation } from './types';

export type FlagsProps = {
  side: Side;
  disabled?: boolean;
};

const Flags = ({ disabled = false, side }: FlagsProps) => {
  const { quoteFlags, checkedZhai, checkedZheng, updatePriceWithBond, updateQuoteFlags } = useQuoteOper();

  const value = quoteFlags[side];
  const zhaiIsChecked = checkedZhai[side];
  const zhengIsChecked = checkedZheng[side];

  const updateFlags = (type: string, val: number | boolean | undefined) => {
    if (disabled) return;
    const update = { [type]: val };
    if (type === 'flag_oco' && val) update.flag_package = false;
    if (type === 'flag_package' && val) update.flag_oco = false;
    updateQuoteFlags(side, update);
  };

  const starRef = useRef<HTMLButtonElement>(null);
  const doubleStarRef = useRef<HTMLButtonElement>(null);
  const ocoRef = useRef<HTMLButtonElement>(null);
  const packageRef = useRef<HTMLButtonElement>(null);

  const { instTraderSearchRef } = useInstTraderSearch();
  const { brokerSearchRef } = useBrokerSearch();

  const isSearchFocusing = () =>
    document.activeElement === instTraderSearchRef.current || document.activeElement === brokerSearchRef.current;

  const { getSideIsFocusingFn } = useQuoteOper();

  const isFocusing = useMemoizedFn(() => getSideIsFocusingFn?.[side]?.() || isSearchFocusing());

  /** 注册快捷键 */
  useHotkeyRefs({
    [side]: { starRef, doubleStarRef, ocoRef, packageRef },
    side,
    disabled,
    isFocusing
  });

  /** 修改债/证 */
  const handledBondClick = (type: BondValuation) => {
    if (disabled) return;
    updatePriceWithBond(side, type);
  };

  return (
    <IconProvider value={{ size: 20 }}>
      <div className="flex justify-between h-6">
        <div className="flex gap-2">
          <FlagIcon
            flagRef={starRef}
            side={side}
            disabled={disabled}
            active={value?.flag_star === 1}
            type={FlagIconType.SingleStar}
            onClick={() => {
              updateFlags('flag_star', value?.flag_star === 1 ? 0 : 1);
            }}
          />

          <FlagIcon
            flagRef={doubleStarRef}
            side={side}
            disabled={disabled}
            active={value?.flag_star === 2}
            type={FlagIconType.DoubleStar}
            onClick={() => {
              updateFlags('flag_star', value?.flag_star === 2 ? 0 : 2);
            }}
          />

          <FlagIcon
            side={side}
            disabled={disabled}
            active={!!value?.flag_intention}
            type={FlagIconType.Intention}
            onClick={() => {
              updateFlags('flag_intention', !value?.flag_intention);
            }}
          />

          <FlagIcon
            flagRef={ocoRef}
            side={side}
            disabled={disabled}
            active={!!value?.flag_oco}
            type={FlagIconType.Oco}
            onClick={() => {
              updateFlags('flag_oco', !value?.flag_oco);
            }}
          />

          <FlagIcon
            flagRef={packageRef}
            side={side}
            disabled={disabled}
            active={!!value?.flag_package}
            type={FlagIconType.Pack}
            onClick={() => {
              updateFlags('flag_package', !value?.flag_package);
            }}
          />

          <FlagIcon
            side={side}
            disabled={disabled}
            active={!!value?.flag_exchange}
            type={FlagIconType.Exchange}
            onClick={() => {
              updateFlags('flag_exchange', !value?.flag_exchange);
            }}
          />
        </div>

        <div className="flex gap-1">
          <FlagIcon
            side={side}
            disabled={disabled}
            active={zhaiIsChecked}
            type={FlagIconType.Zhai}
            onClick={() => {
              handledBondClick(BondValuation.Zhai);
            }}
          />

          <FlagIcon
            side={side}
            disabled={disabled}
            active={zhengIsChecked}
            type={FlagIconType.Zheng}
            onClick={() => {
              handledBondClick(BondValuation.Zheng);
            }}
          />
        </div>
      </div>
    </IconProvider>
  );
};

export default Flags;
