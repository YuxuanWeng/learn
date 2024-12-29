import cx from 'classnames';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { SERVER_NIL } from '@fepkg/common/constants';
import { DealQuote } from '@fepkg/services/types/common';
import { useSpotAppoint } from '../provider';
import SubTitle from './SubTitle';

/** 获取原始价格的展示 */
const getOriginPrice = (origin?: Partial<DealQuote>) => {
  if (!origin) return '';
  const quotePrice = origin.quote_price;
  const returnPoint = origin.return_point;

  const priceContent = quotePrice ? transformPriceContent(quotePrice) : '--';
  let displayPrice = priceContent;

  const returnPointContent = returnPoint && returnPoint > SERVER_NIL ? transformPriceContent(returnPoint) : '--';

  if (origin.flag_rebate) displayPrice += `F${returnPointContent}`;

  let exercise = ',默认';
  if (origin.exercise_manual) {
    if (origin.is_exercise) exercise = ',行权';
    else exercise = ',到期';
  }
  return displayPrice + exercise;
};

export const Price = () => {
  const { quoteState, priceIsChanged, defaultValue, isTkn } = useSpotAppoint();
  const { quotePrice, isExercise, returnPoint, flagRebate, isExerciseManual } = quoteState;

  const originPriceNode = <span className="text-gray-100 text-xs">{getOriginPrice(defaultValue?.quote)}</span>;

  const priceContent = quotePrice ? transformPriceContent(quotePrice) : '--';
  const returnPointContent = returnPoint && returnPoint > SERVER_NIL ? transformPriceContent(returnPoint) : '--';

  return (
    <div className="flex flex-col px-4 py-3 gap-1">
      <div className="h-4 flex items-center gap-1">
        <SubTitle.Title title="Price" />
        {priceIsChanged && (
          <SubTitle.Icon
            isTkn={isTkn}
            content={originPriceNode}
          />
        )}
      </div>

      <div
        className={cx('flex items-end h-6 w-[188px] justify-between', isTkn ? 'text-secondary-100' : 'text-orange-100')}
      >
        <div>
          <span className="text-md font-bold">{priceContent}</span>
          {flagRebate && <span className="ml-1">F{returnPointContent}</span>}
        </div>
        {isExerciseManual && (
          <div className="h-6 w-10 rounded-lg bg-gray-600 flex flex-center text-gray-100">
            {isExercise ? '行权' : '到期'}
          </div>
        )}
      </div>
    </div>
  );
};
