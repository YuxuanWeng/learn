import { Post } from '@fepkg/services/types/enum';

/** 职位对应名称 */
export const POST_MAP = {
  [Post.Post_Broker]: '经纪人',
  [Post.Post_DI]: 'DI',
  [Post.Post_BrokerAssistant]: '助理经纪人',
  [Post.Post_BrokerTrainee]: '经纪人培训生',
  [Post.Post_Backstage]: '后台'
};

export const TAG_COLORS = ['bg-primary-400', 'bg-auxiliary-400', 'bg-ofr-400', 'bg-trd-400', 'bg-danger-400'];
