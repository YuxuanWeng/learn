import { ButtonIconProps } from '@fepkg/components/Button/types';
import { IconBridgeText, IconPayfor } from '@fepkg/icon-park-react';
import { ReceiptDealTradeFlag } from '../types';

export const getReceiptDealTradeFlagProps = (flag: ReceiptDealTradeFlag | null) => {
  if (!flag) return {};
  return {
    [ReceiptDealTradeFlag.Real]: { type: 'orange', checked: false, icon: <IconBridgeText /> },
    [ReceiptDealTradeFlag.Bridge]: { type: 'orange', checked: true, icon: <IconBridgeText /> },
    [ReceiptDealTradeFlag.Payfor]: { type: 'danger', checked: true, icon: <IconPayfor /> }
  }[flag] as Partial<ButtonIconProps>;
};
