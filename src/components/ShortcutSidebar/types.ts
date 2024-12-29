import { FiccBondBasic, MarketDeal, QuoteLite } from '@fepkg/services/types/common';
import { Side } from '@fepkg/services/types/enum';
import { OptimisticUpdateParams } from '@/common/services/hooks/useBondQuoteQuery';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';

export enum InternalEnum {
  /** 明盘 */
  External,
  /** 暗盘 */
  Internal
}

export type ShortcutSidebarProps = {
  /** 当前展示的表格 Key */
  activeTableKey: ProductPanelTableKey;
  /** 已选择的方向 */
  selectedSide?: Side;
  /** 已选择的债券列表 */
  selectedBondList: FiccBondBasic[];
  /** 已选择的报价列表  */
  selectedQuoteList: QuoteLite[];
  /** 是否有选择 STC 报价 */
  hasSelectedSTCQuote: boolean;
  /** 乐观更新时的回调 */
  onOptimisticUpdate?: (params: OptimisticUpdateParams) => void;
  /** 操作成功后的回调 */
  onEventSuccess: () => void;
};

export type DealShortcutSidebarProps = {
  /** 已选择的成交 */
  selectedMarketDealList: MarketDeal[];
  /** 乐观更新时的回调 */
  onOptimisticUpdate?: (params: OptimisticUpdateParams) => void;
  /** 操作成功后的回调 */
  onEventSuccess: () => void;
};

export enum Action {
  Delete,
  Edit,
  Join,
  Refer,
  UnRefer,
  UpdatePrice,
  UpdateVol,
  /** 批量更新报价的 Settlement */
  MulUpsertSettlement,
  /** 右键菜单/右侧快捷栏  编辑报价 */
  EditQuote,
  /** 成交 */
  Deal,
  /** 编辑成交 */
  EditDeal
}

export enum ActionValue {
  BID_OFR, // BID_OFRsBID_OFRss
  UpdateTime, // 更新报价时间
  SingleStar, // 单星
  DoubleStar, // 双星
  Pack, // 打包
  OCO, // OCO
  Internal, // 暗盘
  External, // 明盘
  Val, // 中债估值
  Urgent, // 紧急
  ExchangeSide, // 换边
  Recommend, // 推荐
  AlmostDone // Almost Done 标识该条报价为灰色
}

export type UpdatePrice = {
  price: number;
  isBatch?: boolean;
};

export type UpdateVolume = {
  volume: number;
  isBatch?: boolean;
};
