import { ProductType } from '@fepkg/services/types/bdm-enum';
import localforage from 'localforage';
import { ReceiptDealPanelStruct } from '@/pages/Deal/Receipt/ReceiptDealPanel/providers/ReceiptDealPanelProvider/types';
import { ReceiptDealTableColumnSettingItem } from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export const getReceiptDealPanelStoreKey = (productType: ProductType, userId?: string) => {
  return `receiptDeal-${productType}-${userId}`;
};

export const getReceiptDealPanelStructFromLocalForage = async (
  storeKey: string
): Promise<ReceiptDealPanelStruct | undefined> => {
  try {
    return (await localforage.getItem(storeKey)) as ReceiptDealPanelStruct;
  } catch {
    return undefined;
  }
};
export const setTableStructsToLocalForage = async (storeKey: string, panelStructs: ReceiptDealPanelStruct) => {
  await localforage.setItem(storeKey, panelStructs);
};

export type UpdatePanelStructCacheFnParams = {
  /** 数据存储 key */
  storeKey: string;
} & {
  type: 'columnSettings';
  value?: ReceiptDealTableColumnSettingItem[];
};

export const updateReceiptDealPanelStructCache = async (params: UpdatePanelStructCacheFnParams) => {
  const { storeKey, type, value } = params;
  const panelStruct = await getReceiptDealPanelStructFromLocalForage(storeKey);
  const structs = { ...panelStruct, [type]: value } as ReceiptDealPanelStruct;
  await setTableStructsToLocalForage(storeKey, structs);
};
