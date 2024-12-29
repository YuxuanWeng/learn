import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { Dialog } from '@fepkg/components/Dialog';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { CommonRoute } from 'app/types/window-v2';
import { Provider as JotaiProvider } from 'jotai';
import { NavigatorItemId } from '@/components/Navigator';
import { DialogLayout } from '@/layouts/Dialog';
import { useNavigatorCheckedId, useNavigatorCheckedIdValue } from '@/layouts/Home/atoms';
import { usePageInitialed } from '@/layouts/Home/atoms/page-initialed';
import { useProductParams } from '@/layouts/Home/hooks';
import { ActiveProductTypeProvider } from '@/layouts/Home/hooks/useActiveProductType';
import { ReceiptDealFilter } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealFilter';
import { useParamsCacheInitialValues } from '@/pages/Deal/Receipt/ReceiptDealPanel/hooks/useParamsCacheInitialValues';
import { ReceiptDealFilterProvider } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/FilterProvider';
import { ReceiptDealPanelProvider } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider';
import { useReceiptDealPanelLoader } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/preload';
import { ReceiptDealPanelSidebar } from './components/ReceiptDealSidebar';
import { ReceiptDealTable } from './components/ReceiptDealTable';

const Inner = ({ home = false }) => {
  const [jotaiInitialValues] = useParamsCacheInitialValues();
  const checkedId = useNavigatorCheckedIdValue();
  const displayCls = checkedId === NavigatorItemId.Setting ? 'hidden' : '';

  return (
    <JotaiProvider initialValues={jotaiInitialValues}>
      <ReceiptDealPanelProvider>
        <ReceiptDealFilterProvider>
          {!home && (
            <DialogLayout.Header controllers={['min', 'max', 'close']}>
              <Dialog.Header>成交单</Dialog.Header>
            </DialogLayout.Header>
          )}

          <section
            className={cx(
              'flex',
              home
                ? `home-panel rounded-tl-2xl border border-r-0 border-b-0 border-gray-600 border-solid ${displayCls}`
                : 'flex-1 h-0'
            )}
          >
            <div className="flex flex-col flex-1 w-0">
              <ReceiptDealFilter />
              <ReceiptDealTable />
            </div>

            <ReceiptDealPanelSidebar />
          </section>
        </ReceiptDealFilterProvider>
      </ReceiptDealPanelProvider>
    </JotaiProvider>
  );
};

const ReceiptDealPanel = ({ home = false }) => {
  const { productType } = useProductParams();
  const { timestamp } = useReceiptDealPanelLoader();
  const navigate = useNavigate();
  const [_, setCheckedId] = useNavigatorCheckedId();
  usePageInitialed();

  // 内码跳转逻辑，更新router_path，然后刷新jotaiInitialValues
  useEffect(() => {
    if (home) return void 0;
    const off = window.Broadcast.on(BroadcastChannelEnum.BROADCAST_RECEIPT_DEAL_REFRESH, code => {
      let path = `${CommonRoute.ReceiptDealPanel}/${productType}`;
      if (code) path += `/${code}/${Date.now()}`;

      navigate(path);
    });
    return () => {
      off();
    };
  }, [home, navigate, productType, setCheckedId]);

  return (
    // 此处再包一个 ActiveProductTypeProvider，让成交单内的 activeProductType 还是取 routeProductType
    <ActiveProductTypeProvider key={timestamp}>
      <Inner home={home} />
    </ActiveProductTypeProvider>
  );
};

export default ReceiptDealPanel;
