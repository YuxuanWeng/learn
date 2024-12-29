import { useLocation } from 'react-router-dom';
import { useProductParams } from '@/hooks/useProductParams';
import { useQuery } from '@tanstack/react-query';
import { getAllRule } from '@/common/services/api/approval/rule';

export const useRuleSettingList = () => {
  const { productType } = useProductParams();
  const location = useLocation();

  return useQuery({
    queryKey: ['useRuleSettingList', productType, location.pathname],
    queryFn: ({ signal }) => getAllRule(productType, { signal }),
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 15000,
    select: res => {
      return res?.rule_list;
    }
  });
};
