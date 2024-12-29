import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { SearchOption, SearchProps } from '@fepkg/components/Search';
import type { InstTraderSearch } from '@fepkg/services/types/inst-trader/search';

export type InstTraderSearchProps = Omit<
  SearchProps<TraderWithPref>,
  'options' | 'showOptions' | 'value' | 'onChange'
> & {
  /** 搜索接口入参 */
  searchParams?: Omit<InstTraderSearch.Request, 'keyword' | 'searchEnabled'>;

  /** 是否首选项高亮，默认需要首选项高亮 */
  preferenceHighlight?: boolean;
  /** 是否展示 options */
  showOptions?:
    | boolean
    | ((selected?: SearchOption<TraderWithPref> | null, options?: SearchOption<TraderWithPref>[]) => boolean);
  /** 选择时的回调
   * （如果不为 undefined 内部将使用 onChange 代替 InstTraderSearchProvider 中的更新上下文状态的方法，
   *   因此外部需要使用 InstTraderSearchProvider 提供的更新状态方法更新上下文的状态，这是为了保持单向数据流的一致性） */
  onChange?: (opt?: SearchOption<TraderWithPref> | null) => void;
  /** 请求前的回调 */
  onBeforeSearch?: (params?: string) => void;
  /** 在列表中隐藏的traderID */
  hiddenTraderIDs?: string[];
};
