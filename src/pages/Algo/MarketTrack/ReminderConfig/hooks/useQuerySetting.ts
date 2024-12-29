import { APIs } from '@fepkg/services/apis';
import { OppositePriceNotificationSetting } from '@fepkg/services/types/bds-common';
import { useQuery } from '@tanstack/react-query';
import { fetchOppositePriceNotificationSetting } from '@/common/services/api/opposite-price-notification/setting-get';
import { useProductParams } from '@/layouts/Home/hooks';

export const useQuerySetting = () => {
  const { productType } = useProductParams();
  return useQuery({
    queryKey: [APIs.oppositePriceNotification.setting.get],
    queryFn: async ({ signal }) => {
      const response = await fetchOppositePriceNotificationSetting({ product_type: productType }, { signal });
      return response.setting as OppositePriceNotificationSetting;
    },
    refetchOnWindowFocus: false
  });
};
