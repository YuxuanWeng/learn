import { TraceName } from '@fepkg/business/constants/trace-map';
import { BridgeChannel, Side } from '@fepkg/services/types/bds-enum';
import { ReceiptDealMulUpdateBridge } from '@fepkg/services/types/receipt-deal/mul-update-bridge';
import { trim } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useLogger } from '@/common/providers/LoggerProvider';
import { mulUpdateBridge } from '@/common/services/api/bridge/mul-bridge-update';
import { logger } from '@/common/utils/logger';
import { checkIllegalList } from '@/pages/Spot/utils/bridge';
import { BatchModalInitialState } from '../types';
import { checkReceiptDealStatus, getBatchBridgeSubmitDiffParams, transformBatchPrams } from '../utils';

export const MAX_SEND_INST_GROUP = 10;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const EditBridgeContainer = createContainer((initialState: BatchModalInitialState) => {
  const { defaultBridgeValue, bidDirectConnectionDealIds, ofrDirectConnectionDealIds } = initialState;

  const bridgeInst = defaultBridgeValue?.inst;
  const bridgeTrader = defaultBridgeValue?.trader;

  const [params, setParams] = useImmer<Omit<ReceiptDealMulUpdateBridge.Request, 'current_bridge_inst_id'>>(
    transformBatchPrams(defaultBridgeValue)
  );

  const { getLogContext, wrapperSubmit } = useLogger();

  const ctx = () => getLogContext(TraceName.BRIDGE_EDIT_WITH_BATCH);

  /** 提交编辑 */
  const submit = async () => {
    if (!bridgeInst?.inst_id) return false;
    const buildParams: ReceiptDealMulUpdateBridge.Request = {
      ...params,
      current_bridge_inst_id: bridgeInst.inst_id,
      parent_deal_ids: initialState.parentDealIds,
      bid_bridge_pay: params.bid_bridge_pay ? Number(params.bid_bridge_pay) : undefined,
      ofr_bridge_pay: params.ofr_bridge_pay ? Number(params.ofr_bridge_pay) : undefined
    };

    const diffData = getBatchBridgeSubmitDiffParams(buildParams);

    logger.ctxInfo(ctx(), `[bridgeUpdate] request to server, req=${JSON.stringify(diffData)}`);

    const flagPayForInstChanged =
      (buildParams.bid_bridge_pay && bidDirectConnectionDealIds.some(v => !v.flagPayForInst)) ||
      (buildParams.ofr_bridge_pay && ofrDirectConnectionDealIds.some(v => !v.flagPayForInst));

    if (flagPayForInstChanged) {
      let checkReceiptDealIds: string[] = [];
      if (buildParams.bid_bridge_pay) checkReceiptDealIds = bidDirectConnectionDealIds.map(v => v.dealId);
      if (buildParams.ofr_bridge_pay) checkReceiptDealIds = ofrDirectConnectionDealIds.map(v => v.dealId);
      const pass = await checkReceiptDealStatus(initialState.parentDealIds, checkReceiptDealIds);
      if (!pass) return false;
    }

    const res = await mulUpdateBridge(diffData, { traceCtx: ctx() });

    checkIllegalList(res.receipt_deal_operate_illegal_list ?? []);

    return true;
  };

  /** 切换方向 */
  const switchDirection = (side: Side, value: number) => {
    const field = side === Side.SideBid ? 'bid_bridge_direction' : 'ofr_bridge_direction';
    setParams(draft => {
      draft[field] = value;
    });
  };

  /** 切换渠道 */
  const switchChannel = (side: Side, value: BridgeChannel) => {
    const field = side === Side.SideBid ? 'bid_bridge_channel' : 'ofr_bridge_channel';

    setParams(draft => {
      if (draft[field] === value) draft[field] = void 0;
      else draft[field] = value;
    });
  };

  /** 更新费用 */
  const updatePay = (side: Side, value: string) => {
    const field = side === Side.SideBid ? 'bid_bridge_pay' : 'ofr_bridge_pay';
    setParams(draft => {
      // 提交时需要转成number
      draft[field] = value as unknown as number;
    });
  };

  /** 更新发单备注 */
  const updateSendMsgComment = (side: Side, value: string) => {
    const field = side === Side.SideBid ? 'bid_send_msg_comment' : 'ofr_send_msg_comment';
    setParams(draft => {
      draft[field] = trim(value);
    });
  };

  /** 更新发给 */
  const updateSendMsg = (side: Side, value?: string) => {
    const field = side === Side.SideBid ? 'bid_send_msg' : 'ofr_send_msg';
    setParams(draft => {
      draft[field] = value;
    });
  };

  const handleSubmit = async () => {
    const res = await wrapperSubmit<boolean>(TraceName.BRIDGE_EDIT_WITH_BATCH, submit);
    return res;
  };

  return {
    bridgeInst,
    bridgeTrader,

    params,
    setParams,

    /** 真实对手方交易员 */
    realityTrade: initialState.defaultTradeValue,

    submit: handleSubmit,
    switchDirection,
    switchChannel,
    updatePay,
    updateSendMsg,
    updateSendMsgComment,

    bridge: initialState.defaultBridgeValue
  };
});

export const EditBridgeProvider = EditBridgeContainer.Provider;
export const useEditBridge = EditBridgeContainer.useContainer;
