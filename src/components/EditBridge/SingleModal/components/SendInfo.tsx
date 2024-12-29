import { TraderSearchProvider } from '@fepkg/business/components/Search/TraderSearch';
import { Side } from '@fepkg/services/types/bds-enum';
import { useProductParams } from '@/layouts/Home/hooks';
import { Channel, Cost, Send, SendComment, Settlement } from '../../Components';
import { useEditBridge } from '../provider';

type SendInfoProps = { side: Side };

export const Inner = ({ side }: SendInfoProps) => {
  const { formState, updateFormState, handleRateClick } = useEditBridge();
  /** 渠道 */
  const channelFiled = side === Side.SideBid ? 'bidChannel' : 'ofrChannel';
  /** 费用 */
  const payFiled = side === Side.SideBid ? 'bidSendPay' : 'ofrSendPay';
  /** 结算方式 */
  const settlementFiled = side === Side.SideBid ? 'bidSettlement' : 'ofrSettlement';
  /** 发单备注 */
  const sendMsgCommentFiled = side === Side.SideBid ? 'bidSendMsgComment' : 'ofrSendMsgComment';
  /** 发给 */
  const sendMsgFiled = side === Side.SideBid ? 'bidSendMsg' : 'ofrSendMsg';
  /** 是否代付 */
  const isPaidFiled = side === Side.SideBid ? 'bidIsPaid' : 'ofrIsPaid';

  return (
    <div className="flex flex-col gap-2">
      {/* 发给 */}
      <Send
        value={formState[sendMsgFiled] ?? ''}
        onChange={val => updateFormState(sendMsgFiled, val)}
      />

      {/* 渠道 */}
      <Channel
        value={formState[channelFiled]}
        onChange={val => updateFormState(channelFiled, val)}
      />

      {/* 费用 */}
      <Cost
        value={formState[payFiled]?.toString()}
        onChange={val => {
          updateFormState(payFiled, val as unknown as number);
          if (val) updateFormState(isPaidFiled, true);
        }}
        onRateClick={() => handleRateClick(side)}
      />

      {/* 结算 */}
      <Settlement settlement={formState[settlementFiled]} />

      {/* 发单备注 */}
      <SendComment
        value={formState[sendMsgCommentFiled]}
        onChange={val => updateFormState(sendMsgCommentFiled, val)}
      />

      <div className="component-dashed-x-600" />
    </div>
  );
};

export const SendInfo = (props: SendInfoProps) => {
  const { formState } = useEditBridge();
  const { productType } = useProductParams();
  const defaultValue = props.side === Side.SideBid ? formState.bidTrader : formState.ofrTrader;

  return (
    <TraderSearchProvider initialState={{ productType, defaultValue }}>
      <Inner {...props} />
    </TraderSearchProvider>
  );
};
