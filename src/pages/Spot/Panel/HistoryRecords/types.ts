import { ReceiptDealSearchRealParentDeal } from '@fepkg/services/types/receipt-deal/search-real-parent-deal';

export type TypeSearchFilter = Omit<ReceiptDealSearchRealParentDeal.Request, 'offset' | 'count'>;
