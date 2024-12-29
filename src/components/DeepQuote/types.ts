import { BasicTableColumn } from '@/pages/ProductPanel/components/BasicTable/types';

type PickBasicTableColumnKey =
  | 'original'
  | 'recommendCls'
  | 'volume'
  | 'comment'
  | 'brokerName'
  | 'instName'
  | 'traderName'
  | 'cp';

export type DeepQuoteTableColumn = Pick<BasicTableColumn, PickBasicTableColumnKey> & { isOther?: boolean };
