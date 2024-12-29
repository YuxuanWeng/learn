import { useCallback } from 'react';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { useAtomCallback } from 'jotai/utils';
import { getDefaultQuoteTableColumnSettings } from '@/common/constants/table';
import { defaultTableSettingsAtom, getTableSettingsAtom } from '../atoms/table';
import { getTableCache } from '../providers/MainGroupProvider/storage';
import { useProductPanel } from '../providers/PanelProvider';
import { BondQuoteTableColumnSettingItem, ProductPanelTableKeys } from '../types';

export const useResetTableColumnSettings = () => {
  const { groupStoreKey } = useProductPanel();

  const setAtom = useAtomCallback(
    useCallback(
      (_, set, target: { atom: typeof defaultTableSettingsAtom; value: BondQuoteTableColumnSettingItem[] }) => {
        set(target.atom, target.value);
      },
      []
    )
  );

  const reset = useMemoizedFn(async (targetProductType: ProductType, groupId?: string) => {
    const { tableCache } = await getTableCache(groupStoreKey, groupId);

    for (const key of ProductPanelTableKeys) {
      const atom = getTableSettingsAtom(targetProductType, key);
      const value =
        tableCache?.tableParamsCache?.get(key)?.columnSettings ??
        getDefaultQuoteTableColumnSettings(targetProductType, key);

      setAtom({ atom, value });
    }
  });

  return reset;
};
