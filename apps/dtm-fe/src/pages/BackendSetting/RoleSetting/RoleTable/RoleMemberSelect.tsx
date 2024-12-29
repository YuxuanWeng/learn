import { memo, useMemo, useState } from 'react';
import { Select, SelectOption } from '@fepkg/components/Select';
import { fetchUserList } from '@fepkg/services/api/user/list';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealRoleMember, User } from '@fepkg/services/types/common';
import { Post } from '@fepkg/services/types/enum';
import { UserList } from '@fepkg/services/types/user/list';
import { useProductParams } from '@/hooks/useProductParams';
import { isPostBackstage } from '@/utils/product';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';

export type RoleMemberSelectProps = {
  disabled?: boolean;
  error?: boolean;
  value: ReceiptDealRoleMember[];
  disableOptions?: string[];
  onChange: (val?: ReceiptDealRoleMember[]) => void;
  options?: SelectOption<string>[];
};

const transform2RoleMemberOpt = (user?: User, disableOptions?: string[]) => {
  if (!user) return null;
  return { label: user.name_cn, value: user.user_id, disabled: disableOptions?.includes(user.user_id) };
};

const ROLE_MEMBERS_PAGE_SIZE = 50;

const defaultSearchParams = {
  post_list: [Post.Post_Broker, Post.Post_BrokerAssistant, Post.Post_BrokerTrainee, Post.Post_DI, Post.Post_Backstage],
  count: ROLE_MEMBERS_PAGE_SIZE
};
export const RoleMemberSelect = memo(
  ({ disabled, onChange, value, disableOptions, error, options }: RoleMemberSelectProps) => {
    const [input, setInput] = useState('');
    const { productType } = useProductParams();

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
      queryKey: [APIs.user.list, 'role-member-infinite', input] as const,
      queryFn: async ({ pageParam = 0, signal }: { pageParam?: number; signal?: AbortSignal }) => {
        const searchParams: UserList.Request = {
          keyword: input,
          offset: (pageParam ?? 0) * ROLE_MEMBERS_PAGE_SIZE,
          product_type: productType,
          ...defaultSearchParams
        };

        try {
          const res = await fetchUserList(searchParams, { signal });
          return { ...res, pageParam };
        } catch {
          return { pageParam };
        }
      },
      getNextPageParam(lastPage) {
        const { pageParam, has_more } = lastPage ?? {};
        if (has_more) return pageParam + 1;
        return void 0;
      }
    });

    const handleLoadMore = () => {
      if (isFetchingNextPage) return;
      if (hasNextPage) fetchNextPage();
    };

    const searchOptionsResult = useMemo(() => {
      return (
        data?.pages
          ?.map(page => page?.list)
          .flat()
          .filter(item => {
            // 本场景后台则全台子，非后台区分台子
            if (isPostBackstage(item)) {
              return true;
            }
            return item?.product_list?.some(i => i.product_type === productType);
          }) ?? []
      );
    }, [data?.pages, productType]);

    const selectValue = value?.map(i => i?.member_id);

    const memberSelectOptions = useMemo(() => {
      // 以属性的options为准
      if (options) return options;
      const res = searchOptionsResult ?? [];
      const disableOptionsWithoutSelf = disableOptions?.filter(i => !selectValue?.includes(i)) ?? [];
      const list = res.map(item => transform2RoleMemberOpt(item, disableOptionsWithoutSelf)).filter(Boolean);

      return list;
    }, [searchOptionsResult, disableOptions, selectValue, options]);

    return (
      <Select<string[]>
        search
        error={error}
        multiple
        className="text-gray-000 w-80"
        placeholder="请选择"
        disabled={disabled}
        options={memberSelectOptions}
        selectedOptions={value.map(i => ({ value: i.member_id, label: i.member_name }))}
        inputValue={input}
        value={selectValue ?? []}
        optionFilter={false}
        onInputChange={setInput}
        onChange={(_, __, ___, selectedOpts) => {
          const result =
            selectedOpts?.map(item => {
              return {
                member_id: String(item.value || ''),
                member_name: item?.label
              };
            }) ?? [];
          onChange(result);
        }}
        onLoadMore={handleLoadMore}
      />
    );
  },
  // option滚动后会有几百个选项，此时深比较的开销远小于dom的变更，待Select有虚拟化列表后可删去
  isEqual
);
