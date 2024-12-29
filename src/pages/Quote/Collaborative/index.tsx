import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { LocalServerLoadingProvider } from '@/layouts/LocalDataProvider/LocalServer';
import { QuoteBatchForm } from '../BatchForm';
import { OriginalTextModal } from './components/OriginalTextModal';
import { CollaborativeQuotePanel } from './components/Panel';
import { QuoteModal } from './components/QuoteModal';
import { RepeatQuoteModal } from './components/RepeatQuoteModal';
import { SettingModal } from './components/SettingModal';
import { GroupSettingProvider } from './components/SettingModal/providers';
import { QUOTE_BATCH_FORM_LOGGER_FLOW_NAME, QUOTE_BATCH_FORM_LOGGER_TRACE_FIELD } from './constants';
import { useQuoteBatchFormSubmit } from './hooks/useQuoteBatchFormSubmit';
import { TableStateProvider } from './providers/TableStateProvider';
import { UploadProvider } from './providers/UploadProvider';

// const CollaborativeInitSyncDataTypeList = [
//   SyncDataType.SyncDataTypeBondDetail,
//   SyncDataType.SyncDataTypeTrader,
//   SyncDataType.SyncDataTypeUser,
//   SyncDataType.SyncDataTypeInst,
//   SyncDataType.SyncDataTypeQuoteDraft,
//   SyncDataType.SyncDataTypeQuoteDraftMessage
// ];
const Inner = () => {
  return (
    <TableStateProvider>
      <UploadProvider>
        {/* 分组配置provider */}
        <GroupSettingProvider>
          <CollaborativeQuotePanel />

          <QuoteModal />
          <QuoteBatchForm
            useSubmit={useQuoteBatchFormSubmit}
            showFlags
            showFooter
            loggerInfo={{
              traceField: QUOTE_BATCH_FORM_LOGGER_TRACE_FIELD,
              flowName: QUOTE_BATCH_FORM_LOGGER_FLOW_NAME
            }}
          />
          <RepeatQuoteModal />
          <OriginalTextModal />
          <SettingModal />
        </GroupSettingProvider>
      </UploadProvider>
    </TableStateProvider>
  );
};

const CollaborativeQuote = () => {
  const dialogLayout = useDialogLayout();

  if (!dialogLayout) return null;

  // if(!isUseLocalServer()){
  //   <LocalDataProvider
  //     title="协同报价"
  //     initSyncDataTypeList={CollaborativeInitSyncDataTypeList}
  //     close={closeCollaborativeQuote}
  //   >
  //     <Inner />
  //   </LocalDataProvider>
  // }

  return (
    <LocalServerLoadingProvider title="协同报价">
      <Inner />
    </LocalServerLoadingProvider>
  );
};

export default CollaborativeQuote;
