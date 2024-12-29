import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { BondSearchProvider } from '@fepkg/business/components/Search/BondSearch';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { BondQuoteType } from '@fepkg/services/types/enum';
import { pick } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { FlowLoggerProvider } from '@/common/providers/FlowLoggerProvider';
import { PriceGroupProvider } from '@/components/business/PriceGroup';
import { BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import { InstTraderSearchProvider } from '@/components/business/Search/InstTraderSearch';
import { TraderPreferenceProvider } from '@/components/business/Search/TraderSearch';
import { CPBSearchConnectorProvider } from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { PanelParamsProvider, PanelStateProvider, SingleQuotePanel, usePanelParams, usePanelState } from './Panel';
import { QuoteOperProvider } from './QuoteOper/QuoteOperProvider';
import { LOGGER_FLOW_NAME, LOGGER_TRACE_FIELD, QuoteFooterFlagsYield } from './constants';
import { useOpacity } from './hooks/useOpacity';
import { FlagValueProvider } from './providers/FlagProvider';
import { FocusProvider } from './providers/FocusProvider';
import { ParsingUploadProvider } from './providers/ParsingUploadProvider';
import { SearchConnectorProvider } from './providers/SearchConnectorProvider';
import { SingleQuoteDialogContext } from './types';
import {
  filterServerNil,
  getDefaultBroker,
  getDefaultInst,
  getDefaultTraderWithTag,
  transform2TraderWithTag
} from './utils';

const Inner = () => {
  const { defaultParams } = usePanelParams();
  const { productType } = useProductParams();
  const { actionMode, focusInput } = defaultParams;

  const [defaultInst] = useState(() => getDefaultInst(actionMode, defaultParams?.defaultValue?.inst_info));
  const [defaultTrader] = useState(() => getDefaultTraderWithTag(actionMode, defaultParams?.defaultValue?.trader_info));
  const [defaultBroker] = useState(() => getDefaultBroker(actionMode, defaultParams?.defaultValue?.broker_info));

  const [defaultPriceValue] = useState(() => {
    const filteredPriceValue = filterServerNil(defaultParams?.defaultValue);

    const quote_type = filteredPriceValue?.quote_type || BondQuoteType.Yield;
    const quote_price = (filteredPriceValue?.quote_price || '').toString();
    return {
      quote_type,
      flag_intention: filteredPriceValue?.flag_intention,
      flag_rebate: filteredPriceValue?.flag_rebate,
      return_point: filteredPriceValue?.return_point ? filteredPriceValue.return_point.toString() : undefined,
      quote_price
    };
  });

  const [defaultFilteredQuote] = useState(() => filterServerNil(defaultParams?.defaultValue));

  useOpacity();

  /** 初始化时关闭倒挂提示窗口 */
  useLayoutEffect(() => {
    ModalUtils.destroyAll();
    message.destroy();
  }, []);
  const InstTraderSearchProps = {
    productType,
    defaultValue: transform2TraderWithTag(defaultTrader, defaultInst)
  };
  const QuoteOperProps = {
    mode: defaultParams.actionMode,
    quote: defaultFilteredQuote,
    showParseLiqSpeed: true
  };

  return (
    <FlagValueProvider
      initialState={{ value: pick(defaultParams?.defaultValue, QuoteFooterFlagsYield), mode: defaultParams.actionMode }}
    >
      <ParsingUploadProvider>
        <BondSearchProvider initialState={{ productType, defaultValue: defaultParams?.defaultValue?.bond_basic_info }}>
          <InstTraderSearchProvider initialState={InstTraderSearchProps}>
            <TraderPreferenceProvider>
              <BrokerSearchProvider initialState={{ productType, defaultValue: defaultBroker }}>
                <CPBSearchConnectorProvider initialState={{ productType }}>
                  <PriceGroupProvider
                    initialState={{ defaultValue: defaultPriceValue, side: defaultParams.defaultValue?.side }}
                  >
                    <FocusProvider initialState={{ focusInput }}>
                      <QuoteOperProvider initialState={QuoteOperProps}>
                        <SearchConnectorProvider>
                          <SingleQuotePanel />
                        </SearchConnectorProvider>
                      </QuoteOperProvider>
                    </FocusProvider>
                  </PriceGroupProvider>
                </CPBSearchConnectorProvider>
              </BrokerSearchProvider>
            </TraderPreferenceProvider>
          </InstTraderSearchProvider>
        </BondSearchProvider>
      </ParsingUploadProvider>
    </FlagValueProvider>
  );
};

const Wrapper = () => {
  const { defaultParams } = usePanelParams();
  const { panelState } = usePanelState();
  const context = useContext<SingleQuoteDialogContext>(DialogContext);
  const traceId = useRef(uuidv4());
  const { productType } = useProductParams();

  if (!context) return null;
  if (!productType) return null;

  /** 使用 key 重置整个面板状态 */
  const key = `${defaultParams?.defaultValue?.quote_id}_${defaultParams?.defaultValue?.bond_basic_info?.code_market}_${defaultParams?.defaultValue?.update_time}_${panelState.lastActionTime}_${defaultParams.actionMode}_${defaultParams?.focusInput}`;

  return (
    <FlowLoggerProvider
      key={key}
      initialState={{
        traceId: traceId.current,
        traceField: LOGGER_TRACE_FIELD,
        flowName: LOGGER_FLOW_NAME
      }}
    >
      <Inner />
    </FlowLoggerProvider>
  );
};

const SingleQuote = () => {
  const dialogLayout = useDialogLayout();

  if (!dialogLayout) return null;

  return (
    <PanelParamsProvider>
      <PanelStateProvider>
        <Wrapper />
      </PanelStateProvider>
    </PanelParamsProvider>
  );
};

export default SingleQuote;
