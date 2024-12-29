import { RefObject, useEffect, useRef, useState } from 'react';
import { DealQuote } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import { cloneDeep } from 'lodash-es';
import { calcTotalVolume, getUpdatedOrAddedQuoteIds } from '@/components/IDCSpot/utils';

interface IProps {
  optimal: DealQuote;
  quoteList: DealQuote[];
  spotVolRef: RefObject<HTMLInputElement>;
  spotVol?: number;
  dealType: DealType;
  disabled?: boolean;
  setTotal?: (val: number) => void;
}

export default function useRealtimePrice({
  optimal,
  quoteList,
  spotVolRef,
  spotVol,
  dealType,
  disabled,
  setTotal
}: IProps) {
  const isTkn = dealType === DealType.TKN;
  const [submitLabel, setSubmitLabel] = useState(isTkn ? 'TKN' : 'GVN');
  const [prevValidList, setPrevValidList] = useState<DealQuote[]>([]);

  useEffect(
    function priceExpiry() {
      if (!disabled) {
        setPrevValidList(quoteList);
        setTotal?.(calcTotalVolume(quoteList));
      } else requestIdleCallback(() => document.getSelection()?.removeAllRanges());
      if (disabled) {
        setSubmitLabel('价格失效');
      } else {
        setSubmitLabel(isTkn ? 'TKN' : 'GVN');
      }
    },
    [optimal, spotVol, isTkn, quoteList, disabled, setTotal]
  );

  const updatedIds = useRef<DealQuote['quote_id'][]>([]);
  const firstTimeList = useRef<DealQuote[]>([]);
  useEffect(
    function listUpdate() {
      if (!firstTimeList.current?.length) {
        firstTimeList.current = cloneDeep(quoteList);
        return;
      }
      updatedIds.current = getUpdatedOrAddedQuoteIds(firstTimeList.current, quoteList);
      spotVolRef.current?.focus();
      spotVolRef.current?.select();
    },
    [disabled, quoteList, spotVolRef]
  );

  return {
    prevValidList,
    disabled,
    submitLabel,
    updatedIds
  };
}
