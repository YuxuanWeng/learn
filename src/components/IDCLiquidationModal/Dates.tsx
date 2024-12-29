import { HTMLProps, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { getEarlierDate, getNextTradedDate, useDisabledDealDate } from '@fepkg/business/hooks/useDealDateMutation';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { DateOffsetEnum, DateOffsetValue } from '@fepkg/business/types/date';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { RadioButton } from '@fepkg/components/Radio';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import moment from 'moment';
import { getTrdAndDelDate } from '@/pages/Spot/Panel/DealRecord/utils';
import { ReadOnly } from '../ReadOnly';

type IResult = { tradedDate: string; deliveryDate: string };
type IProps = {
  listedDate?: string;
  tradedDate?: string;
  deliveryDate?: string;
  onChange?: (result: IResult) => void;
  checkedIndex: number | undefined;
  setCheckedIndex: (val: number | undefined) => void;
};
type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

const TAGS = [
  {
    tag: LiquidationSpeedTag.Today,
    offset: 0,
    label: '+0'
  },
  {
    tag: LiquidationSpeedTag.Today,
    offset: 1,
    label: '+1'
  },
  {
    tag: LiquidationSpeedTag.Tomorrow,
    offset: 0,
    label: '明天+0'
  },
  {
    tag: LiquidationSpeedTag.Tomorrow,
    offset: 1,
    label: '明天+1'
  }
];

const formateDate = (date: string) => (date ? moment(Number(date)).format('YYYY-MM-DD') : '');

export default function Dates({
  listedDate,
  tradedDate,
  deliveryDate,
  onChange,
  checkedIndex,
  setCheckedIndex
}: IProps & IDom) {
  const [tradedDatePlus1, setTradedDatePlus1] = useState<string>();
  // 选中的tag index
  const isUnlisted = !!listedDate && +listedDate > moment().startOf('day').valueOf();
  const today = isUnlisted ? listedDate : moment().startOf('day').valueOf().toString();

  useEffect(() => {
    const result = moment(getNextTradedDate(tradedDate ?? today))
      .valueOf()
      .toString();

    setTradedDatePlus1(result);
  }, [isUnlisted, today, tradedDate]);

  const offset = useMemo(() => {
    if (tradedDate === deliveryDate) return 0;
    if (tradedDatePlus1 === deliveryDate) return 1;

    return undefined;
  }, [tradedDate, deliveryDate, tradedDatePlus1]);

  const displayTradedDate = useMemo(() => formateDate(tradedDate ?? ''), [tradedDate]);
  const displayDeliveryDate = useMemo(() => formateDate(deliveryDate ?? ''), [deliveryDate]);

  const options = useMemo(() => {
    let hasChecked = !!checkedIndex;
    return TAGS.map((tag, i) => {
      const result = getTrdAndDelDate(tag, listedDate);
      let checked;
      // 如果手动选择过，则仅判断
      if (hasChecked) {
        checked = checkedIndex === i;
        // 如果没有选择过，则自动选择第一个
      } else if (!hasChecked) {
        checked = result.tradedDate === tradedDate && result.deliveryDate === deliveryDate;
        if (checked) {
          hasChecked = true;
          setCheckedIndex(i);
        }
      }
      return {
        ...tag,
        ...result,
        checked
      };
    });
  }, [checkedIndex, deliveryDate, listedDate, tradedDate]);

  // 是否由日期+n表示
  // 即当前交割是否显示在日期一栏
  // 交割不属于四个选项则显示在日期
  const displayByDate = useMemo(() => {
    return checkedIndex === undefined;
  }, [checkedIndex]);

  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);
  const tradeDateRangeMoment = useMemo(
    () => tradeDateRange.map(item => moment(normalizeTimestamp(item))),
    [tradeDateRange]
  );

  const maxDeadlineDate = useMemo(() => {
    const bondMaxDeadlineDate = listedDate;
    const pmMaxDeadlineDate = formatDate(moment().add(3, 'M'));

    return isUnlisted && bondMaxDeadlineDate
      ? getEarlierDate(bondMaxDeadlineDate, pmMaxDeadlineDate)
      : pmMaxDeadlineDate;
  }, [isUnlisted, listedDate]);

  const disabledDate = useDisabledDealDate(
    tradeDateRangeMoment,
    formatDate(moment().subtract(1, 'week')),
    maxDeadlineDate
  );

  const onSettlementChange = (settlement: { tradedDate: string; deliveryDate: string }) => {
    const tagIndex = options.findIndex(
      o => o.tradedDate === settlement.tradedDate && o.deliveryDate === settlement.deliveryDate
    );
    if (tagIndex >= 0) {
      setCheckedIndex(tagIndex);
    } else {
      setCheckedIndex(void 0);
    }

    onChange?.(settlement);
  };
  return (
    <div>
      <div className="!bg-gray-600 w-full flex rounded-lg">
        {options.map((o, i) => (
          <RadioButton
            tabIndex={-1}
            key={`${o.tag}_${o.offset}`}
            checked={o.checked}
            onClick={() => {
              setCheckedIndex(i);
              onChange?.({
                tradedDate: o.tradedDate,
                deliveryDate: o.deliveryDate
              });
            }}
            className="flex-1 max-w-[130px] h-8flex-1 !h-6"
            clearInnerPadding
          >
            {o.label}
          </RadioButton>
        ))}
      </div>

      <SettlementDatePicker
        className="mt-2"
        placeholder="请选择"
        prefix="交易日"
        pickerProps={{ className: 'w-[208px] before:!w-[60px] before:ml-[-1px] h-6' }}
        disabledDate={disabledDate}
        size="xs"
        offsetMode="radio-round"
        offsetOptions={[
          { label: '+0', value: DateOffsetEnum.PLUS_0 },
          { label: '+1', value: DateOffsetEnum.PLUS_1 }
        ]}
        offsetDisabled={!displayByDate}
        offsetClassName="!ml-3"
        pickerValue={displayByDate ? displayTradedDate : undefined}
        offsetValue={displayByDate ? (offset as DateOffsetValue) : 0}
        onPickerChange={async val => {
          if (val == null) return;
          const tradedMoment = moment(getNextTradedDate(val, true));

          onSettlementChange({
            tradedDate: tradedMoment.valueOf().toString(),
            deliveryDate: tradedMoment.valueOf().toString()
          });
        }}
        onOffsetChange={async val => {
          if (!tradedDate) return;

          const newDeliveryDate = val === 1 ? moment(getNextTradedDate(tradedDate)).valueOf().toString() : tradedDate;

          onSettlementChange({
            tradedDate,
            deliveryDate: newDeliveryDate
          });
        }}
      />

      <div className={cx('w-full flex mt-2 gap-3 h-6')}>
        <ReadOnly
          containerClassName="flex-1"
          labelWidth={60}
          optionsClassName="h-6 !min-h-0"
          rowCount={1}
          options={[{ label: '交易日', value: displayTradedDate }]}
        />
        <ReadOnly
          containerClassName="flex-1"
          labelWidth={60}
          optionsClassName="h-6 !min-h-0"
          rowCount={1}
          options={[{ label: '交割日', value: displayDeliveryDate }]}
        />
      </div>
    </div>
  );
}
