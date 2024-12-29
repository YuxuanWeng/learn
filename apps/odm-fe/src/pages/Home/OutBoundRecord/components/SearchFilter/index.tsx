import { MarketNotifyMsgTypeOptions, MarketNotifySorOptions } from '@fepkg/business/constants/options';
import { Button } from '@fepkg/components/Button';
import { RadioGroup } from '@fepkg/components/Radio';
import { Select } from '@fepkg/components/Select';
import { IconRefresh } from '@fepkg/icon-park-react';
import { Acceptor, MarketNotifyMsgType } from '@fepkg/services/types/bds-enum';
import { useHomeLayout } from '@/providers/LayoutProvider';
import { useNotify } from '@/providers/NotifyProvider';
import { isUndefined } from 'lodash-es';
import { ProductOption, SorProductOption } from '@/pages/Home/constants';
import { RangePicker } from '../RangePicker';

const OptionEnumRange = {
  [Acceptor.AcceptorNone]: void 0,
  [Acceptor.AcceptorWind]: { msgType: MarketNotifyMsgTypeOptions, product: ProductOption },
  [Acceptor.AcceptorSor]: { msgType: MarketNotifySorOptions, product: SorProductOption }
};

export const SearchFilter = () => {
  const { params, onFilterChange, resetParams } = useNotify();
  const { current } = useHomeLayout();
  const options = OptionEnumRange[current];

  return (
    <div className="flex items-center overflow-x-hidden hover:overflow-x-scroll hover:pb-2 py-4 mx-4 gap-x-4">
      <Select
        className="w-60 flex-shrink-0 bg-gray-800"
        label="业务产品"
        placeholder="不限"
        multiple
        value={params.product_type ?? []}
        options={options?.product}
        onChange={val => onFilterChange({ product_type: val })}
      />

      <div className="flex items-center flex-shrink-0 max-w-[558px] h-8  px-3 gap-x-3  bg-gray-800 rounded-lg">
        <div className="w-[70px] text-sm font-medium text-gray-200">消息类型:</div>
        <RadioGroup
          value={
            isUndefined(params.market_notify_msg_type)
              ? [MarketNotifyMsgType.MarketNotifyMsgTypeNone]
              : [params.market_notify_msg_type]
          }
          onChange={val => {
            const type = val[0] as MarketNotifyMsgType;
            const market_notify_msg_type = type === MarketNotifyMsgType.MarketNotifyMsgTypeNone ? undefined : type;
            onFilterChange({ market_notify_msg_type });
          }}
          className="flex-wrap !gap-3 [&_.s-radio-wrapper] whitespace-nowrap"
          type="radio"
          options={options?.msgType}
        />
      </div>

      <RangePicker />
      <Button
        type="gray"
        plain
        icon={<IconRefresh />}
        onClick={resetParams}
      >
        清空条件
      </Button>
    </div>
  );
};
