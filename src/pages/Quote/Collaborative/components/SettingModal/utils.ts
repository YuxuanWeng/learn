import { User } from '@fepkg/services/types/common';
import { AccountStatus, JobStatus, Post, ProductType } from '@fepkg/services/types/enum';
import { BrokerGroup } from '@/pages/Base/SystemSetting/components/QuoteSettings/types';

const defUser: User = {
  user_id: '',
  job_status: JobStatus.JobStatusNone,
  account_status: AccountStatus.AccountStatusNone,
  name_cn: '',
  name_en: '',
  account: '',
  email: '',
  phone: '',
  telephone: '',
  QQ: '',
  department_id: '',
  deleted: 0,
  qm_account: '',
  post: Post.PostNone,
  pinyin: '',
  pinyin_full: ''
};

// 暂时把name_cn加上，目的是兼容dev未合并的代码
/** 的到简化后的user，去掉所有非必需字段，清空除了user_id之外的所有字段 */
export const getSimplifiedUser = ({ user_id, name_cn }: User) => ({ ...defUser, user_id, name_cn }) as User;

/** 获取简化后的入参 */
export const getGroupParams = (val: BrokerGroup[]) => {
  return val.map(i => ({
    ...i,
    // 只传入有用到的数据
    brokers: i.brokers?.map(getSimplifiedUser)
  }));
};

/** 根据用户的在职、启用状态判断该成员是否为有效状态 */
export const getUserInvalid = (user?: User, productType?: ProductType): boolean => {
  const ownProducts = user?.product_list?.map(i => i.product_type) ?? [];
  const invalidPost = new Set([Post.Post_DI, Post.Post_Backstage]);

  if (
    !user ||
    user.account_status !== AccountStatus.Enable ||
    user.job_status !== JobStatus.OnJob ||
    !productType ||
    !ownProducts.includes(productType) ||
    invalidPost.has(user.post)
  )
    return true;
  return false;
};
