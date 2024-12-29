import { useRef } from 'react';
import { formatDate } from '@fepkg/common/utils/date';
import { useMemoizedFn } from 'ahooks';
import { useImmer } from 'use-immer';
import { dealDateManager } from '../../utils/data-manager/deal-date-manager';
import {
  DealDateMutateEvent,
  DealDateMutationState,
  ResetDealDateMutationParams,
  UseDealDateMutationParams
} from './types';
import {
  changeDeliveryDate,
  changeDeliveryOffset,
  changeTradedDate,
  changeTradedOffset,
  initDealDateState
} from './utils';

export const useDealDateMutation = (params: UseDealDateMutationParams) => {
  const { productType, range = [], rangeMoment = dealDateManager.getDealDateMomentRange(), defaultValue } = params;

  const unlisted = useRef(defaultValue?.unlisted ?? false);
  const today = useRef(formatDate(params?.defaultValue?.today ?? Date.now()));

  const [state, updateState] = useImmer<DealDateMutationState>(() => {
    return initDealDateState({ productType, range, defaultValue: { ...defaultValue, today: today.current } });
  });

  const mutate: DealDateMutateEvent = useMemoizedFn(({ type, date, offset }) => {
    let newState = {} as DealDateMutationState;

    switch (type) {
      case 'traded-date':
        newState = changeTradedDate({
          unlisted: unlisted.current,
          today: today.current,
          range,
          rangeMoment,
          state,
          date
        });
        break;
      case 'traded-date-offset':
        newState = changeTradedOffset({
          unlisted: unlisted.current,
          today: today.current,
          range,
          rangeMoment,
          state,
          offset
        });
        break;
      case 'delivery-date':
        newState = changeDeliveryDate({ range, rangeMoment, state, date });
        break;
      case 'delivery-date-offset':
        newState = changeDeliveryOffset({ range, rangeMoment, state, offset });
        break;
      default:
        break;
    }

    updateState(newState);

    return newState;
  });

  const reset = useMemoizedFn((p: ResetDealDateMutationParams) => {
    unlisted.current = p.defaultValue?.unlisted ?? unlisted.current;
    today.current = formatDate(p.defaultValue?.today ?? today.current);
    const newState = initDealDateState({
      ...p,
      productType: p?.productType ?? productType,
      range,
      rangeMoment,
      defaultValue: { ...p.defaultValue, unlisted: unlisted.current, today: today.current }
    });
    updateState(newState);
  });

  return [state, mutate, reset, today.current] as const;
};
