import { APIs } from '@fepkg/services/apis';
import { Acceptor } from '@fepkg/services/types/bds-enum';
import { useQuery } from '@tanstack/react-query';
import { notifyMsgSearch } from '@/common/services/api/market-notify/msg-search';
import { ColumnFieldsEnum } from '@/common/types/column-fields-enum';
import { TypeSearchFilter } from '../type';
import { dataConvert } from '../utils';

type Props = {
  params: TypeSearchFilter;
  page: number;
  pageSize: number;
  acceptor_id: Acceptor;
  tagList: ColumnFieldsEnum[];
};
export const useDataQuery = ({ params, page, pageSize, acceptor_id, tagList }: Props) => {
  const queryKey = [APIs.receiptDeal.historyDealSearch, page, pageSize, acceptor_id, params] as const;
  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const res = await notifyMsgSearch(
        {
          ...params,
          offset: (page - 1) * pageSize,
          count: pageSize,
          acceptor_id
        },
        {
          signal
        }
      );
      return { list: res.msg_list?.map(msg => dataConvert(msg, tagList)) ?? [], total: res.total ?? 0 };
    },
    keepPreviousData: true,
    enabled: tagList.length > 1
  });
};
