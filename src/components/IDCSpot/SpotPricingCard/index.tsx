/* eslint-disable no-nested-ternary */
import { FC, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { SpotModalHintFlow } from '@fepkg/business/constants/log-map';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { IconClose } from '@fepkg/icon-park-react';
import { BondDeal, Counterparty, DealQuote, LiquidationSpeed } from '@fepkg/services/types/common';
import {
  BondCategory,
  BondDealStatus,
  BondQuoteType,
  DealOperationType,
  DealType,
  OperationSource,
  ReceiverSide,
  Side,
  SpotPricingFailedReason
} from '@fepkg/services/types/enum';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { idcDealConfirm } from '@/common/services/api/deal/confirm';
import { trackPoint } from '@/common/utils/logger/point';
import { DraggableHeader } from '@/components/HeaderBar';
import { getBondDetailDialogConfig } from '@/components/IDCBoard/utils';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { SpotPricingDisplayRecord } from '@/pages/Spot/SpotPricingHint/types';
import { SpotPricingCardType } from '../types';
import IMMsgLine from './IMMsgLine';
import QuoteLine from './QuoteLine';
import SpotLine from './SpotLine';
import UnMatch from './UnMatch';
import UserLine from './UserLine';
import { SpotPricingCardMessageStatus, SpotPricingCardStatus } from './types';
import {
  getBGTypeClasses,
  getCardMessageStatus,
  getCardStatus,
  getIsInvisible,
  getLiquidationBySpotPricing,
  getMessgeQuote,
  getShowButtons,
  getSpotQuote
} from './util';
import '../style.less';

const SpotPricingCardStatusClasses = {
  [SpotPricingCardStatus.Offline]: 'offline',
  [SpotPricingCardStatus.Confirmed]: 'confirmed',
  [SpotPricingCardStatus.Refused]: 'refused',
  [SpotPricingCardStatus.PartialFinished]: 'partial',
  [SpotPricingCardStatus.NoVolumn]: 'novolume'
};

const TextColors = {
  [SpotPricingCardMessageStatus.QuoterConfirmed]: 'text-green-100 gradient-success',
  [SpotPricingCardMessageStatus.QuoterRefused]: 'text-danger-100 gradient-refused',
  [SpotPricingCardMessageStatus.SpotterRefused]: 'text-danger-100 gradient-refused',
  [SpotPricingCardMessageStatus.SpotterConfirmed]: 'text-purple-100 gradient-partial',
  [SpotPricingCardMessageStatus.QuoterPartialConfirmed]: 'text-purple-100 gradient-partial',
  [SpotPricingCardMessageStatus.QuoterAsking]: 'text-yellow-100 gradient-asking',
  [SpotPricingCardMessageStatus.SpotterAsking]: 'text-yellow-100 gradient-asking'
};

type IProp = {
  card: SpotPricingDisplayRecord;
  message?: BondDeal;
  cardStatus: SpotPricingCardStatus;
  isSpotSelf: boolean;
  spotQuoteData: DealQuote;
  onProcessed?: () => void;
};

const subTitleMainCls = 'inline text-white text-md';
const subTitleSecondaryCls = 'text-gray-200 text-sm font-normal';

const isLiquidationUnlimited = (liquidationList: LiquidationSpeed[]) => {
  const unlimitedList = [
    { tag: 1, offset: 0 },
    { tag: 1, offset: 1 },
    { tag: 2, offset: 0 }
  ];

  if (liquidationList.length === 3) {
    return liquidationList.every(l => {
      return unlimitedList.some(ul => ul.tag === l.tag && ul.offset === l.offset) != null;
    });
  }

  return false;
};

const CardMessage: FC<IProp> = ({ message, isSpotSelf, spotQuoteData, cardStatus, card, onProcessed }) => {
  const spotPricingRecord = card.spot_pricing_record;

  const spotPricingQuote =
    message == null
      ? undefined
      : spotPricingRecord?.spot_pricing_quote_list?.find(q => q.quote_id === message.quote_id);

  const messageQuote =
    message == null || spotPricingQuote == null ? undefined : getMessgeQuote(card, spotPricingQuote, message);

  const messageStatus = getCardMessageStatus(message);

  const showButtons = getShowButtons(messageStatus, isSpotSelf);

  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isAskingLoading, setIsAskingLoading] = useState(false);

  const [spotValue, setSpotValue] = useState<number | undefined>(
    !isSpotSelf ? (message?.spot_pricing_volume ?? 0) / 1000 : 0
  );

  const onConfirm = async () => {
    if (message == null) return;

    if ((spotValue == null || spotValue === 0) && !isSpotSelf) return;

    setIsConfirmLoading(true);
    trackPoint(SpotModalHintFlow.FlowSubmit);
    const isPartConfirmed = !isSpotSelf && (spotValue ?? 0) * 1000 !== (message?.spot_pricing_volume ?? 0);

    let operation_type: DealOperationType;
    if (isSpotSelf) {
      operation_type = DealOperationType.DOTBrokerAConfirm;
    } else if (isPartConfirmed) operation_type = DealOperationType.DOTBrokerBPartiallyFilled;
    else operation_type = DealOperationType.DOTBrokerBConfirm;

    try {
      await idcDealConfirm({
        deal_id: message.deal_id ?? '',
        confirm_status: isPartConfirmed ? BondDealStatus.DealPartConfirmed : BondDealStatus.DealConfirmed,
        volume: isSpotSelf ? undefined : (spotValue ?? 0) * 1000,
        operator: miscStorage.userInfo?.user_id,
        confirm_side: isSpotSelf ? ReceiverSide.SpotPricinger : ReceiverSide.BeSpotPricinger,
        operation_info: {
          operator: miscStorage.userInfo?.user_id ?? '',
          operation_type,
          operation_source: OperationSource.OperationSourceSpotPricing
        }
      });
      trackPoint(SpotModalHintFlow.FlowSuccess);

      onProcessed?.();
    } finally {
      setIsConfirmLoading(false);
      setIsAskingLoading(false);
      setIsRejectLoading(false);
    }
  };

  const onAsking = async () => {
    setIsAskingLoading(true);

    if (message == null) return;

    try {
      await idcDealConfirm({
        deal_id: message.deal_id ?? '',
        confirm_status: BondDealStatus.DealAsking,
        operator: miscStorage.userInfo?.user_id,
        confirm_side: isSpotSelf ? ReceiverSide.SpotPricinger : ReceiverSide.BeSpotPricinger,
        operation_info: {
          operator: miscStorage.userInfo?.user_id ?? '',
          operation_type: isSpotSelf ? DealOperationType.DOTBrokerAAsking : DealOperationType.DOTBrokerBAsking,
          operation_source: OperationSource.OperationSourceSpotPricing
        }
      });
    } finally {
      setIsConfirmLoading(false);
      setIsAskingLoading(false);
      setIsRejectLoading(false);
    }
  };

  const onReject = async () => {
    setIsRejectLoading(true);

    if (message == null) return;

    try {
      await idcDealConfirm({
        deal_id: message.deal_id ?? '',
        confirm_status: BondDealStatus.DealRefuse,
        operator: miscStorage.userInfo?.user_id,
        confirm_side: isSpotSelf ? ReceiverSide.SpotPricinger : ReceiverSide.BeSpotPricinger,
        operation_info: {
          operator: miscStorage.userInfo?.user_id ?? '',
          operation_type: isSpotSelf ? DealOperationType.DOTBrokerAReject : DealOperationType.DOTBrokerBReject,
          operation_source: OperationSource.OperationSourceSpotPricing
        }
      });

      onProcessed?.();
    } finally {
      setIsConfirmLoading(false);
      setIsAskingLoading(false);
      setIsRejectLoading(false);
    }
  };

  const bottomMessage = useMemo(() => {
    const quoterName = message?.spot_pricingee?.broker?.name_cn;
    const spotterName = message?.spot_pricinger?.broker?.name_cn;

    if (messageStatus === SpotPricingCardMessageStatus.QuoterConfirmed) {
      return `${quoterName}确认`;
    }

    if (messageStatus === SpotPricingCardMessageStatus.SpotterRefused) {
      return `${spotterName}拒绝`;
    }

    if (messageStatus === SpotPricingCardMessageStatus.QuoterRefused) {
      return `${quoterName}拒绝`;
    }

    const confirmVolume = message?.confirm_volume && <span className="text-orange-100"> {message.confirm_volume}</span>;

    if (messageStatus === SpotPricingCardMessageStatus.QuoterPartialConfirmed) {
      return (
        <>
          {!isSpotSelf ? '我已' : quoterName}部分确认
          <span className="inline-blocke ml-2">{confirmVolume}</span>
        </>
      );
    }

    if (messageStatus === SpotPricingCardMessageStatus.SpotterConfirmed) {
      return (
        <>
          {isSpotSelf ? '我已' : spotterName}部分确认
          {confirmVolume}
        </>
      );
    }

    if (messageStatus === SpotPricingCardMessageStatus.QuoterAsking && isSpotSelf) {
      return `[${quoterName}在问]`;
    }

    if (messageStatus === SpotPricingCardMessageStatus.SpotterAsking && !isSpotSelf) {
      return (
        <>
          我已部分确认
          {confirmVolume}，[{spotterName}]在问
        </>
      );
    }

    if (messageStatus === SpotPricingCardMessageStatus.SpotterAsking && isSpotSelf) {
      return (
        <>
          {quoterName}部分确认
          {confirmVolume}
        </>
      );
    }

    return '';
  }, [
    message?.confirm_volume,
    message?.spot_pricingee?.broker?.name_cn,
    message?.spot_pricinger?.broker?.name_cn,
    messageStatus,
    isSpotSelf
  ]);

  const unMatchQuotes = useMemo(() => {
    return (spotPricingRecord?.spot_pricing_quote_list ?? []).filter(
      quote => !card.deal_list?.some(m => m.quote_id === quote.quote_id)
    );
  }, [card]);

  const isOutDated = useMemo(() => {
    return card.outDatedContractIDs?.includes(message?.deal_id ?? '');
  }, [card, message]);

  const getSpotPricingInstBySpotter = (): Counterparty => ({
    broker: spotPricingRecord?.spot_pricing_broker_info
  });

  return (
    <div className={cx('bg-gray-800 mx-3 mb-3 last:mb-4 overflow-hidden rounded-lg relative')}>
      {isOutDated && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 bg-[rgba(55,55,55,0.6)] cursor-not-allowed" />
      )}
      <div className="mx-3 pb-2 mb-3">
        <UserLine
          isNoVolumn={cardStatus === SpotPricingCardStatus.NoVolumn}
          dealType={spotPricingRecord?.deal_type ?? DealType.DealTypeNone}
          spotTradeInfo={message == null ? getSpotPricingInstBySpotter() : message?.spot_pricinger}
          quoteTradeInfo={message?.spot_pricingee}
        />
        {!isSpotSelf &&
          message &&
          messageQuote &&
          [
            SpotPricingCardMessageStatus.ConfirmToBe,
            SpotPricingCardMessageStatus.QuoterPartialConfirmed,
            SpotPricingCardMessageStatus.SpotterAsking,
            SpotPricingCardMessageStatus.QuoterAsking
          ].includes(messageStatus) &&
          !messageQuote?.flag_urgent && (
            <IMMsgLine
              quote={messageQuote}
              messageStatus={messageStatus}
              message={message}
            />
          )}
      </div>
      <section className="my-0 mx-3">
        <SpotLine
          confirmVolume={message?.confirm_volume}
          quote={spotQuoteData}
          spotValue={spotValue}
          onSpotVolChange={vol => {
            setSpotValue(vol);
          }}
          isSpottedReply={
            [
              SpotPricingCardMessageStatus.ConfirmToBe,
              SpotPricingCardMessageStatus.QuoterAsking,
              SpotPricingCardMessageStatus.SpotterAsking
            ].includes(messageStatus) && !isSpotSelf
          }
          isPartialConfirmed={
            [SpotPricingCardMessageStatus.QuoterPartialConfirmed, SpotPricingCardMessageStatus.SpotterAsking].includes(
              messageStatus
            ) && !isSpotSelf
          }
        />
        <QuoteLine
          bond={spotPricingRecord?.bond_basic_info}
          quote={messageQuote}
          isMarketChanged={
            unMatchQuotes.length === 0 ||
            unMatchQuotes.some(q => q.spot_pricing_failed_reason === SpotPricingFailedReason.MarketChanged)
          }
        />
      </section>
      {(bottomMessage || showButtons) && (
        <section className="border-0 border-t-gray-600 border-dashed border-t mx-3 pt-2">
          {bottomMessage && (
            <p
              className={cx(
                'mb-2 text-sm text-center w-[300px] h-9 mx-auto flex justify-center items-center',
                TextColors[
                  messageStatus === SpotPricingCardMessageStatus.SpotterAsking && isSpotSelf
                    ? SpotPricingCardMessageStatus.QuoterPartialConfirmed
                    : messageStatus
                ] || ''
              )}
            >
              {bottomMessage}
            </p>
          )}
          {showButtons && (
            <div className="text-center pb-2">
              <Button
                className="mr-1 min-w-[72px] h-6"
                onClick={onReject}
                type="danger"
                ghost
                disabled={isConfirmLoading || isAskingLoading}
                loading={isRejectLoading}
              >
                拒绝
              </Button>
              {![SpotPricingCardMessageStatus.QuoterAsking, SpotPricingCardMessageStatus.SpotterAsking].includes(
                messageStatus
              ) && (
                <Button
                  ghost
                  type="yellow"
                  onClick={onAsking}
                  className="ml-1 mr-1 min-w-[72px] h-6"
                  disabled={isRejectLoading || isConfirmLoading}
                  loading={isAskingLoading}
                >
                  在问
                </Button>
              )}
              <Button
                className="ml-1 min-w-[72px] h-6"
                type="primary"
                onClick={onConfirm}
                disabled={((spotValue == null || spotValue === 0) && !isSpotSelf) || isRejectLoading || isAskingLoading}
                loading={isConfirmLoading}
              >
                确定
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default function SpotPricingCard({
  card,
  className,
  onClose,
  onRefresh,
  forceVisible,
  onDragStart,
  onDragEnd
}: SpotPricingCardType) {
  const { receiverSide } = card;

  const spotPricingRecord = card.spot_pricing_record;

  const isSpotSelf = receiverSide === ReceiverSide.SpotPricinger;

  const isInvisible = useMemo(() => getIsInvisible(card, forceVisible), [card, forceVisible]);

  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  useEffect(() => {
    if (isInvisible) {
      onClose?.();
    }
  }, [card]);

  const cardStatus = useMemo(() => {
    return getCardStatus(card);
  }, [card]);

  const hasOpponentResponse = card.deal_list?.some(m => {
    const status = getCardMessageStatus(m);

    if (!isSpotSelf) {
      return (
        status === SpotPricingCardMessageStatus.SpotterConfirmed ||
        status === SpotPricingCardMessageStatus.SpotterRefused
      );
    }

    return cardStatus !== SpotPricingCardStatus.ConfirmToBe;
  });

  const title = hasOpponentResponse ? '收到点价反馈' : isSpotSelf ? '我的客户发来意向' : '我的客户被点价';

  const bond = spotPricingRecord?.bond_basic_info;

  const unMatchVol = spotPricingRecord?.unmatch_volume ?? 0;

  // 未匹配的点价方报价结构体
  const unmatchSpotQuote = useMemo(() => {
    const side = spotPricingRecord?.deal_type === DealType.GVN ? Side.SideBid : Side.SideOfr;
    const flag_rebate = spotPricingRecord?.return_point != null && spotPricingRecord.return_point > 0;
    const quote_type = BondQuoteType.Yield;
    const trader_info = {
      name_zh: spotPricingRecord?.spot_pricing_trader_info?.name_zh
    };

    return {
      side,
      quote_price: spotPricingRecord?.spot_pricing_price,
      yield: spotPricingRecord?.spot_pricing_price,
      flag_rebate,
      return_point: spotPricingRecord?.return_point,
      quote_type,
      trader_info,
      volume: spotPricingRecord?.spot_pricing_volume,
      liquidation_speed_list: isLiquidationUnlimited(spotPricingRecord?.sp_liquidation_speed_list ?? [])
        ? []
        : spotPricingRecord?.sp_liquidation_speed_list ?? []
    } as DealQuote;
  }, [card]);

  const unMatchQuotes = useMemo(() => {
    return (spotPricingRecord?.spot_pricing_quote_list ?? []).filter(
      quote => !card.deal_list?.some(m => m.quote_id === quote.quote_id)
    );
  }, [card]);

  // 保留 1x1 的大小，不然让主进程重新调整窗口大小的时候会有问题
  if (isInvisible) return <div style={{ width: 1, height: 1 }} />;

  const config = getBondDetailDialogConfig(productType, { bond: spotPricingRecord?.bond_basic_info });

  return (
    <div
      className={cx(
        'spot-pricing-card',
        'w-[456px] pb-px border border-solid border-gray-400 rounded-lg flex flex-col overflow-hidden bg-gray-600 select-none',
        SpotPricingCardStatusClasses[cardStatus] ?? '',
        getBGTypeClasses(cardStatus, (card.deal_list ?? []).length === 1),
        className
      )}
    >
      <DraggableHeader
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <header className="h-12 text-white flex justify-between items-center px-3 text-md rounded-t-lg">
          {title}

          <Button.Icon
            type="transparent"
            icon={<IconClose />}
            onClick={onClose}
          />
        </header>
      </DraggableHeader>

      <h1 className={cx('mx-3 flex justify-start items-center h-6 my-3')}>
        <div>
          <span className={cx(subTitleMainCls, 'mr-2')}>
            {spotPricingRecord?.bond_basic_info?.bond_category === BondCategory.LGB
              ? bond?.short_name
              : bond?.display_code}
          </span>
          <span className={subTitleSecondaryCls}>
            {spotPricingRecord?.bond_basic_info?.bond_category === BondCategory.LGB
              ? bond?.display_code
              : bond?.short_name}
          </span>
        </div>
        <time className="ml-auto text-gray-300 text-sm font-normal">
          {formatDate(spotPricingRecord?.spot_pricing_time, 'HH:mm:ss')}
        </time>
      </h1>

      <div className="overflow-y-overlay">
        {(card.deal_list?.length === 0 ? [undefined] : card.deal_list)?.map((message: BondDeal | undefined) => {
          return (
            <CardMessage
              key={message?.deal_id ?? -1}
              card={card}
              message={message}
              cardStatus={cardStatus}
              isSpotSelf={isSpotSelf}
              spotQuoteData={message == null ? unmatchSpotQuote : getSpotQuote(card.spot_pricing_record!, message)}
              onProcessed={() => {
                if (
                  (card.deal_list ?? [])
                    .filter(m => m !== message)
                    .every(m => {
                      const s = getCardMessageStatus(m);
                      return !getShowButtons(s, isSpotSelf) && s !== SpotPricingCardMessageStatus.ConfirmToBe;
                    })
                ) {
                  onClose?.();
                } else {
                  onRefresh?.();
                }
              }}
            />
          );
        })}
        {isSpotSelf && unMatchVol !== 0 && (
          <UnMatch
            cardStatus={cardStatus}
            spotStatus={unmatchSpotQuote}
            unMatchQuotes={unMatchQuotes}
            unMatchVol={unMatchVol}
            allVol={spotPricingRecord?.spot_pricing_volume ?? 0}
            onOpenBondDetailDialog={() => {
              openDialog(config);
            }}
          />
        )}
      </div>
    </div>
  );
}

export const OfflineSpotPricingCard: FC<SpotPricingCardType> = ({ card, onClose, onDragStart, onDragEnd }) => {
  const deal = card.deal_list?.[0];
  const bond = deal?.bond_basic_info;

  const onConfirm = async () => {
    const contractID = card.deal_list?.[0]?.deal_id;

    if (contractID == null) return;

    await idcDealConfirm({
      deal_id: contractID,
      confirm_status: BondDealStatus.DealConfirmed,
      confirm_side: ReceiverSide.BeSpotPricinger,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTOfflineConfirm,
        operation_source: OperationSource.OperationSourceSpotPricing
      }
    });

    onClose?.();
  };

  const tmpQuote = useMemo(() => {
    const side = Side.SideBid;
    const quote_type = deal?.price_type;
    const flag_rebate = deal?.return_point != null && deal.return_point > 0;
    // const { return_point } = deal;

    return {
      side,
      yield: deal?.price,
      clean_price: deal?.price,
      full_price: deal?.price,
      flag_rebate,
      return_point: deal?.return_point,
      quote_type,
      volume: deal?.spot_pricing_volume,
      liquidation_speed_list: [getLiquidationBySpotPricing(deal)],
      exercise_manual: true
    } as DealQuote;
  }, [deal]);

  return (
    <div
      className={cx(
        'spot-pricing-card',
        'w-[456px] pb-px border border-solid border-gray-400 rounded-lg flex flex-col overflow-hidden bg-gray-600 -mb-px',
        'bg-gray-700 offline overflow-hidden'
      )}
    >
      <DraggableHeader
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <header className="h-12 text-white flex justify-between items-center px-3 text-md rounded-t-lg offline">
          线下成交单
          <IconClose
            onClick={onClose}
            className="w-6 h-6 cursor-pointer hover:text-primary-100"
          />
        </header>
      </DraggableHeader>
      <h1 className={cx('mx-4 flex justify-start items-center h-6 my-3')}>
        <span className={cx(bond?.bond_category === BondCategory.LGB ? subTitleSecondaryCls : subTitleMainCls, 'mr-2')}>
          {bond?.display_code}
        </span>
        <span className={bond?.bond_category === BondCategory.LGB ? subTitleMainCls : subTitleSecondaryCls}>
          {bond?.short_name}
        </span>
        <time className="ml-auto text-gray-300 text-sm">{formatDate(deal?.create_time, 'HH:mm:ss')}</time>
      </h1>
      <div className={cx('bg-gray-800 mx-4 mb-3 last:mb-3 overflow-hidden rounded-lg relative')}>
        <div className={cx('mx-3 pb-2 mb-3')}>
          <UserLine
            isOffline
            dealType={DealType.GVN}
            spotTradeInfo={deal?.spot_pricinger}
            quoteTradeInfo={deal?.spot_pricingee}
          />
        </div>
        <section className="my-0 mx-3">
          <QuoteLine
            bond={bond}
            quote={tmpQuote}
            parseLiquidation={false}
          />
        </section>
      </div>
      <div className="flex justify-center items-center h-14 mt-1.5 bg-gray-800 w-full">
        <Button
          className="h-8"
          type="primary"
          onClick={onConfirm}
        >
          我知道了
        </Button>
      </div>
    </div>
  );
};
