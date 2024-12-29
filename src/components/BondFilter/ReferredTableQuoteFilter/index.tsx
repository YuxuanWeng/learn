import { RangePickerProps } from 'antd/lib/date-picker';
import { SimplifyReferTypeOptions } from '@fepkg/business/constants/options';
import { useImmerPropsValue } from '@fepkg/common/hooks';
import { PickByType } from '@fepkg/common/types';
import { formatDate } from '@fepkg/common/utils/date';
import { Checkbox, CheckboxValue } from '@fepkg/components/Checkbox';
import { RangePicker } from '@fepkg/components/DatePicker/RangePicker';
import { Dialog } from '@fepkg/components/Dialog';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { RangeTime } from '@fepkg/services/types/common';
import { RefType } from '@fepkg/services/types/enum';
import moment, { Moment } from 'moment';
import { DEFAULT_REFERRED_QUOTE_FILTER_VALUE } from '@/common/constants/filter';
import { usePrevWorkingDate } from '@/common/services/hooks/usePrevWorkingDate';
import { miscStorage } from '@/localdb/miscStorage';
import { useGlobalSearchValue, useUpdateGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';
import { useResetTablePage } from '@/pages/ProductPanel/hooks/useResetTablePage';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { QuoteFilterValue, TableQuoteFilterProps } from '../types';

type ShouldBeCheckedValue = Omit<PickByType<QuoteFilterValue, boolean | undefined>, 'is_lead' | 'is_nd'>;

export const ReferredTableQuoteFilter = ({ value, onChange }: TableQuoteFilterProps) => {
  const { groupStoreKey } = useProductPanel();
  const { delayedActiveGroupState: activeGroup } = useMainGroupData();

  const searchValue = useGlobalSearchValue();
  const { softLifecycleId } = miscStorage;
  const [updateGlobalSearch] = useUpdateGlobalSearchValue(groupStoreKey, useResetTablePage);

  const [filterValue, updateFilterValue] = useImmerPropsValue({
    defaultValue: value ?? DEFAULT_REFERRED_QUOTE_FILTER_VALUE,
    value,
    onChange
  });

  // 获取前 5 个工作日
  const [prev5WorkingDate] = usePrevWorkingDate(5);

  /** 处理选择撤销类型的回调 */
  const handleSelectRefer = (val: CheckboxValue[]) => {
    updateFilterValue(draft => {
      draft.ref_type_list = val as RefType[];
    });
  };

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

  const getDateValue = (): [Moment | null, Moment | null] => {
    if (filterValue.time_soft_lifecycleId != softLifecycleId) {
      return [moment().startOf('day'), moment().endOf('day')];
    }
    return filterValue.date_range
      ? [
          filterValue.date_range.start_time ? moment(Number(filterValue.date_range.start_time)) : null,
          filterValue.date_range.end_time ? moment(Number(filterValue.date_range.end_time)) : null
        ]
      : [null, null];
  };

  const handleDateSelect = (dates: [Moment | null, Moment | null] | null) => {
    if (dates === null) {
      updateFilterValue(draft => {
        draft.date_range = void 0;
        draft.time_soft_lifecycleId = softLifecycleId;
      });
      return;
    }
    const date_range: RangeTime = {};
    if (dates?.[0]) {
      date_range.start_time = moment(dates[0]).startOf('day').valueOf().toString();
    } else {
      date_range.start_time = undefined;
    }
    if (dates?.[1]) {
      date_range.end_time = moment(dates[1]).endOf('day').valueOf().toString();
    } else {
      date_range.end_time = undefined;
    }
    updateFilterValue(draft => {
      draft.date_range = date_range;
      draft.time_soft_lifecycleId = softLifecycleId;
    });
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // 因为作废区数量太大，服务端目前需要做个限制，只能选 5 个工作日内的数据，后续回到正常逻辑
    const lastDay = prev5WorkingDate ?? moment().subtract(5, 'days');
    // let lastY = moment().subtract(3, 'M');
    // if (productType === ProductType.BNC) lastY = moment().subtract(1, 'y');
    return current && (current > moment().endOf('day') || current < lastDay);
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

      <Dialog.FooterItem className="!gap-1 !pr-0">
        <span className="text-sm text-gray-200 w-[65px]">撤销类型：</span>
        <RadioIndeterminateGroup
          className="[&_.s-radio-wrapper]:h-7"
          options={SimplifyReferTypeOptions}
          value={filterValue?.ref_type_list ?? []}
          onChange={handleSelectRefer}
        />
      </Dialog.FooterItem>

      <RangePicker
        value={getDateValue()}
        placeholder={[formatDate(prev5WorkingDate), formatDate(moment())]}
        onChange={handleDateSelect}
        disabledDate={disabledDate}
        className="flex-shrink-0 w-[252px] bg-gray-700 h-7"
      />
    </div>
  );
};
