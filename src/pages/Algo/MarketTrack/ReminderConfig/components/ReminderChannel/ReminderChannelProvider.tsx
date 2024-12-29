import { useState } from 'react';
import { APIs } from '@fepkg/services/apis';
import { useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useDebounce } from 'usehooks-ts';
import { fetchTraderSetting } from '@/common/services/api/opposite-price-notification/trader-setting-get';
import { logDataError } from '@/common/utils/logger/data';
import { useProductParams } from '@/layouts/Home/hooks';

const ReminderChannel = createContainer(() => {
  const [inputValue, setInputValue] = useState('');
  const { productType } = useProductParams();
  const keyword = useDebounce(inputValue, 500);
  const query = useQuery({
    queryKey: [APIs.oppositePriceNotification.traderSetting.get, inputValue ? keyword || inputValue : inputValue],
    queryFn: async ({ signal }) => {
      const { trader_list = [], base_response } = await fetchTraderSetting(
        { keyword, product_type: productType },
        { signal }
      );

      const uniqTraders = uniqBy(trader_list, 'trader_id');
      // 如果有重复数据
      if (uniqTraders.length !== trader_list.length) {
        logDataError({
          api: APIs.oppositePriceNotification.traderSetting.get,
          logName: 'data-duplication',
          traceId: base_response?.trace_id
        });
      }

      return uniqTraders;
    },
    refetchOnWindowFocus: false
  });

  return { handleRefetch: query.refetch, traderSetting: query.data ?? [], inputValue, setInputValue };
});

export const ReminderChannelProvider = ReminderChannel.Provider;
export const useReminderChannel = ReminderChannel.useContainer;
