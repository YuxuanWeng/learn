import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { IconLeftArrow, IconRightArrow } from '@fepkg/icon-park-react';
import { Side, TradeDirection } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { Bridge } from '../../NoneModal/components/Bridge';
import { useEditBridge } from '../provider';

type ChangeBridgeProps = { side: Side.SideBid | Side.SideOfr };

export const ChangeBridge = ({ side }: ChangeBridgeProps) => {
  const { formState, defaultSendMsg, updateFormState, updateCost } = useEditBridge();

  const { productType } = useProductParams();

  const withPayFor = { first: side === Side.SideBid, second: side === Side.SideOfr };

  const directionFiled = side === Side.SideBid ? 'bidDirection' : 'ofrDirection';
  const direction = formState[directionFiled];

  const isPaidFiled = side === Side.SideBid ? 'bidIsPaid' : 'ofrIsPaid';
  const sendMsgFiled = side === Side.SideBid ? 'bidSendMsg' : 'ofrSendMsg';

  const realityTradeFiled = side === Side.SideBid ? 'bidTrader' : 'ofrTrader';
  const realityInstFiled = side === Side.SideBid ? 'bidInst' : 'ofrInst';

  const bridgeTradeFiled = side === Side.SideBid ? 'bidBridgeTrader' : 'ofrBridgeTrader';
  const bridgeInstFiled = side === Side.SideBid ? 'bidBridgeInst' : 'ofrBridgeInst';

  const getSideBridge = () => {
    if (side === Side.SideOfr) {
      return {
        first: Side.SideOfr,
        second: Side.SideNone,
        firstBridgeInstName: getInstName({ inst: formState[realityInstFiled], productType }),
        firstRealityTradeName: formState[realityTradeFiled]?.name_zh,
        secondBridgeInstName: getInstName({ inst: formState[bridgeInstFiled], productType }),
        secondRealityTradeName: formState[bridgeTradeFiled]?.name_zh
      };
    }

    return {
      first: Side.SideNone,
      second: Side.SideBid,
      firstBridgeInstName: getInstName({ inst: formState[bridgeInstFiled], productType }),
      firstRealityTradeName: formState[bridgeTradeFiled]?.name_zh,
      secondBridgeInstName: getInstName({ inst: formState[realityInstFiled], productType }),
      secondRealityTradeName: formState[realityTradeFiled]?.name_zh
    };
  };

  const updateIsPaid = () => {
    const value = !formState[isPaidFiled];
    updateFormState(isPaidFiled, value);
    const sendPayFiled = side === Side.SideBid ? 'bidSendPay' : 'ofrSendPay';
    if (value) updateCost(side);
    else updateFormState(sendPayFiled, undefined);
  };

  const getDirectionIcon = useMemoizedFn(() => {
    if (direction === TradeDirection.TradeDirectionOfr2Bid) return <IconRightArrow />;
    return <IconLeftArrow />;
  });

  const handleDirectionChange = useMemoizedFn(() => {
    const cur =
      direction === TradeDirection.TradeDirectionBid2Ofr
        ? TradeDirection.TradeDirectionOfr2Bid
        : TradeDirection.TradeDirectionBid2Ofr;
    updateFormState(directionFiled, cur);

    let sendMsg = '';

    if (side === Side.SideOfr) {
      if (cur === TradeDirection.TradeDirectionOfr2Bid) {
        // 真实交易机构指向桥机构，取桥机构发给信息作为发给
        sendMsg = defaultSendMsg ?? '';
      } else {
        // 桥指向真实机构
        sendMsg = formState[realityTradeFiled]?.name_zh ?? '';
      }
    } else if (cur === TradeDirection.TradeDirectionOfr2Bid) {
      // 桥指向真实机构
      sendMsg = formState[realityTradeFiled]?.name_zh ?? '';
    } else {
      // 真实交易机构指向桥机构，取桥机构发给信息作为发给
      sendMsg = defaultSendMsg ?? '';
    }
    updateFormState(sendMsgFiled, sendMsg);
  });

  return (
    <div className={cx('flex gap-2 items-center')}>
      <Bridge
        side={getSideBridge().first}
        className="!w-[146px]"
        bridgeInst={getSideBridge().firstBridgeInstName}
        realityTrade={getSideBridge().firstRealityTradeName}
        traderNameCls={side === Side.SideBid ? 'text-orange-100' : ''}
        withPayFor={withPayFor.first}
        selected={formState[isPaidFiled]}
        payForAlign={side === Side.SideBid ? 'left' : 'right'}
        onPayForClick={() => {
          if (!withPayFor.first) return;
          updateIsPaid();
        }}
      />
      <Button.Icon
        icon={getDirectionIcon()}
        className="!w-6 !h-6"
        onClick={handleDirectionChange}
      />

      <Bridge
        side={getSideBridge().second}
        bridgeInst={getSideBridge().secondBridgeInstName}
        realityTrade={getSideBridge().secondRealityTradeName}
        className="w-[146px]"
        traderNameCls={side === Side.SideOfr ? 'text-secondary-100' : ''}
        selected={formState[isPaidFiled]}
        withPayFor={withPayFor.second}
        payForAlign={side === Side.SideOfr ? 'right' : 'left'}
        onPayForClick={() => {
          if (!withPayFor.second) return;
          updateIsPaid();
        }}
      />
    </div>
  );
};
