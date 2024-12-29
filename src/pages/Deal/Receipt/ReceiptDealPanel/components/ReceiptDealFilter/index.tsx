import { useMemo } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import { receiptDealStatusOptions } from '@fepkg/business/components/ReceiptDealTableCell';
import { DateTypeOptions } from '@fepkg/business/constants/options';
import { isIntegerString } from '@fepkg/common/utils';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Checkbox, CheckboxValue } from '@fepkg/components/Checkbox';
import { Combination } from '@fepkg/components/Combination';
import { RangePicker } from '@fepkg/components/DatePicker/RangePicker';
import { Input } from '@fepkg/components/Input';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { Select } from '@fepkg/components/Select';
import { IconRefresh, IconSearch } from '@fepkg/icon-park-react';
import { RangeTime } from '@fepkg/services/types/common';
import { DealDateType, FuzzySearchType } from '@fepkg/services/types/enum';
import { useSetAtom } from 'jotai';
import moment, { Moment } from 'moment';
import { internalCodeReg } from '@/common/utils/internal-code';
import { GlobalSearch } from '@/components/business/GlobalSearch';
import { GlobalSearchOptionType } from '@/components/business/GlobalSearch/types';
import { useProductParams } from '@/layouts/Home/hooks';
import {
  receiptDealTablePageAtom,
  receiptDealTableSearchingBondAtom
} from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import {
  getReceiptDealFilterBridgeValue,
  getReceiptDealFilterInternalValue
} from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealFilter/utils';
import {
  bridgeOptions,
  internalOptions,
  receiptDealFinishedOptions,
  receiptDealFinishedStatuses,
  receiptDealUnfinishedStatuses
} from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import { useReceiptDealFilter } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/FilterProvider';
import {
  BridgeFilterState,
  InternalFilterState,
  ReceiptDealFilterState,
  ReceiptDealRelatedFilter
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';
import { globalSearchValueAtom, useGlobalSearchValue } from '@/pages/ProductPanel/atoms/global-search';

const SearchCls = 'w-60 h-7';
const MonthAgo = moment().subtract(1, 'month').startOf('day');

export const ReceiptDealFilter = () => {
  const { productType } = useProductParams();
  const {
    showAllRef,
    relatedFilterValue,
    updateRelatedFilterValue,
    inputFilterValue,
    updateInputFilterValue,
    onShowAll
  } = useReceiptDealFilter();
  const setGlobalSearchValue = useSetAtom(globalSearchValueAtom);
  const searchValue = useGlobalSearchValue();
  const setSearchingBond = useSetAtom(receiptDealTableSearchingBondAtom);
  const setPage = useSetAtom(receiptDealTablePageAtom);

  const statusOptions = useMemo(() => {
    if (!relatedFilterValue.finished.length) {
      return receiptDealStatusOptions;
    }
    if (relatedFilterValue.finished.includes(ReceiptDealFilterState.Finished)) {
      return receiptDealStatusOptions.filter(o => receiptDealFinishedStatuses.includes(o.value));
    }
    return receiptDealStatusOptions.filter(o => receiptDealUnfinishedStatuses.includes(o.value));
  }, [relatedFilterValue.finished]);

  const onInternalChange = (val: CheckboxValue[]) => {
    let flag_internal: boolean | undefined = void 0;
    if (val.includes(InternalFilterState.Internal)) {
      flag_internal = true;
    } else if (val.includes(InternalFilterState.NonInternal)) {
      flag_internal = false;
    }
    updateRelatedFilterValue({ flag_internal });
  };

  const onBridgeChange = (val: CheckboxValue[]) => {
    let flag_bridge: boolean | undefined = void 0;
    if (val.includes(BridgeFilterState.Bridge)) {
      flag_bridge = true;
    } else if (val.includes(BridgeFilterState.NonBridge)) {
      flag_bridge = false;
    }
    updateRelatedFilterValue({ flag_bridge });
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    // 一个月至今
    return current < MonthAgo;
  };

  const handleDateTypeSelect = (val: DealDateType | undefined) => {
    const param: Partial<ReceiptDealRelatedFilter> = { date_type: val };
    if (!val) {
      param.date_range = void 0;
    }
    updateRelatedFilterValue(param);
  };

  const handleDateSelect = (dates: [Moment | null, Moment | null] | null) => {
    if (dates === null) {
      updateRelatedFilterValue({ date_range: void 0 });
      return;
    }
    const date_range: RangeTime = {};
    if (dates?.[0]) date_range.start_time = moment(dates[0]).startOf('days').valueOf().toString();
    if (dates?.[1]) date_range.end_time = moment(dates[1]).endOf('days').valueOf().toString();
    updateRelatedFilterValue({ date_range });
  };

  const setGlobalSearch = useSetAtom(globalSearchValueAtom);

  return (
    <div className="component-dashed-x-600">
      <div className="px-3 flex items-center gap-x-3 h-14 select-none overflow-x-overlay border-0 border-b border-solid border-gray-600">
        <Button
          ref={showAllRef}
          type="gray"
          ghost
          className="h-7"
          icon={<IconRefresh />}
          onClick={onShowAll}
        >
          清空条件
        </Button>
        <RadioIndeterminateGroup
          className="shrink-0 bg-gray-700 rounded-lg h-7"
          options={receiptDealFinishedOptions}
          otherCancel
          value={relatedFilterValue.finished}
          onChange={val =>
            updateRelatedFilterValue({
              finished: val as ReceiptDealFilterState[],
              receipt_deal_status: void 0
            })
          }
        />
        <Select
          label="状态"
          labelWidth={72}
          size="sm"
          className="w-60 shrink-0"
          multiple
          tags={false}
          placeholder="不限"
          options={statusOptions}
          value={relatedFilterValue.receipt_deal_status ?? []}
          onChange={val => {
            updateRelatedFilterValue({ receipt_deal_status: val.length ? val : void 0 });
          }}
        />
        <RadioIndeterminateGroup
          className="shrink-0 bg-gray-700 rounded-lg h-7"
          options={internalOptions}
          otherCancel
          value={getReceiptDealFilterInternalValue(relatedFilterValue)}
          onChange={onInternalChange}
        />
        <RadioIndeterminateGroup
          className="shrink-0 bg-gray-700 rounded-lg h-7"
          options={bridgeOptions}
          otherCancel
          value={getReceiptDealFilterBridgeValue(relatedFilterValue)}
          onChange={onBridgeChange}
        />
        <section className="bg-gray-700 rounded-lg h-7 px-3 flex items-center shrink-0 gap-4">
          <Checkbox
            checked={!!relatedFilterValue.flag_urge}
            onChange={val => {
              updateRelatedFilterValue({ flag_urge: val || void 0 });
            }}
          >
            催单提醒
          </Checkbox>
          <Checkbox
            checked={!!relatedFilterValue.flag_self}
            onChange={val => {
              updateRelatedFilterValue({ flag_self: val || void 0 });
            }}
          >
            本人成交单
          </Checkbox>
        </section>
        <Combination
          containerCls="flex-row-reverse"
          size="sm"
          background="prefix700-suffix600"
          prefixNode={
            <RangePicker
              className="w-[248px] bg-gray-700"
              disabled={!relatedFilterValue.date_type}
              disabledDate={disabledDate}
              value={
                relatedFilterValue.date_range
                  ? [
                      relatedFilterValue.date_range.start_time
                        ? moment(Number(relatedFilterValue.date_range.start_time))
                        : null,
                      relatedFilterValue.date_range.end_time
                        ? moment(Number(relatedFilterValue.date_range.end_time))
                        : null
                    ]
                  : [null, null]
              }
              placeholder={[formatDate(MonthAgo), '结束日期']}
              onChange={handleDateSelect}
            />
          }
          suffixNode={
            <Select
              className="w-[118px] "
              clearIcon={null}
              options={DateTypeOptions}
              value={relatedFilterValue.date_type}
              onChange={handleDateTypeSelect}
            />
          }
        />
      </div>
      <div className="px-3 h-12 select-none flex gap-x-3 items-center">
        <Input
          className={SearchCls}
          placeholder="订单号"
          suffixIcon={<IconSearch />}
          value={inputFilterValue.order_no}
          onChange={val => {
            if (isIntegerString(val)) {
              updateInputFilterValue({ order_no: val || void 0 });
            } else {
              updateInputFilterValue({ order_no: inputFilterValue.order_no ?? null });
            }
          }}
        />
        <Input
          className={SearchCls}
          placeholder="过桥码"
          suffixIcon={<IconSearch />}
          value={inputFilterValue.bridge_code}
          onChange={val => {
            if (isIntegerString(val)) {
              updateInputFilterValue({ bridge_code: val || void 0 });
            } else {
              updateInputFilterValue({ bridge_code: inputFilterValue.bridge_code ?? null });
            }
          }}
        />
        <Input
          className={SearchCls}
          placeholder="序列号"
          suffixIcon={<IconSearch />}
          value={inputFilterValue.seq_number}
          onChange={val => {
            if (isIntegerString(val)) {
              updateInputFilterValue({ seq_number: val || void 0 });
            } else {
              updateInputFilterValue({ seq_number: inputFilterValue.seq_number ?? null });
            }
          }}
        />
        <Input
          className={SearchCls}
          placeholder="内码"
          suffixIcon={<IconSearch />}
          value={inputFilterValue.internal_code}
          onChange={val => {
            if (internalCodeReg.test(val)) {
              updateInputFilterValue({ internal_code: val || void 0 });
            } else {
              updateInputFilterValue({ internal_code: inputFilterValue.internal_code ?? null });
            }
          }}
        />
        <div className="grow shrink-0 flex justify-end">
          <GlobalSearch
            className="w-50 [&_.s-input]:h-[18px]"
            needInvalid
            bondUnlimited
            productType={productType}
            searchType={FuzzySearchType.MainPage}
            value={searchValue}
            onSearch={(val, selected) => {
              const searchingBond =
                selected && selected.original.search_option_type === GlobalSearchOptionType.BOND
                  ? selected.original
                  : undefined;
              setSearchingBond(searchingBond);
              setGlobalSearchValue(val);
              setPage(1);
            }}
            onClear={() => {
              setGlobalSearchValue(void 0);
              setSearchingBond(void 0);
            }}
          />
        </div>
      </div>
    </div>
  );
};
