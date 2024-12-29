import { BondBenchmarkRate, FiccBondBasic, FiccBondDetail, InstRating, QuoteLite } from '@fepkg/services/types/common';
import { Moment } from 'moment';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';

/**
 * 债券信息->基本信息的字段描述
 */
export type TypeBaseInfo = {
  /**
   * 债券全称
   */
  full_name?: string;

  /**
   * 主体评级
   */
  issuer_rating_current?: string;

  /**
   * 债项评级
   */
  rating_current?: string;

  /**
   * 债券类型
   */
  selective_name?: string;

  /**
   * 含权类型
   */
  option_type?: string;

  /**
   * 主承销商
   */
  underwriter_code?: string;

  /**
   * 发行规模
   */
  issue_amount?: string;

  /**
   * 承销团
   */
  underwriter_group?: string;

  /**
   * 债券期限
   */
  maturity_term?: string;

  /**
   * 担保方式
   */
  warrant_method?: string;

  /**
   * 剩余期限
   */
  time_to_maturity?: string;

  /**
   * 担保人
   */
  warranter?: string;

  /**
   * 还本方式
   */
  repayment_method?: string;
};

/**
 * 利率信息
 */
export type TypeRateInfo = {
  /**
   * 利率方式
   */
  coupon_type?: string;

  /**
   * 票面利率
   */
  coupon_rate_current?: string;

  /**
   * 基础利率名
   */
  name?: string;

  /**
   * 基础利率
   */
  value?: string;

  /**
   * 发行收益
   */
  issue_rate?: string;

  /**
   * 发行价格
   */
  issue_price?: string;

  /**
   * 付息频率
   */
  coupon_frequency?: string;

  /**
   * 计息频率
   */
  compound_frequency?: string;
};

/**
 * 债券日历
 */
export type TypeBondCalendar = {
  /**
   * 发行开始日
   */
  issue_start_date?: string;

  /**
   * 到期日
   */
  maturity_date?: string;

  /**
   * 起息日
   */
  interest_start_date?: string;

  /**
   * 下次付息日
   */
  next_coupon_date?: string;

  /**
   * 上市日
   */
  listed_date?: string;

  /**
   * 下市日
   */
  delisted_date?: string;

  /**
   * 行权日
   */
  option_date?: string;
};

export type TypeProps = {
  visible: boolean;
  onChange: (value: number, visible: boolean) => void;
};

export type TypePublisher = {
  company?: string;
  type?: string;
};

export type TypeDisplayItem = {
  /**
   * 债券简称
   */
  short_name: string;

  /**
   * 代码
   */
  bond_code: string;

  /**
   * 剩余期限
   */
  time_to_maturity: string;

  /**
   * 评级
   */
  rating_current: string;

  /**
   * 债券类型
   */
  selective_name: string;

  /**
   * 发行量
   */
  issue_amount: string;

  /**
   * 票面利率
   */
  coupon_rate_current?: string;

  /**
   * 发行人
   */
  publisher?: string;
  /**
   * 担保方式
   */
  warrant_method: string;
  /**
   * 利率方式
   */
  coupon_type: string;
  /**
   * 质押率
   */
  conversion_rate: string;
  /**
   * 债券评级机构
   *
   */
  rating_inst_code: string;

  /**
   * 到期日
   */
  maturity_date: string;
};

export type RangeValue = [Moment | null, Moment | null] | null;

export type LatestBondInfo = {
  bondBasicInfo?: FiccBondBasic;
  bondDetailInfo: FiccBondDetail;
  issuer_rating: InstRating[];
  benchmarkRate?: BondBenchmarkRate; // 债券基准利率
  publisher: string[];
};

export enum TabType {
  ProductQuote = '0',
  BaseInfo = '1'
}

export type BondDetailDialogContext = {
  data?: QuoteLite;
  bond_info?: FiccBondBasic;
  tab?: ProductPanelTableKey;
};
