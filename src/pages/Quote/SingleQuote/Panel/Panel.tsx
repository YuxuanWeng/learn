import { Dialog } from '@fepkg/components/Dialog';
import { Side } from '@fepkg/services/types/enum';
import { ErrorBoundary } from '@sentry/react';
import { useMemoizedFn } from 'ahooks';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { useFlowLogger } from '@/common/providers/FlowLoggerProvider';
import { logError } from '@/common/utils/logger/data';
import { BondSearch, useBondSearch } from '@/components/business/Search/BondSearch';
import { BrokerSearch } from '@/components/business/Search/BrokerSearch';
import { InstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { DialogLayout } from '@/layouts/Dialog';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks/useProductParams';
import { BondBasic } from '../BondBasic';
import { Calc } from '../Calc';
import QuoteOper from '../QuoteOper';
import { Exchange } from '../QuoteOper/Exchange';
import { useQuoteOper } from '../QuoteOper/QuoteOperProvider';
import { InvertedDisplay } from '../Reminder';
import useSubmit from '../hooks/useSubmit';
import { useFocus } from '../providers/FocusProvider';
import { useParsingUpload } from '../providers/ParsingUploadProvider';
import { useSearchConnector } from '../providers/SearchConnectorProvider';
import { QuoteActionMode, SearchInputCategory } from '../types';
import { toggleRootElOpacity } from '../utils';
import { Footer } from './Footer';
import { usePanelState } from './PanelStateProvider';
import { usePanelParams } from './usePanelParams';

export const SingleQuotePanel = () => {
  const { cancel } = useDialogLayout();
  const { defaultParams } = usePanelParams();
  const { productType } = useProductParams();
  const { actionMode, disabled } = defaultParams;

  const { updatePanelState, opacityChangedByCancel } = usePanelState();
  const { insertParsingContent, clearParsingContent } = useParsingUpload();
  const { bondSearchState } = useBondSearch();
  const { handleBondChange, handleInstTraderChange, handleBrokerChange } = useSearchConnector();
  const { clearCurrentFocusRef, updateSearchInputRef, bondSearchCbRef } = useFocus();
  const { trackPoint } = useFlowLogger();
  const { clearValuationStatus } = useQuoteOper();

  const { handleSubmit, handleEnterDown, submitting } = useSubmit();
  const { updatePrevFocusRef } = useFocus();

  useEnterDown(handleEnterDown);

  const handleCancel = useMemoizedFn(() => {
    opacityChangedByCancel.current = true;
    toggleRootElOpacity(false);

    clearParsingContent();
    updatePanelState(draft => {
      draft.lastActionTime = Date.now();
    });

    cancel();
  });

  // 报价搜索禁用状态
  const bondSearchDisabled =
    disabled || actionMode === QuoteActionMode.EDIT || actionMode === QuoteActionMode.EDIT_UNREFER;

  return (
    <ErrorBoundary
      onError={(error, info) => {
        logError({ keyword: 'unexpected_quote_dialog_error', error, info });
      }}
    >
      <DialogLayout.Header
        onCancel={handleCancel}
        keyboard
      >
        <Dialog.Header>报价</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body className="flex flex-col gap-1 !py-1">
        <InvertedDisplay
          productType={productType}
          bond={bondSearchState.selected?.original}
        />

        <div className="flex flex-col gap-1">
          <BondSearch
            size="sm"
            className="bg-gray-800 !h-7"
            ref={bondSearchCbRef}
            parsing
            disabled={bondSearchDisabled}
            onChange={(opt, parsings, traderList) => {
              handleBondChange(opt, parsings, traderList);
              clearValuationStatus();
            }}
            onFocus={() => {
              updateSearchInputRef(SearchInputCategory.Bond);
            }}
            onBlur={clearCurrentFocusRef}
            onParsingSuccess={insertParsingContent}
            onBeforeParsing={params => trackPoint(undefined, 'parsing-prev-single-quote-v2', params)}
            onBeforeSearch={params => trackPoint(undefined, 'fuzzy-search-bond-prev-single-quote-v2', params)}
          />
          <BondBasic />
        </div>

        {/* TODO gap-2，临时调整为gap-1，待下个版本宽度问题解决后调整回来 */}
        <div className="flex items-center gap-1 justify-between">
          <QuoteOper
            side={Side.SideBid}
            disabled={disabled}
          />
          <Exchange disabled={disabled} />
          <QuoteOper
            side={Side.SideOfr}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InstTraderSearch
            className="bg-gray-800 h-7"
            label="机构(交易员)"
            labelWidth={96}
            // 默认为false，这里手动设置为true，否则无法展示债券识别联动的选项
            showOptions
            // 需要返回带有经纪人的数据，否则无法联动经纪人选项
            searchParams={{ with_broker: true }}
            // 需要首选项高亮
            preferenceHighlight
            disabled={disabled}
            onChange={handleInstTraderChange}
            onFocus={() => {
              updateSearchInputRef(SearchInputCategory.InstTrader);
            }}
            onBlur={clearCurrentFocusRef}
            onBeforeSearch={params => trackPoint(undefined, 'fuzzy-search-inst-trader-prev-single-quote-v2', params)}
          />

          <BrokerSearch
            className="bg-gray-800 h-7"
            disabled={disabled}
            onChange={handleBrokerChange}
            onFocus={() => {
              updateSearchInputRef(SearchInputCategory.Broker);
            }}
            onBlur={clearCurrentFocusRef}
            onBeforeSearch={params => trackPoint(undefined, 'fuzzy-search-broker-prev-single-quote-v2', params)}
          />
        </div>
      </Dialog.Body>

      <Dialog.Footer
        confirmBtnProps={{ loading: submitting, disabled: disabled || submitting, onMouseDown: updatePrevFocusRef }}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
      >
        <Footer disabled={disabled} />
      </Dialog.Footer>

      <Calc
        productType={productType}
        actionMode={actionMode}
      />
    </ErrorBoundary>
  );
};
