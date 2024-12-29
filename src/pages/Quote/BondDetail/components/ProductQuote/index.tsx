import { FC, useMemo, useState } from 'react';
import cx from 'classnames';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { FiccBondBasic, FiccBondDetail, QuoteLite } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { useResizeTable } from '../../hooks/useResizeTable';
import { LatestBondInfo } from '../../type';
import DealTable from './components/DealTable';
import DisplayItem from './components/DisplayItem';
import QuoteTable from './components/QuoteTable';
import ReferredTable from './components/ReferredTable';

type Props = {
  bondDetailInfo?: FiccBondDetail;
  bondBasicInfo?: FiccBondBasic;
  productType: ProductType;
  quoteLite?: QuoteLite;
  height: number;
  tableKey: ProductPanelTableKey;
  latestBondInfo?: LatestBondInfo;
};

const ProductQuote: FC<Props> = ({
  bondDetailInfo,
  bondBasicInfo,
  productType,
  quoteLite,
  height,
  tableKey,
  latestBondInfo
}) => {
  const [dealVisible, setDealVisible] = useLocalStorage('singleBondDetail-dealVisible', true);
  const [referredVisible, setReferredVisible] = useLocalStorage('singleBondDetail-referredVisible', true);

  const { quoteHeight, dealTableHeight, startResize } = useResizeTable(height);
  const [bondSelected, setBondSelected] = useState(false);
  const [bottomSelected, setBottomSelected] = useState(false);

  const [animating, setAnimating] = useState(false);

  // 成交区域宽度
  const dealWidth = useMemo(() => {
    if (dealVisible && referredVisible) return '50%';
    if (dealVisible && !referredVisible) return '100%';
    return 0;
  }, [dealVisible, referredVisible]);

  // refer区域宽度
  const referredWidth = useMemo(() => {
    if (dealVisible && referredVisible) return '50%';
    if (!dealVisible && referredVisible) return '100%';
    return 0;
  }, [dealVisible, referredVisible]);

  return (
    <div className="m-3">
      <DisplayItem latestBondInfo={latestBondInfo} />
      <QuoteTable
        productType={productType}
        bondDetailInfo={bondDetailInfo}
        bondBasicInfo={bondBasicInfo}
        quoteLite={quoteLite}
        height={quoteHeight}
        tableKey={tableKey}
        bottomSelected={bottomSelected}
        setBondSelected={setBondSelected}
      />

      {/* 高度调整线 */}
      <div
        className="h-0.5 border-0 border-b border-b-gray-700 border-solid select-none mx-6 cursor-row-resize relative"
        onMouseDown={e => {
          e.preventDefault();
          startResize();
        }}
      />

      <div
        className="flex mt-2.5"
        style={{ height: dealTableHeight }}
      >
        <div className="w-4 bg-gray-700 -ml-4 z-[1000]" />
        <div
          className={cx(
            'overflow-x-overlay h-full w-full select-none',
            'overflow-y-hidden !overflow-x-hidden rounded-b-lg',
            animating && 'transition-width duration-200 ease-linear',
            referredVisible && dealVisible ? 'mr-3' : ''
          )}
          onTransitionEnd={() => {
            setAnimating(false);
          }}
          style={{ width: dealWidth }}
        >
          <DealTable
            onResizeIconClick={() => setAnimating(true)}
            code_market={bondDetailInfo?.code_market}
            productType={productType}
            referredVisible={referredVisible}
            setReferredVisible={setReferredVisible}
            bondSelected={bondSelected}
            setBottomSelected={setBottomSelected}
          />
        </div>

        <div
          className={cx(
            ' h-full overflow-x-overlay w-full select-none ',
            'overflow-y-hidden !overflow-x-hidden rounded-b-lg',
            animating && 'transition-width duration-200 ease-linear'
          )}
          onTransitionEnd={() => {
            setAnimating(false);
          }}
          style={{ width: referredWidth }}
        >
          <ReferredTable
            onResizeIconClick={() => setAnimating(true)}
            key_market={bondDetailInfo?.key_market}
            productType={productType}
            dealVisible={dealVisible}
            setDealVisible={setDealVisible}
            bondSelected={bondSelected}
            setBottomSelected={setBottomSelected}
          />
        </div>
        <div className="w-4 bg-gray-700 -mr-4 z-[1000]" />
      </div>
    </div>
  );
};

export default ProductQuote;
