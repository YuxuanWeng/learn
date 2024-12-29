import { BondSearchProvider } from '@fepkg/business/components/Search/BondSearch';
import { InstSearchProvider, transform2AgencyInstOpt } from '@fepkg/business/components/Search/InstSearch';
import { Dialog } from '@fepkg/components/Dialog';
import { BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import { InstTraderSearchProvider } from '@/components/business/Search/InstTraderSearch';
import { TraderPreferenceProvider } from '@/components/business/Search/TraderSearch';
import { CPBSearchConnectorProvider } from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { DialogLayout } from '@/layouts/Dialog';
import { useProductParams } from '@/layouts/Home/hooks';
import Filter from './Filter';
import HistoryTable from './HistoryTable';
import { HistoryRecordsProvider } from './provider';

const Inner = () => {
  return (
    <div className="flex flex-col flex-1 h-full">
      <Filter />
      <HistoryTable />
    </div>
  );
};

export default function HistoryRecords() {
  const { productType } = useProductParams();

  return (
    <HistoryRecordsProvider>
      {/* 债券搜索 */}
      <BondSearchProvider initialState={{ productType }}>
        {/* 机构搜过 */}
        <InstSearchProvider initialState={{ productType, transformOption: transform2AgencyInstOpt(productType) }}>
          {/* 机构/交易员搜索 */}
          <InstTraderSearchProvider initialState={{ productType }}>
            {/* 为了支持机构交易员搜索框首选项高亮 */}
            <TraderPreferenceProvider>
              {/* 为了支持CPBSearchConnectorProvider */}
              <BrokerSearchProvider initialState={{ productType }}>
                {/* 为了支持切换首选项 */}
                <CPBSearchConnectorProvider initialState={{ productType }}>
                  <DialogLayout.Header controllers={['min', 'max', 'close']}>
                    <Dialog.Header>历史记录</Dialog.Header>
                  </DialogLayout.Header>

                  <Dialog.Body className="flex flex-col">
                    <Inner />
                  </Dialog.Body>
                </CPBSearchConnectorProvider>
              </BrokerSearchProvider>
            </TraderPreferenceProvider>
          </InstTraderSearchProvider>
        </InstSearchProvider>
      </BondSearchProvider>
    </HistoryRecordsProvider>
  );
}
