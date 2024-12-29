import type { LocalBondGetByKeyMarketList } from '@fepkg/services/types/data-localization-manual/bond/get-by-key-market-list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalBondByKeyMarketList = (params: LocalBondGetByKeyMarketList.Request) => {
  return localRequest.invoke<LocalBondGetByKeyMarketList.Request, LocalBondGetByKeyMarketList.Response>({
    value: params,
    action: DataLocalizationAction.BondGetByKeyMarketList
  });
};
