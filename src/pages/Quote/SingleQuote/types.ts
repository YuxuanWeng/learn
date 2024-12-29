import { QuoteLite } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';

export enum QuoteActionMode {
  ADD,
  JOIN,
  EDIT,
  /** 从作废区打开报价面板 */
  EDIT_UNREFER,
  /** 右键新报价 */
  CTX_MENU_JOIN
}

export enum QuoteFocusInputType {
  BID_PRICE = 1,
  BID_RETURN_POINT = 2,
  BID_VOL = 3,
  OFR_PRICE = 4,
  OFR_RETURN_POINT = 5,
  OFR_VOL = 6,
  BOND = 7,
  LIQ_SPEED = 8,
  COMMENT = 9,
  BID_LIQ_SPEED = 10,
  OFR_LIQ_SPEED = 11
}

export type SingleQuoteDialogContext = {
  /** 当前活动表格类型 */
  activeTableKey?: ProductPanelTableKey;
  /** 默认带入的报价信息 */
  defaultValue?: Partial<QuoteLite>;
  /** 报价操作类型 */
  actionMode?: QuoteActionMode;
  /** 报价初始聚焦位置 */
  focusInput?: QuoteFocusInputType;
  /** 报价面板是否禁用 */
  disabled?: boolean;
  /** 报价打开时间 */
  timestamp?: number;
  /** 提交成功时的回调 */
  onSuccess?: () => void;
  /** 取消打开时的回调 */
  onCancel?: () => void;
};

/** 报价面板Search Input框分类 */
export enum SearchInputCategory {
  Bond,
  Inst,
  InstTrader,
  Trader,
  Broker
}

/** 报价面板QuoteOper Input框分类 */
export enum QuoteOperInputCategory {
  BirPrice,
  OfrPrice,
  BidVolume,
  OfrVolume,
  BidReturnPoint,
  OfrReturnPoint,
  BidLiqSpeed,
  OfrLiqSpeed
}
