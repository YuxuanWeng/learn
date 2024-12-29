import { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import cx from 'classnames';
import { RangePickerProps } from 'antd/es/date-picker';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { DateOffsetEnum, DateOffsetValue } from '@fepkg/business/types/date';
import { GetRefObjectGeneric } from '@fepkg/common/types';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { Checkbox } from '@fepkg/components/Checkbox';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { message } from '@fepkg/components/Message';
import { RadioButton } from '@fepkg/components/Radio';
import { SizeProps } from '@fepkg/components/types';
import { LiquidationSpeed, QuoteInsert } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { isEqual, uniq } from 'lodash-es';
import type { Moment } from 'moment';
import moment from 'moment';
import {
  DateShortcuts,
  DateShortcutsEnum,
  DateShortcutsLine1,
  DateShortcutsLine2,
  Dates,
  DaysStruct,
  SettlementDate,
  SettlementMethod
} from '@/common/types/liq-speed';
import { isEqualWithMomentOfDay } from '@/common/utils/date';
import {
  getDateWithProduct,
  getOffsetOfPlus,
  isWeekCategory,
  isWeekDayByKey,
  transformToLiqSpeedList,
  turnClearSpeedToObject
} from '@/common/utils/liq-speed';
import { trackPoint } from '@/common/utils/logger/point';
import { ReadOnly } from '../../ReadOnly';
import { useDateHotkeyRefs } from './useDateHotkeyRef';
import { useTradeAndDeliveryDate } from './useTradeAndDeliveryDate';
import { getConflictLabels, getRepeatData, getRetainTagIds } from './utils';
import styles from './antd.module.less';

interface DShortcutsType {
  key: DateShortcutsEnum;
  label: string;
}

export enum Source {
  Quote, // 触发源为报价窗口
  Sidebar, // 触发源为侧边栏
  BatchQuote,
  IQuote
}

export type DatesFnParams = Pick<QuoteInsert, 'traded_date' | 'settlement_date' | 'delivery_date'>;

interface IProps extends SizeProps {
  containerRef?: Ref<HTMLDivElement>;
  source?: Source; // 触发来源
  defaultLiqSpeedList?: LiquidationSpeed[]; // 初始的LiqSpeedList
  productType?: ProductType; // 台子
  defaultChecked?: boolean; // 是否默认选中checkbox
  disableDatePicker?: boolean; // 禁用日历选择器
  delistedDate?: string; // 债券下市日
  settlementContainerCls?: string; // 结算方式容器样式
  settlementBtnCls?: [string, string]; // 结算方式按钮样式
  offsetCls?: string; // offset的样式
  onCheckBoxChange?: (param: boolean) => void;
  onLiqSpeedListChange?: (liquidation_speed_list: LiquidationSpeed[]) => void;
  onDeliveryDateChange?: (dates: DatesFnParams) => void;
  logFlag?: string;
  listedDate?: string; // 未上市债券的上市日
  disableButtons?: boolean;
}

type SettleDayRef = GetRefObjectGeneric<DatePickRef<Moment>>;

// Algo Iquote\报价\协同报价，单条修改，多条修改\主面板侧边栏
export const QuoteDates = ({
  containerRef,
  settlementContainerCls,
  settlementBtnCls,
  offsetCls,
  source = Source.Quote,
  size = 'xs',
  defaultLiqSpeedList = [],
  productType = ProductType.BNC,
  defaultChecked = false,
  disableDatePicker = false,
  delistedDate = '',
  onCheckBoxChange,
  onLiqSpeedListChange,
  onDeliveryDateChange,
  logFlag,
  listedDate,
  disableButtons
}: IProps) => {
  const defaultLiqSpeeds = useRef(defaultLiqSpeedList);

  const memoDefaultValue = useMemo(() => {
    const { date, labelSet } = turnClearSpeedToObject(defaultLiqSpeeds.current);
    return { date, labelSet: labelSet.map(v => ({ ...v, timestamp: v.timestamp || Date.now() })) };
  }, []);

  const [checked, setChecked] = useState(defaultChecked); // 结算方式是否选中
  const [dateOffset, setDateOffset] = useState<DateOffsetValue>(DateOffsetEnum.PLUS_0); // +0 还是 +1
  const [dateOffsetDisabled, setDateOffsetDisabled] = useState(true); // 偏离是否禁用
  const [initWarning, setInitWarning] = useState(true); // 第一次进来时如果标签冲突要有提示语
  const [settlementMethod, setSettlementMethod] = useState<SettlementMethod[]>(memoDefaultValue.labelSet || []);
  const [settlementDate, setSettlementDate] = useState<SettlementDate>();
  const [tradedDate, setTradedDate] = useState<string | undefined>(undefined); // 交易日
  const [deliveryDate, setDeliveryDate] = useState<string | undefined>(undefined); // 交割日
  const [lastIsLabel, setLastIsLabel] = useState(false); // 最后点击的结算方式是dateShortsEnum类型标签还是datePicker

  const dateRef = useRef<HTMLDivElement>(null); // 备注面板dom ref
  const mergedContainerRefs = useMemo(
    () => mergeRefs(containerRef ? [dateRef, containerRef] : [dateRef]),
    [containerRef]
  );

  const pickerContainerRef = useRef<HTMLDivElement>(null);

  const [lock, setLock] = useState(true);

  const [labelDaysMap, setLabelDaysMap] = useState<DaysStruct[]>([]); // 选中的标签或日期与交易日交割日的对应关系
  const [dateDaysMap, setDateDaysMap] = useState<{
    date: string;
    offset: DateOffsetEnum;
    deliveryDate: Moment;
    tradedDate: Moment;
  }>(); // 选中的标签或日期与交易日交割日的对应关系

  const [treadDayAndDeliDays] = useTradeAndDeliveryDate(void 0, listedDate); // 所有标签与交易日交割日的对应关系

  const prevDelivery = useRef<string | undefined>();
  const dateButtonRefs = useDateHotkeyRefs();
  const datePickerRef = useRef<SettleDayRef>(null);

  /** 更新结算方式与结算方式对应的交易日交割日 */
  const updateSettlementMethod = useCallback(
    (data: SettlementMethod[]) => {
      try {
        if (!treadDayAndDeliDays.length) return;
        // 找到标签对应的交易日和交割日
        const days = data
          .filter(v => v.key !== DateShortcutsEnum.NONE)
          .map(settlement => {
            const response = treadDayAndDeliDays.find(v => v.key === settlement.key && v.offset === settlement.offset);
            return {
              key: settlement.key,
              offset: settlement.offset,
              tradedDate: response?.tradedDate || moment(),
              deliveryDate: response?.deliveryDate || moment()
            };
          });

        setSettlementMethod(data);
        setLabelDaysMap(days);
      } catch {
        message.warn('获取结算方式失败');
      }
    },
    [treadDayAndDeliDays]
  );

  /** 更新日期与日期对应的交易日交割日 */
  const updateSettlementDate = useMemoizedFn(async (date: SettlementDate) => {
    setSettlementDate(date);
    if (!date.label) setDateDaysMap(undefined);
    else {
      const traded = moment(getNextTradedDate(moment(date.label), true));

      const delivery = date.offset === DateOffsetEnum.PLUS_1 ? moment(getNextTradedDate(traded)) : traded;
      setDateDaysMap({
        date: date.label,
        offset: date.offset,
        tradedDate: traded,
        deliveryDate: delivery
      });
    }
  });

  /** 清除选中的日期 */
  const clearPickerDate = useMemoizedFn(async () => {
    await updateSettlementDate({ label: '', offset: dateOffset });
  });

  const getAllDates = useCallback(() => {
    const datePickerDates: Dates[] = [];
    if (dateDaysMap) {
      datePickerDates.push({ tradedDate: dateDaysMap.tradedDate, deliveryDate: dateDaysMap.deliveryDate });
    }
    const dates = [
      ...labelDaysMap.map(v => ({ tradedDate: v.tradedDate, deliveryDate: v.deliveryDate })),
      ...datePickerDates
    ];
    return dates;
  }, [dateDaysMap, labelDaysMap]);

  /** 更新交易日交割日的显示值 */
  useEffect(() => {
    setLock(true);
    if (source === Source.Sidebar && !checked) {
      setTradedDate('');
      setDeliveryDate('');
      setDateOffsetDisabled(true);
      setLock(false);
      return;
    }
    // 取日期的交易日交割日
    if (dateDaysMap && !settlementMethod.length) {
      setTradedDate(formatDate(dateDaysMap.tradedDate));
      setDeliveryDate(formatDate(dateDaysMap.deliveryDate));
      setLock(false);
      return;
    }
    // 取默认的交易日交割日
    const hasDefault = settlementMethod.some(v => v.key === DateShortcutsEnum.NONE);
    if (hasDefault) {
      const { traded, delivery } = getDateWithProduct(treadDayAndDeliDays, productType);
      setTradedDate(traded);
      setDeliveryDate(delivery);
      setLock(false);
      return;
    }

    // 取结算方式的交易日交割日
    const dates = getAllDates();
    const trades = uniq(dates.map(v => formatDate(v.tradedDate)));
    const deliveryDates = uniq(dates.map(v => formatDate(v.deliveryDate)));

    if (trades.length === 1) setTradedDate(trades[0]);
    if (trades.length > 1) setTradedDate('');

    if (deliveryDates.length === 1) setDeliveryDate(deliveryDates[0]);
    if (deliveryDates.length > 1) setDeliveryDate('');
    setLock(false);
  }, [checked, dateDaysMap, getAllDates, productType, settlementMethod, source, treadDayAndDeliDays]);

  /** 处理冲突 */
  useEffect(() => {
    if (!labelDaysMap.length) return;

    // 找到冲突的交易日和交割日
    const conflictDates = getRepeatData<Dates>(getAllDates());

    if (!conflictDates.length) return;
    let flag = !!dateDaysMap;
    (async () => {
      if (
        lastIsLabel &&
        dateDaysMap &&
        conflictDates.some(
          v =>
            isEqualWithMomentOfDay(v.tradedDate, dateDaysMap.tradedDate) &&
            isEqualWithMomentOfDay(v.deliveryDate, dateDaysMap.deliveryDate)
        )
      ) {
        if (initWarning) {
          message.warning('结算方式由于冲突被取消');
          setInitWarning(false);
        }
        await clearPickerDate();
        flag = false;
      }

      // 找到需要保留的标签下标, 第三个参数的意义: 如果已经选中了日期，则保留任何标签
      const retainLabelIds = getRetainTagIds(conflictDates, labelDaysMap, flag);

      // 找到冲突的标签
      const conflictLabels = getConflictLabels(conflictDates, labelDaysMap, retainLabelIds);

      // 清除冲突的标签
      const newSettlements = settlementMethod.filter(
        v => !conflictLabels.some(item => item.key === v.key && item.offset === v.offset)
      );

      if (isEqual(newSettlements, settlementMethod)) return;
      updateSettlementMethod(newSettlements);

      if (initWarning && checked) {
        const conflictKeys = new Set(conflictLabels.map(v => v.key));
        const labels = DateShortcuts.filter(item => conflictKeys.has(item.key));
        for (const v of labels) message.warning(`标签${v.label}由于冲突日被取消`, 1);
        setInitWarning(false);
      }
    })();
  }, [
    checked,
    clearPickerDate,
    dateDaysMap,
    getAllDates,
    initWarning,
    labelDaysMap,
    lastIsLabel,
    settlementMethod,
    updateSettlementMethod
  ]);

  /** 初始化还原默认值 */
  useEffect(() => {
    setChecked(defaultChecked);

    const { date, labelSet } = memoDefaultValue;

    // 恢复dateOffset
    if (date.label) {
      setDateOffset(date.offset);
    } else {
      const offset = labelSet.find(v => isWeekCategory(v.key))?.offset || DateOffsetEnum.PLUS_0;
      setDateOffset(offset as DateOffsetValue);
    }
    (async () => {
      await updateSettlementDate(date);
    })();
    updateSettlementMethod(labelSet);
  }, [defaultChecked, memoDefaultValue, updateSettlementDate, updateSettlementMethod]);

  /** liq_speed_list相关内容发生变化时的回调 */
  useEffect(() => {
    const newSettlementDate = settlementDate || { label: '', offset: DateOffsetEnum.PLUS_0 };
    const liquidationSpeeds = transformToLiqSpeedList(settlementMethod, newSettlementDate, dateOffset);
    if (!settlementDate?.label) {
      onLiqSpeedListChange?.(liquidationSpeeds);
      return;
    }
    const updates = liquidationSpeeds.filter(v => !!v.tag);
    updates.push({
      date: moment(settlementDate.label).valueOf().toString(),
      offset: dateOffset
    });

    onLiqSpeedListChange?.(updates);
  }, [dateOffset, onLiqSpeedListChange, settlementDate, settlementMethod]);

  /** 控制offset的禁用状态 */
  useEffect(() => {
    const settlement = settlementMethod.find(item => item.key.includes('weekday'));
    const dateOffsetIsVisible = settlementDate?.label || settlement;
    if (checked) setDateOffsetDisabled(!dateOffsetIsVisible);
  }, [checked, settlementDate?.label, settlementMethod]);

  /** 结算日期变化时的回调 */
  useEffect(() => {
    if (deliveryDate === prevDelivery.current || lock) return;
    prevDelivery.current = deliveryDate;
    onDeliveryDateChange?.({
      delivery_date: deliveryDate,
      traded_date: tradedDate,
      settlement_date: settlementDate?.label
    });
  }, [deliveryDate, lock, onDeliveryDateChange, settlementDate?.label, tradedDate]);

  /** 更新结算方式标签中的offset和日期中的offset */
  const handleDateOffsetChange = async (v: DateOffsetValue) => {
    // dateRef.current?.focus();
    const settlements = settlementMethod?.map(settlement => {
      if (isWeekDayByKey(settlement.key)) settlement.offset = v;
      else settlement.offset = getOffsetOfPlus(settlement.key);
      return settlement;
    });
    if (settlementDate) await updateSettlementDate({ ...settlementDate, offset: v });
    updateSettlementMethod(settlements);
    setDateOffset(v);
    trackPoint('date-shortcut-offset');
  };

  /** 处理标签的选中 */
  const onLabelClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    item: SettlementMethod | DShortcutsType
  ) => {
    setLastIsLabel(true);

    const isCtlMode = event.metaKey || event.ctrlKey;
    if (isCtlMode && item.key === DateShortcutsEnum.NONE) return void message.warning('多选模式不能选择默认标签');

    // 日历选择器单选与label互斥
    if (!settlementMethod?.length) {
      updateSettlementMethod([{ key: item.key, offset: getOffsetOfPlus(item.key, dateOffset), timestamp: Date.now() }]);
      if (!isCtlMode) await clearPickerDate();
      return void 0;
    }
    if (!isCtlMode) {
      trackPoint('date-shortcut-single');
      updateSettlementMethod([
        {
          key: item.key,
          offset: isWeekDayByKey(item.key) ? dateOffset : getOffsetOfPlus(item.key),
          timestamp: Date.now()
        }
      ]);
      await clearPickerDate();
      return void 0;
    }
    trackPoint('date-shortcut-multiple');
    let settlements: SettlementMethod[] = [...settlementMethod];
    const { length } = settlements;
    const isExist = settlements.some(v => v.key === item.key);
    const isExistDefault = settlements.some(v => v.key === DateShortcutsEnum.NONE);
    if (isExistDefault) {
      message.warning('多选模式不能选择默认标签');
      settlements = settlements.filter(v => v.key !== DateShortcutsEnum.NONE);
    }
    // 反选
    if (length === 1 && isExist) return void 0;
    if (length > 1 && isExist) settlements = settlements.filter(v => v.key !== item.key);
    else {
      settlements.push({
        key: item.key,
        offset: isWeekDayByKey(item.key) ? dateOffset : getOffsetOfPlus(item.key),
        timestamp: Date.now()
      });
    }
    updateSettlementMethod(settlements);
    return void 0;
  };

  /** 日历日期触发的函数 */
  const handlePickerSettlementChange = async (d: Moment | null, isCtrlMode?: boolean) => {
    setLastIsLabel(false);
    await updateSettlementDate({ label: formatDate(d), offset: dateOffset, timestamp: Date.now() });

    if (d === null && !settlementMethod.length) {
      updateSettlementMethod([{ key: DateShortcutsEnum.NONE, offset: dateOffset }]);
      return;
    }

    if (isCtrlMode) updateSettlementMethod(settlementMethod.filter(v => v.key !== DateShortcutsEnum.NONE));
    else updateSettlementMethod([]);
    datePickerRef.current?.blur();
    dateRef.current?.blur();
    trackPoint('date-picker-change');
  };

  /** 今日之前和下市日之后的日期需要被禁用不能选择, 3个月后的禁用 */
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    const pmMaxDeadlineDate = moment().add(3, 'M');
    const today = moment();
    let startDate: Moment | undefined;
    if (listedDate) {
      const listedTime = moment(normalizeTimestamp(listedDate));
      if (listedTime.isAfter(today)) {
        startDate = listedTime;
      }
    }

    const maxDeadlineDate =
      delistedDate && moment(pmMaxDeadlineDate).isAfter(normalizeTimestamp(delistedDate))
        ? normalizeTimestamp(delistedDate)
        : formatDate(pmMaxDeadlineDate);

    return (
      current < (startDate ?? today).subtract(1, 'days').endOf('day') ||
      current >= moment(maxDeadlineDate).subtract(1, 'days').endOf('day')
    );
  };

  return (
    <div
      // 需要能够被聚焦
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      ref={mergedContainerRefs}
      className={cx(
        'relative flex flex-col items-start gap-2 bg-dashed-gray-500 bg-size-dashed bg-position-dashed bg-no-repeat rounded-lg',
        source !== Source.IQuote ? 'py-2 px-3 focus:bg-dashed-primary-000 focus:outline-none' : 'mx-3 my-2 px-3 py-2'
      )}
    >
      {source === Source.Sidebar && (
        <Checkbox
          tabIndex={-1}
          checked={checked}
          onMouseDown={evt => evt.preventDefault()}
          onChange={val => {
            setChecked(val);
            onCheckBoxChange?.(val);
          }}
        >
          结算方式
        </Checkbox>
      )}

      <div className={cx('flex flex-col justify-start items-start gap-2', settlementContainerCls)}>
        <div className={cx('flex bg-gray-600 rounded-lg gap-1', styles.date)}>
          {DateShortcutsLine1.map((item, index) => {
            const exist = settlementMethod.some(v => v.key === item.key);
            return (
              <RadioButton
                ref={dateButtonRefs[index - 1]}
                onMouseDown={evt => {
                  evt.preventDefault();
                }}
                key={item.key}
                className={cx(
                  size === 'xs' ? '!h-6' : '!h-5',
                  'font-normal rounded-lg text-xs',
                  source === Source.IQuote ? 'min-w-[52px]' : 'min-w-[80px]',
                  settlementBtnCls?.[0]
                )}
                type="checkbox"
                disabled={!checked || disableButtons}
                checked={exist}
                value={item.key}
                onClick={event => {
                  onLabelClick(event, item);
                }}
              >
                {item.label}
              </RadioButton>
            );
          })}
        </div>

        <div className={cx('flex bg-gray-600 rounded-lg gap-1', source === Source.IQuote && 'w-full', styles.date)}>
          {DateShortcutsLine2.map((item, index) => {
            const exist = settlementMethod.some(v => v.key === item.key);
            return (
              <RadioButton
                ref={dateButtonRefs[index - 1 + 5]}
                onMouseDown={evt => {
                  evt.preventDefault();
                }}
                key={item.key}
                className={cx(
                  size === 'xs' ? '!h-6' : '!h-5',
                  'font-normal rounded-lg text-xs',
                  source === Source.IQuote ? 'flex-1' : 'min-w-[80px]',
                  settlementBtnCls?.[1]
                )}
                type="checkbox"
                disabled={!checked || disableButtons}
                checked={exist}
                value={item.key}
                onClick={event => {
                  onLabelClick(event, item);
                }}
              >
                {item.label}
              </RadioButton>
            );
          })}
        </div>

        <div
          className={source === Source.IQuote ? 'w-full' : ''}
          onMouseDown={evt => {
            // 为了不让点击组件内的内容聚焦外部面板
            if (evt.target !== pickerContainerRef.current) evt.preventDefault();
          }}
        >
          <SettlementDatePicker
            className={source === Source.IQuote ? 'w-full' : ''}
            ref={pickerContainerRef}
            size={size}
            allowClear
            offsetClassName={offsetCls}
            pickerProps={{ className: source === Source.IQuote ? 'w-[196px] flex-[0_1_auto]' : 'w-[240px]' }}
            pickerValue={settlementDate?.label || ''}
            offsetMode="radio-round"
            offsetValue={dateOffset}
            pickerRef={datePickerRef}
            disabledDate={disabledDate}
            pickerDisabled={disableDatePicker}
            disabled={!checked}
            offsetDisabled={dateOffsetDisabled}
            onPickerChange={handlePickerSettlementChange}
            onOffsetChange={handleDateOffsetChange}
          />
        </div>

        <div className="w-full">
          <ReadOnly
            rowCount={2}
            options={[
              { label: '交易日', value: tradedDate },
              { label: '交割日', value: deliveryDate, className: 'ml-6' }
            ]}
            optionsClassName={cx(size === 'xs' ? '!h-6' : '!h-8')}
            containerClassName="bg-transparent !px-0"
          />
        </div>
      </div>
    </div>
  );
};
