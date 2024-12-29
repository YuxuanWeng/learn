import { useState } from 'react';
import { Side } from '@fepkg/services/types/enum';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useMarketDealForm } from '@/pages/Deal/Market/MarketDealForm/providers/FormProvider';
import { SideType } from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { InitMarketDealTradeState, MarketDealTradeState } from '../types';

type InitialState = {
  bidTrade?: InitMarketDealTradeState;
  ofrTrade?: InitMarketDealTradeState;
};

const transform2TradeState = (trade?: InitMarketDealTradeState): MarketDealTradeState => {
  return {
    institution_id: trade?.inst?.inst_id,
    trader_id: trade?.trader?.trader_id,
    trader_tag: trade?.trader?.tags?.at(0),
    broker_id: trade?.broker?.user_id
  };
};

const MarketDealTradesContainer = createContainer((initialState?: InitialState) => {
  const { operationType } = useMarketDealForm();
  const { bidTrade, ofrTrade } = initialState ?? {};

  const [defaultTrades] = useState(() => {
    return {
      [Side.SideBid]: bidTrade,
      [Side.SideOfr]: ofrTrade
    };
  });

  const [trades, updateTrades] = useImmer<Record<SideType, MarketDealTradeState>>(() => ({
    [Side.SideBid]: transform2TradeState(defaultTrades[Side.SideBid]),
    [Side.SideOfr]: transform2TradeState(defaultTrades[Side.SideOfr])
  }));

  return { defaultTrades, trades, updateTrades };
});

export const MarketDealTradesProvider = MarketDealTradesContainer.Provider;
export const useMarketDealTrades = MarketDealTradesContainer.useContainer;
