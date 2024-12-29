// forceVisible：是否强制显示，当从成交列表打开时为true，此时即使是全部被部分确认也会强制显示
// isManualRefresh：card是否来自手动刷新，若是则不需要设为已读
import { SpotPricingDetail } from '@fepkg/services/types/common';
import { ReceiverSide } from '@fepkg/services/types/enum';

// isOffline：是否是线下成交单，若是，则泛型一定为OfflineDealRecord，反之则是SpotPricingRecord
export type SpotPricingDisplayRecord = SpotPricingDetail & {
  forceVisible: boolean;
  isManualRefresh: boolean;
  isOffline: boolean;
  receiverSide: ReceiverSide;
  dealID?: string;
  notifyIDs?: string[];
  outDatedContractIDs?: string[];
};
