import { StatusCode } from '@fepkg/request/types';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import type { LocalDealRecordList } from '@fepkg/services/types/data-localization-manual/deal-info/record-list';
import { captureMessage } from '@sentry/react';
import { fetchLocalDealRecordList } from '@/common/services/api/data-localization-manual/deal-info/record-list';

export const fetchDealRecordList = async (
  observer_id: string,
  product_type: ProductType,
  broker_list: string[],
  deal_time?: string
): Promise<LocalDealRecordList.Response | undefined> => {
  try {
    if (!broker_list?.length) {
      return undefined;
    }

    const value = await fetchLocalDealRecordList({
      product_type,
      broker_list: broker_list ?? [],
      deal_time,
      observer_id,
      type: 'create'
    });

    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('fetchLocalDealRecordList', { extra: value });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }
    return value;
  } catch (err) {
    return await Promise.reject(err);
  }
};
