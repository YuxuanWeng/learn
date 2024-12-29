import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { Modal } from '@fepkg/components/Modal';
import { IconLeftArrow, IconRightArrow } from '@fepkg/icon-park-react';
import { Side, TradeDirection } from '@fepkg/services/types/bds-enum';
import { useProductParams } from '@/layouts/Home/hooks';
import { Channel, Cost, HideComment, Send, SendComment, Settlement } from '../Components';
import { EditModalProps, NoneModalInitialState } from '../types';
import { Bridge } from './components/Bridge';
import { SendInstGroup } from './components/SendInstGroup';
import { NoneBridgeProvider, useNoneBridge } from './provider';

const Inner = ({ visible, onClose }: EditModalProps & NoneModalInitialState) => {
  const { formState, updateFormState, submit, updateCost } = useNoneBridge();
  const { direction, bidIsPaid, ofrIsPaid, cost, channel, sendMsg, settlement, sendMsgComment, hideComment } =
    formState;

  const { productType } = useProductParams();

  const bridgeInfo = {
    firstBridgeInstName: getInstName({ inst: formState.ofrInst, productType }),
    firstRealityTradeName: formState.ofrTrader?.name_zh,
    secondBridgeInstName: getInstName({ inst: formState.bidInst, productType }),
    secondRealityTradeName: formState.bidTrader?.name_zh
  };

  return (
    <Modal
      keyboard
      visible={visible}
      width={480}
      title="编辑"
      centered
      footerProps={{ centered: true }}
      onCancel={onClose}
      onConfirm={async () => {
        const res = await submit();
        if (res) onClose?.();
      }}
    >
      <div className="px-4 py-3 select-none">
        <div className="px-3 py-2 flex flex-col gap-2 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Bridge
              side={Side.SideOfr}
              selected={ofrIsPaid}
              withPayFor
              payForAlign="right"
              bridgeInst={bridgeInfo.firstBridgeInstName}
              realityTrade={bridgeInfo.firstRealityTradeName}
              onPayForClick={() => {
                const currentValue = !ofrIsPaid;
                updateFormState('ofrIsPaid', currentValue);
                if (currentValue) {
                  updateFormState('bidIsPaid', false);
                  updateCost(Side.SideOfr);
                } else {
                  updateFormState('cost', void 0);
                }
              }}
            />

            <Button.Icon
              icon={direction === TradeDirection.TradeDirectionBid2Ofr ? <IconLeftArrow /> : <IconRightArrow />}
              className="!w-6 !h-6"
              onClick={() => {
                const cur =
                  direction === TradeDirection.TradeDirectionBid2Ofr
                    ? TradeDirection.TradeDirectionOfr2Bid
                    : TradeDirection.TradeDirectionBid2Ofr;

                updateFormState('direction', cur);

                if (cur === TradeDirection.TradeDirectionBid2Ofr) {
                  updateFormState('sendMsg', formState.ofrTrader?.name_zh ?? '');
                } else {
                  updateFormState('sendMsg', formState.bidTrader?.name_zh ?? '');
                }
              }}
            />

            <Bridge
              side={Side.SideBid}
              selected={bidIsPaid}
              withPayFor
              payForAlign="left"
              bridgeInst={bridgeInfo.secondBridgeInstName}
              realityTrade={bridgeInfo.secondRealityTradeName}
              onPayForClick={() => {
                const currentValue = !bidIsPaid;
                updateFormState('bidIsPaid', currentValue);
                if (currentValue) {
                  updateFormState('ofrIsPaid', false);
                  updateCost(Side.SideBid);
                } else {
                  updateFormState('cost', void 0);
                }
              }}
            />
          </div>

          <div className="component-dashed-x" />

          <Send
            value={sendMsg ?? ''}
            onChange={val => {
              updateFormState('sendMsg', val);
            }}
          />

          {/* 渠道 */}
          <Channel
            value={channel}
            onChange={val => {
              updateFormState('channel', val);
            }}
          />

          <Cost
            disabled={!bidIsPaid && !ofrIsPaid}
            value={(cost ?? '').toString()}
            onChange={val => {
              updateFormState('cost', val as unknown as number);
            }}
            onRateClick={() => {
              if (ofrIsPaid) updateCost(Side.SideOfr);
              if (bidIsPaid) updateCost(Side.SideBid);
            }}
          />

          {/* 结算 */}
          <Settlement settlement={settlement} />

          <SendComment
            value={sendMsgComment}
            onChange={val => {
              updateFormState('sendMsgComment', val);
            }}
          />

          <div className="component-dashed-x" />

          <HideComment
            isChecked={!!hideComment}
            onChange={val => {
              updateFormState('hideComment', val);
            }}
          />

          <SendInstGroup />
        </div>
      </div>
    </Modal>
  );
};

export const NoneModal = (props: EditModalProps & NoneModalInitialState) => {
  return (
    <NoneBridgeProvider initialState={{ ...props }}>
      <Inner {...props} />
    </NoneBridgeProvider>
  );
};
