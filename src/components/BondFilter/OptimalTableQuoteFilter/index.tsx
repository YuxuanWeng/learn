import { useMemo, useState } from 'react';
import { useImmerPropsValue } from '@fepkg/common/hooks';
import { PickByType } from '@fepkg/common/types';
import { Button } from '@fepkg/components/Button';
import { Checkbox, CheckboxOption } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Input } from '@fepkg/components/Input';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { IconEdit } from '@fepkg/icon-park-react';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { ProductType, Side } from '@fepkg/services/types/enum';
import { DEFAULT_QUOTE_FILTER_VALUE } from '@/common/constants/filter';
import { useProductSettlementGroupSettings } from '@/common/services/hooks/useSettings/useProductSettlementGroupSettings';
import SettlementModal, { SettlementGroup } from '@/components/SettlementModal';
import { useProductParams } from '@/layouts/Home/hooks';
import { useGlobalSearchValue, useUpdateGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import { useResetTablePage } from '@/pages/ProductPanel/hooks/useResetTablePage';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { QuoteFilterValue, TableQuoteFilterProps } from '../types';

type ShouldBeCheckedValue = Omit<PickByType<QuoteFilterValue, boolean | undefined>, 'is_lead' | 'is_nd'>;

type ShouldBeCheckedOptValue = Pick<QuoteFilterValue, 'side' | 'is_exercise' | 'ofr_volume'>;

const exerciseOptions = [
  { label: '行权', value: true },
  { label: '到期', value: false }
];

const sideOptions = [
  { label: 'Bid', value: Side.SideBid },
  { label: 'Ofr', value: Side.SideOfr }
];

export const OptimalTableQuoteFilter = ({ value, onChange }: TableQuoteFilterProps) => {
  const { productType } = useProductParams();
  const { groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const searchValue = useGlobalSearchValue();
  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);

  const [filterValue, updateFilterValue] = useImmerPropsValue({
    defaultValue: value ?? DEFAULT_QUOTE_FILTER_VALUE,
    value,
    onChange
  });

  const [settlementModalVisible, setSettlementModalVisible] = useState(false);
  const { settlementGroupSettings, updateSettlementGroupSettings } = useProductSettlementGroupSettings(productType);

  /** 切换相应字段的 checked value */
  const toggleCheckedValue = (key: keyof ShouldBeCheckedValue & ShouldBeCheckedOptValue, val?: boolean) => {
    updateFilterValue(draft => {
      draft[key] = val ?? !draft[key];
    });
  };

  /** 切换Side */
  const toggleSideValue = (val: Side[]) => {
    updateFilterValue(draft => {
      draft.side = val.length === 1 ? val.at(0) : undefined;
    });
  };

  const toggleExerciseValue = (val: boolean[]) => {
    updateFilterValue(draft => {
      draft.is_exercise = val.length === 1 ? val.at(0) : undefined;
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

  const saveSettlementGroup = (settlementGroup: SettlementGroup) => {
    updateSettlementGroupSettings(settlementGroup);
  };

  const settlementGroupOptions = useMemo(() => {
    if (!settlementGroupSettings?.length) return [];

    const groupOptions: CheckboxOption[] = [];
    if (settlementGroupSettings)
      for (const v of settlementGroupSettings) {
        groupOptions.push({ label: v.name, value: Number(v.name), className: '!min-w-[24px]' });
      }
    return groupOptions;
  }, [settlementGroupSettings]);

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
          checked={!!filterValue?.flag_urgent}
          onChange={() => toggleCheckedValue('flag_urgent')}
        >
          紧急
        </Checkbox>
        <Checkbox
          checked={!!filterValue?.flag_recommend}
          onChange={() => toggleCheckedValue('flag_recommend')}
        >
          推荐
        </Checkbox>
      </Dialog.FooterItem>

      {productType !== ProductType.NCD && (
        <RadioIndeterminateGroup
          className="bg-gray-700 rounded-lg [&_.s-radio-wrapper]:h-7"
          options={exerciseOptions}
          value={typeof filterValue.is_exercise === 'boolean' ? [filterValue.is_exercise] : []}
          onChange={val => {
            toggleExerciseValue(val as boolean[]);
          }}
        />
      )}

      <RadioIndeterminateGroup
        className="bg-gray-700 rounded-lg [&_.s-radio-wrapper]:h-7"
        options={sideOptions}
        value={typeof filterValue.side === 'number' ? [filterValue.side] : []}
        onChange={val => {
          toggleSideValue(val as Side[]);
        }}
      />

      <Dialog.FooterItem className="!gap-1">
        <span className="text-gray-200 text-sm whitespace-nowrap">结算：</span>
        <RadioIndeterminateGroup
          className="!gap-1"
          options={settlementGroupOptions}
          value={filterValue.liquidation_speed_list?.length ? filterValue.liquidation_speed_list?.map(v => +v) : []}
          onChange={val => {
            updateFilterValue(draft => {
              draft.liquidation_speed_list = val as unknown as LiquidationSpeed[];
            });
          }}
        />
        <Button.Icon
          text
          icon={<IconEdit />}
          onClick={() => setSettlementModalVisible(true)}
        />
      </Dialog.FooterItem>

      <section className="flex items-center h-7 w-[160px] py-2 rounded-sm">
        <Input
          key="subjectRatingQueryInput"
          label="ofr ≥"
          labelWidth={64}
          placeholder="数值"
          rounded
          value={filterValue.ofr_volume != undefined ? String(filterValue.ofr_volume) : void 0}
          onChange={val => {
            if (!/^\d{0,6}$/.test(val)) return;
            updateFilterValue(draft => {
              draft.ofr_volume = Number(val) || undefined;
            });
          }}
          className="h-7"
        />
      </section>

      {settlementModalVisible && (
        <SettlementModal
          defaultValue={settlementGroupSettings}
          visible={settlementModalVisible}
          onOk={saveSettlementGroup}
          onClose={() => {
            setSettlementModalVisible(false);
          }}
        />
      )}
    </div>
  );
};
