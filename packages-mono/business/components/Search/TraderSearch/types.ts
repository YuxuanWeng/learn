import { SearchOption, SearchProps } from '@fepkg/components/Search';
import { Trader } from '@fepkg/services/types/common';
import { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';

/** 交易员 */
export type TraderWithPref = Trader & {
  /** 唯一标识 */
  key?: string;
  /** 是否为首选项 */
  preference?: boolean;
};

export type TraderSearchProps = Omit<SearchProps<TraderWithPref>, 'options' | 'value' | 'onChange'> & {
  /** 搜索接口入参 */
  searchParams?: Partial<Omit<LocalTraderSearch.Request, 'keyword'>>;
  /** 选择时的回调
   * （如果不为 undefined 内部将使用 onChange 代替 TraderSearchProvider 中的更新上下文状态的方法，
   *   因此外部需要使用 TraderSearchProvider 提供的更新状态方法更新上下文的状态，这是为了保持单向数据流的一致性） */
  onChange?: (opt?: SearchOption<TraderWithPref> | null) => void;
  /** 请求前的回调 */
  onBeforeSearch?: (params?: string) => void;
};
