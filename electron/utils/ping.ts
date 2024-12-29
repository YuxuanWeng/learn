import isReachable from 'is-reachable';

/** ping 的超时时间（感觉不应该太长，特别是在内网环境） */
export const PING_TIMEOUT = 300;

export const ping = (url: string, timeout = PING_TIMEOUT) => isReachable(url, { timeout });
