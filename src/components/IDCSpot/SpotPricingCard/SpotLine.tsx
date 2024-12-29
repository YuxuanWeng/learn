import { FC } from 'react';
import { Tooltip } from '@fepkg/components/Tooltip';
import { DealQuote } from '@fepkg/services/types/common';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { SpotPricingPrice } from '@/components/IDCBoard/Price';
import SpotVol from '../SpotVol';

interface IProps {
  quote: DealQuote;
  spotValue?: number;
  confirmVolume?: number;
  isSpottedReply: boolean;
  isPartialConfirmed: boolean;
  onSpotVolChange?: (vol?: number) => void;
}

const SpotLine: FC<IProps> = ({
  quote,
  isSpottedReply,
  isPartialConfirmed,
  spotValue,
  onSpotVolChange,
  confirmVolume
}) => {
  return (
    <div className="flex flex-col items-start mb-3 border-dashed border-0 border-b border-gray-600 pb-3">
      <div className="flex items-center justify-start w-full text-white">
        <SpotPricingPrice
          className="!w-[120px]"
          isSpot
          quote={quote}
        />
        <Tooltip
          content={formatLiquidationSpeedListToString(quote.liquidation_speed_list ?? [], 'MM.DD')}
          truncate
        >
          <div className="px-3 mr-3 !w-[88px] text-sm font-bold text-gray-000 truncate">
            {formatLiquidationSpeedListToString(quote.liquidation_speed_list ?? [], 'MM.DD')}
          </div>
        </Tooltip>
        {isSpottedReply || isPartialConfirmed ? (
          <SpotVol
            disabled={isPartialConfirmed}
            className="flex-1 !gap-2"
            value={isPartialConfirmed ? (confirmVolume ?? 0) / 1000 : spotValue}
            max={Math.ceil(0.001 * quote.volume)}
            onChange={onSpotVolChange}
            stepperBtnCls="!w-7 !h-7"
            inputClass="!h-7"
            inputSuffixClass="!h-7"
            stepperClass="!gap-2"
          />
        ) : (
          <span className="text-sm font-bold text-gray-000">{quote.volume}</span>
        )}
      </div>
    </div>
  );
};

export default SpotLine;
