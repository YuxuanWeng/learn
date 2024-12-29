import { getSettlement } from '@fepkg/business/utils/liq-speed';
import moment from 'moment';
import {
  ReceiptDealBrokerState,
  ReceiptDealFormSideCommentState,
  ReceiptDealTradeFlag,
  ReceiptDealTradeState
} from '../types';

export const formatDay2TodayTimestamp = (str?: string) => {
  return str ? moment(str).startOf('day').valueOf().toString() : undefined;
};

type BrokerInTradeInfo = {
  broker_id?: string;
  broker_id_b?: string;
  broker_id_c?: string;
  broker_id_d?: string;
  broker_percent?: number;
  broker_percent_b?: number;
  broker_percent_c?: number;
  broker_percent_d?: number;
};

export const getTradeInfoByDefaultValue = (
  trades: ReceiptDealTradeState,
  brokers: ReceiptDealBrokerState[],
  commentState: ReceiptDealFormSideCommentState,
  isRealTrade: boolean
) => {
  const { brokerageComment, instSpecial } = commentState;
  const {
    inst_id,
    trader_id,
    trader_tag,
    brokerage,
    brokerage_type,
    trade_mode,
    flag,
    flag_nc,
    nc,
    pay_for_info,
    traded_date,
    delivery_date,
    liquidation_speed_list
  } = trades;

  // 真实对手方看桥标识有无点亮，非真实对手方代付和桥都为true
  const flag_bridge =
    (isRealTrade && flag === ReceiptDealTradeFlag.Bridge) || (!isRealTrade && flag !== ReceiptDealTradeFlag.Real);
  const flag_pay_for_inst = flag === ReceiptDealTradeFlag.Payfor;

  const [brokerA, brokerB, brokerC, brokerD] = brokers;
  const formatBrokers: BrokerInTradeInfo = {
    broker_id: brokerA?.broker?.user_id ?? '',
    broker_percent: brokerA?.percent ?? 0,

    broker_id_b: brokerB?.broker?.user_id ?? '',
    broker_percent_b: brokerB?.percent ?? 0,

    broker_id_c: brokerC?.broker?.user_id ?? '',
    broker_percent_c: brokerC?.percent ?? 0,

    broker_id_d: brokerD?.broker?.user_id ?? '',
    broker_percent_d: brokerD?.percent ?? 0
  };

  const tradedDate = formatDay2TodayTimestamp(traded_date);
  const deliveryDate = formatDay2TodayTimestamp(delivery_date);

  return {
    inst_id,
    trader_id,
    trader_tag,
    brokerage,
    brokerage_type,
    trade_mode,
    flag_bridge,
    flag_nc,
    nc,
    pay_for_info:
      pay_for_info?.flag_pay_for === false
        ? // 针对编辑模式，flag_pay_for为false时，后端不会主动清空其结构体下的信息，需要前端主动清空
          {
            flag_pay_for: false,
            pay_for_inst_id: '',
            pay_for_city: '',
            pay_for_trader_id: '',
            pay_for_trader_tag: '',
            flag_pay_for_nc: false,
            pay_for_nc: ''
          }
        : pay_for_info,
    flag_pay_for_inst,
    traded_date: tradedDate,
    delivery_date: deliveryDate,
    liquidation_speed_list:
      liquidation_speed_list ?? (tradedDate && deliveryDate ? [getSettlement(tradedDate, deliveryDate)] : void 0),

    inst_brokerage_comment: brokerageComment,
    inst_special: instSpecial,

    ...formatBrokers
  };
};
