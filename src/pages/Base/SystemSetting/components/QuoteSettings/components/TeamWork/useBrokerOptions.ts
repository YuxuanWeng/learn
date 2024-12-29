import { SearchOption } from '@fepkg/components/Search';
import { fetchUserList } from '@fepkg/services/api/user/list';
import { APIs } from '@fepkg/services/apis';
import { Post, ProductType } from '@fepkg/services/types/enum';
import type { UserList } from '@fepkg/services/types/user/list';
import { useQuery } from '@tanstack/react-query';
import { BrokerObj } from '../../types';

type IUseBrokerOptions = {
  productType: ProductType;
  keyword: string;
};

export const useBrokerOptions = ({ productType, keyword }: IUseBrokerOptions) => {
  const queryKey = [APIs.user.list, productType, keyword] as const;
  const queryFn = async () => {
    const res = await fetchUserList({
      product_type: productType,
      keyword,
      post_list: [Post.Post_Broker, Post.Post_BrokerAssistant, Post.Post_BrokerTrainee],
      offset: 0,
      count: 500
    });

    return res;
  };

  return useQuery<UserList.Response, unknown, SearchOption<BrokerObj>[]>({
    queryKey,
    queryFn,
    keepPreviousData: true,
    select: data => {
      return (
        data?.list?.map(({ name_cn, user_id }) => {
          return {
            label: name_cn,
            value: user_id,
            original: {
              brokerId: user_id,
              brokerName: name_cn
            }
          };
        }) ?? []
      );
    }
  });
};
