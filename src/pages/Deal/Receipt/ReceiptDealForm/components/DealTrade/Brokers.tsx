import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconAdd, IconMinus } from '@fepkg/icon-park-react';
import { BrokerSearch, BrokerSearchProvider, useBrokerSearch } from '@/components/business/Search/BrokerSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { MAX_BROKERS_LENGTH, useReceiptDealTrades } from '../../providers/TradesProvider';
import { SideType } from '../../types';

const brokerKeyArr = ['broker', 'broker_b', 'broker_c', 'broker_d'] as const;

const SearchInner = ({ side, index }: { side: SideType; index: number }) => {
  const { formDisabled } = useReceiptDealForm();
  const { updateBrokers, traderInfoError, setTraderInfoError } = useReceiptDealTrades();
  const { updateBrokerSearchState } = useBrokerSearch();
  const brokerKey = brokerKeyArr[index];

  return (
    <BrokerSearch
      className="w-[224px] h-7"
      disabled={formDisabled}
      error={traderInfoError[side]?.[brokerKey]}
      onChange={opt => {
        updateBrokerSearchState(draft => {
          draft.selected = opt ?? null;
        });

        if (opt) {
          setTraderInfoError(draft => {
            draft[side] = { [brokerKey]: false };
          });
        }

        updateBrokers(draft => {
          draft[side][index].broker = opt?.original;
        });
      }}
    />
  );
};

export const Brokers = ({ side }: { side: SideType }) => {
  const { productType } = useProductParams();
  const { formDisabled } = useReceiptDealForm();
  const { brokers, addBroker, deleteBroker, updateBrokeragePercent, traderInfoError } = useReceiptDealTrades();

  /** 不需要联动的 broker search 数据源 */
  const [_, ...otrBrokers] = brokers[side];

  const showDelete = !formDisabled;

  const count = otrBrokers.length;
  if (!count) return null;

  return otrBrokers.map((item, idx) => {
    /** 在原 brokers 数组中的索引 */
    const originalIdx = idx + 1;

    const showAdd = !formDisabled && originalIdx === count && originalIdx < MAX_BROKERS_LENGTH - 1;
    const defaultValue = brokers[side][originalIdx]?.broker;

    return (
      <div
        key={item.key}
        className="flex gap-1 h-7 ml-9"
      >
        <BrokerSearchProvider initialState={{ productType, defaultValue }}>
          <SearchInner
            side={side}
            index={originalIdx}
          />
        </BrokerSearchProvider>

        <Input
          error={traderInfoError?.[side]?.brokeragePercent}
          className="h-7 w-12"
          padding={[3, 8]}
          disabled={formDisabled}
          clearIcon={null}
          value={item.percent?.toString() ?? ''}
          onChange={val => updateBrokeragePercent(side, originalIdx, val)}
        />

        {showDelete && (
          <Button.Icon
            className="w-7 h-7"
            disabled={formDisabled}
            icon={<IconMinus />}
            onClick={() => deleteBroker(side, originalIdx)}
          />
        )}

        {showAdd && (
          <Button.Icon
            className="w-7 h-7"
            disabled={formDisabled}
            icon={<IconAdd />}
            onClick={() => addBroker(side)}
          />
        )}
      </div>
    );
  });
};
