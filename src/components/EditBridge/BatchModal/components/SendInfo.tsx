import { Side } from '@fepkg/services/types/bds-enum';
import { Channel, Cost, Send, SendComment } from '../../Components';
import { useEditBridge } from '../provider';

type SendInfoProps = { side: Side };

export const Inner = ({ side }: SendInfoProps) => {
  const { params, updateSendMsg, switchChannel, updatePay, updateSendMsgComment } = useEditBridge();
  const channel = side === Side.SideBid ? params.bid_bridge_channel : params.ofr_bridge_channel;
  const pay = side === Side.SideBid ? params.bid_bridge_pay : params.ofr_bridge_pay;

  const sendMsgComment = side === Side.SideBid ? params?.bid_send_msg_comment : params?.ofr_send_msg_comment;
  const sendMsg = side === Side.SideBid ? params.bid_send_msg : params.ofr_send_msg;

  return (
    <div className="flex flex-col gap-2">
      {/* 发给 */}
      <Send
        value={sendMsg}
        onChange={val => updateSendMsg(side, val)}
      />

      {/* 渠道 */}
      <Channel
        value={channel}
        onChange={val => switchChannel(side, val)}
      />

      {/* 费用 */}
      <Cost
        value={pay?.toString() ?? ''}
        onChange={val => updatePay(side, val)}
        withRateBtn={false}
      />

      {/* 发单备注 */}
      <SendComment
        value={sendMsgComment}
        onChange={val => updateSendMsgComment(side, val)}
      />
    </div>
  );
};

export const SendInfo = (props: SendInfoProps) => {
  return <Inner {...props} />;
};
