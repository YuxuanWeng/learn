import { Button } from '@fepkg/components/Button';
import { IconArithmetic } from '@fepkg/icon-park-react';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { LiquidationSpeedTag, Side } from '@fepkg/services/types/enum';
import { ParseLiqSpeed } from '@/components/business/ParseLiqSpeed';
import { useFocus } from '../providers/FocusProvider';
import { QuoteOperInputCategory } from '../types';
import { useQuoteOper } from './QuoteOperProvider';

export type ParseLiqSpeedProps = {
  side: Side;
  disabled?: boolean;
};

export const LiqSpeedGroup = ({ side, disabled }: ParseLiqSpeedProps) => {
  const { updatePrevFocusRef, clearCurrentFocusRef, updateQuoteInputCurrentRef, getLiqSpeedRefs, getLiqSpeedRef } =
    useFocus();

  const { setCurrentOpenCalcSide, calc, patchCalc } = useQuoteOper();

  const liqSpeedRefs = getLiqSpeedRefs(side);
  const liqSpeedRef = getLiqSpeedRef(side);

  /** 打开备注面板 */
  const handleCalcClick = () => {
    if (disabled) return;
    setCurrentOpenCalcSide(side);
  };

  const handleParse = (data?: LiquidationSpeed[]) => {
    patchCalc(side, { liquidation_speed_list: data ?? [{ offset: 0, tag: LiquidationSpeedTag.Default }] });
  };

  return (
    <div className="flex gap-2">
      <ParseLiqSpeed
        inputRef={liqSpeedRefs}
        label="结算方式"
        defaultValue={calc[side]?.liquidation_speed_list}
        className="mt-px"
        disabled={disabled}
        onParse={handleParse}
        onFocus={() => {
          updateQuoteInputCurrentRef(
            side === Side.SideBid ? QuoteOperInputCategory.BidLiqSpeed : QuoteOperInputCategory.OfrLiqSpeed
          );
          liqSpeedRef.current?.select();
        }}
        onBlur={clearCurrentFocusRef}
        onSpaceKeydown={() => {
          updatePrevFocusRef();
          handleCalcClick();
        }}
      />
      <Button.Icon
        className="w-7 h-7"
        icon={<IconArithmetic size={20} />}
        onMouseDown={updatePrevFocusRef}
        disabled={disabled}
        onClick={handleCalcClick}
      />
    </div>
  );
};
