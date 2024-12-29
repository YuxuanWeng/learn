import { DiffDeal, DiffKeys } from '@/components/IDCDealDetails/type';

export const getChangeText = (inputValue: string, diffDeals?: DiffDeal[], key?: DiffKeys) => {
  if (diffDeals?.some(item => item.key === key && item.hasChanged)) {
    return <span className="bg-danger-600 px-1 rounded inline-block">{inputValue}</span>;
  }
  return <span className="inline-block">{inputValue}</span>;
};
