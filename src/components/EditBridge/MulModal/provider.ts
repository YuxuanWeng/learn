import { useMemo, useRef, useState } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource, Side } from '@fepkg/services/types/enum';
import { ReceiptDealUpdateBridgeV2 } from '@fepkg/services/types/receipt-deal/update-bridge-v2';
import { useQuery } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { groupBy, last } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useLogger } from '@/common/providers/LoggerProvider';
import { updateBridges } from '@/common/services/api/bridge/bridges-update';
import { fetchPayForInstFee } from '@/common/services/api/deal/pay-for-inst-fee';
import { logger } from '@/common/utils/logger';
import { miscStorage } from '@/localdb/miscStorage';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { BridgeFormStateParams, MulModalInitialState, RealTradeParams, SendInstType, Source } from '../types';
import {
  checkBridgeUpdate,
  checkReceiptDealStatus,
  getFee,
  getMulBridgeSubmitDiffParams,
  transformMulParams
} from '../utils';

const bidInstFiled = 'bidSendOrderInstList';
const ofrInstFiled = 'ofrSendOrderInstList';

export const MAX_SEND_INST_GROUP = 10;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MulBridgeContainer = createContainer((initialState: MulModalInitialState) => {
  const { dealSide, source, currentBridgeTraderId } = initialState;
  const { defaultBridgeValue = [], defaultRealTradeValue, defaultSendMsg = [] } = transformMulParams(initialState);

  const fromDetail = initialState?.source === Source.Detail;

  const [formState, setFormState] = useImmer<BridgeFormStateParams[]>(defaultBridgeValue);

  const [realTradeValue, setRealTradeValue] = useImmer<RealTradeParams>(defaultRealTradeValue);

  const [submitting, setSubmitting] = useState(false);

  const ofrSendRealInstContainerRef = useRef<HTMLDivElement>(null);
  const bidSendRealInstContainerRef = useRef<HTMLDivElement>(null);

  const bidCost = useRef<number>();
  const ofrCost = useRef<number>();

  const getBridgeIndex = () => {
    if (source === Source.Detail) {
      if (dealSide === Side.SideOfr) return 0;
      if (!initialState.defaultBridgeValue?.length) return 0;
      if (dealSide === Side.SideBid) return initialState.defaultBridgeValue.length - 2;
    }
    if (source === Source.Bridge) {
      // 过桥找到当前桥所在的index
      const index = formState.findIndex(v => v.ofrBridgeTrader?.trader_id === currentBridgeTraderId);
      return Math.max(0, index - 1);
    }

    return 0;
  };

  /** 当桥展示的桥index */
  const [bridgeIndex, setBridgeIndex] = useImmer(getBridgeIndex());

  const { getLogContext, wrapperSubmit } = useLogger();

  const spanName = TraceName.BRIDGE_EDIT_WITH_SINGLE_MUL;

  const ctx = () => getLogContext(spanName);

  /** 获取代付机构的费用信息 */
  useQuery({
    queryKey: [
      APIs.deal.payForInstFeeGet,
      defaultRealTradeValue.bidInst?.inst_id,
      defaultRealTradeValue.ofrInst?.inst_id
    ] as const,
    queryFn: async ({ signal }) => {
      const res = await fetchPayForInstFee(
        {
          inst_id_list: [defaultRealTradeValue.bidInst?.inst_id, defaultRealTradeValue.ofrInst?.inst_id].filter(Boolean)
        },
        { signal }
      );
      return res.pay_for_inst_with_fee_list;
    },
    enabled: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: Infinity,
    onSuccess: data => {
      const feeGroupByInstId = groupBy(data, 'inst_id');

      if (defaultRealTradeValue.bidInst?.inst_id) {
        bidCost.current = getFee(
          feeGroupByInstId[defaultRealTradeValue.bidInst.inst_id]?.[0]?.fee_list,
          initialState.firstMaturityDate,
          defaultRealTradeValue.bidDealTime
        );
      }
      if (defaultRealTradeValue.ofrInst?.inst_id) {
        ofrCost.current = getFee(
          feeGroupByInstId[defaultRealTradeValue.ofrInst.inst_id]?.[0]?.fee_list,
          initialState.firstMaturityDate,
          defaultRealTradeValue.ofrDealTime
        );
      }
    }
  });

  // 发单机构组错误状态
  const [error, setError] = useImmer<{ [Side.SideBid]: boolean[][]; [Side.SideOfr]: boolean[][] }>({
    [Side.SideBid]: new Array(MAX_SEND_INST_GROUP).fill(1).map(_ => [false, false]),
    [Side.SideOfr]: new Array(MAX_SEND_INST_GROUP).fill(1).map(_ => [false, false])
  });

  /**
   * details: A -> B,  B -> C,  C -> D,  D -> E , E -> F  ｜ B,C,D,E是桥(四桥场景)
   * index:     0       1       2       3
   * bridge:    B       C       D       E
   */
  /** 当前展示的桥信息 */
  const currentBridgeInfo = useMemo(() => {
    if (formState.length - 2 < bridgeIndex) return void 0;
    const bridge = formState[bridgeIndex + 1];
    if (!bridge) return void 0;
    return {
      ...bridge,
      inst: bridge.ofrBridgeInst,
      trader: bridge.ofrBridgeTrader,
      traderTag: bridge.ofrBridgeTraderTag
    };
  }, [bridgeIndex, formState]);

  /** 当前展示的表单信息 */
  const currentFormState = useMemo(() => {
    const leftStateValue = formState[bridgeIndex] ?? {};
    const rightStateValue = formState[bridgeIndex + 1] ?? {};
    const leftIsReal = bridgeIndex === 0;
    const rightIsReal = bridgeIndex === formState.length - 2;
    return { leftStateValue, rightStateValue, leftIsReal, rightIsReal };
  }, [formState, bridgeIndex]);

  /** 更新单个字段 */
  const updateFormState = useMemoizedFn(
    <T extends keyof BridgeFormStateParams>(key: T, val: BridgeFormStateParams[T], receiptDealId: string) => {
      const index = formState.findIndex(v => v.receiptDealId === receiptDealId);
      if (index < 0) return;
      setFormState(draft => {
        draft[index][key] = val;
      });
    }
  );

  const updateRealTradeState = useMemoizedFn(<T extends keyof RealTradeParams>(key: T, val: RealTradeParams[T]) => {
    setRealTradeValue(draft => {
      draft[key] = val;
    });
  });

  const prev = () => {
    if (bridgeIndex <= 0) return;
    setBridgeIndex(draft => draft - 1);
  };

  const next = () => {
    if (bridgeIndex >= formState.length - 2) return;
    setBridgeIndex(draft => draft + 1);
  };

  // 更新发单机构
  const updateSendInst = useMemoizedFn((side: Side, value: SendInstType, index: number) => {
    const field = side === Side.SideBid ? bidInstFiled : ofrInstFiled;
    const prevValue = realTradeValue[field][index];

    setRealTradeValue(draft => {
      // 防止数组越界
      if (draft[field].length > index) draft[field][index] = { ...prevValue, ...value };
    });
  });

  /** 添加发单机构 */
  const addSendInst = (side: Side) => {
    const field = side === Side.SideBid ? bidInstFiled : ofrInstFiled;
    const ref = side === Side.SideBid ? bidSendRealInstContainerRef : ofrSendRealInstContainerRef;
    if (realTradeValue[field].length >= MAX_SEND_INST_GROUP) return;
    setRealTradeValue(draft => {
      draft[field] = [...realTradeValue[field], {}];
    });
    requestIdleCallback(() => {
      ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'auto' });
    });
  };

  /** 删除发单机构 */
  const deleteSendInst = (side: Side, index: number) => {
    const field = side === Side.SideBid ? bidInstFiled : ofrInstFiled;
    const updateData = realTradeValue[field].filter((_, i) => i !== index);
    setRealTradeValue(draft => {
      draft[field] = updateData;
    });

    const prevError: boolean[][] = error[side];
    const currentError = prevError.map((v, i) => (i === index ? [false, false] : [v[0], false]));
    setError(draft => {
      draft[side] = currentError;
    });
  };

  /** 计算费用 */
  const handleRate = async (side: Side, receiptDealId: string) => {
    const cost = side === Side.SideBid ? bidCost.current : ofrCost.current;
    const payForField = side === Side.SideBid ? 'flagBidPayForInst' : 'flagOfrPayForInst';

    /** 联动点亮代 */
    if (cost) updateRealTradeState(payForField, true);

    /** 更新费用 */
    updateFormState('fee', cost, receiptDealId);
  };

  const submit = useMemoizedFn(async () => {
    const result = checkBridgeUpdate(
      realTradeValue.bidSendOrderInstList,
      realTradeValue.ofrSendOrderInstList,
      initialState.volume,
      MAX_SEND_INST_GROUP
    );

    if (result !== true) {
      logger.ctxInfo(ctx(), '[bridgeUpdate] check failed');
      setError(result);
      return false;
    }

    const diffList = getMulBridgeSubmitDiffParams(initialState, {
      realTradeValue,
      bridgeValue: formState
    });

    const diffParams: ReceiptDealUpdateBridgeV2.Request = {
      parent_deal_id: initialState.parentDealId,
      update_bridge_info_list: diffList,
      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyBridgeInfo,
        operation_source: fromDetail
          ? OperationSource.OperationSourceReceiptDealDetail
          : OperationSource.OperationSourceReceiptDealBridge
      }
    };

    if (realTradeValue.flagBidPayForInst !== initialState.defaultRealTradeValue?.flagBidPayForInst) {
      diffParams.flag_bid_pay_for_inst = realTradeValue.flagBidPayForInst;
    }

    if (realTradeValue.flagOfrPayForInst !== initialState.defaultRealTradeValue?.flagOfrPayForInst) {
      diffParams.flag_ofr_pay_for_inst = realTradeValue.flagOfrPayForInst;
    }

    logger.ctxInfo(ctx(), `[bridgeUpdate] request to server, req=${JSON.stringify(diffParams)}`);

    const flagPayForInstChanged = 'flag_bid_pay_for_inst' in diffParams || 'flag_ofr_pay_for_inst' in diffParams;

    if (flagPayForInstChanged) {
      const checkReceiptDealIds: string[] = [];
      if ('flag_ofr_pay_for_inst' in diffParams) checkReceiptDealIds.push(diffList[0]?.receipt_deal_id ?? '');
      if ('flag_bid_pay_for_inst' in diffParams) checkReceiptDealIds.push(last(diffList)?.receipt_deal_id ?? '');
      const pass = await checkReceiptDealStatus([initialState.parentDealId], checkReceiptDealIds);
      if (!pass) return false;
    }

    const res = await updateBridges(diffParams, { traceCtx: ctx() });

    checkIllegalList(res.receipt_deal_operate_illegal_list ?? []);

    return true;
  });

  const handleSubmit = async () => {
    const response = await wrapperSubmit(spanName, submit);
    return response;
  };

  return {
    ofrSendRealInstContainerRef,
    bidSendRealInstContainerRef,

    defaultSendMsg,
    bidCost,
    ofrCost,

    currentFormState,
    currentBridgeInfo,
    submitting,
    defaultRealTradeValue,
    realTradeValue,
    formState,
    bridgeIndex,

    error,
    setError,

    setSubmitting,
    addSendInst,
    deleteSendInst,
    updateSendInst,
    handleRate,

    prev,
    next,
    setBridgeIndex,
    updateRealTradeState,
    updateFormState,
    handleSubmit
  };
});

export const MulBridgeProvider = MulBridgeContainer.Provider;
export const useMulBridge = MulBridgeContainer.useContainer;
