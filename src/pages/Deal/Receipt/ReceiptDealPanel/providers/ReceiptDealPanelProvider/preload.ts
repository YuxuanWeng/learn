import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { dealDateManager } from '@fepkg/business/utils/data-manager/deal-date-manager';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { miscStorage } from '@/localdb/miscStorage';
import {
  getReceiptDealPanelStoreKey,
  getReceiptDealPanelStructFromLocalForage
} from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/storage';
import { checkOnOrBeforeFirstWeekdayOfMonth } from '../../components/ReceiptDealTable/utils';

export const receiptDealPanelLoader = async ({ params }: LoaderFunctionArgs) => {
  const productType = Number(params.productType) || ProductType.BNC;
  const { internalCode, timestamp } = params;

  const panelStoreKey = getReceiptDealPanelStoreKey(productType, miscStorage.userInfo?.user_id);
  const panelCache = await getReceiptDealPanelStructFromLocalForage(panelStoreKey);

  const firstWeekdayOfMonth = dealDateManager.getFirstDealDateOfMonth();
  const isOnOrBeforeFirstWorkdayOfMonth = checkOnOrBeforeFirstWeekdayOfMonth(firstWeekdayOfMonth);

  return {
    panelStoreKey,
    internalCode,
    timestamp,
    panelCache,
    isOnOrBeforeFirstWorkdayOfMonth
  };
};

export const useReceiptDealPanelLoader = () => useLoaderData() as Awaited<ReturnType<typeof receiptDealPanelLoader>>;
