import { useState } from 'react';
import { ReceiptDealTrade } from '@fepkg/services/types/common';
import { BrokerageType, Side, TradeMode } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { omit } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { v4 } from 'uuid';
import { miscStorage } from '@/localdb/miscStorage';
import { BrokerageTypeMap } from '../constants';
import { useReceiptDealFormParams } from '../hooks/useParams';
import {
  OmitReceiptDealTradeKeys,
  ReceiptDealBrokerState,
  ReceiptDealFormMode,
  ReceiptDealTradeFlag,
  ReceiptDealTradeInfoErrorState,
  ReceiptDealTradeState,
  SideType
} from '../types';
import { getDuplicateBroker } from '../utils/validation/validationDealTradeInfo';
import { useReceiptDealBridge } from './BridgeProvider';
import { useReceiptDealDate } from './DateProvider';
import { useReceiptDealForm } from './FormProvider';

/** 目前需支持的最大 broker 数量 */
export const MAX_BROKERS_LENGTH = 4;

const DEFAULT_TRADE_STATE: ReceiptDealTradeState = {
  flag: ReceiptDealTradeFlag.Real,
  flag_nc: false,
  brokerage: BrokerageTypeMap[BrokerageType.BrokerageTypeC],
  brokerage_type: BrokerageType.BrokerageTypeC,
  trade_mode: TradeMode.QQ,
  pay_for_info: {
    flag_pay_for: false,
    flag_pay_for_nc: false
  }
};

const transform2TradeState = (trade?: ReceiptDealTrade): ReceiptDealTradeState => {
  let flag = ReceiptDealTradeFlag.Real;
  if (trade?.flag_pay_for_inst) flag = ReceiptDealTradeFlag.Payfor;
  else if (trade?.flag_bridge) flag = ReceiptDealTradeFlag.Bridge;

  return {
    ...DEFAULT_TRADE_STATE,
    ...omit(trade, OmitReceiptDealTradeKeys),
    nc: trade?.nc ?? '',
    inst_id: trade?.inst?.inst_id,
    trader_id: trade?.trader?.trader_id,
    trader_tag: trade?.trader?.tags?.[0],
    pay_for_info: {
      flag_pay_for: trade?.pay_for_info?.flag_pay_for,
      pay_for_city: trade?.pay_for_info?.pay_for_city,
      flag_pay_for_nc: trade?.pay_for_info?.flag_pay_for_nc,
      pay_for_nc: trade?.pay_for_info?.pay_for_nc ?? '',
      pay_for_inst_id: trade?.pay_for_info?.pay_for_inst?.inst_id,
      pay_for_trader_id: trade?.pay_for_info?.pay_for_trader?.trader_id,
      pay_for_trader_tag: trade?.pay_for_info?.pay_for_trader?.tags?.[0]
    },
    flag
  };
};

const transform2BrokerStates = (trade?: ReceiptDealTrade) => {
  const res: ReceiptDealBrokerState[] = [{ key: v4(), broker: miscStorage?.userInfo, percent: 100 }];
  const { broker, broker_b, broker_c, broker_d, broker_percent, broker_percent_b, broker_percent_c, broker_percent_d } =
    trade ?? {};

  if (broker) res[0] = { key: v4(), broker, percent: broker_percent };
  if (broker_b) res.push({ key: v4(), broker: broker_b, percent: broker_percent_b });
  if (broker_c) res.push({ key: v4(), broker: broker_c, percent: broker_percent_c });
  if (broker_d) res.push({ key: v4(), broker: broker_d, percent: broker_percent_d });

  return res;
};

const ReceiptDealTradesContainer = createContainer(() => {
  const { mode, defaultReceiptDeal } = useReceiptDealFormParams();
  const { formDisabled, realTradeStatus, connectBrokerage } = useReceiptDealForm();
  const { sideMutation } = useReceiptDealDate();
  const { hasBridge } = useReceiptDealBridge();

  const { bridge_code, bid_trade_info, ofr_trade_info } = defaultReceiptDeal ?? {};

  const isEdit = mode === ReceiptDealFormMode.Edit;

  const [defaultTrades] = useState(() => {
    return {
      [Side.SideBid]: isEdit ? bid_trade_info : undefined,
      [Side.SideOfr]: isEdit ? ofr_trade_info : undefined
    };
  });

  const [bidDealDateState] = sideMutation[Side.SideBid];
  const [ofrDealDateState] = sideMutation[Side.SideOfr];

  const [trades, updateTrades] = useImmer<Record<SideType, ReceiptDealTradeState>>(() => ({
    [Side.SideBid]: { ...DEFAULT_TRADE_STATE, ...transform2TradeState(defaultTrades[Side.SideBid]) },
    [Side.SideOfr]: { ...DEFAULT_TRADE_STATE, ...transform2TradeState(defaultTrades[Side.SideOfr]) }
  }));

  const [brokers, updateBrokers] = useImmer<Record<SideType, ReceiptDealBrokerState[]>>(() => ({
    [Side.SideBid]: transform2BrokerStates(defaultTrades[Side.SideBid]),
    [Side.SideOfr]: transform2BrokerStates(defaultTrades[Side.SideOfr])
  }));

  const [traderInfoError, setTraderInfoError] = useImmer<ReceiptDealTradeInfoErrorState>({
    [Side.SideBid]: {},
    [Side.SideOfr]: {}
  });

  /** 快捷更新 trade state 当个字段的值 */
  const changeTradeState = useMemoizedFn(
    <F extends keyof ReceiptDealTradeState>(side: SideType, field: F, val: ReceiptDealTradeState[F]) => {
      updateTrades(draft => {
        draft[side][field] = val;
      });
    }
  );

  const flagDisabled = {
    [Side.SideBid]:
      // 若为真实对手方，有桥时，禁用
      Boolean(realTradeStatus[Side.SideBid] && (hasBridge || (isEdit && bridge_code))) ||
      // 若对手为真实对手方，且有桥模块，禁用？
      Boolean(realTradeStatus[Side.SideOfr] && hasBridge) ||
      // 若对手方为非真实成交方时，且为编辑状态有桥时，禁用
      Boolean(!realTradeStatus[Side.SideOfr] && isEdit && bridge_code),
    [Side.SideOfr]:
      // 若为真实对手方，有桥时，禁用
      Boolean(realTradeStatus[Side.SideOfr] && (hasBridge || (isEdit && bridge_code))) ||
      // 若对手为真实对手方，且有桥模块，禁用？
      Boolean(realTradeStatus[Side.SideBid] && hasBridge) ||
      // 若对手方为非真实成交方时，且为编辑状态有桥时，禁用
      Boolean(!realTradeStatus[Side.SideBid] && isEdit && bridge_code)
  };

  const updateBrokerage = useMemoizedFn((side: SideType, val: string, connect: boolean) => {
    updateTrades(draft => {
      draft[side].brokerage = val;

      if (
        connect &&
        draft[side].brokerage_type !== BrokerageType.BrokerageTypeN &&
        draft[side].brokerage_type !== BrokerageType.BrokerageTypeR
      ) {
        draft[side].brokerage_type = BrokerageType.BrokerageTypeN;
        connectBrokerage(side, BrokerageType.BrokerageTypeN);
      }
    });
  });

  const updateBrokerageType = useMemoizedFn((side: SideType, val: BrokerageType) => {
    changeTradeState(side, 'brokerage_type', val);
    updateBrokerage(side, BrokerageTypeMap[val], false);
    connectBrokerage(side, val);
  });

  const autoBrokeragePercentDisabled = (() => {
    if (formDisabled) return true;

    const bidBrokers = brokers[Side.SideBid];
    const ofrBrokers = brokers[Side.SideOfr];

    if (bidBrokers.length !== 1 || ofrBrokers.length !== 1) return true;
    if (!bidBrokers[0]?.broker?.user_id || !ofrBrokers[0]?.broker?.user_id) return true;
    if (bidBrokers[0]?.broker?.user_id === ofrBrokers[0]?.broker?.user_id) return true;

    return false;
  })();

  /** 自动佣金 */
  const autoBrokeragePercent = useMemoizedFn(() => {
    if (autoBrokeragePercentDisabled) return;

    updateBrokers(draft => {
      const [bidFirst] = draft[Side.SideBid];
      const [ofrFirst] = draft[Side.SideOfr];

      draft[Side.SideBid][0].percent = 50;
      draft[Side.SideOfr][0].percent = 50;

      draft[Side.SideBid][1] = { ...ofrFirst, percent: 50 };
      draft[Side.SideOfr][1] = { ...bidFirst, percent: 50 };
    });
  });

  const updateBrokeragePercent = useMemoizedFn((side: SideType, idx: number, val: string) => {
    updateBrokers(draft => {
      const count = draft[side].length;

      if (!/^$|^(0|[1-9](\d?){1,2})|100$/.test(val)) return;

      let percent: number | undefined;

      if (val) {
        percent = parseInt(val, 10);
        if (percent > 100) percent = 100;
      }

      if (count === 2) {
        // 当经纪人数为2个时，拥挤比例互补，和总为100
        draft[side][0].percent = idx === 0 ? percent : 100 - (percent ?? 0);
        draft[side][1].percent = idx === 1 ? percent : 100 - (percent ?? 0);
      } else {
        draft[side][idx].percent = percent;
      }

      const total = draft[side].reduce((acc, cur) => acc + (cur.percent || 0), 0) || 0;

      setTraderInfoError(draftError => {
        draftError[side] = {
          brokeragePercent: total > 100
        };
      });
    });
  });

  const addBroker = useMemoizedFn((side: SideType) => {
    updateBrokers(draft => {
      if (draft[side].length >= MAX_BROKERS_LENGTH) return;

      draft[side].push({ key: v4() });
    });
  });

  const deleteBroker = useMemoizedFn((side: SideType, idx: number) => {
    updateBrokers(draft => {
      draft[side].splice(idx, 1);

      // 当只存在1个经纪人时，佣金比例总等于100
      if (draft[side].length === 1) draft[side][0].percent = 100;

      const total = draft[side].reduce((acc, cur) => acc + (cur.percent || 0), 0);
      const duplicates = getDuplicateBroker(draft[side].map(i => i.broker?.user_id).filter(Boolean));

      setTraderInfoError(draftError => {
        if (duplicates) {
          for (const [key, value] of Object.entries(duplicates)) {
            draftError[side] = {
              [key]: value
            };
          }
        } else {
          draftError[side] = { broker: false };
          draftError[side] = { broker_b: false };
          draftError[side] = { broker_c: false };
          draftError[side] = { broker_d: false };
        }
        draftError[side] = { brokeragePercent: total > 100 };
      });
    });
  });

  /** 更新标识 */
  const updateFlag = useMemoizedFn((side: SideType) => {
    const otrSide = side === Side.SideBid ? Side.SideOfr : Side.SideBid;

    const { flag } = trades[side];

    // 若为真实对手方
    if (realTradeStatus[side]) {
      // 若有桥（有桥模块或过桥码），仅支持「灭」
      if (hasBridge || (isEdit && bridge_code)) {
        changeTradeState(side, 'flag', ReceiptDealTradeFlag.Real);
        return;
      }

      const toggle2Real = () => {
        // 点为「灭」时，将两方佣金置为「C」
        changeTradeState(side, 'flag', ReceiptDealTradeFlag.Real);
        updateBrokerageType(side, BrokerageType.BrokerageTypeC);
        updateBrokerageType(otrSide, BrokerageType.BrokerageTypeC);
      };

      const toggle2Payfor = () => {
        // 点为「代」时，点「灭」另一方，将该方向佣金置为「R」，另一方佣金置为「N」
        changeTradeState(side, 'flag', ReceiptDealTradeFlag.Payfor);
        changeTradeState(otrSide, 'flag', ReceiptDealTradeFlag.Real);
        updateBrokerageType(side, BrokerageType.BrokerageTypeR);
        updateBrokerageType(otrSide, BrokerageType.BrokerageTypeN);
      };

      // 若无桥，支持「灭」、「代」切换，但两方不可同时为「代」
      if (flag === ReceiptDealTradeFlag.Payfor) toggle2Real();
      else if (flag === ReceiptDealTradeFlag.Real) toggle2Payfor();
    } else {
      // 若为非真实对手方

      // 若与非真实对手方相连，禁用，保持原状
      if (!realTradeStatus[otrSide]) return;

      const toggle2Bridge = () => {
        // 点为「桥」时，该方向佣金置为「B」
        changeTradeState(side, 'flag', ReceiptDealTradeFlag.Bridge);
        updateBrokerageType(side, BrokerageType.BrokerageTypeB);

        // 若另一方（需代付机构相连方向）为真实对手方，另一方佣金置为「C」
        if (realTradeStatus[otrSide]) updateBrokerageType(otrSide, BrokerageType.BrokerageTypeC);
      };

      const toggle2Payfor = () => {
        // 点为「代」时，该方向佣金置为「C」
        changeTradeState(side, 'flag', ReceiptDealTradeFlag.Payfor);
        updateBrokerageType(side, BrokerageType.BrokerageTypeC);

        // 若另一方（需代付机构相连方向）为真实对手方，另一方佣金置为「N」
        if (realTradeStatus[otrSide]) updateBrokerageType(otrSide, BrokerageType.BrokerageTypeN);
      };

      // 若与真实对手方相连，支持「桥」、「代」切换
      if (flag === ReceiptDealTradeFlag.Bridge) toggle2Payfor();
      else if (flag === ReceiptDealTradeFlag.Payfor) toggle2Bridge();
    }
  });

  return {
    flagDisabled,
    defaultTrades,
    trades: {
      [Side.SideBid]: {
        ...trades[Side.SideBid],
        traded_date: bidDealDateState.tradedDate,
        delivery_date: bidDealDateState.deliveryDate
      },
      [Side.SideOfr]: {
        ...trades[Side.SideOfr],
        traded_date: ofrDealDateState.tradedDate,
        delivery_date: ofrDealDateState.deliveryDate
      }
    },
    updateTrades,
    changeTradeState,
    brokers,
    updateBrokers,
    addBroker,
    deleteBroker,
    updateBrokeragePercent,
    updateFlag,
    updateBrokerage,
    updateBrokerageType,
    autoBrokeragePercentDisabled,
    autoBrokeragePercent,
    traderInfoError,
    setTraderInfoError
  };
});

export const ReceiptDealTradesProvider = ReceiptDealTradesContainer.Provider;
export const useReceiptDealTrades = ReceiptDealTradesContainer.useContainer;
