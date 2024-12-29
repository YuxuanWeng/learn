import { DateOffsetEnum } from '@fepkg/business/types/date';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { Popover } from '@fepkg/components/Popover';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconLeftArrow } from '@fepkg/icon-park-react';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealDate } from '../../providers/DateProvider';
import { useReceiptDealForm } from '../../providers/FormProvider';

const dateCls =
  'w-[244px] mx-3 [&_.ant-picker]:def:bg-gray-700 [&_.s-radio-group]:w-[112px] [&_.s-radio-group]:bg-gray-700';

const CpDisplay = ({ instName, traderName }: { instName: string; traderName: string }) => {
  return (
    <div className="flex-center flex-col flex-1">
      <Tooltip
        truncate
        content={instName}
      >
        <span className="max-w-[98px] text-sm font-bold text-gray-100 truncate">{instName || '机构待定'}</span>
      </Tooltip>

      <Tooltip
        truncate
        content={traderName}
      >
        <span className="max-w-[98px] text-xs font-bold text-gray-300 truncate">{traderName || '-'}</span>
      </Tooltip>
    </div>
  );
};

const DateDisplay = ({ index }: { index: number }) => {
  const { formDisabled } = useReceiptDealForm();
  const { disabledDate, bridgesMutation, mutateBridgeDateState } = useReceiptDealDate();
  const { bridges } = useReceiptDealBridge();

  const prev = bridges[index];
  const next = bridges[index + 1];
  const [bridgeDealDateState] = bridgesMutation[index];

  return (
    <div className="flex flex-col gap-2 w-[268px] pb-3 bg-gray-800 border border-solid border-gray-600 rounded-lg overflow-hidden">
      <div
        className="flex h-11 rounded-t-[7.1px]"
        style={{ background: 'linear-gradient(var(--color-gray-600), var(--color-gray-800))' }}
      >
        <CpDisplay
          instName={prev?.instName}
          traderName={prev?.traderName}
        />

        <div className="flex-center w-10">
          <IconLeftArrow className="text-gray-300" />
        </div>

        <CpDisplay
          instName={next?.instName}
          traderName={next?.traderName}
        />
      </div>

      <div className="component-dashed-x h-px" />

      <SettlementDatePicker
        className={dateCls}
        dropdownCls="[&.ant-picker-dropdown]:!z-hightest undraggable"
        prefix=""
        size="sm"
        allowClear={false}
        disabled={formDisabled}
        pickerValue={bridgeDealDateState.tradedDate}
        offsetMode="radio-square"
        offsetOptions={[
          { label: '今天', value: DateOffsetEnum.PLUS_0 },
          { label: '明天', value: DateOffsetEnum.PLUS_1 }
        ]}
        offsetValue={bridgeDealDateState?.tradedDateOffset}
        disabledDate={disabledDate}
        onPickerChange={date => mutateBridgeDateState(index, { type: 'traded-date', date })}
        onOffsetChange={offset => mutateBridgeDateState(index, { type: 'traded-date-offset', offset })}
      />

      <SettlementDatePicker
        className={dateCls}
        dropdownCls="[&.ant-picker-dropdown]:!z-hightest undraggable"
        prefix=""
        size="sm"
        allowClear={false}
        disabled={formDisabled}
        pickerValue={bridgeDealDateState.deliveryDate}
        offsetMode="radio-square"
        offsetOptions={[
          { label: '+0', value: DateOffsetEnum.PLUS_0 },
          { label: '+1', value: DateOffsetEnum.PLUS_1 }
        ]}
        offsetValue={bridgeDealDateState?.deliveryDateOffset}
        disabledDate={disabledDate}
        onPickerChange={date => mutateBridgeDateState(index, { type: 'delivery-date', date })}
        onOffsetChange={offset => mutateBridgeDateState(index, { type: 'delivery-date-offset', offset })}
      />
    </div>
  );
};

export const DealBridgesSettlementPopover = () => {
  const { than1Bridge, than2Bridge, popoverOpen, setPopoverOpen } = useReceiptDealBridge();

  // 少于 2 座桥时，不展示
  if (!than1Bridge) return null;

  return (
    <Popover
      open={popoverOpen}
      arrow={false}
      closeOnInput={false}
      placement="bottom"
      floatingProps={{ className: '!p-[10px] !border-2 !bg-gray-700 !drop-shadow-modal' }}
      content={
        <div className="flex gap-3">
          {than1Bridge && <DateDisplay index={0} />}
          {than2Bridge && <DateDisplay index={1} />}
        </div>
      }
      onOpenChange={setPopoverOpen}
    >
      <div className="absolute left-1/2 top-[34px]" />
    </Popover>
  );
};
