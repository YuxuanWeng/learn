import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { QuoteFlag, QuoteFlagValue } from '../QuoteOper/types';
import { QuoteActionMode } from '../types';

export const FlagValueContainer = createContainer((initialState?: QuoteFlag) => {
  const [flagValue, updateFlagValue] = useImmer<QuoteFlagValue>(() => {
    if (initialState?.mode === QuoteActionMode.JOIN) return {};
    return initialState?.value ?? {};
  });
  return { flagValue, updateFlagValue };
});

export const FlagValueProvider = FlagValueContainer.Provider;
export const useFlagValue = FlagValueContainer.useContainer;
