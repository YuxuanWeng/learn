import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { IconLeftArrow, IconRightArrow } from '@fepkg/icon-park-react';
import { Side, TradeDirection } from '@fepkg/services/types/bds-enum';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { Bridge } from '../../NoneModal/components/Bridge';
import { SideType } from '../../types';
import { useEditBridge } from '../provider';

type ChangeBridgeProps = { side: SideType };

const getInstDisplay = (inst?: InstitutionTiny | null, noTrader?: boolean) => {
  if (inst === null) return '机构待定';
  if (inst === undefined) return '--';

  // 机构一致，交易员不一致时，机构也要显示 --
  if (noTrader) return '--';
  return getInstName({ inst });
};

export const ChangeBridge = ({ side }: ChangeBridgeProps) => {
  const { params, realityTrade, bridgeInst, bridgeTrader, bridge, switchDirection, updateSendMsg } = useEditBridge();

  const realInst = realityTrade?.[side]?.inst;
  const realTrader = realityTrade?.[side]?.trader;

  const direction = side === Side.SideBid ? params.bid_bridge_direction : params.ofr_bridge_direction;

  const bridgeDirectionDisabled =
    side === Side.SideBid ? bridge?.bidBridgeDirectionDisabled : bridge?.ofrBridgeDirectionDisabled;

  const getSideBridge = () => {
    if (side === Side.SideOfr)
      return {
        first: Side.SideOfr,
        second: Side.SideNone,
        firstBridgeInstName: getInstDisplay(realInst, !realTrader),
        firstRealityTradeName: realTrader?.name_zh ?? '',
        secondBridgeInstName: getInstDisplay(bridgeInst, !bridgeTrader),
        secondRealityTradeName: bridgeTrader?.name_zh ?? ''
      };
    return {
      first: Side.SideNone,
      second: Side.SideBid,
      firstBridgeInstName: getInstDisplay(bridgeInst, !bridgeTrader),
      firstRealityTradeName: bridgeTrader?.name_zh ?? '',
      secondBridgeInstName: getInstDisplay(realInst, !realTrader),
      secondRealityTradeName: realTrader?.name_zh ?? ''
    };
  };

  const disabled = bridgeDirectionDisabled;

  const getIcon = () => {
    if (disabled) {
      if (side === Side.SideBid) return <IconLeftArrow />;
      return <IconRightArrow />;
    }
    return direction === TradeDirection.TradeDirectionBid2Ofr ? <IconLeftArrow /> : <IconRightArrow />;
  };

  const { first, firstBridgeInstName, firstRealityTradeName, secondBridgeInstName, secondRealityTradeName, second } =
    getSideBridge();

  return (
    <div
      className={cx(
        'flex gap-2 items-center',
        side === Side.SideOfr && 'from-secondary-700',
        side === Side.SideBid && 'from-orange-700'
      )}
    >
      <Bridge
        side={first}
        className="!w-[146px]"
        bridgeInst={firstBridgeInstName}
        realityTrade={firstRealityTradeName}
        traderNameCls={side === Side.SideBid ? 'text-orange-100' : ''}
        withPayFor={false}
      />

      {direction ? (
        <Button.Icon
          disabled={disabled}
          icon={getIcon()}
          className="!w-6 !h-6"
          onClick={() => {
            const newDirection =
              direction === TradeDirection.TradeDirectionBid2Ofr
                ? TradeDirection.TradeDirectionOfr2Bid
                : TradeDirection.TradeDirectionBid2Ofr;

            switchDirection(side, newDirection);
            if (side === Side.SideOfr) {
              if (newDirection === TradeDirection.TradeDirectionBid2Ofr) {
                updateSendMsg(side, '');
              } else {
                updateSendMsg(side, bridge?.ofr_send_msg);
              }
            }

            if (side === Side.SideBid) {
              if (newDirection === TradeDirection.TradeDirectionBid2Ofr) {
                updateSendMsg(side, bridge?.bid_send_msg);
              } else {
                updateSendMsg(side, '');
              }
            }
          }}
        />
      ) : (
        <span className="w-6 text-center">--</span>
      )}

      <Bridge
        side={second}
        className="!w-[146px]"
        bridgeInst={secondBridgeInstName}
        realityTrade={secondRealityTradeName}
        traderNameCls={side === Side.SideOfr ? 'text-secondary-100' : ''}
        withPayFor={false}
      />
    </div>
  );
};
