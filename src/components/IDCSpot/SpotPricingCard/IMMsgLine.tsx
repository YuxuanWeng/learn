import { useMemo, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAttentionFilled, IconSendFilled } from '@fepkg/icon-park-react';
import { checkLogin } from '@fepkg/services/api/auth/check-login-get';
import { BondDeal, DealQuote } from '@fepkg/services/types/common';
import { DealType, ImMsgSendStatus } from '@fepkg/services/types/enum';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { includes, last } from 'lodash-es';
import { useEffectOnce } from 'usehooks-ts';
import { liquidationDateToTag } from '@packages/utils/liq-speed';
import { traderMulGet } from '@/common/services/api/base-data/trader-mul-get';
import { dealSyncImMessageStatus } from '@/common/services/api/deal/sync-im-message-status';
import { formatPrice } from '@/common/utils/copy';
import { sendIMMsg } from '@/common/utils/im-helper';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { SendMsgDetail } from '@/components/IMHelper/type';
import { SpotPricingCardMessageStatus } from './types';

export type IProps = {
  message: BondDeal;
  quote: DealQuote;
  messageStatus: SpotPricingCardMessageStatus;
};

/** 获取打开 qm 的 urlProtocol */
const getQmUrl = (qmID: string) => `finchat://?qmId=${qmID}`;

/** 获取打开 qq 的 urlProtocol */
const getQQUrl = (qq: string) => `tencent://message/?Menu=yes&amp;uin=${qq}`;

export const sendMsgToTraderByFE = async (traderID: string, message = '') => {
  const traderInfoRes = await traderMulGet({ trader_id_list: [traderID] });
  const userInfoRes = await checkLogin();

  const trader = traderInfoRes.trader_list?.[0];

  const traderQmId = trader?.qm_account;
  const traderQQ = trader?.qq;

  const selfQmId = userInfoRes.user?.qm_account;
  const selfQQ = userInfoRes.user?.QQ;

  if ((traderQQ && selfQQ) || (traderQmId && selfQmId)) {
    window.Main.invoke(
      UtilEventEnum.OpenExternal,
      traderQmId && selfQmId ? getQmUrl(traderQmId) : getQQUrl(traderQQ![0])
    );

    if (message !== '') {
      window.Main.copy(message);
    }
  }
};

export default function IMMsgLine({ message, quote, messageStatus }: IProps) {
  const { flag_internal, flag_oco, flag_stock_exchange } = quote;

  const getDefaultText = () => {
    const bondCode = message.bond_basic_info?.display_code ?? '';
    const reutrnPointText = (message.return_point ?? 0) > 0 ? `F${formatPrice(message.return_point, 4)}` : ``;
    const price = `${formatPrice(message.price, 4)}${reutrnPointText}`;
    const volume =
      (message.spot_pricing_volume ?? 0) > 10 * 1000
        ? `${(message.spot_pricing_volume ?? 0) / 10 / 1000}亿`
        : `${message.spot_pricing_volume ?? 0}万`;

    const liquidationText =
      quote == null
        ? ''
        : formatLiquidationSpeedListToString(liquidationDateToTag(quote.liquidation_speed_list ?? []), 'MM.DD');

    const comment = [flag_oco && 'OCO', flag_stock_exchange && '交易所', liquidationText].filter(Boolean).join('，');

    return [
      bondCode,
      price,
      comment ? `(${comment})` : '',
      message.deal_type !== DealType.TKN && '给你',
      volume,
      message.deal_type === DealType.TKN && '给我'
    ]
      .filter(Boolean)
      .join(' ');
  };

  // 若为内部报价则不自动发送，且发送按钮文案为“发送”
  const needAutoSend =
    !flag_internal && !includes([ImMsgSendStatus.SendSuccess, ImMsgSendStatus.SendFailed], message.im_msg_send_status);

  const isError = message.im_msg_send_status === ImMsgSendStatus.SendFailed;

  const buttonText = useMemo(() => {
    switch (message.im_msg_send_status) {
      case ImMsgSendStatus.SendSuccess:
        return (
          <div className="flex items-center">
            <i className="icon-green-check bg-primary-200 mr-[5px]" />
            <span className="whitespace-nowrap">再次发送</span>
          </div>
        );
      case ImMsgSendStatus.SendFailed:
        return '重新发送';
      default:
        return '发送';
    }
  }, [message.im_msg_send_status]);

  const [inputing, setInputing] = useState(false);

  const [messageToSend, setMessageToSend] = useState(getDefaultText());

  const [errorText, setErrorText] = useState('');
  /**
   * 请求催单
   * @param sendMsg 请求的参数
   */
  const sendByImHelper = async (sendMsg: SendMsgDetail) => {
    try {
      await sendIMMsg({
        messages: [{ ...sendMsg }],
        imErrorHints: {
          imNotEnabled: 'IM不在线或未开启授权！',
          accountNotBind: 'IM登录账号与OMS账号不匹配！',
          receiverNoQQ: '交易员未绑定账号！',
          receiverNotInList: '交易员不在联系人列表中！',
          senderNoQQ: '未绑定账号！'
        },
        autoAlert: false,
        singleMode: true
      });
      await dealSyncImMessageStatus({
        deal_id: message.deal_id,
        message_text: messageToSend,
        im_msg_send_status: ImMsgSendStatus.SendSuccess
      });
      setErrorText('');
    } catch (e) {
      setErrorText((e as Error)?.message);
      await dealSyncImMessageStatus({
        deal_id: message.deal_id,
        message_text: messageToSend,
        im_msg_send_status: ImMsgSendStatus.SendFailed
      });
    }
  };

  useEffectOnce(() => {
    if (needAutoSend) {
      sendByImHelper({
        msg: messageToSend,
        recv_qq: last(message.spot_pricingee?.trader?.QQ ?? [])
      });
    }
  });

  return (
    <div
      className={cx(
        'mt-[6px] flex',
        flag_internal ? 'internal' : '',
        isError ? 'error' : '',
        flag_internal && inputing ? 'inputing' : ''
      )}
    >
      <Tooltip
        placement="top"
        content={messageToSend}
      >
        <Input
          className="!rounded-r-none"
          disabled={messageStatus === SpotPricingCardMessageStatus.QuoterPartialConfirmed}
          value={messageToSend}
          onChange={setMessageToSend}
          onFocus={() => setInputing(true)}
          onBlur={() => setInputing(false)}
        />
      </Tooltip>
      <Tooltip content={errorText}>
        <div className="relative">
          <Button
            disabled={messageStatus === SpotPricingCardMessageStatus.QuoterPartialConfirmed}
            className="w-[108px] h-max !px-2 !rounded-l-none"
            type="primary"
            plain
            icon={<IconSendFilled />}
            onClick={() => {
              if (message.spot_pricingee?.trader?.trader_id == null || message.deal_id == null) return;
              sendByImHelper({
                msg: messageToSend,
                recv_qq: last(message.spot_pricingee?.trader?.QQ ?? [])
              });
            }}
          >
            {buttonText}
          </Button>
          {errorText && <IconAttentionFilled className="text-danger-100 absolute -right-[7px] -top-[6px]" />}
        </div>
      </Tooltip>
    </div>
  );
}
