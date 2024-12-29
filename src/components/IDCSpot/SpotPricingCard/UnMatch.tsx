import cx from 'classnames';
import { SideMap } from '@fepkg/business/constants/map';
import { Button } from '@fepkg/components/Button';
import { DealQuote, SpotPricingQuote } from '@fepkg/services/types/common';
import { Side, SpotPricingFailedReason } from '@fepkg/services/types/enum';
import { SpotPricingPrice } from '@/components/IDCBoard/Price';
import { SpotPricingCardStatus } from './types';

type UnMatchParams = {
  cardStatus: SpotPricingCardStatus;
  spotStatus: DealQuote;
  unMatchQuotes: SpotPricingQuote[];
  unMatchVol: number;
  allVol: number;
  onOpenBondDetailDialog: VoidFunction;
};

export default function UnMatch({
  cardStatus,
  spotStatus,
  unMatchQuotes,
  unMatchVol,
  allVol,
  onOpenBondDetailDialog
}: UnMatchParams) {
  const isMarketChanged =
    unMatchQuotes.length === 0 ||
    unMatchQuotes.some(q => q.spot_pricing_failed_reason === SpotPricingFailedReason.MarketChanged);

  return (
    <div className={cx('bg-gray-800', 'mx-4 mb-4 px-3 py-2 overflow-hidden rounded-lg')}>
      <div className="flex flex-row justify-between items-center mt-1 mb-1 text-sm text-gray-000 font-bold">
        未匹配报价
        <Button
          className="h-6"
          type={spotStatus.side === Side.SideBid ? 'orange' : 'secondary'}
          ghost
          onClick={onOpenBondDetailDialog}
        >
          查看
        </Button>
      </div>
      <ul className="grid grid-rows-2 grid-cols-2 gap-2 text-gray-200">
        <li className="flex items-center">
          <SpotPricingPrice
            className="!w-auto mr-1"
            quote={spotStatus}
            isSpot
            isUnMatch
          />
          <div
            className={cx(
              'flex ml-1 px-[7px] h-4 text-white rounded items-center',
              spotStatus.side === Side.SideOfr ? 'bg-secondary-100' : 'bg-orange-100'
            )}
          >
            {/* {spotStatus.side === Side.SideOfr ?'Ofr' : 'Bid'} */}
            {SideMap[spotStatus.side].firstUpperCase}
          </div>
        </li>
        <li className="text-sm">
          {cardStatus !== SpotPricingCardStatus.NoVolumn ? (
            <>
              <span className={cx('mr-1', spotStatus.side === Side.SideBid ? 'text-orange-100' : 'text-secondary-100')}>
                {unMatchVol}
              </span>
              <span className="mr-1">/</span>
              <span className="text-gray-000 mr-1">{allVol}</span>
              <span className="text-gray-200">未分配</span>
            </>
          ) : null}
        </li>
        <li className="inline-flex items-center text-sm text-gray-200">
          <span className={cx('mr-1', spotStatus.side === Side.SideOfr ? 'text-secondary-100' : 'text-orange-100')}>
            {isMarketChanged ? 0 : unMatchQuotes.length}
          </span>
          笔
        </li>
        <li className="inline-flex items-center text-gray-200 text-sm">
          原因：
          <span className="text-gray-000">{isMarketChanged ? '行情更新' : '不符规则'}</span>
        </li>
      </ul>
    </div>
  );
}
