import { useMemo } from 'react';
import cx from 'classnames';
import { IconAttention } from '@fepkg/icon-park-react';
import type { QuotePrice } from '@fepkg/services/types/bond-optimal-quote/get-optimal-price';
import { Side } from '@fepkg/services/types/enum';
import { useOptimalPriceQuery } from '@/pages/Quote/SingleQuote/hooks/useOptimalPriceQuery';
import { InvertedDisplayProps } from './types';
import { getInvertedInfo } from './utils';

const getContent = (side: Side, price?: QuotePrice) => {
  const info = getInvertedInfo(side, price);
  const sidePrefix = side === Side.SideBid ? 'ofr' : 'bid';

  let label = '';
  if (!info.inverted) label = '无限制';
  else if (info?.min) label = `不能低于${info.min}`;
  else if (info?.max) label = `不能高于${info.max}`;

  return `${sidePrefix}${label}`;
};

export const InvertedDisplay = ({ className, productType, bond }: InvertedDisplayProps) => {
  const { data } = useOptimalPriceQuery({
    variables: { productType, keyMarketList: bond ? [bond.key_market] : [] }
  });

  const content = useMemo(() => {
    if (!bond?.key_market) return '';

    const map = data?.[bond?.key_market];

    return [Side.SideOfr, Side.SideBid].map(side => getContent(side, map?.[side])).join('，');
  }, [bond?.key_market, data]);

  return (
    <p className={cx('flex items-center flex-shrink-0 gap-2 h-4 text-xs text-secondary-100', className)}>
      {!!content && <IconAttention size={14} />}
      {content}
    </p>
  );
};
