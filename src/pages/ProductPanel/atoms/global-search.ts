import { SearchOption } from '@fepkg/components/Search';
import { FiccBondBasic, InputFilter } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { GlobalSearchOption, GlobalSearchOptionType } from '@/components/business/GlobalSearch/types';
import { useGlobalSearchingBond } from '@/pages/ProductPanel/hooks/useGlobalSearchingBond';
import { getTableCache, updateSearchParamsCache } from '../providers/MainGroupProvider/storage';

type ChangeEventParams = {
  /** 行情看板分组 Id（无需使用行情面板分组 cache 时可传入一个特定的 key） */
  groupId?: string;
  /** 全局搜索接口入参 */
  inputFilter?: InputFilter;
  /** 正在搜索的债券 */
  searchingBond?: FiccBondBasic;
  /** 是否更新 indexedDb cache */
  cache?: boolean;
};

type UpdateEventParams = Omit<ChangeEventParams, 'searchingBond'> & {
  /** 全局搜索选项内容 */
  selected?: SearchOption<GlobalSearchOption> | null;
};

/** 全局搜索 value */
export const globalSearchValueAtom = atomWithReset<InputFilter | undefined>(undefined);
export const useGlobalSearchValue = () => useAtomValue(globalSearchValueAtom);

/** 全局搜索 key，用于重置内部状态用（后期全局搜索数据流时可考虑去掉） */
const globalSearchKeyAtom = atomWithReset<string>('');
export const useGlobalSearchKey = () => useAtomValue(globalSearchKeyAtom);

export const useUpdateGlobalSearchValue = (storeKey: string, useResetTablePage: () => () => void) => {
  const { updateSearchingBond } = useGlobalSearchingBond();

  const setValue = useSetAtom(globalSearchValueAtom);
  const setKey = useSetAtom(globalSearchKeyAtom);
  const resetTablePage = useResetTablePage();

  const change = useMemoizedFn(({ groupId, inputFilter, searchingBond, cache = true }: ChangeEventParams) => {
    setValue(inputFilter);
    resetTablePage();

    if (groupId) {
      updateSearchingBond(groupId, searchingBond);
      if (cache) updateSearchParamsCache({ storeKey, groupId, inputFilter, searchingBond });
    }
  });

  const update = useMemoizedFn(({ groupId, inputFilter, selected, cache }: UpdateEventParams) => {
    const searchingBond =
      selected && selected.original.search_option_type === GlobalSearchOptionType.BOND ? selected.original : undefined;

    change({ groupId, inputFilter, searchingBond, cache });
  });

  const reset = useMemoizedFn(async (groupId?: string, fromCache?: boolean) => {
    // 重置全局搜索组件
    setKey(Date.now().toString());

    if (fromCache) {
      const { tableCache } = await getTableCache(storeKey, groupId);
      const { inputFilter, searchingBond } = tableCache?.searchParamsCache ?? {};
      change({ groupId, inputFilter, searchingBond });

      return;
    }

    change({ groupId });
  });

  return [update, reset] as const;
};
