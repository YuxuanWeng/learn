import { useEffect, useState } from 'react';
import cx from 'classnames';
import { DateOffsetEnum, DateOffsetValue } from '@fepkg/business/types/date';
import { formatDate } from '@fepkg/common/utils/date';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { Modal } from '@fepkg/components/Modal';
import { RadioButton } from '@fepkg/components/Radio';
import { Tabs } from '@fepkg/components/Tabs';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, uniq } from 'lodash-es';
import moment from 'moment';
import { DateShortcuts, DateShortcutsEnum } from '@/common/types/liq-speed';
import {
  getNotWeekOffset,
  isWeekCategory,
  isWeekCategoryOnService,
  transToLiquidationSpeedTag,
  transToShortcutEnum
} from '@/common/utils/liq-speed';
import { useKeyboard } from '@/pages/ProductPanel/hooks/useKeyboard';
import { useDateHotkeyRefs } from './useDateHotkeyRef';
import styles from './antd.module.less';

const TabPanes = [1, 2, 3] as const;

const tabs = [
  { key: 1, label: '1', className: '!h-7' },
  { key: 2, label: '2', className: '!h-7' },
  { key: 3, label: '3', className: '!h-7' }
];

export type SettlementGroup = {
  name: (typeof TabPanes)[number];
  value: LiquidationSpeed[];
}[];

export const defaultSettlementGroup = [{ [TabPanes[0]]: [] }, { [TabPanes[1]]: [] }, { [TabPanes[2]]: [] }];

type ISettlement = { [key in (typeof TabPanes)[number]]: LiquidationSpeed[] };
type DateOffsetType = { [key in (typeof TabPanes)[number]]: DateOffsetValue };
type DateType = { [key in (typeof TabPanes)[number]]: number | undefined };

type PropsType = {
  visible: boolean;
  defaultValue?: SettlementGroup;
  onOk: (v: SettlementGroup) => void;
  onClose?: () => void;
};

const defaultSettlements: ISettlement = {
  [TabPanes[0]]: [],
  [TabPanes[1]]: [],
  [TabPanes[2]]: []
};

export const DEFAULT_SETTLEMENT_GROUP_VALUE: SettlementGroup = [
  { name: TabPanes[0], value: [] },
  { name: TabPanes[1], value: [] },
  { name: TabPanes[2], value: [] }
];

const defaultDate = { [TabPanes[0]]: undefined, [TabPanes[1]]: undefined, [TabPanes[2]]: undefined };
const defaultOffsetStatus = { [TabPanes[0]]: false, [TabPanes[1]]: false, [TabPanes[2]]: false };
const defaultOffset: DateOffsetType = { 1: DateOffsetEnum.PLUS_0, 2: DateOffsetEnum.PLUS_0, 3: DateOffsetEnum.PLUS_0 };

const SettlementModal = ({ visible, onClose, onOk, defaultValue }: PropsType) => {
  const DShortcutsDay = DateShortcuts.filter(v => !isWeekCategory(v.key));
  const DShortcutsWeek = DateShortcuts.filter(v => isWeekCategory(v.key));

  const [activeTab, setActiveTab] = useState<(typeof TabPanes)[number]>(TabPanes[0]);
  const [settlements, setSettlements] = useState<ISettlement>(defaultSettlements);
  const [dateOffset, setDateOffset] = useState<DateOffsetType>(defaultOffset); // +0 还是 +1
  const [date, setDate] = useState<DateType>(defaultDate); // 日期
  const [dateOffsetDisabled, setDateOffsetDisabled] = useState(defaultOffsetStatus); // 偏移值禁用状态

  const reset = (data?: SettlementGroup) => {
    const newSettlements: ISettlement = {
      1: [],
      2: [],
      3: []
    };
    const newDates: DateType = {
      1: undefined,
      2: undefined,
      3: undefined
    };

    const newOffset: DateOffsetType = defaultOffset;
    const offsetVisible = cloneDeep(defaultOffsetStatus);

    data?.forEach(v => {
      const weeks = v.value.find(val => val.tag && isWeekCategoryOnService(val.tag));
      const dates = v.value.find(val => val.date);
      const offset = weeks?.offset || dates?.offset || DateOffsetEnum.PLUS_0;

      offsetVisible[v.name] = !weeks && !dates;

      newSettlements[v.name] = v.value;
      newDates[v.name] = dates?.date ? Number(dates.date) : undefined;
      newOffset[v.name] = offset;
    });

    setDate(newDates);
    setSettlements(newSettlements);
    setDateOffset(newOffset);
    setDateOffsetDisabled(offsetVisible);
  };

  // 同步默认值
  useEffect(() => {
    reset(defaultValue);
  }, [defaultValue]);

  // 更新offset的禁用状态
  useEffect(() => {
    if (!settlements[activeTab].length || !settlements[activeTab].some(v => v.date || isWeekCategoryOnService(v.tag))) {
      setDateOffsetDisabled(pre => ({ ...pre, [activeTab]: true }));
      setDateOffset(pre => ({ ...pre, [activeTab]: DateOffsetEnum.PLUS_0 }));
    } else {
      setDateOffsetDisabled(pre => ({ ...pre, [activeTab]: false }));

      const weeks = settlements[activeTab].find(val => val.tag && isWeekCategoryOnService(val.tag));
      const dates = settlements[activeTab].find(val => val.date);
      const offset = weeks?.offset || dates?.offset || DateOffsetEnum.PLUS_0;
      setDateOffset(pre => ({ ...pre, [activeTab]: offset }));
    }
  }, [activeTab, date, settlements]);

  const handleClose = () => {
    onClose?.();
    reset(defaultValue);
    setActiveTab(TabPanes[0]);
  };

  // 处理标签的点击事件
  const handleLabelClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, key: DateShortcutsEnum) => {
    const isCtrMode = event.metaKey || event.ctrlKey;
    const newSettlements = cloneDeep(settlements);
    const newDate = cloneDeep(date);
    const currentOffset = getNotWeekOffset(key, dateOffset[activeTab]);
    const liquidationSpeedTag = transToLiquidationSpeedTag(key);

    if (!isCtrMode) {
      setDate({ ...newDate, [activeTab]: undefined });
      setSettlements({
        ...newSettlements,
        [activeTab]: [{ date: undefined, tag: liquidationSpeedTag, offset: currentOffset || DateOffsetEnum.PLUS_0 }]
      });
      return;
    }

    let settlementsItem = newSettlements[activeTab];
    const offset = currentOffset || DateOffsetEnum.PLUS_0;
    if (settlementsItem.some(v => v.tag === liquidationSpeedTag && v.offset === offset))
      settlementsItem = settlementsItem.filter(v => !(v.tag === liquidationSpeedTag && v.offset === offset));
    else {
      settlementsItem = settlementsItem.concat([
        {
          date: undefined,
          tag: liquidationSpeedTag,
          offset
        }
      ]);
    }

    setSettlements({ ...newSettlements, [activeTab]: uniq(settlementsItem) });
  };

  const handleSubmit = useMemoizedFn(() => {
    if (!visible) return;
    const response: SettlementGroup = [];
    TabPanes.forEach(v => {
      response.push({ name: v, value: settlements[v] });
    });

    onOk(
      response.map(item => ({
        ...item,
        value: item.value.filter(v => !!v.date || !!v.tag)
      }))
    );
    handleClose();
  });

  const dateButtonRefs = useDateHotkeyRefs(visible);

  useKeyboard({ onEscDown: onClose, onEnterDown: handleSubmit });

  return (
    <Modal
      width={640}
      title="结算设置"
      className={styles.modal}
      visible={visible}
      onConfirm={handleSubmit}
      onCancel={handleClose}
    >
      <div className="py-2 px-3">
        <Tabs
          items={tabs}
          defaultActiveKey={tabs[0].key}
          activeKey={activeTab}
          onChange={item => setActiveTab(item.key as unknown as (typeof TabPanes)[number])}
        />

        <div
          className={cx(
            'bg-dashed-gray-500 bg-size-dashed bg-position-dashed bg-no-repeat block w-full mt-2 py-2 px-3 component-dashed rounded-lg',
            styles.date
          )}
        >
          <div className="w-fit flex justify-start items-center gap-1 bg-gray-600 rounded-lg">
            {DShortcutsDay.map((item, index) => {
              const exist = settlements[activeTab].some(v => transToShortcutEnum(v) === item.key);
              return (
                <RadioButton
                  disabled={item.key === DateShortcutsEnum.NONE}
                  ref={dateButtonRefs[index - 1]}
                  tabIndex={-1}
                  key={item.key}
                  className="!h-6 min-w-[80px] font-normal rounded-lg text-xs"
                  type="checkbox"
                  checked={exist && item.key !== DateShortcutsEnum.NONE}
                  value={item.key}
                  onClick={event => {
                    handleLabelClick(event, item.key);
                  }}
                >
                  {item.label}
                </RadioButton>
              );
            })}
          </div>
          <div className="w-fit flex justify-start items-center gap-1 flex-wrap mt-2 bg-gray-600 rounded-lg">
            {DShortcutsWeek.map((item, index) => {
              const exist = settlements[activeTab].some(v => transToShortcutEnum(v) === item.key);
              return (
                <RadioButton
                  ref={dateButtonRefs[index + 4]}
                  tabIndex={-1}
                  key={item.key}
                  className="!h-6 min-w-[80px] font-normal rounded-lg text-xs"
                  type="checkbox"
                  checked={exist}
                  value={item.key}
                  onClick={event => {
                    handleLabelClick(event, item.key);
                  }}
                >
                  {item.label}
                </RadioButton>
              );
            })}
          </div>
          <SettlementDatePicker
            allowClear
            offsetMode="radio-round"
            pickerProps={{ className: 'w-[240px]' }}
            offsetClassName="ml-16"
            className="mt-2 w-fit"
            size="xs"
            pickerValue={date[activeTab] ? moment(date[activeTab]).format('YYYY-MM-DD') : ''}
            offsetValue={dateOffset[activeTab] || DateOffsetEnum.PLUS_0}
            offsetDisabled={dateOffsetDisabled[activeTab]}
            onOffsetChange={v => {
              const newDateOffset = cloneDeep(dateOffset);
              setDateOffset({ ...newDateOffset, [activeTab]: v });
              const newSettlements = cloneDeep(settlements);
              const currentSettlements = newSettlements[activeTab].map(val => {
                if (isWeekCategoryOnService(val.tag) || !!val.date) {
                  val.offset = v;
                }
                return val;
              });
              setSettlements({ ...newSettlements, [activeTab]: currentSettlements });
            }}
            onPickerChange={(dateMoment, isCtrlMode) => {
              const fmtDate = formatDate(dateMoment);
              const newDate = cloneDeep(date);
              const newSettlements = cloneDeep(settlements);
              const currentSettlements = newSettlements[activeTab];
              let update = currentSettlements.filter(v => !v.date && v.tag !== LiquidationSpeedTag.Default);
              const dateFormat = dateMoment?.startOf('day').valueOf().toString();
              update.push({
                tag: undefined,
                date: dateFormat,
                offset: dateOffset[activeTab] || DateOffsetEnum.PLUS_0
              });

              if (!isCtrlMode) {
                update = [
                  {
                    tag: undefined,
                    date: dateFormat,
                    offset: dateOffset[activeTab] || DateOffsetEnum.PLUS_0
                  }
                ];
              } else {
                update.push({
                  tag: undefined,
                  date: dateFormat,
                  offset: dateOffset[activeTab] || DateOffsetEnum.PLUS_0
                });
              }
              setSettlements({ ...newSettlements, [activeTab]: update });
              setDate({ ...newDate, [activeTab]: fmtDate });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
export default SettlementModal;
