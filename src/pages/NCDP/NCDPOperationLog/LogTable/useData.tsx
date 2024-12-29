import { MaturityDateTypeMap, RatingMap } from '@fepkg/business/constants/map';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { APIs } from '@fepkg/services/apis';
import { NCDPOperationLog } from '@fepkg/services/types/bds-common';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { getNCDOperationLog } from '@/common/services/api/bond-quote/ncdp-operation-log-get';
import { NCDPInfoFetchData } from '@/common/services/hooks/useNCDPInfoQuery';
import { NCDPTableColumn } from '@/pages/ProductPanel/components/NCDPTable/types';
import { PAGE_SIZE } from '@/pages/Quote/QuoteLog/useOperationLogQuery';
import { transform2IssuerDateContent } from '@/common/services/api/bond-quote/ncdp-search';

type Props = {
  ncdpId: string;
  page: number;
  referred: boolean;
};

const transformTableColumn = (referred: boolean, original: NCDPOperationLog): NCDPTableColumn => {
  const { issuer_rating_current, issuer_type, issuer_date, maturity_date } = original.ncdp_snapshot;

  const rating = RatingMap[issuer_rating_current];
  const issuerDate = transform2IssuerDateContent(referred, issuer_type, issuer_date);
  const maturityDate = MaturityDateTypeMap[maturity_date];
  const operationType = original.operation_type;
  const createTime = transform2DateContent(original.create_time, 'YYYY-MM-DD HH:mm:ss.SSS');
  return {
    original: { ...original.ncdp_snapshot, log_id: original.log_id },
    rating,
    issuerDate,
    maturityDate,
    createTime,
    operationType
  };
};

const getQueryKey = (id: string, page: number, referred: boolean) => {
  return [APIs.bondQuote.getOperationLog, id, page, referred] as const;
};

const queryFn: QueryFunction<NCDPInfoFetchData, ReturnType<typeof getQueryKey>> = async ({ signal, queryKey }) => {
  const [_, ncdp_id, page, referred] = queryKey;

  try {
    const { log_list = [], total } = await getNCDOperationLog(
      {
        ncdp_id,
        offset: ((page ?? 1) - 1) * PAGE_SIZE,
        count: PAGE_SIZE
      },
      { signal }
    );
    return { list: log_list.map(item => transformTableColumn(referred, item)), total };
  } catch {
    return { list: [], total: 0 };
  }
};

export const useLogQuery = ({ ncdpId, page, referred }: Props) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: getQueryKey(ncdpId, page, referred),
    queryFn,
    keepPreviousData: true,
    refetchInterval: 2500
  });

  const prefetch = useMemoizedFn((newPage: number) => {
    const queryKey = getQueryKey(ncdpId, newPage, referred);
    queryClient.prefetchQuery(queryKey, queryFn);
  });

  return { data, prefetch };
};
