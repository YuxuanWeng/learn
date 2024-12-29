import { FC } from 'react';
import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconExchange, IconOco, IconPack, IconStar, IconStar2 } from '@fepkg/icon-park-react';
import { DealQuote, FiccBondBasic } from '@fepkg/services/types/common';
import { liquidationDateToTag } from '@packages/utils/liq-speed';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { isNumberNil } from '@/common/utils/quote';
import { SpotPricingPrice } from '@/components/IDCBoard/Price';

interface IProps {
  quote?: DealQuote;
  bond?: FiccBondBasic;
  parseLiquidation?: boolean;
  isMarketChanged?: boolean;
}

const QuoteLine: FC<IProps> = ({ quote, bond, parseLiquidation = true, isMarketChanged }) => {
  const showTagsArea =
    (quote?.flag_star != null && quote.flag_star !== 0) ||
    quote?.flag_oco ||
    quote?.flag_package ||
    quote?.flag_exchange;

  const showCommentArea =
    (bond?.has_option && quote?.exercise_manual) || quote?.flag_stock_exchange || quote?.flag_indivisible;

  const showCommentLine = showCommentArea || (quote?.comment != null && quote.comment !== '');

  const liquidationText =
    quote == null
      ? ''
      : formatLiquidationSpeedListToString(
          parseLiquidation
            ? liquidationDateToTag(quote.liquidation_speed_list ?? [])
            : quote.liquidation_speed_list ?? [],
          'MM.DD'
        );

  return (
    <div className="pb-3">
      <div className={cx('flex flex-col items-stretch')}>
        {!quote || isNumberNil(quote.volume) ? (
          <p className="text-danger-200 text-center gradient-refused text-sm w-[300px] h-9 mx-auto flex justify-center items-center">
            {isMarketChanged ? '行情变化，请确认盘口后重新点价' : '没有量'}
          </p>
        ) : (
          <div className="flex items-center justify-start text-white">
            <div className="flex">
              <SpotPricingPrice
                quote={quote}
                isSpot={false}
                className="flex-1 !w-[120px]"
              />
            </div>
            <div className="w-[88px] flex items-center pl-3">
              <Tooltip
                content={liquidationText}
                truncate
              >
                <div className="mr-3 w-[88px] text-sm truncate text-gray-100 font-medium">{liquidationText}</div>
              </Tooltip>
            </div>
            <span
              className={cx(
                'ml-3 text-sm text-gray-100 font-medium',
                quote.flag_internal ? 'text-primary-200' : 'text-gray-100'
              )}
            >
              {quote.volume}
            </span>
            {showTagsArea && (
              <div className="h-6 ml-auto flex items-center bg-gray-700 gap-1 px-2 rounded-lg text-gray-100">
                {quote.flag_star === 1 && <IconStar />}
                {quote.flag_star === 2 && <IconStar2 />}
                {quote.flag_package && !quote.flag_oco && <IconPack />}
                {quote.flag_oco && <IconOco />}
                {quote.flag_exchange && <IconExchange />}
              </div>
            )}
          </div>
        )}
      </div>
      {showCommentLine && (
        <div className="flex mt-2 items-center">
          <Tooltip
            content={quote.comment}
            truncate
          >
            <div className="text-sm text-gray-100 font-medium truncate flex-1">{quote.comment}</div>
          </Tooltip>
          {showCommentArea && (
            <div className="ml-auto">
              <div className="h-6 ml-2 flex items-center bg-gray-700 gap-3 px-2 rounded-lg text-gray-100 flex-shrink-0 whitespace-nowrap">
                {quote.flag_stock_exchange && <div>交易所</div>}
                {bond?.has_option && quote?.exercise_manual && <div>{quote.is_exercise ? '行权' : '到期'}</div>}
                {quote.flag_indivisible && <div>整量</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuoteLine;
