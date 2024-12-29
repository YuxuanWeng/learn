/** Network Worker 相关类型 */
export enum NetworkWorkerType {
  /** 开始检查 url 是否能够连接 */
  StartUrlIsReachableCheck = 'network-worker-start-url-is-reachable-check',
  /** 结束检查 url 是否能够连接 */
  EndUrlIsReachableCheck = 'network-worker-end-url-is-reachable-check',
  /** url 是否能够连接状态的变更 */
  UrlIsReachableChange = 'network-worker-url-is-reachable-change',
  /** 暂无网络提示显示状态的变更 */
  OfflineTipVisibleChange = 'network-worker-offline-tip-visible-change',
  /** 设置需要展示提示内容的最大失败次数 */
  SetMaxShowOfflineTipFailures = 'network-worker-set-max-show-offline-tip-failures',
  /** 设置检测网络时 Ping 的超时时间 */
  SetNetworkPingTimeout = 'network-worker-set-network-ping-timeout',
  /** 设置重新检测网络时间间隔 */
  SetNetworkRecheckTimeout = 'network-worker-set-network-recheck-timeout'
}

/** Network worker message 数据结构 */
export type NetworkWorkerData = {
  type: NetworkWorkerType;
  value?: {
    /** 需要检查的 url */
    url?: string;
    /** 需要检查的 url 是否能够连接 */
    isReachable?: boolean;
    /** 暂无网络提示显示状态 */
    offlineTipVisible?: boolean;
    /** 需要展示提示内容的最大失败次数 */
    maxShowOfflineTipFailures?: number;
    /** 检测网络时 Ping 的超时时间 */
    pingTimeout?: number;
    /** 重新检测网络时间间隔 */
    recheckTimeout?: number;
  };
};

/** Network Worker 相关消息事件类型 */
export interface NetworkWorkerEvent extends ExtendableMessageEvent {
  data: NetworkWorkerData;
}
