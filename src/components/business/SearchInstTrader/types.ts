import { ProductType } from '@fepkg/services/types/bdm-enum';
import { Trader } from '@fepkg/services/types/common';

export type TraderTiny = Pick<Trader, 'trader_id' | 'name_zh' | 'inst_info'>;

export type TraderTinyWithInst = TraderTiny & {
  instId?: string;
  cp?: string;
  instName?: string;
  biz_short_name?: string;
  /** 该机构交易员是否为有效 */
  invalid?: boolean;
};

export type InstTraderData = {
  traders: (TraderTiny & { checked?: boolean })[];
  inst_id: string;
  inst_name?: string | undefined;
  cp?: string;
  biz_short_name?: string;
};

export type InstTraderMap = { [inst_id: string]: InstTraderData };

export type SearchInstTraderProps = {
  productType: ProductType;
  visible?: boolean;
  onConfirm?: (data: TraderTinyWithInst[]) => void;
  onCancel?: () => void;
  /** 默认选中的交易员 */
  defaultTraders?: TraderTinyWithInst[];
};
