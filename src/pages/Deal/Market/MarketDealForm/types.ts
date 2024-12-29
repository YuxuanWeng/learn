import { InstitutionTiny, MarketDeal, QuoteLite, Trader, User } from '@fepkg/services/types/common';

export type MarketDealDialogContext = {
  /** 默认带入的市场成交数据 */
  defaultValue?: Partial<MarketDeal>;
  /** 默认带入的报价 （从基本报价/最优报价/作废区内进入需要） */
  defaultQuote?: Partial<QuoteLite>;
  /** 默认带入的债券信息是否为只读 */
  defaultBondReadOnly?: boolean;
  /** 默认聚焦的组件 */
  defaultFocused?: 'bond' | 'price';
  /** 打开窗口的时间戳 */
  timestamp?: number;
  /** 拷贝数量 */
  copyCount?: number;
  /** 提交成功时的回调 */
  onSuccess?: () => void;
  /** 取消打开时的回调 */
  onCancel?: () => void;
};

export type InitMarketDealTradeState = {
  inst?: InstitutionTiny;
  trader?: Trader;
  broker?: User;
};

export type MarketDealTradeState = {
  institution_id?: string;
  trader_id?: string;
  trader_tag?: string;
  broker_id?: string;
};
