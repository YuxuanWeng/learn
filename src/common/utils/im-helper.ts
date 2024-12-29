import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { IMHelperMsgSendErrCode, IMHelperMsgSendSingleResult } from 'app/packages/im-helper-core/types';
import { showMultiSendResult } from '@/components/IMHelper/MultiSendDialog';
import { IMHelperMsgSendSingleResultForDisplay, SendMsgDetail } from '@/components/IMHelper/type';
import { miscStorage } from '@/localdb/miscStorage';

const warnModal = (title = '', hintLightMode = false) => {
  const theme = hintLightMode ? 'light' : 'dark';
  ModalUtils.warn({
    theme,
    title,
    showCancel: false,
    okText: '关闭'
  });
};

export type IMErrorHints = {
  imNotEnabled?: string;
  accountNotBind?: string;
  receiverNotInList?: string;
  receiverNoQQ?: string;
  senderNoQQ?: string;
  otherError?: string;
};

type IProp = {
  messages: SendMsgDetail[];
  imErrorHints?: IMErrorHints;
  autoAlert?: boolean;
  singleMode?: boolean;
  extraPresendFilter?: (msg: SendMsgDetail) => string | undefined;
  // 额外发送前校验，若不符合，则返回字符串，字符串为用于显示的校验的错误信息，返回undefined则表示通过
  hintLightMode?: boolean;
};

export const sendIMMsg = ({
  messages,
  imErrorHints,
  autoAlert,
  singleMode,
  extraPresendFilter,
  hintLightMode
}: IProp) => {
  return new Promise<{
    resultForDisplay: IMHelperMsgSendSingleResultForDisplay[];
    result: IMHelperMsgSendSingleResult[];
    msgForSend: SendMsgDetail[];
  }>((resolve, reject) => {
    const handleError = (err: string) => {
      if (autoAlert) {
        warnModal(err, hintLightMode);
      } else {
        reject(new Error(err));
      }
    };
    if (!miscStorage.userInfo?.QQ) {
      handleError(imErrorHints?.senderNoQQ || '未绑定账号，发送失败！');
      return;
    }
    const msgForSend = messages.filter(
      m => m.recv_qq != null && m.recv_qq !== '' && (extraPresendFilter == null || extraPresendFilter(m) == null)
    );

    window.IMHelperBridge.sendQQ(msgForSend).then(({ result, error }) => {
      if (error != null) {
        if (error.code === 10001) {
          handleError(imErrorHints?.imNotEnabled || 'IM不在线或未开启授权状态！');
          return;
        }
        handleError(imErrorHints?.otherError || '发送超时!');
        console.log('发送IM错误', error?.toString());
        return;
      }

      if (result != null) {
        if (result.some(r => r.errorCode === IMHelperMsgSendErrCode.bindError)) {
          handleError(imErrorHints?.accountNotBind || 'IM登录账号与OMS账号不匹配！');
          return;
        }
      }

      const resultForDisplay: IMHelperMsgSendSingleResultForDisplay[] = [];

      if (result != null) {
        result.forEach((r, index) => {
          const rawMsg = msgForSend[index];

          if (r.success || resultForDisplay.some(rd => rd.trader_id === rawMsg.receiver_id)) {
            return;
          }

          const errMsg =
            r.errorCode === IMHelperMsgSendErrCode.notFriends
              ? imErrorHints?.receiverNotInList || '交易员不在联系人列表中！'
              : r.msg ?? '发送失败';

          if (singleMode) {
            handleError(errMsg);
          }
          resultForDisplay.push({
            ...r,
            trader_id: rawMsg.receiver_id ?? '',
            trader_name: rawMsg.receiver_name ?? '',
            inst_name: rawMsg.inst_name ?? '',
            msg: errMsg
          });
        });
      }

      messages.forEach(m => {
        if (resultForDisplay.some(rd => rd.trader_id === m.receiver_id)) {
          return;
        }

        if (m.recv_qq == null || m.recv_qq === '') {
          if (singleMode) {
            handleError(imErrorHints?.receiverNoQQ || '交易员未绑定账号！');
          }
          resultForDisplay.push({
            trader_id: m.receiver_id ?? '',
            trader_name: m.receiver_name ?? '',
            inst_name: m.inst_name ?? '',
            success: false,
            msg: imErrorHints?.receiverNoQQ || '交易员未绑定账号！'
          });
        } else if (extraPresendFilter != null) {
          const err = extraPresendFilter(m);

          if (err != null) {
            resultForDisplay.push({
              trader_id: m.receiver_id || '',
              trader_name: m.receiver_name || '',
              inst_name: m.inst_name || '',
              success: false,
              msg: err
            });
          }
        }
      });

      if (autoAlert) {
        if (resultForDisplay.length !== 0) {
          if (!singleMode) showMultiSendResult(resultForDisplay, hintLightMode === true);
        } else {
          message.success('发送成功！');
        }
      }

      resolve({ resultForDisplay, result: result ?? [], msgForSend });
    });
  });
};
