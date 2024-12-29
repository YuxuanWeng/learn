import { ReactNode, createContext, useContext } from 'react';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { usePreference } from '@/common/hooks/usePreference';
import { useProductParams } from '@/layouts/Home/hooks';

export const useTraderPreferenceValue = () => {
  const { productType } = useProductParams();
  const key = getLSKey(LSKeys.TraderSelectedPreference, productType);
  return usePreference(key);
};

const TraderPreferenceContext = createContext<ReturnType<typeof useTraderPreferenceValue> | null>(null);

export const TraderPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const value = useTraderPreferenceValue();
  return <TraderPreferenceContext.Provider value={value}>{children}</TraderPreferenceContext.Provider>;
};

export const useTraderPreference = () => useContext(TraderPreferenceContext);
