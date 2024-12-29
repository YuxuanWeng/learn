import { useContext, useLayoutEffect, useState } from 'react';
import { SpotModalDetailType } from '@fepkg/business/constants/log-map';
import { SyncDataType } from '@fepkg/services/types/bdm-enum';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { isUseLocalServer } from '@/common/ab-rules';
import BitOper from '@/common/utils/bit';
import { logError } from '@/common/utils/logger/data';
import { trackPoint } from '@/common/utils/logger/point';
import ErrorBoundary from '@/components/ErrorBoundary';
import { IDCPanel } from '@/components/IDCBoard/Panel';
import type { IGrid } from '@/components/IDCBoard/types';
import { IBondDetailDialog, renderBondNodes } from '@/components/IDCBoard/utils';
import { SpotDate } from '@/components/IDCSpot/types';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { LocalDataProvider } from '@/layouts/LocalDataProvider';
import { LocalServerLoadingProvider } from '@/layouts/LocalDataProvider/LocalServer';
import { PanelStateProvider } from '../Panel/Providers/PanelStateProvider';

const spotDates = [BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0), SpotDate.Plus0, SpotDate.FRA];

const DialogInner = ({ context }) => {
  const [maxRows, setMaxRows] = useState(0);
  const onPanelListChange = (list: IGrid[][]) => {
    const mx = list.reduce((max, grids) => Math.max(max, grids.length), 0);
    if (mx > maxRows) setMaxRows(mx);
  };

  useLayoutEffect(() => {
    trackPoint(SpotModalDetailType.DetailEnter);
  }, []);

  return (
    <>
      <DialogLayout.Header>{renderBondNodes(context?.bond, true, false)}</DialogLayout.Header>
      <div className="bg-gray-700 px-3 py-3 flex flex-col h-full">
        <div className="overflow-overlay z-[100] flex-auto h-0">
          <div className="grid grid-cols-[616px_312px_616px] gap-2">
            {spotDates.map(sDate => (
              <IDCPanel
                className="h-[calc(100vh_-_120px)]"
                key={sDate}
                spotDate={sDate}
                showSubOptimal={sDate !== SpotDate.Plus0}
                onListChange={onPanelListChange}
                rowCount={Math.max(maxRows, 6)}
                onSpot={openSpotParam => {
                  window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_IDC_SPOT_OPEN, openSpotParam);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default () => {
  const context = useContext<IBondDetailDialog>(DialogContext);
  const bondPanelNode = context ? (
    <ErrorBoundary
      onError={(error, info) => {
        logError({ keyword: 'unexpected_idc_bond_detail_dialog_error', error, info });
      }}
    >
      <PanelStateProvider initialState={{ detailBond: context?.bond }}>
        <DialogInner context={context} />
      </PanelStateProvider>
    </ErrorBoundary>
  ) : null;

  if (isUseLocalServer()) {
    return <LocalServerLoadingProvider>{bondPanelNode}</LocalServerLoadingProvider>;
  }

  return (
    <LocalDataProvider
      initSyncDataTypeList={[
        SyncDataType.SyncDataTypeQuote,
        SyncDataType.SyncDataTypeDeal,
        SyncDataType.SyncDataTypeTrader,
        SyncDataType.SyncDataTypeInst,
        SyncDataType.SyncDataTypeUser,
        SyncDataType.SyncDataTypeBondDetail
      ]}
    >
      {bondPanelNode}
    </LocalDataProvider>
  );
};
