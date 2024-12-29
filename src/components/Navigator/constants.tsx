import {
  IconBridge,
  IconCRM,
  IconCalculator,
  IconContractNote,
  IconCoordinatedQuotation,
  IconDtm,
  IconIQuote,
  IconMarket,
  IconMore,
  IconQuoteReminder,
  IconSetting,
  IconTP,
  IconTransactionDetails
} from '@fepkg/icon-park-react';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { NavigatorItemId, NavigatorItemInfo, NavigatorMenuItem } from './types';

export const DROPPABLE_AREA_ID = 'navigator-droppable-area';
export const NAVIGATOR_MORE_ID = 'navigator-more';

export const DEFAULT_NAVIGATOR_MENU: NavigatorMenuItem[] = [
  { id: NavigatorItemId.Market },
  { id: NavigatorItemId.CoordinatedQuotation },
  { id: NavigatorItemId.IQuote },
  { id: NavigatorItemId.QuoteReminder },
  { id: NavigatorItemId.Calculator },
  { id: NavigatorItemId.ReceiptDeal },
  { id: NavigatorItemId.BNCTrade },
  { id: NavigatorItemId.TransactionDetails },
  { id: NavigatorItemId.Bridge },
  { id: NavigatorItemId.CRM },
  { id: NavigatorItemId.ReceiptDealApproval },
  { id: NavigatorItemId.Setting }
];

export const getNavigatorInfoMap = (productType: ProductType): Record<NavigatorItemId, NavigatorItemInfo> => ({
  [NavigatorItemId.Market]: {
    label: '行情',
    icon: <IconMarket />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.MktPage),
    sortable: false
  },
  [NavigatorItemId.CoordinatedQuotation]: {
    label: '协同报价',
    icon: <IconCoordinatedQuotation />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.CollaborationMenu),
    sortable: true
  },
  [NavigatorItemId.IQuote]: {
    label: 'iQuote',
    icon: <IconIQuote />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.IQuoteMenu),
    sortable: true
  },
  [NavigatorItemId.QuoteReminder]: {
    label: '行情追踪',
    icon: <IconQuoteReminder />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.TraceMenu),
    sortable: true
  },
  [NavigatorItemId.Calculator]: {
    label: '计算器',
    icon: <IconCalculator />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.CalMenu),
    sortable: true
  },
  [NavigatorItemId.ReceiptDeal]: {
    label: '成交单',
    icon: <IconContractNote />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealPage),
    sortable: true,
    contextMenu: true
  },
  [NavigatorItemId.BNCTrade]: {
    label: '点价',
    icon: <IconTP />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.SpotPricing),
    sortable: true
  },
  [NavigatorItemId.TransactionDetails]: {
    label: '明细',
    icon: <IconTransactionDetails />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.DealDetailPage),
    sortable: true
  },
  [NavigatorItemId.Bridge]: {
    label: '过桥',
    icon: <IconBridge />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.BridgePage),
    sortable: true
  },
  [NavigatorItemId.CRM]: {
    label: 'CRM',
    icon: <IconCRM />,
    accessCode: AccessCode.Crm,
    sortable: true
  },
  [NavigatorItemId.Setting]: {
    label: '设置',
    icon: <IconSetting />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.System),
    sortable: true
  },
  [NavigatorItemId.ReceiptDealApproval]: {
    label: 'DTM',
    icon: <IconDtm />,
    accessCode: AccessCode.CodeDTM,
    sortable: true
  },
  [NavigatorItemId.More]: {
    label: '更多',
    icon: <IconMore />,
    accessCode: getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.System),
    sortable: false
  }
});
