import { SearchOption, SearchProps } from '@fepkg/components/Search';
import { InstitutionTiny } from '@fepkg/services/types/common';
import type { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';

export type InstSearchRequest = Pick<InstFuzzySearch.Request, 'count' | 'offset'>;
export type InstSearchResponse<T extends InstitutionTiny = InstitutionTiny> = { list?: T[]; total?: number };

export type InstSearchProps<
  T extends InstitutionTiny = InstitutionTiny,
  Req extends InstSearchRequest = InstFuzzySearch.Request
> = Omit<SearchProps<T>, 'options' | 'value' | 'onChange'> & {
  /** 机构搜索的 api，默认使用 APIs.inst.fuzzySearch，还可使用 APIs.crm.instList，
   * 使用 APIs.crm.instList 请将 onlyRemoteQuery 置为 true */
  api?: string;
  /** 搜索接口入参 */
  searchParams?: Omit<Req, 'keyword'>;
  /** 选择时的回调
   * （如果不为 undefined 内部将使用 onChange 代替 InstSearchProvider 中的更新上下文状态的方法，
   *   因此外部需要使用 InstSearchProvider 提供的更新状态方法更新上下文的状态，这是为了保持单向数据流的一致性） */
  onChange?: (opt?: SearchOption<T> | null) => void;
  /** 请求前的回调 */
  onBeforeSearch?: (params?: string) => void;
  /** 过滤搜索结果 */
  onFilter?: (data?: T[]) => T[];
  /** 跳过本地化检索，直接使用远程检索 */
  onlyRemoteQuery?: boolean;
};
