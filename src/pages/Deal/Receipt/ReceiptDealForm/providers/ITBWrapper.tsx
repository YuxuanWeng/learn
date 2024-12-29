import { Key } from 'react';
import { InstSearchProvider } from '@fepkg/business/components/Search/InstSearch';
import { InstitutionTiny, Trader, User } from '@fepkg/services/types/common';
import { BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import { TraderPreferenceProvider, TraderSearchProvider } from '@/components/business/Search/TraderSearch';
import { ITBSearchConnectorProvider } from '@/components/business/Search/providers/ITBSearchConnectorProvider';
import { useProductParams } from '@/layouts/Home/hooks';

export type ITBProviderWrapperProps = {
  children: React.ReactNode;
  defaultValue?: { inst?: InstitutionTiny; trader?: Trader; broker?: User };
  brokerProviderKey?: Key;
};

export const ITBProviderWrapper = ({ children, defaultValue, brokerProviderKey }: ITBProviderWrapperProps) => {
  const { productType } = useProductParams();
  return (
    <InstSearchProvider initialState={{ productType, defaultValue: defaultValue?.inst }}>
      <TraderSearchProvider
        initialState={{
          productType,
          defaultValue: defaultValue?.trader
        }}
      >
        <TraderPreferenceProvider>
          <BrokerSearchProvider
            key={brokerProviderKey}
            initialState={{ productType, defaultValue: defaultValue?.broker }}
          >
            <ITBSearchConnectorProvider initialState={{ productType }}>{children}</ITBSearchConnectorProvider>
          </BrokerSearchProvider>
        </TraderPreferenceProvider>
      </TraderSearchProvider>
    </InstSearchProvider>
  );
};
