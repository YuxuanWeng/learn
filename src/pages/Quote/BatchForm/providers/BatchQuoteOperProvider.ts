import { useRef, useState } from 'react';
import { Side } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { QuoteComponentRef } from '@/components/business/Quote';
import { QuoteFlags } from '@/pages/Quote/SingleQuote/QuoteOper/types';
import useUnit from '@/pages/Quote/SingleQuote/hooks/useUnit';
import { ValuationInfo } from '../components/BatchQuoteOper/types';

const BatchQuoteOperContainer = createContainer(() => {
  const priceRef = useRef<QuoteComponentRef>(null);
  const valuationRef = useRef<HTMLInputElement>(null);

  const [selectedSide, setSelectedSide] = useState<Side>();
  const [flagsInfo, updateFlagsInfo] = useImmer<QuoteFlags>({});
  const [valuationInfo, updateValuationInfo] = useImmer<ValuationInfo>({ value: '' });
  const [volume, setVolume] = useState('');

  const { unit, updateUnit } = useUnit();

  const resetValuationInfo = () => {
    updateValuationInfo(draft => {
      draft.val = false;
      draft.csi = false;
      draft.value = '';
    });
  };

  return {
    priceRef,
    valuationRef,

    selectedSide,
    setSelectedSide,
    flagsInfo,
    updateFlagsInfo,
    valuationInfo,
    volume,
    setVolume,
    updateValuationInfo,
    resetValuationInfo,
    unit,
    updateUnit
  };
});

export const BatchQuoteOperProvider = BatchQuoteOperContainer.Provider;
export const useBatchQuoteOper = BatchQuoteOperContainer.useContainer;
