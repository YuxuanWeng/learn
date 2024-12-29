import { forwardRef, useRef, useState } from 'react';
import { Input, InputProps } from '@fepkg/components/Input';
import { IconSearch } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import { User } from '@fepkg/services/types/common';
import { Post } from '@fepkg/services/types/enum';
import type { UserList } from '@fepkg/services/types/user/list';
import { useMergeRefs } from '@floating-ui/react';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';

type SearchInputProps = {
  onChange?: (response: User[]) => void;
  size?: InputProps['size'];
  placeholder?: string;
  className?: string;
  containerCls?: string;
  productType: number;
  filter?: (data: UserList.Response) => UserList.Response;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange, containerCls = '', size, placeholder = '输入成员姓名搜索', className, productType, filter }, ref) => {
    const focused = useRef(false);
    const [searchContent, setSearchContent] = useState('');
    const [keyword, setKeyword] = useState('');

    const mergedRefs = useMergeRefs([
      ref,
      (node: HTMLInputElement) => {
        if (!focused.current) node?.focus();
        focused.current = true;
      }
    ]);

    const previousData = useRef<User[]>();
    const { refetch } = useFuzzySearchQuery<UserList.Response, UserList.Request>({
      api: APIs.user.list,
      keyword,
      searchParams: {
        product_type: productType,
        post_list: [Post.Post_Broker, Post.Post_BrokerAssistant, Post.Post_BrokerTrainee, Post.Post_DI],
        count: 200
      },
      requestConfig: { hideErrorMessage: true },
      staleTime: 0,
      queryOptions: { notifyOnChangeProps: ['data'], enabled: true },
      queryWhenEmpty: true,
      onSuccess: data => {
        if (!data?.list) {
          onChange?.([]);
          return;
        }
        previousData.current = data?.list;
        const filterData = filter ? filter(data) : data;
        onChange?.(filterData?.list || []);
      }
    });

    return (
      <div className={containerCls}>
        <Input
          ref={mergedRefs}
          size={size}
          placeholder={placeholder}
          value={searchContent}
          padding={[3, 11]}
          suffixIcon={<IconSearch />}
          className={className}
          onChange={text => {
            // 清除非法字符
            let kwd = text;
            kwd = kwd.trim();
            kwd = kwd.replaceAll('\\', '');
            kwd = kwd.replaceAll("'", '');
            kwd = kwd.replaceAll(' ', '');
            setKeyword(kwd);
            setSearchContent(text);
          }}
          onEnterPress={() => refetch()}
        />
      </div>
    );
  }
);
