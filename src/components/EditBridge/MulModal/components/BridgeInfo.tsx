import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { IconLeftArrow, IconRightArrow } from '@fepkg/icon-park-react';
import { Side, TradeDirection } from '@fepkg/services/types/bds-enum';
import { useMemoizedFn } from 'ahooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { Channel, Cost, HideComment, Send, SendComment, Settlement } from '../../Components';
import { Bridge, InstTraderProps } from '../../NoneModal/components/Bridge';
import { useMulBridge } from '../provider';
import { BaseInfo } from './BaseInfo';
import { SendInstGroup } from './SendInstGroup';

type BridgeHead = InstTraderProps;

const baseCls = '!w-[146px]';
const baseTraderCls = '!w-[106px]';

export const BridgeInfo = ({ index, isLeft, isRight }: { index: number; isLeft?: boolean; isRight?: boolean }) => {
  const {
    defaultRealTradeValue,
    realTradeValue,
    currentBridgeInfo,
    defaultSendMsg,
    formState,
    bidCost,
    ofrCost,
    handleRate,
    updateFormState,
    updateRealTradeState
  } = useMulBridge();

  const { productType } = useProductParams();

  const isFirst = index === 0; // 第一单
  const isLast = index === formState.length - 1; // 最后一单

  const value = formState[index];
  const isReal = isFirst || isLast;

  const { bidTrader, ofrTrader } = defaultRealTradeValue;
  const {
    receiptDealId,
    sendMsg,
    channel,
    fee,
    settlement,
    sendMsgComment,
    direction,
    ofrBridgeTrader,
    bidBridgeTrader
  } = value;

  const ofrRealTraderDisplay = ofrTrader?.name_zh ?? '';
  const ofrBridgeTraderDisplay = ofrBridgeTrader?.name_zh ?? '';

  const bidRealTraderDisplay = bidTrader?.name_zh ?? '';
  const bidBridgeTraderDisplay = bidBridgeTrader?.name_zh ?? '';

  const getLeftBridgeHeaderInfo = useMemoizedFn(() => {
    const res: BridgeHead = { side: Side.SideNone, className: baseCls, payForAlign: 'right' };
    if (isFirst) {
      // 左侧取真实交易双方信息
      res.side = Side.SideOfr;
      res.bridgeInst = getInstName({ inst: defaultRealTradeValue?.ofrInst, productType });
      res.realityTrade = ofrRealTraderDisplay;
      res.payForAlign = 'left';
    } else {
      res.bridgeInst = getInstName({ inst: value.ofrBridgeInst, productType });
      res.realityTrade = ofrBridgeTraderDisplay;
      res.className = cx(res.className, '!from-secondary-700');
      res.traderNameCls = '!text-secondary-100';
    }

    return res;
  });

  const getRightBridgeHeaderInfo = useMemoizedFn(() => {
    const res: BridgeHead = { side: Side.SideNone, className: baseCls, payForAlign: 'right' };
    if (index === formState.length - 1) {
      // 右侧取真实交易双方信息
      res.side = Side.SideBid;
      res.bridgeInst = getInstName({ inst: defaultRealTradeValue?.bidInst, productType });
      res.realityTrade = bidRealTraderDisplay;
      res.payForAlign = 'right';
    } else {
      res.bridgeInst = getInstName({ inst: value.bidBridgeInst, productType });
      res.realityTrade = bidBridgeTraderDisplay;
      res.className = cx(res.className, '!from-orange-700');
      res.traderNameCls = '!text-orange-100';
    }

    return res;
  });

  const leftBridgeInfo = getLeftBridgeHeaderInfo();
  const rightBridgeInfo = getRightBridgeHeaderInfo();

  const hideCommentIsChecked = isFirst ? realTradeValue.ofrHideComment : realTradeValue.bidHideComment;

  const leftOfrBridgeSendMsg = defaultSendMsg.find(v => v.traderId === value.ofrBridgeTrader?.trader_id)?.sendMsg ?? '';
  const rightBidBridgeSendMsg =
    defaultSendMsg.find(v => v.traderId === value.bidBridgeTrader?.trader_id)?.sendMsg ?? '';
  const currBridgeSendMsg =
    defaultSendMsg.find(v => v.traderId === currentBridgeInfo?.trader?.trader_id)?.sendMsg ?? '';

  const handleDirectionClick = useMemoizedFn(() => {
    const cur =
      direction === TradeDirection.TradeDirectionBid2Ofr
        ? TradeDirection.TradeDirectionOfr2Bid
        : TradeDirection.TradeDirectionBid2Ofr;
    updateFormState('direction', cur, receiptDealId);

    // 第一单
    if (isFirst) {
      if (cur === TradeDirection.TradeDirectionBid2Ofr) {
        // bid->ofr（真实交易机构）
        updateFormState('sendMsg', ofrRealTraderDisplay, receiptDealId);
      } else {
        // ofr（真实交易机构）->bid
        updateFormState('sendMsg', currBridgeSendMsg, receiptDealId);
      }
      return;
    }

    // 最后一单
    if (isLast) {
      if (cur === TradeDirection.TradeDirectionBid2Ofr) {
        // bid（真实交易机构）->ofr
        updateFormState('sendMsg', currBridgeSendMsg, receiptDealId);
      } else {
        // ofr->bid（真实交易机构）
        updateFormState('sendMsg', bidRealTraderDisplay, receiptDealId);
      }
      return;
    }

    // 中间单
    if (cur === TradeDirection.TradeDirectionBid2Ofr) {
      // bid->ofr
      if (isRight) updateFormState('sendMsg', currBridgeSendMsg, receiptDealId); // 右边 bid->ofr
      else updateFormState('sendMsg', leftOfrBridgeSendMsg, receiptDealId); // 左边 bid->ofr (当前index ofr方桥的发给)
      return;
    }

    // ofr->bid
    if (isLeft) updateFormState('sendMsg', currBridgeSendMsg, receiptDealId); // 左边 ofr->bid
    else updateFormState('sendMsg', rightBidBridgeSendMsg, receiptDealId); // 右边 ofr->bid（当前index bid方桥的发给）
  });

  return (
    <div className="bg-gray-800 rounded-lg border border-solid border-gray-600 p-3 flex flex-col gap-2 box-border w-[356px]">
      <div className="flex items-center gap-2">
        <Bridge
          side={leftBridgeInfo.side}
          className={leftBridgeInfo.className}
          withPayFor={isLast}
          bridgeInst={leftBridgeInfo.bridgeInst}
          realityTrade={leftBridgeInfo.realityTrade}
          traderNameCls={cx(leftBridgeInfo.traderNameCls, baseTraderCls)}
          payForAlign={leftBridgeInfo.payForAlign}
          selected={realTradeValue.flagBidPayForInst}
          onPayForClick={() => {
            if (!isLast) return;
            updateRealTradeState('flagBidPayForInst', !realTradeValue.flagBidPayForInst);

            /** 更新费用 */
            updateFormState('fee', realTradeValue.flagBidPayForInst ? void 0 : bidCost.current, receiptDealId);
          }}
        />
        <Button.Icon
          icon={direction === TradeDirection.TradeDirectionOfr2Bid ? <IconRightArrow /> : <IconLeftArrow />}
          className="!w-6 !h-6"
          onClick={handleDirectionClick}
        />

        <Bridge
          side={rightBridgeInfo.side}
          className={rightBridgeInfo.className}
          withPayFor={isFirst}
          bridgeInst={rightBridgeInfo.bridgeInst}
          realityTrade={rightBridgeInfo.realityTrade}
          traderNameCls={cx(rightBridgeInfo.traderNameCls, baseTraderCls)}
          selected={realTradeValue.flagOfrPayForInst}
          onPayForClick={() => {
            if (!isFirst) return;
            updateRealTradeState('flagOfrPayForInst', !realTradeValue.flagOfrPayForInst);

            /** 更新费用 */
            updateFormState('fee', realTradeValue.flagOfrPayForInst ? void 0 : ofrCost.current, receiptDealId);
          }}
        />
      </div>

      <div className="component-dashed-x-600" />

      <BaseInfo />

      {/* 发给 */}
      <Send
        value={sendMsg}
        onChange={val => {
          updateFormState('sendMsg', val, receiptDealId);
        }}
      />

      {/* 渠道 */}
      <Channel
        value={channel}
        onChange={val => {
          updateFormState('channel', val, receiptDealId);
        }}
      />

      {/* 费用 */}
      <Cost
        value={fee?.toString()}
        onChange={val => {
          updateFormState('fee', val as unknown as number, receiptDealId);
          if (!isReal) return;
          const payForField = isFirst ? 'flagOfrPayForInst' : 'flagBidPayForInst';
          // 联动点亮代付标识
          if (val) updateRealTradeState(payForField, true);
        }}
        withRateBtn={isReal}
        onRateClick={() => {
          if (!isReal) return;
          if (isFirst) handleRate(Side.SideOfr, receiptDealId);
          else handleRate(Side.SideBid, receiptDealId);
        }}
      />

      {/* 结算 */}
      <Settlement settlement={settlement} />

      {/* 发单备注 */}
      <SendComment
        value={sendMsgComment}
        onChange={val => {
          updateFormState('sendMsgComment', val, receiptDealId);
        }}
      />

      {isReal && <div className="component-dashed-x-600" />}

      {isReal && (
        <HideComment
          isChecked={!!hideCommentIsChecked}
          onChange={() => {
            if (!isReal) return;
            const field = isFirst ? 'ofrHideComment' : 'bidHideComment';
            updateRealTradeState(field, !hideCommentIsChecked);
          }}
        />
      )}
      {isReal && <SendInstGroup side={index === 0 ? Side.SideOfr : Side.SideBid} />}
    </div>
  );
};
