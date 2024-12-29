import cx from 'classnames';
import { DirectionTag, PXCellPrice } from '@fepkg/business/components/QuoteTableCell';
import { MarketDeal } from '@fepkg/services/types/common';
import { isNil } from 'lodash-es';
import { getIntervalTime } from '../../../util';

type Props = {
  data?: MarketDeal;
};

export const LatestMarketInfo = ({ data }: Props) => {
  if (isNil(data)) {
    return null;
  }
  const { deal_time, direction, price, flag_internal, flag_rebate, return_point } = data;

  /** 间隔时间 */
  const intervalTime = getIntervalTime(deal_time);

  return (
    <div className="flex relative h-7 min-w-[224px] rounded-lg bg-gray-700 items-center">
      <div className="pl-3 w-16 text-gray-300">{intervalTime}</div>
      <div className="flex items-center px-2">
        <DirectionTag direction={direction} />
        <PXCellPrice
          price={price}
          internal={flag_internal}
          rebate={flag_rebate}
          returnPoint={return_point}
          className={cx(
            'flex flex-col justify-center !top-0 !bottom-0',
            flag_internal ? '!text-gray-300' : '!text-orange-050'
          )}
        />
      </div>
    </div>
  );
};
