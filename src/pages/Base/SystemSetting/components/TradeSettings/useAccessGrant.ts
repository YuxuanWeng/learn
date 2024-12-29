import { APIs } from '@fepkg/services/apis';
import { UserLite } from '@fepkg/services/types/bdm-common';
import { UserAccessGrantType } from '@fepkg/services/types/enum';
import { useQuery } from '@tanstack/react-query';
import { getUserAccessGrant } from '@/common/services/api/user/user-access-grant-get';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * 请求当前登录用户的可见经纪人信息
 * 需注意NCD一级使用的是二级的设置，如果后续NCD一级有被授权人设置且没取到值时可以检查一下
 */
export const useAccessGrant = (access: UserAccessGrantType) => {
  const user: UserLite | undefined = miscStorage.userInfo;
  const userId = user?.user_id ?? '';
  const { productType } = useProductParams();

  const data = useQuery({
    queryKey: [APIs.user.getUserAccessGrant, userId, productType] as const,
    queryFn: async ({ signal }) => {
      const result = await getUserAccessGrant(
        {
          product_type: productType,
          grantee_id_list: [userId]
        },
        { signal }
      );
      const granterUsers = (result.access_grant_list?.[0]?.granter_access_list ?? [])
        .filter(i => i.access_grant_list?.includes(access))
        .map(item => item.granter);
      if (user) {
        granterUsers.push(user);
      }
      const grantUserIdList = granterUsers.map(item => item.user_id);
      return { granterUsers, grantUserIdList };
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: false
  });

  return { ...data.data };
};
