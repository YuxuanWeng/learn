import { SearchOption } from '@fepkg/components/Search';
import { User } from '@fepkg/services/types/common';
import { Post } from '@fepkg/services/types/enum';

export const isBroker = (user: User) => user?.post !== Post.Post_DI && user?.post !== Post.Post_Backstage;

export const transform2BrokerOpt = (user?: User): SearchOption<User> | null => {
  if (!user) return null;
  return isBroker(user) ? { label: user.name_cn, value: user.user_id, original: user, disabled: false } : null;
};
