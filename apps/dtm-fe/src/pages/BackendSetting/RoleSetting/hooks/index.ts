import { useLocation } from 'react-router-dom';
import { useProductParams } from '@/hooks/useProductParams';
import { useQuery } from '@tanstack/react-query';
import { getAllRole } from '@/common/services/api/approval/role';

export const useRoleSettingList = (enabled = true) => {
  const { productType } = useProductParams();
  const location = useLocation();

  return useQuery({
    queryKey: ['useRoleSettingList', productType, location.pathname],
    queryFn: ({ signal }) => getAllRole(productType, { signal }),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled,
    cacheTime: 15000,
    select: res => {
      return res?.role_list ?? [];
    }
  });
};
