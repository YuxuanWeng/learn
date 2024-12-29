import { QueryFunction, QueryKey } from '@tanstack/react-query';

export type MessageFeedLiveQueryProps<Response> = {
  /** 后端约定的centrifugeChannel */
  centrifugeChannel: string;
  /** ws场景下的初始化数据或兜底轮训，需注意返回undefined的话query会认为queryFn未成功执行，进而导致ws监听注册失败 */
  queryFn: QueryFunction<Response>;
  /** queryFn的入参 */
  queryKey?: QueryKey;
  /** react query的enabled */
  enabled?: boolean;
  /** 处理增量更新的ws消息，入参类型需要自己约束 */
  handleWSMessage?: (data, prevData?: Response) => Response;
  /** 传入后，如果ws连接状态不是success则会开始轮训 */
  refetchInterval?: number;
  /** react query的 onSuccess */
  onSuccess?: (data?: Response) => void;
};
