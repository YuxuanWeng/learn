import { SearchOption, SearchProps } from '@fepkg/components/Search';
import { User } from '@fepkg/services/types/common';

export type BrokerSearchProps = Omit<SearchProps<User>, 'options' | 'value' | 'onChange'> & {
  /** 选择时的回调
   * （如果不为 undefined 内部将使用 onChange 代替 BrokerSearchProvider 中的更新上下文状态的方法，
   *   因此外部需要使用 BrokerSearchProvider 提供的更新状态方法更新上下文的状态，这是为了保持单向数据流的一致性） */
  onChange?: (opt?: SearchOption<User> | null) => void;
  /** 请求前的回调 */
  onBeforeSearch?: (params?: string) => void;
  /** options过滤函数 */
  optionFilter?: (val: SearchOption<User>) => boolean;
};
