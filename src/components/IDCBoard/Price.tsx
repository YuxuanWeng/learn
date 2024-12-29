import cx from 'classnames';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Tooltip } from '@fepkg/components/Tooltip';
import { BondQuoteType, Side } from '@fepkg/services/types/bds-enum';
import { DealQuote } from '@fepkg/services/types/common';
import { isUndefined } from 'lodash-es';

const TextCol = { [Side.SideBid]: 'text-orange-100', [Side.SideOfr]: 'text-secondary-100' };

type PriceProps = { quote?: Partial<DealQuote> };

const getDisplayPrice = (quote: Partial<DealQuote>) => {
  const quotePrice = quote.quote_price;

  return !isUndefined(quotePrice) && quotePrice >= 0 ? transformPriceContent(quotePrice) : '--';
};

const getPriceInfo = (quote: Partial<DealQuote>) => {
  const { return_point = SERVER_NIL } = quote;
  const price = getDisplayPrice(quote);
  const returnPoint = return_point > SERVER_NIL ? transformPriceContent(return_point) : '--';
  const [part1, part2] = price.split('.');
  return { returnPoint, part1, part2, price };
};

const getToolTipsPrice = (quote: Partial<DealQuote>) => {
  const { flag_rebate = false } = quote;
  const { part1, part2, returnPoint } = getPriceInfo(quote);
  return (
    <span>
      {part1}.{part2} {flag_rebate ? `F${returnPoint}` : ''}
    </span>
  );
};

const PanelPrice = ({ quote }: PriceProps) => {
  if (!quote?.quote_id) return <span className={cx(TextCol[quote?.side || Side.SideBid], 'w-[144px] ml-1')}>--</span>;
  const { side = Side.SideBid, flag_rebate = false } = quote;
  const { part1, part2, returnPoint } = getPriceInfo(quote);

  return (
    <div className="w-[144px] flex items-center gap-1 -ml-px mr-[5px]">
      <Tooltip
        truncate
        content={getToolTipsPrice(quote)}
      >
        <span className={cx(TextCol[side], 'max-w-[144px] truncate font-extrabold')}>
          {/* Price */}
          <span className="text-sm">{part1}.</span>
          <span className="text-lg">{part2}</span>
          {/* returnPoint */}
          {flag_rebate && <span className="font-extrabold text-lg ml-1">F{returnPoint}</span>}
        </span>
      </Tooltip>
    </div>
  );
};

const PriceIcon = ({ quote }: PriceProps) => {
  if (!quote?.quote_id) return null;
  return (
    <div className="min-w-[16px] h-4 bg-primary-600 rounded flex items-center justify-center">
      <Tooltip content={getToolTipsPrice(quote)}>
        <span className="text-primary-100 text-xs flex items-center">
          {quote?.quote_type === BondQuoteType.Yield && '收'}
          {quote?.quote_type === BondQuoteType.CleanPrice && '净'}
        </span>
      </Tooltip>
    </div>
  );
};

const ReferPrice = ({ quote }: PriceProps) => {
  if (!quote?.quote_id) return <span>--</span>;

  const { side = Side.SideBid, flag_rebate } = quote;

  const { price, returnPoint } = getPriceInfo(quote);
  const baseCls = cx(TextCol[side], 'flex items-center h-7 font-extrabold');

  if (!flag_rebate) {
    return <div className={cx(baseCls, 'items-center text-lg')}>{price}</div>;
  }
  return (
    <div className={cx(baseCls, 'flex-col')}>
      <span className="text-sm leading-[14px]">{price}</span>
      <span className="text-xs leading-[14px]">F{returnPoint}</span>
    </div>
  );
};

const SpotPricingPrice = ({
  quote,
  isUnMatch = false,
  isSpot = true,
  className
}: PriceProps & { className?: string; isUnMatch?: boolean; isSpot: boolean }) => {
  const getPriceTextCls = () => {
    if (isUnMatch) return 'text-xs';
    if (!isSpot) return 'text-sm';
    return 'text-lg';
  };

  const priceTextCls = getPriceTextCls();

  if (!quote) return <span>--</span>;

  const { side = Side.SideBid, flag_rebate } = quote;

  const { price, returnPoint } = getPriceInfo(quote);
  const baseCls = cx(
    isSpot ? TextCol[side] : 'text-gray-100',
    'w-[120px] flex items-center gap-1 -ml-px mr-[5px] h-7 font-extrabold'
  );

  if (!flag_rebate) {
    return <div className={cx(baseCls, priceTextCls, className)}>{price}</div>;
  }

  return (
    <div className={cx(baseCls, className)}>
      <Tooltip
        truncate
        content={getToolTipsPrice(quote)}
      >
        <span className={cx(TextCol[side], 'max-w-[120px] truncate font-extrabold')}>
          {/* Price */}
          <span className={priceTextCls}>{price}</span>

          {/* returnPoint */}
          {flag_rebate && <span className="font-medium text-xs ml-1">F{returnPoint}</span>}
        </span>
      </Tooltip>
    </div>
  );
};

const SpotPrice = ({ quote, className = '' }: PriceProps & { className?: string }) => {
  if (!quote) return <span>--</span>;

  const { side = Side.SideBid, flag_rebate } = quote;

  const { price, returnPoint } = getPriceInfo(quote);
  const baseCls = cx(TextCol[side], 'flex items-center h-7 font-extrabold');

  if (!flag_rebate) {
    return <div className={cx(baseCls, className, 'text-md')}>{price}</div>;
  }

  return (
    <div className={cx('w-[144px] flex items-center gap-1', className)}>
      <Tooltip
        truncate
        content={getToolTipsPrice(quote)}
      >
        <span className={cx(TextCol[side], 'max-w-[144px] truncate font-extrabold')}>
          {/* Price */}
          <span className="text-md">{price}</span>

          {/* returnPoint */}
          {flag_rebate && <span className="font-medium text-xs ml-1">F{returnPoint}</span>}
        </span>
      </Tooltip>
    </div>
  );
};

export { PanelPrice, PriceIcon, SpotPrice, SpotPricingPrice };
