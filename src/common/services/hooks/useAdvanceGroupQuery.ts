import { useEffect } from 'react';
import { parseJSON } from '@fepkg/common/utils/utils';
import { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { FilterGroup } from '@fepkg/services/types/bds-common';
import { UserSettingFilterGroupGet } from '@fepkg/services/types/user/setting-filter-group-get';
import { QueryFunction, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { GroupQuickFilterValue } from '@/components/BondFilter/QuickFilter/types';
import { BondIssueInfoFilterValue, GeneralFilterValue } from '@/components/BondFilter/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { getFilterGroup } from '../api/user/user-setting-get-filter-group';

type ConfigFetchData = RequestResponse<UserSettingFilterGroupGet.Response>;

type FilterGroupDesc = {
  generalFilterValue?: GeneralFilterValue;
  quicklyFilterValue?: GroupQuickFilterValue;
  bondIssueInfoFilterValue?: BondIssueInfoFilterValue;
};

export type FilterGroupsStruct = {
  groupId: string;
  groupName: string;
} & FilterGroupDesc;

const transformGroups = (groups: FilterGroup[]) => {
  return groups.map(v => ({
    groupId: v.group_id ?? '',
    groupName: v.group_name ?? '',
    generalFilterValue: parseJSON<FilterGroupDesc>(v.desc ?? '{}')?.generalFilterValue,
    quicklyFilterValue: parseJSON<FilterGroupDesc>(v.desc ?? '{}')?.quicklyFilterValue,
    bondIssueInfoFilterValue: parseJSON<FilterGroupDesc>(v.desc ?? '{}')?.bondIssueInfoFilterValue
  }));
};

export const useAdvanceGroupQuery = <TSelectData = FilterGroupsStruct[]>(
  requestConfig?: RequestConfig,
  queryOptions?: Omit<UseQueryOptions<ConfigFetchData, unknown, TSelectData>, 'queryKey' | 'queryFn'>
) => {
  const { productType } = useProductParams();
  const enabled = productType === ProductType.NCD || productType === ProductType.BCO;

  const queryKey = [APIs.user.setting.getFilterGroup, productType] as const;
  const queryFn: QueryFunction<ConfigFetchData> = ({ signal }) =>
    getFilterGroup(
      { product_type: productType === ProductType.BCO ? ProductType.BCO : undefined },
      { ...requestConfig, signal }
    );

  const query = useQuery<ConfigFetchData, unknown, TSelectData>({
    queryKey,
    ...queryOptions,
    queryFn,
    select: queryOptions?.select ?? (data => transformGroups(data.filter_group_list ?? []) as unknown as TSelectData),
    enabled
  });

  useEffect(() => {
    const { on } = window.Broadcast;
    const off = on(BroadcastChannelEnum.BROADCAST_ADVANCE_GROUP_CHANGE, query.refetch);
    return () => {
      off();
    };
  }, [query.refetch]);

  return query;
};
