import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { SearchOption } from '@fepkg/components/Search';
import { Counterparty } from '@fepkg/services/types/common';
import { BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import {
  InstTraderSearch,
  InstTraderSearchProps,
  InstTraderSearchProvider,
  transform2Trader
} from '@/components/business/Search/InstTraderSearch';
import { TraderPreferenceProvider } from '@/components/business/Search/TraderSearch';
import {
  CPBSearchConnectorProvider,
  useCPBSearchConnector
} from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { useProductParams } from '@/layouts/Home/hooks';

type DealInstTraderSearchProps = Omit<InstTraderSearchProps, 'onChange'> & {
  instTrader?: Counterparty;
  error?: boolean;
  onChange: (val?: string) => void;
};

const Inner = ({ autoFocus, disabled, onChange, ...rest }: DealInstTraderSearchProps) => {
  // const { updateInstTraderSearchState } = useInstTraderSearch();
  const { handleInstTraderChange } = useCPBSearchConnector();

  const handleChange = (opt?: SearchOption<TraderWithPref> | null) => {
    handleInstTraderChange(opt);
    // 选中选项后，只要不是清空就请求修改
    if (opt) {
      onChange(opt?.value as string);
    } else {
      onChange(undefined);
    }
  };

  return (
    <InstTraderSearch
      className="bg-gray-800"
      {...rest}
      labelWidth={96}
      autoFocus={autoFocus}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};

export const DealInstTraderSearch = (props: DealInstTraderSearchProps) => {
  const { productType } = useProductParams();

  const { instTrader } = props;
  const key = `${instTrader?.inst?.inst_id}|${instTrader?.trader?.trader_id}|${instTrader?.trader?.trader_tag}`;
  return (
    <InstTraderSearchProvider
      key={key}
      initialState={{
        productType,
        defaultValue: transform2Trader(instTrader)
      }}
    >
      {/* 为了支持机构交易员搜索框首选项高亮 */}
      <TraderPreferenceProvider>
        {/* 为了支持CPBSearchConnectorProvider */}
        <BrokerSearchProvider initialState={{ productType }}>
          {/* 为了支持切换首选项 */}
          <CPBSearchConnectorProvider initialState={{ productType }}>
            <Inner {...props} />
          </CPBSearchConnectorProvider>
        </BrokerSearchProvider>
      </TraderPreferenceProvider>
    </InstTraderSearchProvider>
  );
};
