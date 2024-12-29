import { useContext, useEffect, useState } from 'react';
import { Dialog } from '@fepkg/components/Dialog';
import { Tabs } from '@fepkg/components/Tabs';
import { QuoteLite } from '@fepkg/services/types/common';
import { useAtom } from 'jotai';
import { useWindowSize } from 'usehooks-ts';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { useProductParams } from '@/layouts/Home/hooks';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { pollingActiveAtom } from './atoms';
import BaseInfo from './components/BaseInfo';
import ProductQuote from './components/ProductQuote';
import { useDisplayDataQuery } from './hooks/useDataQuery';
import { DetailPanelProvider } from './providers/DetailPanelProvider';
import { BondDetailDialogContext, TabType } from './type';

const tableTabs = [
  { key: TabType.ProductQuote, label: '产品报价', className: 'w-30' },
  { key: TabType.BaseInfo, label: '基本信息', className: 'w-30' }
];
const BondDetail = () => {
  const { productType } = useProductParams();

  const [tab, setTab] = useState(TabType.ProductQuote);
  // TODO 待确认为什么不把这个hook直接放到使用的地方
  const { height } = useWindowSize();
  const [, setActive] = useAtom(pollingActiveAtom);

  // 弹窗相关设置
  const context = useContext<BondDetailDialogContext>(DialogContext);
  const [quoteLite, setQuoteLite] = useState<QuoteLite>();
  const [keyMarket, setKeyMarket] = useState<string>();

  const { data } = useDisplayDataQuery({
    key_market_list: keyMarket ? [keyMarket] : []
  });

  useEffect(() => {
    if (context?.data || context?.bond_info) {
      const quote_lite = context.data;
      const bond = quote_lite?.bond_basic_info || context.bond_info;
      setKeyMarket(bond?.key_market);
      setQuoteLite(quote_lite);
    }
  }, [context]);

  return (
    <DetailPanelProvider>
      <DialogLayout.Header controllers={['min', 'max', 'close']}>
        <Dialog.Header subtitle={data?.bondDetailInfo.display_code}>{data?.bondDetailInfo?.short_name}</Dialog.Header>
      </DialogLayout.Header>

      <div className="flex-1 bg-gray-700">
        <div className="mt-3 mx-3 bg-gray-800 rounded-lg w-[240px]">
          <Tabs
            items={tableTabs}
            defaultActiveKey={tableTabs[0].key}
            activeKey={tab}
            onChange={item => {
              setTab(item.key);
              setActive(item.key === TabType.ProductQuote);
              window.getSelection()?.removeAllRanges();
            }}
          />
        </div>

        {tab === TabType.ProductQuote && data && (
          <ProductQuote
            bondBasicInfo={data.bondBasicInfo}
            bondDetailInfo={data.bondDetailInfo}
            productType={productType}
            quoteLite={quoteLite}
            height={height}
            tableKey={context?.tab ?? ProductPanelTableKey.Basic}
            latestBondInfo={data}
          />
        )}

        {tab === TabType.BaseInfo && data && (
          <BaseInfo
            bondAppendixInfo={data.bondDetailInfo}
            height={height}
            benchmarkRate={data.benchmarkRate}
            issuerRatingList={data.issuer_rating}
          />
        )}
      </div>
    </DetailPanelProvider>
  );
};

export default BondDetail;
