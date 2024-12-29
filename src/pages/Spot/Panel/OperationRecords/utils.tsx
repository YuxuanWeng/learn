import { ReactNode } from 'react';
import { CompItem, getCpData } from '@fepkg/business/components/DealDetailLogTable/CpCell';
import { BondQuoteTypeMap, BrokerageCommentMap, ExerciseTypeMap } from '@fepkg/business/constants/map';
import { getCP } from '@fepkg/business/utils/get-name';
import { IconCheckCircleFilled, IconMinusCircleFilled, IconPartialConfirmation } from '@fepkg/icon-park-react';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BondDealLog, Counterparty, DealOperationLogV2 } from '@fepkg/services/types/bds-common';
import { BondQuoteType, DealOperationType, DealType, ExerciseType } from '@fepkg/services/types/bds-enum';
import { formatPrice } from '@/common/utils/copy';
import { getSettlementType } from '../DealRecord/utils';

export const notUpdatesOperationTypes = new Set([
  DealOperationType.DealOperationTypeNone,
  DealOperationType.DOTNewDeal,
  DealOperationType.DOTBrokerAConfirm,
  DealOperationType.DOTBrokerAReject,
  DealOperationType.DOTBrokerBConfirm,
  DealOperationType.DOTBrokerBReject,
  DealOperationType.DOTSend,
  DealOperationType.DOTRemindOrder,
  DealOperationType.DOTHandOver,
  DealOperationType.DOTCreateByClone,
  DealOperationType.DOTCloned,
  DealOperationType.DOTReceiptDealDelete
]);

const getBroker = (cp?: Counterparty) => {
  if (cp?.broker == null) return undefined;

  return cp.broker.name_cn;
};

const getTransfer = (cp?: Counterparty) => {
  if (!cp?.flag_modify_brokerage) return undefined;
  return cp?.brokerage_comment == null ? undefined : BrokerageCommentMap[cp?.brokerage_comment];
};

const getBondCode = (snapShot: BondDealLog) => snapShot.snapshot?.bond_basic_info?.display_code;

const getPrice = (snapShot: BondDealLog) => {
  const priceStr = snapShot.snapshot?.price?.toFixed(4);

  const rebateStr = formatPrice(snapShot.snapshot?.return_point, 4);

  return rebateStr &&
    snapShot.snapshot?.return_point != null &&
    snapShot.snapshot.return_point > 0 &&
    snapShot.snapshot?.price_type === BondQuoteType.Yield
    ? `${priceStr} F${rebateStr}`
    : priceStr;
};

const getPriceType = (snapShot: BondDealLog) =>
  BondQuoteTypeMap[snapShot.snapshot?.price_type ?? ''] as string | undefined;

const getVolume = (snapShot: BondDealLog) => snapShot.snapshot?.confirm_volume?.toString();

const getLiquidation = (snapShot: BondDealLog) => {
  return getSettlementType(
    snapShot.snapshot?.bid_settlement_type?.at(0),
    snapShot.snapshot?.ofr_settlement_type?.at(0),
    snapShot.snapshot?.bid_traded_date,
    snapShot.snapshot?.ofr_traded_date,
    snapShot.snapshot?.flag_exchange
  );
};

const getExec = (snapShot: BondDealLog) => {
  return { ...ExerciseTypeMap, [ExerciseType.ExerciseTypeNone]: '默认' }[
    snapShot.snapshot?.exercise_type ?? ExerciseType.ExerciseTypeNone
  ];
};

const getBidCP = (snapShot: BondDealLog, _, productType?: ProductType) => {
  const counterparty =
    snapShot.snapshot?.deal_type !== DealType.TKN
      ? snapShot.snapshot?.spot_pricingee
      : snapShot.snapshot?.spot_pricinger;

  return getCP({ productType, inst: counterparty?.inst, trader: counterparty?.trader });
};

const getOfrCP = (snapShot: BondDealLog, _, productType?: ProductType) => {
  const counterparty =
    snapShot.snapshot?.deal_type === DealType.TKN
      ? snapShot.snapshot?.spot_pricingee
      : snapShot.snapshot?.spot_pricinger;
  return getCP({ productType, inst: counterparty?.inst, trader: counterparty?.trader });
};

const getBidBroker = (snapShot: BondDealLog) =>
  getBroker(
    snapShot.snapshot?.deal_type !== DealType.TKN
      ? snapShot.snapshot?.spot_pricingee
      : snapShot.snapshot?.spot_pricinger
  );

const getOfrBroker = (snapShot: BondDealLog) =>
  getBroker(
    snapShot.snapshot?.deal_type === DealType.TKN
      ? snapShot.snapshot?.spot_pricingee
      : snapShot.snapshot?.spot_pricinger
  );

const getBridge = (snapShot: BondDealLog) => (snapShot.snapshot?.flag_bridge ? '是' : '否');

const getSendOrderMsg = (snapShot: BondDealLog) =>
  snapShot.snapshot?.flag_bridge ? undefined : snapShot.snapshot?.send_order_msg;

const getBidSendOrderMsg = (snapShot: BondDealLog) =>
  snapShot.snapshot?.flag_bridge ? snapShot.snapshot?.bid_send_order_msg : undefined;

const getOfrSendOrderMsg = (snapShot: BondDealLog) =>
  snapShot.snapshot?.flag_bridge ? snapShot.snapshot?.ofr_send_order_msg : undefined;

const getStaggerDate = (snapShot: BondDealLog) => {
  const staggerDate = snapShot.stagger_date;

  if (staggerDate === 1) return 'ofr错期';
  if (staggerDate === 2) return 'bid错期';

  return undefined;
};

const getBidBrokerageReason = (snapShot: BondDealLog) =>
  getTransfer(
    snapShot.snapshot?.deal_type !== DealType.TKN
      ? snapShot.snapshot?.spot_pricingee
      : snapShot.snapshot?.spot_pricinger
  );

const getOfrBrokerageReason = (snapShot: BondDealLog) =>
  getTransfer(
    snapShot.snapshot?.deal_type === DealType.TKN
      ? snapShot.snapshot?.spot_pricingee
      : snapShot.snapshot?.spot_pricinger
  );

const getCPListFlag = (snapShot: BondDealLog) =>
  JSON.stringify(
    snapShot.details?.map(d =>
      [
        d.child_deal_id,
        d.bid_inst_id,
        d.ofr_inst_id,
        d.bid_trader_id,
        d.ofr_trader_id,
        d.bid_flag_bridge,
        d.ofr_flag_bridge,
        snapShot.flag_bid_pay_for_inst,
        snapShot.flag_ofr_pay_for_inst
      ].join('_')
    )
  );
const getCPListRender = (snapShot: BondDealLog) => {
  return (
    <CompItem
      list={getCpData(
        snapShot?.details ?? [],
        snapShot.flag_bid_pay_for_inst,
        snapShot.flag_ofr_pay_for_inst,
        snapShot.snapshot?.bond_basic_info?.product_type
      )}
    />
  );
};

const emptyStrToNull = (str?: string) => (str === '' ? undefined : str);

export const getMessageRender = (record: DealOperationLogV2) => {
  const operationType = record.operation_type;

  const iconSenctionCls = 'flex items-center gap-2';

  if (operationType === DealOperationType.DOTBrokerAReject || operationType === DealOperationType.DOTBrokerBReject) {
    return () => (
      <div className={iconSenctionCls}>
        <IconMinusCircleFilled className="text-danger-100" />
        拒绝
      </div>
    );
  }

  if (operationType === DealOperationType.DOTBrokerAConfirm || operationType === DealOperationType.DOTBrokerBConfirm) {
    return () => (
      <div className={iconSenctionCls}>
        <IconCheckCircleFilled className="text-primary-100" />
        已确认
      </div>
    );
  }

  if (operationType === DealOperationType.DOTBrokerBPartiallyFilled) {
    return () => (
      <div className={iconSenctionCls}>
        <IconPartialConfirmation className="text-purple-100" />
        部分确认
      </div>
    );
  }

  if (operationType === DealOperationType.DOTRemindOrder) {
    return () => (
      <div className={iconSenctionCls}>
        <IconCheckCircleFilled className="text-primary-100" />
        已催单
      </div>
    );
  }

  if (operationType === DealOperationType.DOTSend) {
    return () => (
      <div className={iconSenctionCls}>
        <IconCheckCircleFilled className="text-primary-100" />
        已发送
      </div>
    );
  }

  if (operationType === DealOperationType.DOTHandOver) {
    return () => (
      <div className={iconSenctionCls}>
        <IconCheckCircleFilled className="text-primary-100" />
        已移交
      </div>
    );
  }

  if (operationType === DealOperationType.DOTCloned) {
    const internalCodes = (record.after_deal_snapshot?.be_clone_internal_code ?? []).map(c => `【${c}】`).join(' ');
    return () => `克隆${(record.after_deal_snapshot?.be_clone_internal_code ?? []).length}条 内码${internalCodes}`;
  }

  if (operationType === DealOperationType.DOTCreateByClone) {
    return () => `由内码【${record.after_deal_snapshot?.snapshot?.clone_source_internal_code}】克隆新增`;
  }

  return undefined;
};

export const getDiffRenders = (old?: BondDealLog, current?: BondDealLog) => {
  const result: {
    label: string;
    renderBefore?: () => ReactNode;
    renderAfter?: () => ReactNode;
  }[] = [];

  const processList: {
    label: string;
    func: (snapShot: BondDealLog, isOld: boolean, productType?: ProductType) => JSX.Element | undefined | string;
    funcFlag?: (snapShot: BondDealLog) => string;
  }[] = [
    {
      label: '产品',
      func: getBondCode
    },
    {
      label: 'Px',
      func: getPrice
    },
    {
      label: '价格备注',
      func: getPriceType
    },
    {
      label: 'Vol',
      func: getVolume
    },
    {
      label: '交割方式',
      func: getLiquidation
    },
    {
      label: '行权方式',
      func: getExec
    },
    {
      label: 'CP.Bid',
      func: getBidCP
    },
    {
      label: 'Broker(B)',
      func: getBidBroker
    },
    {
      label: 'CP.Ofr',
      func: getOfrCP
    },
    {
      label: 'Broker(O)',
      func: getOfrBroker
    },
    {
      label: '是否过桥',
      func: getBridge
    },
    {
      label: '发给',
      func: getSendOrderMsg
    },
    {
      label: 'Bid发给',
      func: getBidSendOrderMsg
    },
    {
      label: 'Ofr发给',
      func: getOfrSendOrderMsg
    },
    {
      label: 'Ofr发给',
      func: getStaggerDate
    },
    {
      label: '免佣类型(B)',
      func: getBidBrokerageReason
    },
    {
      label: '免佣类型(O)',
      func: getOfrBrokerageReason
    },
    {
      label: 'CP信息',
      func: getCPListRender,
      funcFlag: getCPListFlag
    }
  ];

  for (const p of processList) {
    const productType = old?.snapshot?.bond_basic_info?.product_type;

    const oldFlag = old == null ? undefined : emptyStrToNull((p.funcFlag ?? p.func)(old, true, productType) as string);
    const newFlag =
      current == null ? undefined : emptyStrToNull((p.funcFlag ?? p.func)(current, true, productType) as string);

    if (oldFlag !== newFlag) {
      const oldContent = p.func == null ? oldFlag : p.func(old!, true, productType);
      const newContent = p.func == null ? newFlag : p.func(current!, true, productType);
      result.push({
        label: p.label,
        renderBefore: () => oldContent || undefined,
        renderAfter: () => newContent || undefined
      });
    }
  }

  return result;
};
