import { SearchOption, SearchProps } from '@fepkg/components/Search';
import { FiccBondBasic, QuoteParsing, Trader } from '@fepkg/services/types/common';
import { LocalServerBaseDataBondSearch } from '@fepkg/services/types/local-server/base-data-bond-search';

export type BondSearchProps = Omit<SearchProps<FiccBondBasic>, 'options' | 'showOptions' | 'value' | 'onChange'> & {
  /** 搜索接口入参 */
  searchParams?: Partial<Omit<LocalServerBaseDataBondSearch.Request, 'keyword'>>;
  /** 是否开启识别功能 */
  parsing?: boolean;
  /** 是否展示 options */
  showOptions?:
    | boolean
    | ((selected?: SearchOption<FiccBondBasic> | null, options?: SearchOption<FiccBondBasic>[]) => boolean);
  /** 选择时的回调
   * （如果不为 undefined 内部将使用 onSelect 代替 BondSearchProvider 中的更新上下文状态的方法，
   *   因此外部需要使用 BondSearchProvider 提供的更新状态方法更新上下文的状态，这是为了保持单向数据流的一致性） */
  onChange?: (opt?: SearchOption<FiccBondBasic> | null, parsings?: QuoteParsing[], traderList?: Trader[]) => void;
  /** 解析成功后的回调 */
  onParsingSuccess?: (keyword: string) => void;
  /** 债券搜索请求前的回调 */
  onBeforeSearch?: (params?: string) => void;
  /** 报价识别请求前的回调 */
  onBeforeParsing?: (params?: string) => void;
};
