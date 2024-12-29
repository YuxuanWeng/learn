import { UpdatedQuoteFilterGroup } from '@fepkg/services/types/common';
import { isEqual } from 'lodash-es';
import moment, { Moment } from 'moment';
import {
  DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
  DEFAULT_GENERAL_FILTER_VALUE,
  DEFAULT_QUICK_FILTER_VALUE
} from '@/common/constants/filter';
import { QuoteFilterGroupItem } from '@/common/services/hooks/useFilterGroupQuery';
import { GeneralFilterValue } from '@/components/BondFilter/types';
import { RangeInputValue } from '@/components/RangeInput';
import { GroupManageItem, GroupStruct } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { deleteFalsyValue } from '@/pages/ProductPanel/utils';

export function transFilter(filter: GeneralFilterValue): Map<string, any> {
  const newFilter = new Map<string, any>();
  for (const [key, val] of Object.entries(filter)) {
    if (key === 'bond_issue_info_filter') {
      if (filter.bond_issue_info_filter) {
        for (const [innerKey, innerVal] of Object.entries(filter.bond_issue_info_filter)) {
          if (Array.isArray(innerVal)) {
            if (innerVal.length != 0) {
              const array = innerVal as string[];
              newFilter.set(innerKey, [...array].sort());
            }
          }
        }
      }
    } else if (Array.isArray(val)) {
      if (val.length != 0) {
        const array = val as string[];
        newFilter.set(key, [...array].sort());
      }
    }
  }
  return newFilter;
}

/**
 * 转换成上传的结构
 * @param groupManageItem 请求中不变部分
 * @param groupStruct 本地与远端可能不同的部分
 * @param sharedBrokerIdList 分享的IdList
 * @returns
 */
export const transToUpdatedQuoteFilterGroup = (
  groupManageItem: GroupManageItem,
  groupStruct?: GroupStruct,
  sharedBrokerIdList?: string[]
) => {
  const newManageQueryResult = {
    quick_filter: groupStruct?.quickFilter,
    general_filter: groupStruct?.generalFilter,
    bond_issue_info_filter: groupStruct?.bondIssueInfoFilter,
    bond_id_list: groupStruct?.bondIdList,
    custom_sorting: groupStruct?.customSorting,
    advance_outer_quick_filter: groupStruct?.advanceOuterQuickFilter,
    advance_group_ids: groupStruct?.advanceGroupIds
  };
  const newGroup: UpdatedQuoteFilterGroup = {
    group_id: groupManageItem.groupId,
    product_type: groupManageItem.productType,
    group_name: groupManageItem.groupName,
    creator_name: groupManageItem.creatorName,
    shared_broker_id_list: sharedBrokerIdList,
    desc: JSON.stringify(newManageQueryResult)
  };
  return newGroup;
};

// 转换成分组前端主要使用的结构
export const transToGroupManageItem = (
  group?: QuoteFilterGroupItem,
  localGroup?: GroupStruct
): GroupManageItem | undefined => {
  if (!group) return void 0;
  return {
    groupId: group.group_id,
    productType: group.product_type,
    creatorId: group.creator_id,
    groupName: group.group_name,
    creatorName: group.creator_name,
    sharedBrokerList: group.shared_broker_list,
    serverGroup: {
      groupId: group.group_id,
      quickFilter: group.desc?.quick_filter,
      generalFilter: group.desc?.general_filter,
      bondIssueInfoFilter: group.desc?.bond_issue_info_filter,
      bondIdList: group.desc?.bond_id_list,
      customSorting: group.desc?.custom_sorting,
      advanceOuterQuickFilter: group.desc?.advance_outer_quick_filter,
      advanceGroupIds: group.desc?.advance_group_ids
    },
    localGroup
  };
};

// 本地存储内容与远端内容结合，如果是高级模式的存储，只取本地存储的高级部分，反之亦然
export const combineGroupManageItem = (localGroup: GroupStruct, serverGroup: GroupStruct, isAdvance: boolean) => {
  if (isAdvance) {
    return {
      ...serverGroup,
      advanceOuterQuickFilter: localGroup.advanceOuterQuickFilter,
      advanceGroupIds: localGroup.advanceGroupIds
    };
  }
  return {
    ...serverGroup,
    quickFilter: localGroup.quickFilter,
    generalFilter: localGroup.generalFilter,
    bondIssueInfoFilter: localGroup.bondIssueInfoFilter,
    bondIdList: localGroup.bondIdList
  };
};

// 清理一部分内容
export const clearPartOfGroupStruct = (targetGroup: GroupStruct, isAdvance: boolean) => {
  if (isAdvance) {
    return {
      ...targetGroup,
      advanceOuterQuickFilter: DEFAULT_QUICK_FILTER_VALUE,
      advanceGroupIds: []
    };
  }
  return {
    ...targetGroup,
    quickFilter: DEFAULT_QUICK_FILTER_VALUE,
    generalFilter: DEFAULT_GENERAL_FILTER_VALUE,
    bondIssueInfoFilter: DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE,
    bondIdList: []
  };
};

// 回滚一部分内容
export const rollbackPartOfGroupStruct = (targetGroup: GroupStruct, serverGroup: GroupStruct, isAdvance: boolean) => {
  if (isAdvance) {
    return {
      ...targetGroup,
      advanceOuterQuickFilter: serverGroup.advanceOuterQuickFilter,
      advanceGroupIds: serverGroup.advanceGroupIds
    };
  }
  return {
    ...targetGroup,
    quickFilter: serverGroup.quickFilter,
    generalFilter: serverGroup.generalFilter,
    bondIssueInfoFilter: serverGroup.bondIssueInfoFilter,
    bondIdList: serverGroup.bondIdList
  };
};

const filterVoid = <T extends object>(data?: T) => {
  const res: any = {};
  for (const item in data) {
    if (data[item] !== undefined) res[item] = data[item];
  }
  return res as T;
};

export function isNormalGroupEqual(localGroup: GroupStruct, serverGroup: GroupStruct): boolean {
  const transGenFilterA = transFilter(localGroup.generalFilter ?? DEFAULT_GENERAL_FILTER_VALUE);
  const transGenFilterB = transFilter(serverGroup.generalFilter ?? DEFAULT_GENERAL_FILTER_VALUE);
  return (
    isEqual(
      deleteFalsyValue(localGroup.quickFilter ?? DEFAULT_QUICK_FILTER_VALUE),
      deleteFalsyValue(serverGroup.quickFilter ?? DEFAULT_QUICK_FILTER_VALUE)
    ) &&
    isEqual(transGenFilterA, transGenFilterB) &&
    isEqual(
      deleteFalsyValue(localGroup.bondIssueInfoFilter ?? DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE),
      deleteFalsyValue(serverGroup.bondIssueInfoFilter ?? DEFAULT_BOND_ISSUE_INFO_FILTER_VALUE)
    )
  );
}

export function isAdvanceGroupEqual(localGroup: GroupStruct, serverGroup: GroupStruct): boolean {
  return (
    isEqual(
      deleteFalsyValue(localGroup.advanceOuterQuickFilter ?? DEFAULT_QUICK_FILTER_VALUE),
      deleteFalsyValue(serverGroup.advanceOuterQuickFilter ?? DEFAULT_QUICK_FILTER_VALUE)
    ) && isEqual(localGroup.advanceGroupIds ?? [], serverGroup.advanceGroupIds ?? [])
  );
}

/** 判断分组是否相同 */
export function isGroupEqual(localGroup?: GroupStruct, serverGroup?: GroupStruct, isAdvance?: boolean) {
  if (localGroup && serverGroup) {
    if (isAdvance) {
      return isAdvanceGroupEqual(localGroup, serverGroup);
    }
    return isNormalGroupEqual(localGroup, serverGroup);
  }
  return true;
}

export const judgeHasModified = (groupManageItem: GroupManageItem, isAdvance?: boolean) => {
  // 我们组件目前输入跟输出的default值不相同，会导致不能简单用isEqual来判断变没变
  return !isGroupEqual(groupManageItem.localGroup, groupManageItem.serverGroup, isAdvance);
};

// 获取新的行情看板名称
export const getNewName = (name: string, oldNameList: string[]) => {
  let newName = name;
  let num = 1;
  // eslint-disable-next-line @typescript-eslint/no-loop-func
  while (oldNameList.includes(newName)) {
    newName = `${name}(${num})`;
    num++;
  }
  return newName;
};

export const formatGeneralFilter = (data?: GeneralFilterValue): GeneralFilterValue => {
  let new_remain_days_range: RangeInputValue | undefined =
    data?.remain_days_type === 'date' ? ['', ''] : data?.remain_days_range;

  if (data?.remain_days_type === 'date') {
    if (data.remain_days_range?.length) {
      const { remain_days_range } = data;
      new_remain_days_range = [
        remain_days_range[0] ? moment(remain_days_range[0] as Moment).format('YYYY-MM-DD') : '',
        remain_days_range[1] ? moment(remain_days_range[1] as Moment).format('YYYY-MM-DD') : ''
      ];
    }
  }

  return { ...data, remain_days_range: new_remain_days_range ?? ['', ''] };
};
