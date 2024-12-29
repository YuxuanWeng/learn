import { HTMLProps, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { DateOffsetEnum, DateOffsetValue } from '@fepkg/business/types/date';
import { RadioButton } from '@fepkg/components/Radio';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { DealType } from '@fepkg/services/types/enum';
import { isEqual } from 'lodash-es';
import { liquidationDateToTag, uniqLiquidationList } from '@packages/utils/liq-speed';
import { DateShortcutsEnum, SettlementMethod, DateShortcuts as dateShortcuts } from '@/common/types/liq-speed';
import {
  formatLiquidationSpeedListToString,
  getOffsetOfPlus,
  isWeekCategory,
  isWeekDayByKey,
  transToShortcutEnum,
  turnClearSpeedToObject
} from '@/common/utils/liq-speed';
import './style.less';

export interface DShortcutsType {
  key: DateShortcutsEnum;
  label: string;
}

export interface DShortcutsCheckOption {
  ctrlKey?: boolean;
}

type IProps = {
  type?: DealType;
  value: LiquidationSpeed[];
  defaultLiqSpeedList?: LiquidationSpeed[];
  disabled?: boolean;
  buttonRefs?: Record<string, RefObject<HTMLButtonElement>>;
  autoInsertDefault?: boolean;
  defaultLabel?: string;
  buttonClassname?: string;
  asStaticText?: boolean;
  allowMultipleCheck?: boolean;
  prefix?: string;
  size?: SizeType;
  minWidth?: number | 'unset';
  onChange?: (methods: SettlementMethod[]) => void;
  onLabelCheck?: (item: (SettlementMethod | DShortcutsType)[], option?: DShortcutsCheckOption) => void;
  onDefaultCheck?: (item?: SettlementMethod | DShortcutsType, option?: DShortcutsCheckOption) => void;
};
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

export default function DateShortcuts({
  type,
  value,
  defaultLiqSpeedList = [],
  disabled,
  autoInsertDefault = true,
  defaultLabel = '不限',
  allowMultipleCheck = true,
  buttonClassname,
  asStaticText,
  prefix,
  minWidth = 64,
  onChange,
  onLabelCheck,
  onDefaultCheck,
  ...rest
}: IProps & IDom) {
  const source = useMemo(
    () =>
      (autoInsertDefault ? [{ key: DateShortcutsEnum.NONE, label: defaultLabel }] : []).concat(
        liquidationDateToTag(value)
          .map(transToShortcutEnum)
          .map(key => ({
            key,
            label: dateShortcuts.find(item => item.key === key)?.label
          })) as DShortcutsType[]
      ),
    [value, autoInsertDefault, defaultLabel]
  );

  const memoDefaultValue = useMemo(() => {
    const { date, labelSet } = turnClearSpeedToObject(defaultLiqSpeedList);
    return {
      date,
      labelSet: labelSet
        .filter(v => !!source.some(s => s.key === v.key))
        .map(v => ({ ...v, timestamp: v.timestamp || Date.now() }))
    };
  }, [defaultLiqSpeedList, source]);

  const [settlementMethod, setSettlementMethod] = useState<SettlementMethod[]>(memoDefaultValue.labelSet);
  const [dateOffset, setDateOffset] = useState<DateOffsetValue>(DateOffsetEnum.PLUS_0);

  function onLabelClick(event: React.MouseEvent<HTMLElement, MouseEvent>, item: SettlementMethod | DShortcutsType) {
    const timestamp = Date.now();
    const getMethod = (o: DateOffsetEnum) =>
      ({
        key: item.key,
        offset: o,
        timestamp
      }) as SettlementMethod;

    const isCtrlKey = allowMultipleCheck ? event.metaKey || event.ctrlKey : false;

    // 单选
    if (!isCtrlKey) {
      const offset = isWeekDayByKey(item.key) ? dateOffset : getOffsetOfPlus(item.key);
      setSettlementMethod([getMethod(offset)]);

      onLabelCheck?.([item], { ctrlKey: false });
      onDefaultCheck?.(void 0, { ctrlKey: isCtrlKey });
      return;
    }

    let settlements: SettlementMethod[] = [...settlementMethod];
    const { length } = settlements;
    const isExist = settlements.some(v => v.key === item.key);

    // 【不限】互斥
    if (item.key === DateShortcutsEnum.NONE) {
      onDefaultCheck?.(item, { ctrlKey: isCtrlKey });
      setSettlementMethod([getMethod(DateOffsetEnum.PLUS_0)]);

      onLabelCheck?.([item], { ctrlKey: true });
      return;
    }
    onDefaultCheck?.(void 0, { ctrlKey: isCtrlKey });
    const defaultIdx = settlements.findIndex(v => v.key === DateShortcutsEnum.NONE);
    if (defaultIdx > -1) settlements.splice(defaultIdx, 1);

    // 反选
    if (length === 1 && isExist) return;

    if (length > 1 && isExist) {
      settlements = settlements.filter(v => v.key !== item.key);
    } else {
      const offset = isWeekDayByKey(item.key) ? dateOffset : getOffsetOfPlus(item.key);
      settlements.push(getMethod(offset));
    }

    setSettlementMethod(settlements);

    onLabelCheck?.(settlements, { ctrlKey: true });
  }

  useEffect(
    function init() {
      const { date, labelSet } = memoDefaultValue;
      if (date.label) {
        setDateOffset(date.offset);
      } else {
        const offset = labelSet.find(v => isWeekCategory(v.key))?.offset || DateOffsetEnum.PLUS_0;
        setDateOffset(offset as DateOffsetValue);
      }
    },
    [memoDefaultValue, setSettlementMethod]
  );

  const prevResult = useRef<SettlementMethod[] | null>(null);
  useEffect(
    function result() {
      if (isEqual(settlementMethod, prevResult.current)) return;
      prevResult.current = settlementMethod;
      onChange?.(settlementMethod);
    },
    [onChange, settlementMethod]
  );

  useEffect(
    function reset() {
      if (defaultLiqSpeedList.length === 0) setSettlementMethod([]);
    },
    [defaultLiqSpeedList]
  );

  return asStaticText ? (
    <div
      {...rest}
      className="inline-block flex items-center"
    >
      <div className="bg-gray-700 rounded-lg pl-2 pr-8 py-[5px] flex text-sm items-center text-gray-200">
        {prefix ? <span>{prefix}</span> : null}{' '}
        <span className="text-orange-200 text-sm">
          {formatLiquidationSpeedListToString(uniqLiquidationList(value), 'MM.DD')}
        </span>
      </div>
    </div>
  ) : (
    <div
      {...rest}
      className="flex items-center w-full"
    >
      <div
        className={cx(
          'rounded-lg bg-gray-700 flex items-center gap-0.5 justify-between',
          rest?.className,
          source.length === 1 ? 'w-[130px]' : 'w-[264px]'
        )}
      >
        {source.map(item => {
          const exist = settlementMethod.some(v => v.key === item.key);
          return (
            <RadioButton
              tabIndex={-1}
              key={item.key}
              checked={exist}
              disabled={disabled}
              onClick={event => onLabelClick(event, item)}
              className={cx('flex-1 max-w-[130px] h-8', buttonClassname)}
              clearInnerPadding
            >
              {item.label}
            </RadioButton>
          );
        })}
      </div>
    </div>
  );
}
