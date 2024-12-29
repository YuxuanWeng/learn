import { SPACE_TEXT } from '@fepkg/common/constants';
import { ReceiptDealTrade } from '@fepkg/services/types/bds-common';

export const transform2BrokerContent = (
  receiptDealTrade: ReceiptDealTrade,
  grantUserIdList?: string[]
): [string, boolean] => {
  const brokerList = [
    receiptDealTrade.broker,
    receiptDealTrade.broker_b,
    receiptDealTrade.broker_c,
    receiptDealTrade.broker_d
  ].filter(b => !!b);
  const brokerContent = brokerList
    .map(b => b?.name_cn)
    .filter(n => !!n)
    .join(SPACE_TEXT);
  const isMine = grantUserIdList ? brokerList.filter(Boolean).some(b => grantUserIdList.includes(b.user_id)) : false;
  return [brokerContent, isMine];
};

export const transform2CPContent = (receiptDealTrade?: ReceiptDealTrade, showPayFor = true) => {
  if (!receiptDealTrade) return '';
  let instStr = receiptDealTrade.inst?.short_name_zh ?? '机构待定';
  if (receiptDealTrade.trader) {
    instStr += `(${receiptDealTrade.trader.name_zh})`;
  }
  if (showPayFor) {
    const payForStr = receiptDealTrade.pay_for_info
      ? `${receiptDealTrade.pay_for_info.pay_for_inst?.short_name_zh ?? ''} ${
          receiptDealTrade.pay_for_info.pay_for_trader?.name_zh ?? ''
        }`
      : '';
    if (payForStr) {
      return instStr + SPACE_TEXT + SPACE_TEXT + payForStr;
    }
  }

  return instStr;
};

export const uniqParentChildList = <P>(parentList: P[], childKey: string, uniqueChildId: string) => {
  const uniqueList: P[] = [];
  const uniqueChildIdSet = new Set<string>();
  const conflictChildIds: string[] = [];
  for (const parent of parentList ?? []) {
    const childList = parent?.[childKey]?.filter(d => {
      const isChildUnique = !uniqueChildIdSet.has(d?.[uniqueChildId]);
      if (!isChildUnique) {
        conflictChildIds.push(d?.[uniqueChildId]);
        return isChildUnique;
      }
      uniqueChildIdSet.add(d?.[uniqueChildId]);
      return isChildUnique;
    });
    if (childList?.length) {
      uniqueList.push({ ...parent, [childKey]: childList });
    }
  }
  return { uniqueList, conflictChildIds };
};
