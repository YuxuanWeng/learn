import type { ParsingDealInfo } from '@fepkg/services/types/parsing/deal-info';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'usehooks-ts';
import { fetchParsingDealInfo } from '@/common/services/api/parsing/deal-Info';
import { useProductParams } from '@/layouts/Home/hooks';

export const getParsingDealInfoQueryKey = (text, productType) => ['useParsingDealInfo', text, productType] as const;

export const parsingDealInfoQueryFn: QueryFunction<
  ParsingDealInfo.Response | undefined,
  ReturnType<typeof getParsingDealInfoQueryKey>
> = ({ queryKey, signal }) => {
  const [, text, productType] = queryKey;
  if (!text) return undefined;
  return fetchParsingDealInfo({ user_input: text, product_type: productType }, { signal });
};

export const useParsingDealInfo = (text: string, enabled = true) => {
  const { productType } = useProductParams();

  const debounceText = useDebounce(text);

  return useQuery({
    queryKey: getParsingDealInfoQueryKey(text ? debounceText || text : text, productType),
    queryFn: parsingDealInfoQueryFn,
    refetchOnWindowFocus: false,
    staleTime: 60000,
    enabled,
    keepPreviousData: true,
    select: res => {
      return res?.deal_list?.filter(i => i.bond_basic?.key_market) ?? [];
    }
  });
};
