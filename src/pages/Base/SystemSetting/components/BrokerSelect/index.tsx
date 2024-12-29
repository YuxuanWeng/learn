import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Search } from '@fepkg/components/Search';
import { IconDelete, IconDown } from '@fepkg/icon-park-react';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { useBrokerOptions } from '../QuoteSettings/components/TeamWork/useBrokerOptions';
import { BrokerObj, IBrokerInfo } from '../QuoteSettings/types';

type BrokerSelectProps = {
  value: IBrokerInfo;
  deleteFlag: boolean;
  brokerList: IBrokerInfo[];
  onChange: (params?: IBrokerInfo) => void;
};

const BrokerSelect = ({ value, onChange, deleteFlag, brokerList }: BrokerSelectProps) => {
  const { productType } = useProductParams();

  const [keyword, setKeyword] = useState(value?.brokerName ?? '');
  const operator = miscStorage.userInfo?.user_id;

  const { data: brokerOptions = [] } = useBrokerOptions({
    productType,
    keyword
  });

  const selected = brokerOptions.find(i => i.value === value.brokerId) ?? null;

  const listId = new Set(brokerList.map(v => v.brokerId));
  const filterBrokerOptions = brokerOptions.filter(v => !listId.has(String(v.value)) && String(v.value) !== operator);

  return (
    <div className="group flex items-center w-[280px] relative">
      <Search<BrokerObj>
        className="h-7"
        label="Broker"
        suffixIcon={<IconDown />}
        value={selected}
        destroyOnClose
        options={filterBrokerOptions}
        inputValue={keyword}
        onInputChange={setKeyword}
        onChange={option => {
          if (option && !brokerList.map(item => item.brokerId).includes(String(option?.original?.brokerId))) {
            onChange({
              id: value.id,
              brokerId: String(option?.original?.brokerId),
              brokerName: String(option?.original?.brokerName)
            });
          } else {
            onChange({
              id: value.id
            });
          }
        }}
        onBlur={() => {
          // 未选择到broker则清空输入框文字
          if (!selected) {
            setKeyword('');
          }
        }}
      />
      {deleteFlag && (
        <Button.Icon
          text
          icon={<IconDelete />}
          className="opacity-0 group-hover:opacity-100 absolute w-7 h-7 right-[-32px]"
          onClick={() => {
            onChange();
          }}
        />
      )}
    </div>
  );
};

export default BrokerSelect;
