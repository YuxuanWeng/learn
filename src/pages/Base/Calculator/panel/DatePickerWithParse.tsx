import { KeyboardEvent } from 'react';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { formatDate } from '@fepkg/common/utils/date';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { fetchParsingClearSpeed } from '@fepkg/services/api/parsing/clear-speed';
import { trim } from 'lodash-es';
import moment from 'moment';
import { useProductParams } from '@/layouts/Home/hooks';
import { useCalcState } from '../providers/CalcProvider';

const DateReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const DatePickerWithParse = () => {
  const {
    bond,
    panelState,
    settleRef,
    offsetLoading,
    settlePickerOpen,
    setSettlePickerOpen,
    handleSettlementChange,
    disabledSettleDate,
    handleDateOffsetChange
  } = useCalcState();
  const disabled = !bond;

  const { productType } = useProductParams();

  const handleSettlementChangeWrapper = (val: moment.Moment | null) => {
    handleSettlementChange(val);
  };

  const handleKeyDown = async (evt: KeyboardEvent<HTMLInputElement>) => {
    const inputValue = evt.currentTarget.value;
    const isValid = moment(trim(inputValue)).isValid();
    // 已经是合法的日期格式，不需要识别，直接赋值
    if (isValid && DateReg.test(trim(inputValue))) return;

    if (evt.key !== KeyboardKeys.Enter) return;

    if (disabled) return;

    try {
      const parsingResult = await fetchParsingClearSpeed({
        user_input: inputValue,
        only_date: true,
        product_type: productType
      });

      if (!parsingResult.delivery_date) {
        await handleDateOffsetChange(DateOffsetEnum.PLUS_1);
        return;
      }

      const date = parsingResult.delivery_date;

      if (date && moment(Number(trim(date))).isValid()) {
        await handleSettlementChange(moment(Number(date)), false);
        return;
      }

      if (parsingResult.today_offset !== undefined) {
        await handleDateOffsetChange(parsingResult.today_offset, false);
      }
    } catch {
      await handleDateOffsetChange(DateOffsetEnum.PLUS_1);
    } finally {
      setSettlePickerOpen(false);
    }
  };

  return (
    <SettlementDatePicker
      disabled={disabled}
      className="h-7 z-10 mt-2"
      size="sm"
      pickerProps={{ className: '!w-[304px] h-7', inputReadOnly: false, onKeyDown: handleKeyDown }}
      offsetClassName="!w-[118px] !h-7"
      placeholder="请输入"
      prefix="结算日期"
      offsetMode="select"
      pickerRef={node => {
        settleRef.current = node;
      }}
      pickerOpen={settlePickerOpen}
      onPickerOpenChange={setSettlePickerOpen}
      disabledDate={disabledSettleDate}
      offsetOptions={[
        { label: 'T+0', value: DateOffsetEnum.PLUS_0 },
        { label: 'T+1', value: DateOffsetEnum.PLUS_1 },
        { label: '其他', value: DateOffsetEnum.OTHER }
      ]}
      pickerValue={panelState.settlementDate ? formatDate(panelState.settlementDate) : undefined}
      offsetValue={panelState.offset}
      onPickerChange={handleSettlementChangeWrapper}
      onOffsetChange={handleDateOffsetChange}
      offsetDisabled={offsetLoading}
    />
  );
};
