import { useImmerPropsValue } from '@fepkg/common/hooks';
import { PickByType } from '@fepkg/common/types';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { DEFAULT_QUOTE_FILTER_VALUE } from '@/common/constants/filter';
import { useGlobalSearchValue, useUpdateGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import { useResetTablePage } from '@/pages/ProductPanel/hooks/useResetTablePage';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { QuoteFilterValue, TableQuoteFilterProps } from '../types';

type ShouldBeCheckedValue = Omit<PickByType<QuoteFilterValue, boolean | undefined>, 'is_lead' | 'is_nd'>;

export const BasicTableQuoteFilter = ({ value, onChange }: TableQuoteFilterProps) => {
  const { groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const searchValue = useGlobalSearchValue();
  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);

  const [filterValue, updateFilterValue] = useImmerPropsValue({
    defaultValue: value ?? DEFAULT_QUOTE_FILTER_VALUE,
    value,
    onChange
  });

  /** 切换相应字段的 checked value */
  const toggleCheckedValue = (key: keyof ShouldBeCheckedValue, val?: boolean) => {
    updateFilterValue(draft => {
      draft[key] = val ?? !draft[key];
    });
  };

  /** 切换我的报价时处理 broker_id_list */
  const toggleMyQuoteValue = (checked: boolean) => {
    updateFilterValue(draft => {
      draft.is_my_flag = checked;
    });

    // 如果是以 BJ:/B: 开头的，说明是正在搜索 Broker，需要和我的报价互斥
    if (searchValue?.user_input?.startsWith('BJ:') || searchValue?.user_input?.startsWith('B:')) {
      updateGlobalSearch({ groupId: activeGroup?.groupId });
    }
  };

  return (
    <div className="flex items-center gap-3 pl-3 py-2 bg-gray-800 select-none overflow-hidden">
      <Dialog.FooterItem>
        <Checkbox
          checked={!!filterValue?.is_vip}
          onChange={() => toggleCheckedValue('is_vip')}
        >
          VIP
        </Checkbox>
        <Checkbox
          checked={!!filterValue?.is_my_flag}
          onChange={isChecked => toggleMyQuoteValue(isChecked)}
        >
          我的报价
        </Checkbox>
        <Checkbox
          checked={!!filterValue?.flag_internal}
          onChange={() => toggleCheckedValue('flag_internal')}
        >
          内部
        </Checkbox>
        <Checkbox
          checked={!!filterValue?.flag_urgent}
          onChange={() => toggleCheckedValue('flag_urgent')}
        >
          紧急
        </Checkbox>
        <Checkbox
          checked={!!filterValue?.is_scattered}
          onChange={() => toggleCheckedValue('is_scattered')}
        >
          散量
        </Checkbox>
        <Checkbox
          checked={!!filterValue?.flag_recommend}
          onChange={() => toggleCheckedValue('flag_recommend')}
        >
          推荐
        </Checkbox>
      </Dialog.FooterItem>
    </div>
  );
};
