import { AccessCode } from '@fepkg/services/access-code';
import { Acceptor } from '@fepkg/services/types/bds-enum';
import { MarketNotifyMsgSearch } from '@fepkg/services/types/market-notify/msg-search';

export enum TabEnum {
  Record = '/home',
  Conf = 'conf'
}

export type TypeSearchFilter = Omit<MarketNotifyMsgSearch.Request, 'offset' | 'count' | 'acceptor_id'>;

export type TabOption = {
  key: TabEnum;
  label: string;
  /** 当前页签对应的权限代码 */
  accessCode: AccessCode;
  /** 可以访问当前页面的机构 */
  acceptors: Set<Acceptor>;
};

export type TabProps = {
  activeKey?: TabEnum;
  item: TabOption;
  onClick: (val: TabOption) => void;
};
