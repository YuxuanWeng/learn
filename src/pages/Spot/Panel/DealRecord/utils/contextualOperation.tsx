import { ReactNode } from 'react';
import { getInstName } from '@fepkg/business/utils/get-name';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { DealRecord } from '@fepkg/services/types/bds-common';
import { DealOperationType, DealType, OperationSource, Side } from '@fepkg/services/types/enum';
import { IMHelperMsgSendErrCode } from 'app/packages/im-helper-core/types';
import { last, uniqWith } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { recordSendMsgCallback } from '@/common/services/api/deal/record-send-msg-callback';
import { sendIMMsg } from '@/common/utils/im-helper';
import { DetailShowConfig } from '@/components/IDCDealDetails/hooks/usePreference';
import { DealContainerData } from '@/components/IDCDealDetails/type';
import { findDirectBridgeDeal, getBondCodeWithBidOfr, getDisplayItemData } from '@/components/IDCDealDetails/utils';
import { SendMsgDetail } from '@/components/IMHelper/type';
import { miscStorage } from '@/localdb/miscStorage';
import { getLGBType, getPrice, getVolume } from '@/pages/Deal/Bridge/utils';
import { getCopyInst, getDialoguesText, getOtherInfo, getSettlementType } from '.';
import { TypeDealRecord } from '../types';

const TRADER__REPLACEMENT = '__TRADER__';

const IM_NOT_ENABLED_ERROR = 'IM不在线或未开启授权状态，发送失败!';
const ACCOUNT_NOT_BIND_ERROR = 'IM登录账号与OMS账号不匹配，发送失败!';

/**
 * 请求发送/催单
 * @param sendMsg 请求的参数
 * @param hintLightMode 请求的参数
 */
export const requestSendMsg = async (sendMsg: SendMsgDetail, hintLightMode = false) => {
  try {
    await sendIMMsg({
      messages: [{ ...sendMsg }],
      imErrorHints: {
        imNotEnabled: IM_NOT_ENABLED_ERROR,
        accountNotBind: ACCOUNT_NOT_BIND_ERROR,
        receiverNoQQ: `${TRADER__REPLACEMENT}未绑定账号，发送失败！`,
        receiverNotInList: `${TRADER__REPLACEMENT}不在联系人列表中，发送失败！`
      },
      singleMode: true,
      hintLightMode
    });
  } catch (e: any) {
    return (e?.message ?? e)?.toString() as string | undefined;
  }

  return undefined;
};

const onSendError = (rawErrors?: ReactNode[]) => {
  const errors = uniqWith(rawErrors ?? [], (a, b) => {
    return a === b && (a === IM_NOT_ENABLED_ERROR || a === ACCOUNT_NOT_BIND_ERROR);
  });

  if (!errors.some(Boolean)) return;

  ModalUtils.warn({
    title: '发送失败',
    content: errors?.map(e => {
      return e && <div key={uuidv4()}>{e}</div>;
    }),
    contentCls: 'max-h-[100px] overflow-auto',
    showCancel: false,
    okText: '好的'
  });
};

const getErrorNode = (msg: string | undefined, receiverName: string, isBid: boolean) => {
  if (msg == null) return undefined;
  if (!msg.includes(TRADER__REPLACEMENT)) {
    return msg;
  }
  return (
    <>
      <span className={isBid ? 'text-orange-100' : 'text-secondary-100'}>{receiverName}</span>
      {msg.replace(TRADER__REPLACEMENT, '')}
    </>
  );
};

/** 发送 */
export async function onSend(info: TypeDealRecord, side: Side) {
  const bidMsg = getDialoguesText(info, true);
  const ofrMsg = getDialoguesText(info);
  const { spot_pricinger, spot_pricingee } = info;

  let spotterError: ReactNode;
  let quoterError: ReactNode;

  let sendSuccess = false;

  const isSendToSpotter =
    (info.deal_type === DealType.TKN && side === Side.SideBid) ||
    (info.deal_type !== DealType.TKN && side === Side.SideOfr);

  const sendMsg = side === Side.SideBid ? bidMsg : ofrMsg;

  const receiver = isSendToSpotter ? spot_pricinger : spot_pricingee;

  const instPart = getInstName({ inst: receiver?.inst, productType: info.bond_info?.product_type });
  const namePart = receiver?.trader?.name_zh == null ? '' : `(${receiver.trader?.name_zh})`;

  const receiverName = `${instPart} ${namePart}`;

  if (!receiver?.inst?.inst_id || receiver?.inst?.inst_id === '0') spotterError = '交易员尚未填写，无法发送';
  else {
    const sendError = await requestSendMsg({
      receiver_name: receiverName,
      recv_qq: last(receiver.trader?.QQ ?? []),
      msg: sendMsg
    });
    spotterError = getErrorNode(sendError, receiverName, info.deal_type === DealType.TKN);

    if (sendError == null) {
      sendSuccess = true;
    }
  }

  if (sendSuccess) {
    recordSendMsgCallback({
      deal_id: info.deal_id,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTSend,
        operation_source: OperationSource.OperationSourceDealRecord
      }
    });

    message.success('发送成功');
  }

  onSendError([quoterError, spotterError]);
}

/** 点价方复制 */
export function onSpotCopy(info: TypeDealRecord, config?: DetailShowConfig) {
  let copyText = '';

  switch (info.deal_type) {
    case DealType.GVN:
    case DealType.TRD:
      copyText = getDialoguesText(info, false, config);
      break;
    default:
      // 在TKN方向 如果我是买方也是卖方，在点价方中，我算买方，对应bid
      copyText = getDialoguesText(info, true, config);
      break;
  }
  window.Main.copy(copyText);
}

/** 被点价方复制 */
export function onBeSpotCopy(info: TypeDealRecord, config?: DetailShowConfig) {
  let copyText = '';
  switch (info.deal_type) {
    case DealType.GVN:
    case DealType.TRD:
      // 我被点价，对方GVN/出给我，我买，我是bid
      copyText = getDialoguesText(info, true, config);
      break;
    default:
      // 我被点价，对方TKN我，我卖，我是ofr
      copyText = getDialoguesText(info, false, config);
      break;
  }
  window.Main.copy(copyText);
}

/** 获取请求催单的message_text */
const getRemindText = (info: DealRecord, isBid = false) => {
  let sendMsg = '';
  if (!info.flag_bridge) sendMsg = info.send_order_msg ?? '';
  else if (isBid) sendMsg = info.bid_send_order_msg ?? '';
  else sendMsg = info.ofr_send_order_msg ?? '';
  const ofrBroker =
    info.deal_type === DealType.TKN ? info.spot_pricingee?.broker?.name_cn : info.spot_pricinger?.broker?.name_cn;

  const bidBroker =
    info.deal_type === DealType.TKN ? info.spot_pricinger?.broker?.name_cn : info.spot_pricingee?.broker?.name_cn;

  return [
    // 内码
    info.internal_code,
    // 双方经纪人
    `${ofrBroker}${bidBroker}`,
    // 期限
    info.bond_info?.time_to_maturity ?? '',
    // 债券代码
    getBondCodeWithBidOfr(
      isBid ? Side.SideBid : Side.SideOfr,
      info.bid_settlement_type?.at(0) ?? getSettlement(info.bid_traded_date ?? '', info.bid_delivery_date ?? ''),
      info.bid_traded_date ?? '',
      info.ofr_settlement_type?.at(0) ?? getSettlement(info.ofr_traded_date ?? '', info.ofr_delivery_date ?? ''),
      info.ofr_traded_date ?? '',
      info.bond_info
    ),
    // 债券简称
    info.bond_info?.short_name,
    // 地方债类型
    getLGBType(info.bond_info),
    // 价格
    getPrice(info),
    // 成交量
    getVolume(info.confirm_volume ?? 0),
    // 交割方式
    getSettlementType(
      info.bid_settlement_type?.at(0),
      info.ofr_settlement_type?.at(0),
      info.bid_traded_date,
      info.ofr_traded_date,
      info.flag_exchange
    ),
    // a机构出给b机构
    getCopyInst(info.spot_pricinger, info.spot_pricingee, info.deal_type),
    sendMsg,
    '催催'
  ]
    .filter(Boolean)
    .join(' ');
};

/** 催单 */
export async function onReminder(info: DealRecord, side?: Side) {
  let sendSuccess = false;

  // 过桥操作人-没有加桥用户就默认为自己，接收方为自己就不发送催单，点亮过桥标志不加桥不会有过桥操作人
  const bidReceiverUser = info.bid_add_bridge_operator;
  const ofrReceiverUser = info.ofr_add_bridge_operator;

  const hasBridge = bidReceiverUser != null || ofrReceiverUser != null;

  // bid方催单信息
  const bidMsg = getRemindText(info, true);
  // ofr方催单信息
  const ofrMsg = getRemindText(info);

  const requestRemind = async (isBid = true) => {
    let sendError: ReactNode | undefined;
    // 没有过桥，对手方不是我，向对手方经纪人发送催单
    const other =
      (info.deal_type !== DealType.TKN && !isBid) || (info.deal_type === DealType.TKN && isBid)
        ? info.spot_pricinger
        : info.spot_pricingee;

    if (other?.broker != null) {
      sendError = getErrorNode(
        await requestSendMsg({ msg: bidMsg, recv_qq: other.broker.QQ, receiver_name: other.broker.name_cn }),
        `${other.broker.name_cn}(对手方)`,
        isBid
      );

      if (sendError == null) {
        sendSuccess = true;
      }
    }

    return sendError;
  };

  const requestRemindWithBridge = async (isBid = true) => {
    let sendError: ReactNode | undefined;
    // 过桥标志点亮，向过桥操作人发送催单
    if (info.flag_bridge && hasBridge) {
      const msg = isBid ? bidMsg : ofrMsg;

      const targetUser = isBid ? bidReceiverUser : ofrReceiverUser;

      if (miscStorage.userInfo?.QQ !== targetUser?.QQ) {
        sendError = getErrorNode(
          await requestSendMsg({
            msg,
            recv_qq: targetUser?.QQ,
            receiver_name: targetUser?.name_cn
          }),
          `${targetUser?.name_cn ?? ''}(加桥用户)`,
          isBid
        );

        if (sendError == null) {
          sendSuccess = true;
        }
      }
    }

    return sendError;
  };

  const onSuccess = () => {
    recordSendMsgCallback({
      deal_id: info.deal_id,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTRemindOrder,
        operation_source: OperationSource.OperationSourceDealRecord
      }
    });

    message.success('发送成功！');
  };

  if (!info.flag_bridge) {
    if (side == null) {
      onSendError(await Promise.all(bidMsg === ofrMsg ? [requestRemind()] : [requestRemind(), requestRemind(false)]));
    } else {
      onSendError(await Promise.all([requestRemind(side === Side.SideBid)]));
    }
    if (sendSuccess) {
      onSuccess();
    }
  }

  if (info.flag_bridge && hasBridge) {
    if (side == null) {
      onSendError(
        await Promise.all(
          bidMsg === ofrMsg ? [requestRemindWithBridge()] : [requestRemindWithBridge(), requestRemindWithBridge(false)]
        )
      );
    } else {
      onSendError(await Promise.all([requestRemindWithBridge(side === Side.SideBid)]));
    }
    if (sendSuccess) {
      onSuccess();
    }
  }
}

/** 删除 */
export function onDelete(info: DealRecord, onOk: () => void) {
  const opponent = getOtherInfo(info);

  const isSelf = opponent?.broker?.user_id === miscStorage.userInfo?.user_id;

  ModalUtils.error({
    title: '删除记录',
    content: isSelf ? (
      '确认要删除订单吗？'
    ) : (
      <>
        确认要删除与<span className="text-orange-100">{opponent?.broker?.name_cn}</span>的订单吗？
      </>
    ),
    onOk
  });
}

/** 成交明细催单
 * param dealItem 选中的明细数据
 * param showConfig 展示配置
 * param 是否是NCD
 * param withReceiver 默认的催单用户信息
 * */
export const dealDetailSendOrder = async (
  dealItem: DealContainerData,
  showConfig: DetailShowConfig,
  isNCD: boolean,
  withReceiver?: { receiverQQ?: string; receiverName?: string }
) => {
  const { internalCode, ofrBrokerFull, bidBrokerFull, index, fieldList } = getDisplayItemData(
    dealItem,
    showConfig,
    false,
    isNCD
  );
  const { dealSide = Side.SideNone, parent_deal } = dealItem;
  const message_text = `${internalCode || ''} ${ofrBrokerFull}${bidBrokerFull} ${index}) ${fieldList.join(' ')} 催催`;

  // 过桥标志为点亮状态
  const targetDeal = parent_deal.bridge_code ? findDirectBridgeDeal(dealItem) : parent_deal;

  const receiver = dealSide === Side.SideBid ? targetDeal?.ofr_trade_info.broker : targetDeal?.bid_trade_info.broker;

  const msg = await requestSendMsg(
    {
      msg: message_text,
      recv_qq: withReceiver?.receiverQQ ?? receiver?.QQ,
      receiver_name: withReceiver?.receiverName ?? receiver?.name_cn
    },
    true
  );

  const sendError = getErrorNode(
    msg,
    withReceiver?.receiverName ?? (receiver?.name_cn || ''),
    dealSide === Side.SideBid
  );

  if (sendError) onSendError([sendError]);
  else {
    recordSendMsgCallback({
      deal_id: parent_deal.parent_deal_id ?? '',
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTRemindOrder,
        operation_source: OperationSource.OperationSourceReceiptDealDetail
      }
    });
    message.success('发送成功');
  }
};

/** 成交明细分组发送 */
export const dealDetailSend = (messages: SendMsgDetail[], callBackFn: (errorTraderIds: string[]) => void) => {
  if (!miscStorage.userInfo?.QQ) {
    onSendError(['您未绑定账号']);
    return;
  }
  const msgForSend = messages.filter(m => m.recv_qq != null && m.recv_qq !== '');

  window.IMHelperBridge.sendQQ(msgForSend).then(({ result, error }) => {
    if (error != null) {
      if (error.code === 10001) {
        onSendError(['IM不在线或未开启授权状态！']);
        return;
      }
      onSendError(['发送超时!']);
      return;
    }

    if (result != null) {
      if (result.some(r => r.errorCode === IMHelperMsgSendErrCode.bindError)) {
        onSendError(['IM助手登录账号与OMS账号不匹配！']);
        return;
      }
    }

    const errorTraderIds: string[] = [];
    const errorNodes: ReactNode[] = [];
    if (result != null) {
      for (const [index, r] of result.entries()) {
        const rawMsg = msgForSend[index];
        if (r.success || errorTraderIds.includes(rawMsg.receiver_id || '')) {
          continue;
        }
        if (r.errorCode === IMHelperMsgSendErrCode.notFriends) {
          const errorNode = getErrorNode(
            `${TRADER__REPLACEMENT}不在联系人列表中！`,
            rawMsg.receiver_name || '',
            rawMsg.side === Side.SideBid
          );
          errorTraderIds.push(rawMsg.receiver_id || '');
          errorNodes.push(errorNode);
        }
      }
    }

    for (const rawMsg of messages) {
      if (errorTraderIds.includes(rawMsg.receiver_id || '')) {
        continue;
      }

      if (!rawMsg.recv_qq) {
        const errorNode = getErrorNode(
          `${TRADER__REPLACEMENT}未绑定账号！`,
          rawMsg.receiver_name || '',
          rawMsg.side === Side.SideBid
        );
        errorTraderIds.push(rawMsg.receiver_id || '');
        errorNodes.push(errorNode);
      }
    }
    if (errorTraderIds.length) {
      onSendError(errorNodes);
    } else {
      message.success('发送成功！');
    }
    callBackFn(errorTraderIds);
  });
};
