import { useMemo } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import {
  BCOProductMarketOptions,
  BNCProductMarketOptions,
  NCDProductMarketOptions,
  ReceiptDealTradeInstBrokerageCommentOptions
} from '@fepkg/business/constants/options';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { CheckboxOption, CheckboxValue } from '@fepkg/components/Checkbox';
import { RangePicker } from '@fepkg/components/DatePicker/RangePicker';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { Select } from '@fepkg/components/Select';
import { IconRefresh } from '@fepkg/icon-park-react';
import { RangeTime } from '@fepkg/services/types/common';
import { BrokerageType, ProductMarket, ProductType, ReceiptDealStatus } from '@fepkg/services/types/enum';
import { getDTMClickFilterEvent } from '@/hooks/useLog';
import { useAuth } from '@/providers/AuthProvider';
import { useMemoizedFn } from 'ahooks';
import moment, { Moment } from 'moment';
import { trackPoint } from '@/common/logger';
import {
  getApprovalListFilterExamineTypeValue,
  getApprovalListFilterHandledValue,
  getApprovalListFilterHistoryPassValue,
  getApprovalListFilterNCValue,
  getApprovalListFilterUrgentValue,
  getHistoryApprovalListFilterHandledValue,
  getProductOptions
} from '@/pages/ApprovalList/components/ApprovalListRelatedFilter/utils';
import {
  AdvancedExamineTypeOptions,
  ApprovalStatusOptions,
  BrokerageTypeOptions,
  Completed,
  ExamineTypeOptions,
  HistoryApprovalStatusOptions,
  HistoryPassOptions,
  HistoryReceiptDealStatusOptions,
  InCompleted,
  NCOptions,
  PrintOptions,
  ReceiptDealStatusOptions,
  ToBeExaminedByMyself,
  UrgentOptions
} from '@/pages/ApprovalList/constants/filter';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import {
  ApprovalListType,
  ApprovalStatus,
  ApprovalType,
  FlagNCStatus,
  FlagUrgentStatus,
  HistoryApprovalStatus,
  HistoryPassType
} from '@/pages/ApprovalList/types';

const SixMonthAgo = moment().startOf('day').subtract(6, 'month');

const ThreeYearAgo = moment().startOf('day').subtract(3, 'year');

const defaultSelectProps = {
  labelWidth: 96,
  className: 'w-60 bg-gray-800',
  multiple: true,
  tags: false,
  placeholder: '不限'
};

export const ApprovalListRelatedFilter = () => {
  const { productTypeList } = useAuth();
  const { type, relatedFilterValue, updateRelatedFilterValue, onShowAll } = useApprovalTable();

  const productOptions = useMemo(() => getProductOptions(productTypeList), [productTypeList]);

  const statusOptions = useMemo(() => {
    switch (type) {
      case ApprovalListType.Approval: {
        if (relatedFilterValue.handled === false) {
          return ReceiptDealStatusOptions.filter(o => ToBeExaminedByMyself.includes(o.value as ReceiptDealStatus));
        }
        return ReceiptDealStatusOptions;
      }
      case ApprovalListType.History: {
        if (relatedFilterValue.completed === false) {
          return HistoryReceiptDealStatusOptions.filter(o => InCompleted.includes(o.value as ReceiptDealStatus));
        }
        if (relatedFilterValue.completed) {
          return HistoryReceiptDealStatusOptions.filter(o => Completed.includes(o.value as ReceiptDealStatus));
        }
        return HistoryReceiptDealStatusOptions;
      }
      case ApprovalListType.Deal: {
        return HistoryReceiptDealStatusOptions.filter(o => Completed.includes(o.value as ReceiptDealStatus));
      }
      default: {
        return HistoryReceiptDealStatusOptions;
      }
    }
  }, [type, relatedFilterValue.completed, relatedFilterValue.handled]);

  const disabledDate = useMemoizedFn<NonNullable<RangePickerProps['disabledDate']>>(current => {
    // 三年至今或六个月至今
    return type === ApprovalListType.Approval ? current < SixMonthAgo : current < ThreeYearAgo;
  });

  const onHandledChange = (val: CheckboxValue[]) => {
    let handled: boolean | undefined = void 0;
    if (val.includes(ApprovalStatus.HasExamined)) {
      handled = true;
    } else if (val.includes(ApprovalStatus.ToBeExaminedByMyself)) {
      handled = false;
    }
    updateRelatedFilterValue({ handled, status_list: void 0 });
  };

  const onCompletedChange = (val: CheckboxValue[]) => {
    let completed: boolean | undefined = void 0;
    if (val.includes(HistoryApprovalStatus.Completed)) {
      completed = true;
    } else if (val.includes(HistoryApprovalStatus.InCompleted)) {
      completed = false;
    }
    updateRelatedFilterValue({ completed, status_list: void 0 });
  };

  const onUrgentChange = (val: CheckboxValue[]) => {
    let flag_urgent: boolean | undefined = void 0;
    if (val.includes(FlagUrgentStatus.Urgent)) {
      flag_urgent = true;
    } else if (val.includes(FlagUrgentStatus.NonUrgent)) {
      flag_urgent = false;
    }
    updateRelatedFilterValue({ flag_urgent });
  };

  const onNCChange = (val: CheckboxValue[]) => {
    let is_nc: boolean | undefined = void 0;
    if (val.includes(FlagNCStatus.True)) {
      is_nc = true;
    } else if (val.includes(FlagNCStatus.False)) {
      is_nc = false;
    }
    updateRelatedFilterValue({ is_nc });
  };

  const onExamineTypeChange = (val: CheckboxValue[]) => {
    let is_advanced_approval: boolean | undefined = void 0;
    if (val.includes(ApprovalType.Normal)) {
      is_advanced_approval = false;
    } else if (val.includes(ApprovalType.Advanced)) {
      is_advanced_approval = true;
    }
    updateRelatedFilterValue({ is_advanced_approval, type_list: void 0 });
  };

  const handleDateSelect = (dates: [Moment | null, Moment | null] | null) => {
    if (dates === null) {
      updateRelatedFilterValue({ traded_date_range: void 0 });
      return;
    }
    const date_range: RangeTime = {};
    if (dates?.[0]) date_range.start_time = moment(dates[0]).startOf('days').valueOf().toString();
    if (dates?.[1]) date_range.end_time = moment(dates[1]).endOf('days').valueOf().toString();
    updateRelatedFilterValue({ traded_date_range: date_range });
  };

  const onHistoryPassChange = (val: CheckboxValue[]) => {
    let flag_history_pass: boolean | undefined = void 0;
    if (val.includes(HistoryPassType.True)) {
      flag_history_pass = true;
    } else if (val.includes(HistoryPassType.False)) {
      flag_history_pass = false;
    }
    updateRelatedFilterValue({ flag_history_pass });
  };

  const logFilterClick = (isSelect: boolean, mainButtonType?: string, subButtonType?: string) => {
    if (isSelect) {
      trackPoint(getDTMClickFilterEvent(type !== ApprovalListType.Approval), {
        mainButtonTypeV2: mainButtonType || '',
        subButtonTypeV2: `${mainButtonType || ''}-${subButtonType || ''}`
      });
    }
  };

  return (
    <div className="h-[112px] p-4 flex flex-col gap-y-4 select-none bg-gray-700 rounded-lg overflow-x-overlay">
      <div className="w-max shrink-0 flex items-center gap-x-3">
        <RadioIndeterminateGroup
          className="shrink-0 bg-gray-800 rounded-lg h-8 text-gray-200"
          options={productOptions}
          otherCancel
          ctrl
          value={relatedFilterValue.product_market_list ?? []}
          onChange={val => {
            updateRelatedFilterValue({
              product_market_list: val.length ? (val as ProductMarket[]) : void 0
            });
          }}
          onItemClick={(val, isSelect) => {
            logFilterClick(isSelect, '台子', val.label?.toString());
          }}
        />
        {type !== ApprovalListType.Deal ? (
          <div className="shrink-0 outline outline-[1px] outline-gray-600 rounded-lg flex flex-row gap-3">
            <RadioIndeterminateGroup
              className="shrink-0 bg-gray-800 rounded-lg h-8 text-gray-200"
              options={type === ApprovalListType.Approval ? ApprovalStatusOptions : HistoryApprovalStatusOptions}
              otherCancel
              value={
                type === ApprovalListType.Approval
                  ? getApprovalListFilterHandledValue(relatedFilterValue)
                  : getHistoryApprovalListFilterHandledValue(relatedFilterValue)
              }
              onChange={type === ApprovalListType.Approval ? onHandledChange : onCompletedChange}
              onItemClick={(val, isSelect) => {
                logFilterClick(
                  isSelect,
                  type === ApprovalListType.Approval ? '审批状态' : '单据状态',
                  val.label?.toString()
                );
              }}
            />
            <Select
              label="成交单状态"
              {...defaultSelectProps}
              options={statusOptions}
              value={relatedFilterValue.status_list ?? []}
              onChange={(val, selectOption, isSelect) => {
                logFilterClick(isSelect === true, '成交单状态', selectOption?.label);
                updateRelatedFilterValue({ status_list: val.length ? val : void 0 });
              }}
            />
          </div>
        ) : (
          <Select
            label="成交单状态"
            {...defaultSelectProps}
            options={statusOptions}
            value={relatedFilterValue.status_list ?? []}
            onChange={(val, selectOption, isSelect) => {
              logFilterClick(isSelect === true, '成交单状态', selectOption?.label);
              updateRelatedFilterValue({ status_list: val.length ? val : void 0 });
            }}
          />
        )}

        {type === ApprovalListType.Approval ? (
          <RadioIndeterminateGroup
            className="shrink-0 bg-gray-800 rounded-lg h-8"
            options={UrgentOptions}
            otherCancel
            value={getApprovalListFilterUrgentValue(relatedFilterValue)}
            onChange={onUrgentChange}
            onItemClick={(val, isSelect) => {
              logFilterClick(isSelect, '是否紧急', val.label?.toString());
            }}
          />
        ) : (
          <RadioIndeterminateGroup
            className="shrink-0 bg-gray-800 rounded-lg h-8 pl-3 text-gray-200"
            label="NC："
            options={NCOptions}
            otherCancel
            value={getApprovalListFilterNCValue(relatedFilterValue)}
            onChange={onNCChange}
            onItemClick={(val, isSelect) => {
              logFilterClick(isSelect, 'NC', val.label?.toString());
            }}
          />
        )}
        {type === ApprovalListType.Approval ? (
          <div className="shrink-0 outline outline-[1px] outline-gray-600 rounded-lg flex flex-row gap-3">
            <RadioIndeterminateGroup
              className="shrink-0 bg-gray-800 rounded-lg h-8 pl-3 text-gray-200"
              label="审核类型："
              options={ExamineTypeOptions}
              otherCancel
              value={getApprovalListFilterExamineTypeValue(relatedFilterValue)}
              onChange={onExamineTypeChange}
              onItemClick={(val, isSelect) => {
                logFilterClick(isSelect, '审核类型', val.label?.toString());
              }}
            />
            {relatedFilterValue.is_advanced_approval ? (
              <Select
                label="高级审核类型"
                {...defaultSelectProps}
                options={AdvancedExamineTypeOptions}
                value={relatedFilterValue.type_list ?? []}
                onChange={(val, selectOption, isSelect) => {
                  logFilterClick(isSelect === true, '高级审核类型', selectOption?.label);
                  updateRelatedFilterValue({
                    type_list: val
                  });
                }}
              />
            ) : null}
          </div>
        ) : (
          <div className="shrink-0 outline outline-[1px] outline-gray-600 rounded-lg flex flex-row gap-3">
            <RadioIndeterminateGroup
              className="shrink-0 bg-gray-800 rounded-lg h-8 pl-3 text-gray-200"
              label="佣金："
              options={BrokerageTypeOptions}
              value={relatedFilterValue.brokerage_type_list ?? []}
              onChange={val => {
                updateRelatedFilterValue({
                  brokerage_type_list: val.length ? (val as BrokerageType[]) : void 0,
                  brokerage_comment_list: void 0
                });
              }}
              onItemClick={(val, isSelect) => {
                logFilterClick(isSelect, '佣金', val.label?.toString());
              }}
            />
            {relatedFilterValue.brokerage_type_list?.includes(BrokerageType.BrokerageTypeN) ? (
              <Select
                label="免佣类型"
                {...defaultSelectProps}
                options={ReceiptDealTradeInstBrokerageCommentOptions}
                value={relatedFilterValue.brokerage_comment_list ?? []}
                onChange={(val, selectOption, isSelect) => {
                  logFilterClick(isSelect === true, '免佣类型', selectOption?.label);
                  updateRelatedFilterValue({
                    brokerage_comment_list: val
                  });
                }}
              />
            ) : null}
          </div>
        )}
      </div>
      <div className="w-max shrink-0 flex items-center gap-x-3">
        <section className="flex items-center h-8 bg-gray-800 rounded-lg">
          <span className="w-[72px] pl-3 text-gray-200">交易日</span>
          <RangePicker
            className="w-[248px] rounded-l-none"
            disabledDate={disabledDate}
            value={
              relatedFilterValue.traded_date_range
                ? [
                    relatedFilterValue.traded_date_range.start_time
                      ? moment(Number(relatedFilterValue.traded_date_range.start_time))
                      : null,
                    relatedFilterValue.traded_date_range.end_time
                      ? moment(Number(relatedFilterValue.traded_date_range.end_time))
                      : null
                  ]
                : [null, null]
            }
            placeholder={[formatDate(type === ApprovalListType.Approval ? SixMonthAgo : ThreeYearAgo), '结束日期']}
            onChange={handleDateSelect}
          />
        </section>
        <RadioIndeterminateGroup
          className="shrink-0 bg-gray-800 rounded-lg h-8 pl-3 text-gray-200"
          label="通过后回退成交单："
          options={HistoryPassOptions}
          otherCancel
          value={getApprovalListFilterHistoryPassValue(relatedFilterValue)}
          onChange={onHistoryPassChange}
          onItemClick={(val, isSelect) => {
            logFilterClick(isSelect, '回退', val.label?.toString());
          }}
        />
        <RadioIndeterminateGroup
          className="shrink-0 bg-gray-800 rounded-lg h-8 pl-3 text-gray-200"
          label="打印："
          options={PrintOptions}
          otherCancel
          value={relatedFilterValue.flag_printed !== undefined ? [relatedFilterValue.flag_printed] : []}
          onChange={val => {
            if (!val.length) {
              updateRelatedFilterValue({ flag_printed: void 0 });
            } else {
              updateRelatedFilterValue({ flag_printed: Boolean(val.at(0)) });
            }
          }}
          onItemClick={(val, isSelect) => {
            logFilterClick(isSelect, '打印', val.label?.toString());
          }}
        />
        <Button.Icon
          className="w-[108px] h-8 font-medium"
          type="gray"
          icon={<IconRefresh />}
          onClick={() => {
            logFilterClick(true, '清空', '点击清空');
            onShowAll();
          }}
        >
          清空条件
        </Button.Icon>
      </div>
    </div>
  );
};
