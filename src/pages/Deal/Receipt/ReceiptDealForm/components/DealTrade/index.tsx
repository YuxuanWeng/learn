import cx from 'classnames';
import { InstSearch, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { TraderModeOptions } from '@fepkg/business/constants/options';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { Button } from '@fepkg/components/Button';
import { SettlementDatePicker } from '@fepkg/components/DatePicker';
import { Input } from '@fepkg/components/Input';
import { Select } from '@fepkg/components/Select';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAdd, IconMinus } from '@fepkg/icon-park-react';
import { Institution } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { BrokerSearch } from '@/components/business/Search/BrokerSearch';
import { TraderSearch } from '@/components/business/Search/TraderSearch';
import { useITBSearchConnector } from '@/components/business/Search/providers/ITBSearchConnectorProvider';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { FlagStyleMap } from '../../constants';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealDate } from '../../providers/DateProvider';
import { useReceiptDealForm } from '../../providers/FormProvider';
import { ITBProviderWrapper } from '../../providers/ITBWrapper';
import { useReceiptDealTrades } from '../../providers/TradesProvider';
import { SideType } from '../../types';
import { Brokerage } from './Brokerage';
import { Brokers } from './Brokers';
import { NC } from './NC';
import { Payfor } from './Payfor';

const SideStyleMap = {
  [Side.SideBid]: { text: 'B', border: 'pl-3 pr-[11px] border-r' },
  [Side.SideOfr]: { text: 'O', border: 'pl-[11px] pr-3 border-l' }
};

const dateCls =
  'w-[340px] ml-9 [&_.ant-picker]:def:bg-gray-700 [&_.s-radio-group]:w-[112px] [&_.s-radio-group]:bg-gray-700';

const DateInner = ({ side }: { side: SideType }) => {
  const { formDisabled } = useReceiptDealForm();
  const { disabledDate, sideMutation, mutateSideDateState } = useReceiptDealDate();

  const [sideDealDateState] = sideMutation[side];

  return (
    <>
      <SettlementDatePicker
        prefix="交易日"
        className={dateCls}
        size="sm"
        allowClear={false}
        disabled={formDisabled}
        pickerValue={sideDealDateState.tradedDate}
        offsetMode="radio-square"
        offsetOptions={[
          { label: '今天', value: DateOffsetEnum.PLUS_0 },
          { label: '明天', value: DateOffsetEnum.PLUS_1 }
        ]}
        offsetValue={sideDealDateState?.tradedDateOffset}
        disabledDate={disabledDate}
        onPickerChange={date => mutateSideDateState(side, { type: 'traded-date', date })}
        onOffsetChange={offset => mutateSideDateState(side, { type: 'traded-date-offset', offset })}
      />

      <SettlementDatePicker
        prefix="交割日"
        className={dateCls}
        size="sm"
        allowClear={false}
        disabled={formDisabled}
        pickerValue={sideDealDateState.deliveryDate}
        offsetMode="radio-square"
        offsetOptions={[
          { label: '+0', value: DateOffsetEnum.PLUS_0 },
          { label: '+1', value: DateOffsetEnum.PLUS_1 }
        ]}
        offsetValue={sideDealDateState?.deliveryDateOffset}
        disabledDate={disabledDate}
        onPickerChange={date => mutateSideDateState(side, { type: 'delivery-date', date })}
        onOffsetChange={offset => mutateSideDateState(side, { type: 'delivery-date-offset', offset })}
      />
    </>
  );
};

const SearchInner = ({ side }: { side: SideType }) => {
  const { formDisabled } = useReceiptDealForm();
  const {
    flagDisabled,
    trades,
    updateTrades,
    changeTradeState,
    updateFlag,
    brokers,
    updateBrokers,
    addBroker,
    deleteBroker,
    updateBrokeragePercent,
    updateBrokerage,
    updateBrokerageType,
    traderInfoError,
    setTraderInfoError
  } = useReceiptDealTrades();
  const { hasBridge } = useReceiptDealBridge();

  const { handleInstChange, handleTraderChange, handleBrokerChange } = useITBSearchConnector();
  const { instSearchState } = useInstSearch();

  const tradeState = trades[side];
  const inst = instSearchState.selected?.original;
  const city = inst?.district_name ?? (inst as Institution)?.area?.name ?? '-';
  const sideBrokers = brokers[side];
  const broker = sideBrokers[0];

  const style = SideStyleMap[side];
  const flagStyle = FlagStyleMap[tradeState.flag];

  const showAdd = sideBrokers.length === 1;
  const showDelete = sideBrokers.length > 1;

  return (
    <>
      {/* 桥，机构，城市 */}
      <div className="flex h-7">
        <Button.Icon
          className="w-7 h-7 p-0 mr-2"
          bright
          {...flagStyle}
          disabled={formDisabled || flagDisabled[side]}
          onClick={() => updateFlag(side)}
          onKeyDown={preventEnterDefault}
        />

        <InstSearch
          label={`机构(${style.text})`}
          className="h-7"
          placeholder="请选择"
          error={traderInfoError[side]?.inst}
          disabled={formDisabled}
          onChange={opt => {
            setTraderInfoError(draft => {
              draft[side] = { inst: false };
            });
            handleInstChange(opt, (i, t, b) => {
              updateTrades(draft => {
                draft[side].inst_id = i?.inst_id;
                draft[side].trader_id = t?.trader_id;
              });

              // 与 brokers 的第一项联动
              updateBrokers(draft => {
                draft[side][0].broker = b;
              });
            });
          }}
        />

        <Tooltip
          truncate
          content={city}
        >
          <div className="shrink-0 w-[112px] h-7 ml-1 px-3 text-sm/7 text-gray-000 bg-gray-600 rounded-lg truncate">
            {city}
          </div>
        </Tooltip>
      </div>

      {/* 交易员，交易方式 */}
      <div className="flex h-7 ml-9">
        <TraderSearch
          className="w-[224px] h-7"
          error={traderInfoError[side]?.trader}
          disabled={formDisabled}
          searchParams={{ need_area: true }}
          onChange={opt => {
            setTraderInfoError(draft => {
              draft[side] = { trader: false };
            });
            handleTraderChange(opt, undefined, (i, t, b) => {
              updateTrades(draft => {
                draft[side].inst_id = i?.inst_id;
                draft[side].trader_id = t?.trader_id;
              });

              // 与 brokers 的第一项联动
              updateBrokers(draft => {
                draft[side][0].broker = b;
              });
            });
          }}
        />

        {/* 交易方式 */}
        <Select
          tabIndex={-1}
          size="sm"
          className="w-[112px] ml-1"
          clearIcon={null}
          disabled={formDisabled}
          options={TraderModeOptions}
          value={tradeState.trade_mode}
          onChange={val => changeTradeState(side, 'trade_mode', val)}
        />
      </div>

      {/* 佣金，佣金方式 */}
      <div className="flex gap-1 h-7 ml-9">
        <Input
          className="h-7 w-[224px]"
          label="佣金"
          disabled={formDisabled}
          maxLength={30}
          value={tradeState.brokerage}
          onChange={val => updateBrokerage(side, val, true)}
        />
        <Brokerage
          disabled={formDisabled}
          value={tradeState.brokerage_type}
          onChange={val => updateBrokerageType(side, val)}
        />
      </div>

      {hasBridge && <DateInner side={side} />}

      {/* 首个经纪人 */}
      <div className="flex gap-1 h-7 ml-9">
        <BrokerSearch
          className="h-7 w-[224px]"
          error={traderInfoError[side]?.broker}
          disabled={formDisabled}
          onChange={opt => {
            if (opt) {
              setTraderInfoError(draft => {
                draft[side] = { broker: false };
              });
            }
            handleBrokerChange(opt);

            updateBrokers(draft => {
              draft[side][0].broker = opt?.original;
            });
          }}
        />

        <Input
          error={traderInfoError[side]?.brokeragePercent}
          className="h-7 w-12"
          padding={[3, 8]}
          disabled={formDisabled}
          clearIcon={null}
          value={broker.percent?.toString() ?? ''}
          onChange={val => updateBrokeragePercent(side, 0, val)}
        />

        {showDelete && (
          <Button.Icon
            className="w-7 h-7"
            disabled={formDisabled}
            icon={<IconMinus />}
            onClick={() => deleteBroker(side, 0)}
          />
        )}

        {showAdd && (
          <Button.Icon
            className="w-7 h-7"
            disabled={formDisabled}
            icon={<IconAdd />}
            onClick={() => addBroker(side)}
          />
        )}
      </div>
    </>
  );
};

export const DealTrade = ({ side }: { side: SideType }) => {
  const { formDisabled } = useReceiptDealForm();
  const { defaultTrades, trades, changeTradeState, brokers, traderInfoError, setTraderInfoError } =
    useReceiptDealTrades();

  const tradeState = trades[side];

  const style = SideStyleMap[side];

  return (
    <div
      className={cx(
        'flex flex-col gap-2 w-[400px] max-w-[400px] py-3 bg-gray-800 border-0 border-solid border-gray-600 rounded-lg select-none',
        style.border
      )}
    >
      <ITBProviderWrapper
        brokerProviderKey={brokers[side][0].key}
        defaultValue={{
          inst: defaultTrades[side]?.inst,
          trader: defaultTrades[side]?.trader,
          broker: brokers[side][0]?.broker
        }}
      >
        <SearchInner side={side} />
      </ITBProviderWrapper>

      <Brokers side={side} />

      {/* NC */}
      <NC
        error={traderInfoError?.[side]?.nc}
        checked={!!tradeState.flag_nc}
        disabled={formDisabled}
        inputValue={tradeState.nc ?? ''}
        onFlagClick={checked => {
          setTraderInfoError(draft => {
            draft[side] = { nc: false };
          });
          if (!checked) changeTradeState(side, 'nc', '');
          changeTradeState(side, 'flag_nc', checked);
        }}
        onInputChange={val => {
          setTraderInfoError(draft => {
            draft[side] = { nc: !val };
          });
          changeTradeState(side, 'nc', val);
        }}
      />

      <div className="component-dashed-x mt-[9px]" />

      {/* 被代付信息 */}
      <Payfor
        className="mt-1"
        side={side}
      />
    </div>
  );
};
