import { forwardRef, useRef, useState } from 'react';
import { Input, InputProps } from '@fepkg/components/Input';
import { IconSearch } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';
import { useMergeRefs } from '@floating-ui/react';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';

type SearchInputProps = {
  onChange?: (response: InstitutionTiny[]) => void;
  size?: InputProps['size'];
  placeholder?: string;
  className?: string;
  containerCls?: string;
  productType: number;
  filter?: (data: InstitutionTiny[]) => InstitutionTiny[];
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onChange, containerCls = '', size, placeholder = '输入机构名称搜索', className, productType, filter }, ref) => {
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

    const previousData = useRef<InstitutionTiny[]>();
    const { refetch } = useFuzzySearchQuery<InstFuzzySearch.Response, InstFuzzySearch.Request>({
      api: APIs.inst.fuzzySearch,
      keyword,
      searchParams: {
        with_biz_short_name: true,
        product_type: productType,
        count: 200
      },
      onlyRemoteQuery: true,
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
        const filterData = filter ? filter(data.list) : data.list;
        onChange?.(filterData ?? []);
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
          onEnterPress={(_, evt) => {
            evt.stopPropagation();
            refetch();
          }}
        />
      </div>
    );
  }
);
