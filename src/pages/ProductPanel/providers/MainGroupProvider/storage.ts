import { TableSorter } from '@fepkg/components/Table';
import { QuoteSortedField } from '@fepkg/services/types/enum';
import localforage from 'localforage';
import { QuoteFilterGroupItem } from '@/common/services/hooks/useFilterGroupQuery';
import { QuoteFilterValue } from '@/components/BondFilter/types';
import {
  GlobalSearchParams,
  GroupStruct,
  TableCache,
  TableParams
} from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKey } from '@/pages/ProductPanel/types';

export const setGroupStructsToLocalForage = async (storeKey: string, groupStructs: GroupStruct[]) => {
  await localforage.setItem(storeKey, groupStructs);
};

export const getGroupStructsFromLocalForage = async (storeKey: string): Promise<GroupStruct[] | undefined> => {
  try {
    return (await localforage.getItem(storeKey)) as GroupStruct[];
  } catch (e) {
    return undefined;
  }
};

export const setSingleGroupStructToLocalForage = async (storeKey: string, newGroup: GroupStruct) => {
  const localGroups = (await getGroupStructsFromLocalForage(storeKey)) || [];
  const oldLocalGroupIndex = localGroups.findIndex(item => item.groupId === newGroup.groupId);
  if (oldLocalGroupIndex > -1) {
    localGroups[oldLocalGroupIndex] = newGroup;
  } else {
    localGroups.push({ ...newGroup });
  }

  await setGroupStructsToLocalForage(storeKey, localGroups);
};

export const setTableStructsToLocalForage = async (storeKey: string, tableStructs: TableCache[]) => {
  await localforage.setItem(`${storeKey}-table`, tableStructs);
};

export const getTableStructsFromLocalForage = async (storeKey: string): Promise<TableCache[] | undefined> => {
  try {
    return (await localforage.getItem(`${storeKey}-table`)) as TableCache[];
  } catch (e) {
    return undefined;
  }
};

export const removeSingleGroupFromLocalForage = async (storeKey: string, removeStructId: string) => {
  const localGroups = (await getGroupStructsFromLocalForage(storeKey)) || [];
  const newLocalGroupStructs = localGroups?.filter(item => {
    return item.groupId != removeStructId;
  });
  await setGroupStructsToLocalForage(storeKey, newLocalGroupStructs || []);
};

export const removeGroupsFromLocalForageIfNeeded = async (
  storeKey: string,
  localGroupStructs: GroupStruct[],
  groups: QuoteFilterGroupItem[]
) => {
  const removeIdList = localGroupStructs
    ?.filter(localItem => !groups?.find(item => item.group_id === localItem.groupId))
    .map(item => item?.groupId || '');
  if (!removeIdList?.length) {
    return;
  }
  const newLocalGroupStructs = localGroupStructs?.filter(item => {
    return !removeIdList.includes(item.groupId);
  });
  await setGroupStructsToLocalForage(storeKey, newLocalGroupStructs || []);
};

export const removeTablesFromLocalForageIfNeeded = async (
  storeKey: string,
  localTableStructs: TableCache[],
  groups: QuoteFilterGroupItem[]
) => {
  const removeIdList = localTableStructs
    ?.filter(localItem => !groups?.find(item => item.group_id === localItem.groupId))
    .map(item => item?.groupId || '');
  if (!removeIdList?.length) {
    return;
  }
  const newTableStructs = localTableStructs?.filter(item => {
    return !removeIdList.includes(item.groupId);
  });
  await setTableStructsToLocalForage(storeKey, newTableStructs || []);
};

// 向外提供的表格缓存工具函数，一个获取函数加四个分别存储的函数
export const getTableParamById = async (
  storeKey: string,
  groupId: string,
  tableKey: ProductPanelTableKey
): Promise<TableParams | undefined> => {
  const localTableStructs = (await getTableStructsFromLocalForage(storeKey)) || [];
  return localTableStructs.find(item => item.groupId === groupId)?.tableParamsCache?.get(tableKey);
};

export type UpdateTableParamsCacheFnParams = {
  /** 数据存储 key */
  storeKey: string;
  /** 表格缓存所属看板分组 Id */
  groupId: string;
  /** 表格 Key */
  tableKeys: ProductPanelTableKey[];
} & (
  | {
      type: 'quoteFilterValue';
      value: QuoteFilterValue;
    }
  | {
      type: 'columnSettings';
      value: BondQuoteTableColumnSettingItem[];
    }
  | {
      type: 'tableSorter';
      value?: TableSorter<QuoteSortedField>;
    }
);

export type UpdateSearchParamsCacheFnParams = {
  /** 数据存储 key */
  storeKey: string;
  /** 表格缓存所属看板分组 Id */
  groupId: string;
} & GlobalSearchParams;

export const getTableCache = async (storeKey: string, groupId?: string) => {
  const structs = (await getTableStructsFromLocalForage(storeKey)) ?? [];
  const cacheIdx = structs.findIndex(item => item.groupId === groupId);
  return { structs, cacheIdx, tableCache: cacheIdx > -1 ? structs[cacheIdx] : undefined };
};

export const updateTableParamsCache = async (params: UpdateTableParamsCacheFnParams) => {
  const { storeKey, groupId, tableKeys, type, value } = params;

  const { structs, cacheIdx } = await getTableCache(storeKey, groupId);
  const paramsCache = structs[cacheIdx]?.tableParamsCache ?? new Map<ProductPanelTableKey, TableParams>();

  tableKeys.forEach(key => {
    paramsCache.set(key, { ...paramsCache.get(key), [type]: value });
  });

  if (cacheIdx < 0) {
    // 如果 cacheIdx 小于 0，说明并未有本地缓存，需要 push
    structs.push({ groupId, tableParamsCache: paramsCache });
  } else if (cacheIdx >= 0 && !structs[cacheIdx]?.tableParamsCache) {
    // 如果 cacheIdx 大于 0，说明本地已有缓存，但没有 tableParamsCache，需要添加 tableParamsCache
    structs[cacheIdx].tableParamsCache = paramsCache;
  }

  setTableStructsToLocalForage(storeKey, structs);
};

export const updateSearchParamsCache = async (params: UpdateSearchParamsCacheFnParams) => {
  const { storeKey, groupId, inputFilter, searchingBond } = params;

  const { structs, cacheIdx } = await getTableCache(storeKey, groupId);

  const paramsCache = { inputFilter, searchingBond };

  if (structs[cacheIdx]) structs[cacheIdx].searchParamsCache = paramsCache;

  // 如果 cacheIdx 小于 0，说明并未有本地缓存，需要 push
  if (cacheIdx < 0) structs.push({ groupId, searchParamsCache: paramsCache });

  setTableStructsToLocalForage(storeKey, structs);
};

// 整体设置tableCache参数
export const updateWholeTableCache = async (
  storeKey: string,
  groupId: string,
  tableParamsCache: Map<ProductPanelTableKey, TableParams>
) => {
  const structs = (await getTableStructsFromLocalForage(storeKey)) ?? [];
  const cacheIdx = structs.findIndex(item => item.groupId === groupId);
  if (cacheIdx > 0) {
    structs[cacheIdx].tableParamsCache = tableParamsCache;
  } else {
    structs.push({ groupId, tableParamsCache });
  }
  await setTableStructsToLocalForage(storeKey, structs);
};
