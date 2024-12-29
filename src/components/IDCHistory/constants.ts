import { BrokerageCommentMap } from '@fepkg/business/constants/map';
import { BondDealStatus, OperationSource, ReceiptDealTradeInstBrokerageComment } from '@fepkg/services/types/enum';

/** 调佣菜单选项 */
export const brokerageCommentOpts: { key: keyof typeof BrokerageCommentMap; label: string }[] = Object.entries(
  BrokerageCommentMap
)
  .map(([key, label]) => ({
    key: Number(key),
    label
  }))
  .filter(
    item =>
      ![
        ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentNormalBrokerage,
        ReceiptDealTradeInstBrokerageComment.RDTradeInstBrokerageCommentEnumNone
      ].includes(item.key)
  );

/** 历史记录来源标志颜色 */
export const markColors: Record<BondDealStatus, string> = {
  [BondDealStatus.BondDealStatusNone]: '',
  [BondDealStatus.DealConfirming]: 'bg-orange-100',
  [BondDealStatus.DealConfirmed]: 'bg-green-100',
  [BondDealStatus.DealPartConfirmed]: 'bg-purple-100',
  [BondDealStatus.DealRefuse]: 'bg-danger-100',
  // 删除不会展示，这里没有样式
  [BondDealStatus.DealDelete]: '',
  // TODO 需要确定颜色
  [BondDealStatus.DealAsking]: ''
};

/** 历史记录来源标志 */
export const sourceText: Record<OperationSource, string | undefined> = {
  [OperationSource.OperationSourceNone]: void 0,
  [OperationSource.OperationSourceQm]: 'QM',
  [OperationSource.OperationSourceStc]: 'STC',
  [OperationSource.OperationSourceOffline]: '克隆',
  // idb和idc来源都当idc处理不标记
  [OperationSource.OperationSourceBdsIdb]: void 0,
  [OperationSource.OperationSourceBdsIdc]: void 0,
  // 一般不会有老系统的这种情况这种情况
  [OperationSource.OperationSourceIdb]: void 0,
  [OperationSource.OperationSourceIdc]: void 0,

  [OperationSource.OperationSourceQuickChat]: void 0,
  [OperationSource.OperationSourceQuoteDraft]: void 0,
  [OperationSource.OperationSourceReceiptDeal]: void 0,
  [OperationSource.OperationSourceSpotPricing]: void 0,
  [OperationSource.OperationSourceDealRecord]: void 0,
  [OperationSource.OperationSourceApproveReceiptDeal]: void 0,
  [OperationSource.OperationSourceReceiptDealDetail]: void 0,
  [OperationSource.OperationSourceReceiptDealBridge]: void 0,
  [OperationSource.OperationSourceQQGroup]: void 0,
  [OperationSource.OperationSourceDataFeed]: void 0
};
