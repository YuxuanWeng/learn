import { MarketDeal, NCDPInfo } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealChildRowData } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';
import { ShortcutSidebarProps } from '../ShortcutSidebar/types';

export type TCellContextMenuProps = ShortcutSidebarProps & {
  /** key 的前缀，用于一个页面有多个右键菜单时作区分 */
  keyPrefix?: string;
  /** 产品类型 */
  productType: ProductType;
};

export type InvalidContextMenuProps = Pick<TCellContextMenuProps, 'selectedQuoteList'>;

export type DealContextMenuProps = {
  selectedMarketDealList: MarketDeal[];
};

export type ReceiptDealContextMenuProps = {
  selectedReceiptDealList: ReceiptDealChildRowData[];
};

export type NCDContextMenuProps = {
  selectedNCDPList: NCDPInfo[];
  referred: boolean;
};
