import { Broker, User } from '@fepkg/services/types/common';

// 将搜出来的user转化为broker
export const transUsersToBrokers = (list: User[]) =>
  list.map(user => ({
    broker_id: user.user_id,
    name_zh: user.name_cn,
    name_en: '',
    email: '',
    department: '',
    trader_count: 0,
    post: user.post,
    account: ''
  }));

export const transBrokersToUsers = (list: Broker[]) => {
  return list.map(v => ({
    user_id: v.broker_id,
    name_cn: v.name_zh,
    name_en: v.name_en,
    email: v.email,
    account: v.account,
    job_status: v.account_status,
    department: v.department,
    product_list: v.product_list
  })) as unknown as User[];
};
