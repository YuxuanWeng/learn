import { PropsWithChildren, ReactElement } from 'react';
import { PopoverOptions } from '@fepkg/components/Popover';
import { InstitutionTiny } from '@fepkg/services/types/bdm-common';
import { DefaultBridgeConfig } from '@fepkg/services/types/bds-common';

export type FindBridgeProps = PropsWithChildren<
  PopoverOptions & {
    needFindBridge?: boolean;
    findBridgeConfig?: DefaultBridgeConfig;
    parentDealId?: string;
    bidInst?: InstitutionTiny;
    bidTrader?: { name_zh?: string };
    ofrInst?: InstitutionTiny;
    ofrTrader?: { name_zh?: string };
    onChangeSuccess?: (val: DefaultBridgeConfig) => void;
    renderChild: (open: boolean) => ReactElement;
  }
>;
