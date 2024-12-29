import { QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { QuoteDraftMessageListQueryKey } from '@/common/services/hooks/useLiveQuery/QuoteDraftMessage/types';

export type QuoteDraftMessageListQueryVars = Omit<QuoteDraftMessageListQueryKey[1], 'userId'> & {
  keepPrevious?: boolean;
  onSuccess?: (data: QuoteDraftMessageListQueryResult) => void;
};

export type QuoteDraftMessageListQueryResult = {
  messages: QuoteDraftMessage[];
  total?: number;
  hasMore?: boolean;
  latestCreateTime?: string;
};
