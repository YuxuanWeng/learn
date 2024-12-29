import { useRef, useState } from 'react';
import { normalizeTimestamp } from '@fepkg/common/utils/date';
import { message } from '@fepkg/components/Message';
import { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { ReceiptDealTrade } from '@fepkg/services/types/common';
import {
  BrokerageType,
  DealMarketType,
  Direction,
  ExerciseType,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment,
  SettlementMode,
  Side
} from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import {
  ReceiptDealFormError,
  ReceiptDealFormMode,
  ReceiptDealFormSideCommentState,
  ReceiptDealFormState,
  ReceiptDealRealTradeStatus
} from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { useReceiptDealFormParams } from '../hooks/useParams';

type InitialState = {
  /** 是否禁用 ReceiptDealForm */
  disabled?: boolean;
};

const getDefaultCommentState = (trade?: ReceiptDealTrade): ReceiptDealFormSideCommentState => ({
  brokerageComment:
    trade?.inst_brokerage_comment ?? ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage,
  brokerageCommentDisabled: trade?.brokerage_type !== BrokerageType.BrokerageTypeN,
  instSpecial: trade?.inst_special ?? ''
});

const ReceiptDealFormContainer = createContainer((initialState?: InitialState) => {
  const { defaultReceiptDeal, mode } = useReceiptDealFormParams();

  const notJoin = mode !== ReceiptDealFormMode.Join;
  const {
    receipt_deal_id,
    receipt_deal_status,
    direction = Direction.DirectionTrd,
    deal_market_type = DealMarketType.SecondaryMarket,
    yield: yield_,
    yield_to_execution,
    spread,
    full_price,
    clean_price,
    volume,
    deal_time = Date.now(),
    backend_msg = '',
    other_detail = '',
    bid_trade_info,
    ofr_trade_info,
    flag_internal,
    flag_send_market = true,
    settlement_mode = SettlementMode.DVP,
    settlement_amount,
    is_exercise = ExerciseType.ExerciseTypeNone,
    bid_real_receipt_deal_id,
    ofr_real_receipt_deal_id
  } = defaultReceiptDeal ?? {};

  const [formState, updateFormState] = useImmer<ReceiptDealFormState>(() => {
    if (mode === ReceiptDealFormMode.Edit && receipt_deal_status === ReceiptDealStatus.ReceiptDealToBeHandOver) {
      message.warning('当前成交单未移交，暂不支持编辑！');
    }

    return {
      direction,
      dealMarketType: deal_market_type,
      yield: notJoin && yield_ ? yield_.toFixed(4) : '',
      yieldToExecution: notJoin && yield_to_execution ? yield_to_execution.toFixed(4) : '',
      spread: notJoin && spread ? spread.toFixed(4) : '',
      fullPrice: notJoin && full_price ? full_price.toFixed(4) : '',
      cleanPrice: notJoin && clean_price ? clean_price.toFixed(4) : '',
      volume: String(volume || ''),
      dealTime: notJoin ? moment(normalizeTimestamp(deal_time)) : moment(),
      backendMessage: notJoin ? backend_msg : '',
      otherDetail: notJoin ? other_detail : '',
      bidCommentState: getDefaultCommentState(notJoin ? bid_trade_info : void 0),
      ofrCommentState: getDefaultCommentState(notJoin ? ofr_trade_info : void 0),
      internal: notJoin ? flag_internal : void 0,
      sendMarket: notJoin ? flag_send_market : true,
      settlementMode: settlement_mode,
      settlementAmount: notJoin ? settlement_amount?.toFixed(4) ?? '' : '',
      exercise: is_exercise
    };
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, updateFormError] = useImmer<Partial<ReceiptDealFormError>>({});

  /** 计算器是否禁用（进入面板时不自动调用计算器，只有当要素修改时才启动计算器） */
  const [calcDisabled, setCalcDisabled] = useState(notJoin);
  /** 全价是否正在修改中 */
  const [fullPriceEditing, setFullPriceEditing] = useState(false);
  /** 调用计算器后的高精度数据 */
  const highlyAccurateData = useRef<Partial<BaseDataMulCalculate.CalculateResult>>({
    yield: yield_,
    yield_to_execution,
    spread,
    full_price,
    clean_price,
    settlement_amount
  });

  /** 更新 formState（只更新一个字段的值时可使用） */
  const changeFormState = useMemoizedFn(
    <T extends keyof ReceiptDealFormState>(key: T, val: ReceiptDealFormState[T]) => {
      updateFormState(draft => {
        draft[key] = val;
      });
    }
  );

  // add 时，真实对手方通过 Bid/Ofr 的 Trade 中的桥标识来判断
  // update 时，真实对手方通过 defaultReceiptDeal 中 bid_real_receipt_deal_id/ofr_real_receipt_deal_id 是否等于该 receipt_deal_id 来判断

  /** 真实对手方状态，该方向为 true 意味该方向为真实对手方 */
  const realTradeStatus: ReceiptDealRealTradeStatus = { [Side.SideBid]: true, [Side.SideOfr]: true };
  if (mode === ReceiptDealFormMode.Edit) {
    realTradeStatus[Side.SideBid] = receipt_deal_id === bid_real_receipt_deal_id;
    realTradeStatus[Side.SideOfr] = receipt_deal_id === ofr_real_receipt_deal_id;
  }

  /** 联动佣金备注 */
  const connectBrokerage = (side: Side, val: BrokerageType) => {
    updateFormState(draft => {
      const field = side === Side.SideBid ? 'bidCommentState' : 'ofrCommentState';

      if (val === BrokerageType.BrokerageTypeN) {
        draft[field].brokerageComment =
          ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNoSignOrObjection;
        draft[field].brokerageCommentDisabled = false;
      } else if (val === BrokerageType.BrokerageTypeR) {
        draft[field].brokerageComment = ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentSpecial;
        draft[field].brokerageCommentDisabled = true;
      } else {
        draft[field].brokerageComment = ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage;
        draft[field].brokerageCommentDisabled = true;
      }
    });
  };

  return {
    formDisabled: initialState?.disabled,
    formState,
    formError,
    updateFormState,
    changeFormState,
    updateFormError,

    formLoading,
    setFormLoading,

    calcDisabled,
    setCalcDisabled,
    fullPriceEditing,
    setFullPriceEditing,
    highlyAccurateData,

    realTradeStatus,

    connectBrokerage
  };
});

export const ReceiptDealFormProvider = ReceiptDealFormContainer.Provider;
export const useReceiptDealForm = ReceiptDealFormContainer.useContainer;
