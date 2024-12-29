import { HTMLProps, ReactNode } from 'react';
import cx from 'classnames';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Tooltip } from '@fepkg/components/Tooltip';
import { DealQuote } from '@fepkg/services/types/common';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { isNumber } from 'lodash-es';
import { getReadableYield, isPingJiaFan } from '@/common/utils/quote-price';
import { IGrid } from '@/components/IDCBoard/types';
import { formatPrice } from '../utils';

interface IProps {
  /** 文本颜色，若不传，则bid使用orange-100，ofr使用secondary-100 */
  textColor?: string;
  /** 原始报价数据 */
  quote?: Partial<DealQuote>;
  col?: IGrid[];
  hideVolume?: boolean;
}

type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

const IDCFormattedPrice = (props: IProps & IDom) => {
  const { quote, textColor, col } = props;

  let side: Side | null = null;
  if (quote && 'side' in quote) side = quote.side as Side;
  const total =
    (col?.reduce((acc, gride) => {
      acc += gride?.quote?.volume || 0;
      return acc;
    }, 0) || 0) / 1000;

  let jsx: ReactNode = '--';
  let str = '';

  if (quote) {
    if (isPingJiaFan(quote) || quote.flag_intention) {
      jsx = <span className="h-6 flex justify-end items-center">{getReadableYield(quote)}</span>;
    } else if (quote.quote_type === BondQuoteType.Yield) {
      const pValue = quote.quote_price ?? SERVER_NIL;
      str = getReadableYield({
        ...quote,
        quote_price: formatPrice(pValue) === '' ? undefined : Number(formatPrice(pValue))
      }).toString();
    } else {
      // 支持全价等
      const num = quote?.quote_price;
      str = isNumber(num) ? formatPrice(num).toString() : str;
    }
  }

  if (str) {
    let integer: string = str;
    let decimal = '';
    let debate = '';
    const firstDotIdx = str.indexOf('.');
    if (firstDotIdx > -1) {
      integer = str.slice(0, Math.max(0, firstDotIdx));
      [decimal, debate] = str.slice(Math.max(0, firstDotIdx)).split('F');
    }
    let content = `${integer}${decimal}`;
    if (debate) content += `F${debate}`;
    jsx = (
      <div className={cx('h-6 flex justify-center font-extrabold')}>
        <Tooltip
          truncate
          content={content}
        >
          <span className="max-w-[90px] truncate">
            <span className="text-xs">{integer}</span>
            <span className={debate ? 'text-xs' : 'text-sm'}>{decimal}</span>
            {debate && <span className={cx('text-xs text-left ml-1')}>F{debate}</span>}
          </span>
        </Tooltip>
      </div>
    );
  }

  let textColorClass = '';
  let volumeColorClass = '';
  if (textColor) {
    textColorClass = textColor;
  } else if (side === Side.SideBid) {
    textColorClass = 'text-orange-100';
    volumeColorClass = 'text-orange-050';
  } else if (side === Side.SideOfr) {
    textColorClass = 'text-secondary-100';
    volumeColorClass = 'text-secondary-050';
  }

  const cls = ['select-none', textColorClass, ['leading-6', 'child:not-italic', 'child-em:ml-1'].join(' ')]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cx('w-[144px] flex items-center justify-between', cls)}
      style={{ fontFamily: 'OPPO Sans' }}
    >
      {jsx}
      <span className={cx(volumeColorClass, 'text-xs')}>{total && props.hideVolume != true ? `${total}kw` : ''}</span>
    </div>
  );
};

export default IDCFormattedPrice;
