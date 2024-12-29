import { memo } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { DealType } from '@fepkg/services/types/bds-enum';
import { useHead } from '@/components/IDCBoard/Head/HeadProvider';
import { SearchableBond } from '@/components/IDCBoard/Head/SearchableBond';
import { HeadDom, HeadProps } from '@/components/IDCBoard/Head/index';
import IDCSimplifyShortcuts from '@/components/IDCSimplifyShortcuts';
import { SpotDate } from '@/components/IDCSpot/types';
import ReferDropdown from './ReferDropdown';
import './style.less';

const IDCPanelSimplifyHead = memo(function Head({
  referQuoteList,
  onQuoteRefered,
  onSpotButtonClick,
  onBondDetail
}: HeadProps & HeadDom) {
  const { accessCache, bond, initKeyMarket, quickSpotDate, setQuickSpotDate } = useHead();

  const headDisabled = !bond;

  const actionDisabled = !accessCache.action || headDisabled || quickSpotDate === SpotDate.FRA;

  return (
    <header
      className={cx('h-[60px] flex items-center justify-between')}
      data-code={initKeyMarket}
    >
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <SearchableBond simplifyMode />
          <Button
            className="w-[42px] h-6 !text-xs"
            type="orange"
            disabled={actionDisabled}
            onClick={() => onSpotButtonClick?.(DealType.GVN)}
          >
            GVN
          </Button>
          <Button
            className="w-[42px] h-6 !text-xs"
            type="secondary"
            disabled={actionDisabled}
            onClick={() => onSpotButtonClick?.(DealType.TKN)}
          >
            TKN
          </Button>
        </div>
        <div className="flex gap-1">
          <IDCSimplifyShortcuts
            disabled={headDisabled}
            spotDate={quickSpotDate}
            onChange={setQuickSpotDate}
          />
          <ReferDropdown
            simplifyMode
            disabled={headDisabled}
            quoteList={referQuoteList}
            onQuoteRefered={onQuoteRefered}
          />
          <Button
            type="gray"
            plain
            className="w-[42px] h-6 text-gray-100 !text-xs"
            disabled={headDisabled}
            onClick={() => onBondDetail?.(bond)}
          >
            ALL
          </Button>
        </div>
      </div>
    </header>
  );
});

export default IDCPanelSimplifyHead;
