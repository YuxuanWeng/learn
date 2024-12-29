import { HTMLProps, ReactNode, memo, useMemo, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { IconDetails, IconDetailsHover } from '@fepkg/icon-park-react';
import { DealQuote, FiccBondBasic, QuoteLite } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import BitOper from '@/common/utils/bit';
import { getFormattedEstimation } from '@/common/utils/quote-price';
import { useHead } from '@/components/IDCBoard/Head/HeadProvider';
import { SearchableBond } from '@/components/IDCBoard/Head/SearchableBond';
import { SpotDate } from '@/components/IDCSpot/types';
import ReferDropdown from './ReferDropdown';
import './style.less';

export interface HeadProps {
  referQuoteList?: DealQuote[];
  onQuoteRefered?: (quote: QuoteLite | DealQuote) => void;
  onSpotButtonClick?: (dealType: DealType) => void;
  onBondDetail?: (bond?: FiccBondBasic | null) => void;
  spotDate?: SpotDate;
}
export type HeadDom = Omit<HTMLProps<HTMLHeadElement>, keyof HeadProps>;

const IDCPanelHead = memo(function Head({
  referQuoteList,
  onQuoteRefered,
  onSpotButtonClick,
  onBondDetail,
  spotDate
}: HeadProps & HeadDom) {
  const { accessCache, bond, initKeyMarket, isDetailPage } = useHead();

  const [hover, setHover] = useState(false);

  const showButtons = !isDetailPage || spotDate != SpotDate.FRA;

  const headDisabled = !bond;

  const titleBaseBorder = 'h-8 flex items-center border border-solid rounded-lg border-gray-600';
  const fraBondMessageStyle = 'inline rounded-lg bg-gray-700 px-2 py-0.5 h-[22px] mr-2';

  const DetailNode = useMemo(() => {
    let returnNode: ReactNode = null;
    if (spotDate === BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0)) {
      returnNode = (
        <div className={cx('w-[292px]', titleBaseBorder)}>
          <Caption className="ml-3">+1，明天+0</Caption>
        </div>
      );
    } else if (spotDate === SpotDate.Plus0) {
      returnNode = (
        <div className={cx('w-[292px]', titleBaseBorder)}>
          <Caption
            type="orange"
            className="ml-3"
          >
            +0
          </Caption>
        </div>
      );
    } else if (spotDate === SpotDate.FRA) {
      const estimation = getFormattedEstimation(bond, { decimal: 4, noZeroAfterDecimalIndex: 2 });
      returnNode = (
        <div className={cx('flex justify-between w-full', titleBaseBorder)}>
          <Caption
            type="secondary"
            className="flex ml-3"
          >
            远期
          </Caption>
          <div className="flex">
            {bond ? (
              <div className="inline">
                <div className={fraBondMessageStyle}>
                  <label className="text-gray-300">中债净价:</label>
                  <span className="text-gray-200">{estimation?.clean_price}</span>
                </div>
                <span>
                  <div className={fraBondMessageStyle}>
                    <label className="text-gray-300">中债YTM(%):</label>
                    <span className="text-gray-200">{estimation?.yield}</span>
                  </div>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      );
    } else {
      return null;
    }
    return returnNode;
  }, [bond, spotDate]);

  return (
    <header
      className={cx('flex items-center justify-between', isDetailPage ? 'h-12' : 'h-[52px]')}
      data-code={initKeyMarket}
    >
      {!isDetailPage ? (
        <SearchableBond />
      ) : (
        <div className={cx('main-text text-sm flex items-center', showButtons ? 'w-1/4' : 'w-full')}>{DetailNode}</div>
      )}

      {showButtons && spotDate !== SpotDate.FRA ? (
        <div className="flex gap-2 items-center">
          {!isDetailPage ? (
            <Button
              ghost
              className="w-8 h-8"
              disabled={headDisabled}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => onBondDetail?.(bond)}
            >
              {hover ? <IconDetailsHover size={22} /> : <IconDetails size={22} />}
            </Button>
          ) : null}
          {spotDate !== SpotDate.Plus0 ? (
            <ReferDropdown
              isDetail={isDetailPage}
              disabled={headDisabled}
              quoteList={referQuoteList}
              onQuoteRefered={onQuoteRefered}
            />
          ) : null}
          <Button
            className={isDetailPage ? 'h-7' : ''}
            type="orange"
            disabled={!accessCache.action || headDisabled}
            onClick={() => onSpotButtonClick?.(DealType.GVN)}
          >
            GVN
          </Button>
          <Button
            className={isDetailPage ? 'h-7' : ''}
            type="secondary"
            disabled={!accessCache.action || headDisabled}
            onClick={() => onSpotButtonClick?.(DealType.TKN)}
          >
            TKN
          </Button>
        </div>
      ) : null}
    </header>
  );
});

export default IDCPanelHead;
