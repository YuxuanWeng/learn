import { InstSearch } from '@fepkg/business/components/Search/InstSearch';
import { Side } from '@fepkg/services/types/enum';
import { BrokerSearch } from '@/components/business/Search/BrokerSearch';
import { TraderSearch } from '@/components/business/Search/TraderSearch';
import { useITBSearchConnector } from '@/components/business/Search/providers/ITBSearchConnectorProvider';
import { useMarketDealTrades } from '@/pages/Deal/Market/MarketDealForm/providers/MarketTradesProvider';
import { ITBProviderWrapper } from '@/pages/Deal/Receipt/ReceiptDealForm/providers/ITBWrapper';
import { SideType } from '@/pages/Deal/Receipt/ReceiptDealForm/types';

type MarketDealTradeProps = {
  side: SideType;
};

const SearchInner = ({ side }: { side: SideType }) => {
  const { updateTrades } = useMarketDealTrades();
  const { handleInstChange, handleTraderChange, handleBrokerChange } = useITBSearchConnector();

  const sideText = side === Side.SideBid ? 'B' : 'O';

  return (
    <div className="flex-1 p-3 flex flex-col gap-y-2 bg-gray-800 border border-solid rounded-lg border-gray-600">
      <InstSearch
        label={`机构(${sideText})`}
        className="h-7"
        placeholder="请选择"
        onChange={opt => {
          handleInstChange(opt, (i, t, b) => {
            updateTrades(draft => {
              draft[side].institution_id = i?.inst_id;
              draft[side].trader_id = t?.trader_id;
              draft[side].broker_id = b?.user_id;
            });
          });
        }}
      />
      <TraderSearch
        label={`交易员(${sideText})`}
        className="h-7"
        searchParams={{ need_area: true }}
        onChange={opt => {
          handleTraderChange(opt, undefined, (i, t, b) => {
            updateTrades(draft => {
              draft[side].institution_id = i?.inst_id;
              draft[side].trader_id = t?.trader_id;
              draft[side].broker_id = b?.user_id;
            });
          });
        }}
      />
      <BrokerSearch
        label={`经纪人(${sideText})`}
        className="h-7"
        onChange={opt => {
          handleBrokerChange(opt);
          updateTrades(draft => {
            draft[side].broker_id = opt?.original.user_id;
          });
        }}
      />
    </div>
  );
};

export const MarketDealTrade = ({ side }: MarketDealTradeProps) => {
  const { defaultTrades } = useMarketDealTrades();

  return (
    <ITBProviderWrapper
      defaultValue={{
        inst: defaultTrades[side]?.inst,
        trader: defaultTrades[side]?.trader,
        broker: defaultTrades[side]?.broker
      }}
    >
      <SearchInner side={side} />
    </ITBProviderWrapper>
  );
};
