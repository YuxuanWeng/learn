import { ModalUtils } from '@fepkg/components/Modal';
import { ReceiptDealOperateIllegal } from '@fepkg/services/types/bds-common';
import { uniq } from 'lodash-es';

const getCodeListNode = (codeList?: string[]) => {
  return codeList?.map((item, index) => {
    return (
      <span key={item}>
        <span
          onClick={() => {
            window.Main.copy(item);
          }}
        >
          {item}
        </span>
        {index != (codeList?.length || 1) - 1 && <span>、</span>}
      </span>
    );
  });
};

const getContent = (receiptIllegal: ReceiptDealOperateIllegal, isSorSend = false) => {
  const internalCodeStr = getCodeListNode(uniq(receiptIllegal.internal_code_list));
  const bridgeCodeStr = getCodeListNode(receiptIllegal.bridge_code_list);
  const orderNoStr = getCodeListNode(receiptIllegal.order_no_list);
  const seqNoStr = getCodeListNode(receiptIllegal.seq_no_list);
  return (
    <div className="flex-col">
      {internalCodeStr?.length ? (
        <div className="flex">
          <span className="text-gray-300 w-9">交易</span>
          <span className="text-primary-100">
            <span>(内码:</span>
            {internalCodeStr}
            <span>)</span>
          </span>
        </div>
      ) : null}
      {bridgeCodeStr?.length ? (
        <div className="flex">
          <span className="text-gray-300 w-9">交易</span>
          <span className="text-primary-100">
            <span>(成交录入过桥码:</span>
            {bridgeCodeStr}
            <span>)</span>
          </span>
        </div>
      ) : null}
      {orderNoStr?.length ? (
        <div className="flex">
          <span className="text-gray-300 w-9">交易</span>
          <span className="text-primary-100">
            <span>(成交订单号:</span>
            {orderNoStr}
            <span>)</span>
          </span>
        </div>
      ) : null}
      {seqNoStr?.length ? (
        <div className="flex">
          {!isSorSend && <span className="text-gray-300 w-9">交易</span>}
          <span className="text-primary-100">
            {isSorSend ? (
              <span>成交单序列号：{seqNoStr}</span>
            ) : (
              <>
                <span>(成交录入序列号:</span>
                {seqNoStr}
                <span>)</span>
              </>
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export const showAlreadyHasBridgeModal = (receiptIllegal: ReceiptDealOperateIllegal, onDismiss?: () => void) => {
  ModalUtils.warning({
    title: '以下明细已添加桥',
    content: getContent(receiptIllegal),
    showCancel: false,
    onOk: () => {
      onDismiss?.();
    }
  });
};

export const showSorSendModal = (receiptIllegal: ReceiptDealOperateIllegal, onDismiss?: () => void) => {
  ModalUtils.warning({
    title: '要素变更',
    content: <div>以下代付单已开始处理，请通知代付机构变更。{getContent(receiptIllegal, true)}</div>,
    okText: '我知道了',
    showCancel: false,
    onOk: () => {
      onDismiss?.();
    }
  });
};

export const showReverseCheckModal = (
  receiptIllegal: ReceiptDealOperateIllegal,
  onSubmit?: (needContinue?: boolean) => void
) => {
  ModalUtils.warning({
    title: '以下订单存在反向记录，是否继续加桥?',
    content: getContent(receiptIllegal),
    width: 380,
    okText: '确认',
    onOk: () => {
      onSubmit?.(true);
    },
    onCancel: () => {
      onSubmit?.(false);
    }
  });
};

export const showResetCheckModal = (onSubmit?: (needContinue?: boolean) => void) => {
  ModalUtils.warning({
    title: '确认修改？',
    content: '提交修改将重置成交单状态，是否继续？',
    width: 380,
    okText: '确认',
    onOk: () => {
      onSubmit?.(true);
    },
    onCancel: () => {
      onSubmit?.(false);
    }
  });
};

export const showHasSubmitModal = (receiptIllegal: ReceiptDealOperateIllegal, onDismiss?: () => void) => {
  ModalUtils.warning({
    title: '以下订单已提交',
    content: getContent(receiptIllegal),
    showCancel: false,
    onOk: () => {
      onDismiss?.();
    }
  });
};

export const showHasPaidModal = (receiptIllegal: ReceiptDealOperateIllegal, onDismiss?: () => void) => {
  ModalUtils.warning({
    title: '以下订单已有代付',
    content: getContent(receiptIllegal),
    showCancel: false,
    onOk: () => {
      onDismiss?.();
    }
  });
};

export const showCRMChangedModal = () => {
  ModalUtils.warning({
    title: '加桥/换桥失败',
    content: '该桥机构的交易员信息发生变更，操作失败！',
    showCancel: false,
    okText: '好的'
  });
};

/** 并发校验错误弹窗 */
export const showConcurrentCheckModal = (onOk?: () => void) => {
  ModalUtils.warning({
    title: '当前成交由他人操作，提交失败',
    showCancel: false,
    okText: '确定',
    buttonsCentered: true,
    onOk
  });
};
