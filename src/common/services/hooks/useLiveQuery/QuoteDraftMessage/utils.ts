import { StatusCode } from '@fepkg/request/types';
import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { captureMessage } from '@sentry/react';
import { fetchLocalQuoteDraftMessageList } from '@/common/services/api/data-localization-manual/quote-draft-message/list';
import { QuoteDraftMessageListQueryKey } from './types';

export const fetchQuoteDraftMessageList = async (
  observer_id: string,
  params: QuoteDraftMessageListQueryKey[1]
): Promise<LocalQuoteDraftMessageList.Response | undefined> => {
  try {
    const {
      productType: product_type,
      status,
      userId: user_id,
      creatorIdList: creator_list,
      offset,
      count,
      timestamp,
      disabled: observer_disabled
    } = params;

    if (!creator_list || !product_type || offset === undefined || count === undefined) {
      captureMessage('fetchQuoteDraftMessageList params is invalid.', { extra: { params } });
      return await Promise.reject(new Error('params is invalid.'));
    }

    const value = await fetchLocalQuoteDraftMessageList({
      observer_id,
      type: 'create',
      product_type,
      status,
      user_id,
      creator_list,
      offset,
      count,
      timestamp,
      observer_disabled
    });

    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('fetchQuoteDraftMessageList not success.', { extra: { params, value } });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }

    return value;
  } catch (err) {
    captureMessage('fetchQuoteDraftMessageList error.', { extra: { params } });
    return await Promise.reject(err);
  }
};
