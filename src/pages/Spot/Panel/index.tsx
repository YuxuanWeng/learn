import { SyncDataType } from '@fepkg/services/types/enum';
import { isUseLocalServer } from '@/common/ab-rules';
import { QuickSearch } from '@/components/business/QuickSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { LocalDataProvider } from '@/layouts/LocalDataProvider';
import { LocalServerLoadingProvider } from '@/layouts/LocalDataProvider/LocalServer';
import { closeIDCMain } from '../utils/openDialog';
import BondPanel from './BondPanel';
import { DealRecord } from './DealRecord';
import { PanelStateProvider, usePanelState } from './Providers/PanelStateProvider';
import SpotAppBar from './components/SpotAppBar';
import useQuickSearch from './hooks/useQuickSearch';

const DealOptInitSyncDataTypeList = [
  SyncDataType.SyncDataTypeDeal,
  SyncDataType.SyncDataTypeQuote,
  SyncDataType.SyncDataTypeBondDetail,
  SyncDataType.SyncDataTypeHoliday,
  SyncDataType.SyncDataTypeInst,
  SyncDataType.SyncDataTypeTrader,
  SyncDataType.SyncDataTypeUser
];

const Inner = () => {
  const { accessCache, column } = usePanelState();
  const { onQuickSearch } = useQuickSearch();
  const { productType } = useProductParams();

  if (!accessCache.spotPricing) return null;

  return (
    <>
      {/* 横向缩放时，成交记录超出部分逐渐被隐藏，窗口达到最小尺寸时，各个方向禁止滚动，其余尺寸可以纵向滚动 */}
      <div className="relative flex gap-2 h-[calc(100vh_-_45px)] overflow-overlay z-[100]">
        {/* 债券面板 */}
        {column !== 0 && (
          <div className="flex flex-col h-full border border-l-0 border-t-0 border-transparent border-solid border-r-gray-600">
            {/* 报价板 */}
            <div className="flex flex-auto overflow-overlay z-[100]">
              <BondPanel />
            </div>
          </div>
        )}

        {/* 成交记录 */}
        <div
          className="flex flex-col flex-1 h-full bg-gray-800"
          style={{ width: 672 }}
        >
          <DealRecord />
        </div>
      </div>

      {/* 快捷搜索 */}
      <QuickSearch
        productType={productType}
        onSelect={onQuickSearch}
      />
    </>
  );
};

const SpotPanel = () => {
  const node = (
    <>
      <SpotAppBar />
      <Inner />
    </>
  );
  if (isUseLocalServer()) {
    return (
      <PanelStateProvider>
        <LocalServerLoadingProvider
          title="点价板"
          close={closeIDCMain}
          header={<SpotAppBar />}
        >
          {node}
        </LocalServerLoadingProvider>
      </PanelStateProvider>
    );
  }
  return (
    <PanelStateProvider>
      <LocalDataProvider
        title="点价板"
        initSyncDataTypeList={DealOptInitSyncDataTypeList}
        close={closeIDCMain}
        header={<SpotAppBar />}
      >
        {node}
      </LocalDataProvider>
    </PanelStateProvider>
  );
};

export default SpotPanel;
