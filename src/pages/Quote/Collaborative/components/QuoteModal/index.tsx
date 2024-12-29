import { useRef, useState } from 'react';
import { BondSearchProvider, useBondSearch } from '@fepkg/business/components/Search/BondSearch';
import { hasOption } from '@fepkg/business/utils/bond';
import { BondQuoteType, ExerciseType, Side } from '@fepkg/services/types/enum';
import { useAtomValue } from 'jotai';
import { pick } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { FlowLoggerProvider } from '@/common/providers/FlowLoggerProvider';
import { CalcBodyProvider } from '@/components/business/Calc/Body';
import { CalcFooterProvider } from '@/components/business/Calc/Footer';
import { CalcBodyYield, CalcFooterFlagValueYield } from '@/components/business/Calc/constants';
import { ExerciseProvider } from '@/components/business/ExerciseGroup/provider';
import { transFormExerciseToEnum } from '@/components/business/ExerciseGroup/utils';
import { PriceGroupProvider } from '@/components/business/PriceGroup';
import { BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import { InstTraderSearchProvider } from '@/components/business/Search/InstTraderSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { QuoteOperProvider, useQuoteOper } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { FlagValueProvider } from '@/pages/Quote/SingleQuote/providers/FlagProvider';
import { FocusProvider } from '@/pages/Quote/SingleQuote/providers/FocusProvider';
import { ParsingUploadProvider } from '@/pages/Quote/SingleQuote/providers/ParsingUploadProvider';
import { QuoteActionMode } from '@/pages/Quote/SingleQuote/types';
import { filterServerNil } from '@/pages/Quote/SingleQuote/utils';
import { quoteMdlFocusInputAtom, quoteMdlOpenAtom, quoteMdlSelectedAtom } from '../../atoms/modal';
import { QuoteModalPanel } from './components/Panel';

const LOGGER_TRACE_FIELD = 'collaborativeQuoteQuoteTraceId';
const LOGGER_FLOW_NAME = 'collaborative-quote-quote';

const Inner = () => {
  const { productType } = useProductParams();
  const { bondSearchState } = useBondSearch();
  const { calc, side, priceInfo, disabled } = useQuoteOper();

  const selected = useAtomValue(quoteMdlSelectedAtom);
  const { details = [] } = selected ?? {};
  const [selectedDetail] = details;

  let currentSide = Side.SideNone;
  if (disabled[Side.SideBid]) currentSide = Side.SideOfr;
  if (disabled[Side.SideOfr]) currentSide = Side.SideBid;

  const [defaultCalcValue] = useState(() => pick(calc[currentSide], CalcBodyYield));
  const [defaultFlagValue] = useState(() => pick(calc[currentSide], CalcFooterFlagValueYield));

  const quoteType = priceInfo[side]?.quote_type;
  const hasOptionBond = hasOption(bondSearchState.selected?.original);
  const { exercise_manual, is_exercise = null } = selectedDetail ?? {};
  const defaultExerciseType = exercise_manual ? transFormExerciseToEnum(is_exercise) : ExerciseType.ExerciseTypeNone;

  return (
    // 因为要取 QuoteOperProvider 上下文内的值作为默认值，所以以下两个 Provider 需放置在 Inner 内
    <CalcBodyProvider initialState={{ productType, bond: selectedDetail?.bond_info, defaultValue: defaultCalcValue }}>
      <CalcFooterProvider
        initialState={{ defaultValue: { comment: selectedDetail?.comment ?? '', flagValue: defaultFlagValue } }}
      >
        {/* 因为要取 QuoteOperProvider 上下文内的值作为默认值，所以以上两个 Provider 需放置在 Inner 内 */}
        <ExerciseProvider
          {...{
            hasBond: !!bondSearchState.selected?.original,
            productType,
            quoteType,
            isHasOption: hasOptionBond,
            defaultValue: defaultExerciseType
          }}
        >
          <QuoteModalPanel />
        </ExerciseProvider>
      </CalcFooterProvider>
    </CalcBodyProvider>
  );
};

const Wrapper = () => {
  const { productType } = useProductParams();

  const traceId = useRef(uuidv4());

  const selected = useAtomValue(quoteMdlSelectedAtom);
  const focusInput = useAtomValue(quoteMdlFocusInputAtom);

  const { details = [] } = selected ?? {};
  const [selectedDetail] = details;

  const [defaultPriceValue] = useState(() => {
    const filteredPriceValue = filterServerNil(selectedDetail);

    const quote_type = filteredPriceValue?.quote_type || BondQuoteType.Yield;
    const quote_price = selectedDetail?.price ? selectedDetail.price.toString() : '';

    return {
      quote_type,
      flag_intention: filteredPriceValue?.flag_intention,
      flag_rebate: filteredPriceValue?.flag_rebate,
      return_point: filteredPriceValue?.return_point ? filteredPriceValue.return_point.toString() : undefined,
      quote_price
    };
  });

  const [defaultFilteredQuote] = useState(() => filterServerNil(selectedDetail));

  return (
    <FlowLoggerProvider
      initialState={{
        traceId: traceId.current,
        traceField: LOGGER_TRACE_FIELD,
        flowName: LOGGER_FLOW_NAME
      }}
    >
      <FlagValueProvider
        initialState={{
          value: { flag_internal: selectedDetail?.flag_internal, flag_urgent: selectedDetail?.flag_urgent }
        }}
      >
        <ParsingUploadProvider>
          <BondSearchProvider initialState={{ productType, defaultValue: selectedDetail?.bond_info }}>
            {/* 以下 2 个 Provider 无实际业务意义，但由于 FocusProvider 中有依赖关系，所以引入 */}
            <InstTraderSearchProvider initialState={{ productType }}>
              <BrokerSearchProvider initialState={{ productType }}>
                {/* 以上 2 个 Provider 无实际业务意义，但由于 FocusProvider 中有依赖关系，所以引入  */}
                <PriceGroupProvider initialState={{ defaultValue: defaultPriceValue, side: selectedDetail?.side }}>
                  <FocusProvider initialState={{ focusInput }}>
                    <QuoteOperProvider
                      initialState={{
                        quote: {
                          side: Side.SideBid,
                          ...defaultFilteredQuote,
                          bond_info: undefined,
                          bond_basic_info: defaultFilteredQuote?.bond_info
                        },
                        mode: QuoteActionMode.EDIT
                      }}
                    >
                      <Inner />
                    </QuoteOperProvider>
                  </FocusProvider>
                </PriceGroupProvider>
              </BrokerSearchProvider>
            </InstTraderSearchProvider>
          </BondSearchProvider>
        </ParsingUploadProvider>
      </FlagValueProvider>
    </FlowLoggerProvider>
  );
};

export const QuoteModal = () => {
  const open = useAtomValue(quoteMdlOpenAtom);

  if (!open) return null;

  return <Wrapper />;
};
