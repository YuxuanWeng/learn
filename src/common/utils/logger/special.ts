import { noNil } from '@fepkg/common/utils';
import { LogLevel } from '@fepkg/logger';
import { logger } from '.';

/**
 * 需要特殊关注的日志信息
 * 注：非必要情况尽量使用 trackPoint 来打印日志，special默认为立即发送，成本略大；
 * @param name 关键字
 * @param msg 消息
 * @param level 级别
 * @param immediate 是否立即发送，默认为 true
 * @returns void
 */
export const trackSpecial = (name: string, msg: any = void 0, level = LogLevel.ERROR, immediate = true) => {
  const fnName = level?.toLowerCase().charAt(0);
  if (!logger[fnName]) return;

  logger[fnName](noNil({ keyword: name, msg: msg ? JSON.stringify(msg) : void 0 }), {
    immediate
  });
};

/** trackSpecial 不立即发送 */
export const trackSpecialSlow = (name: string, msg: any = void 0, level = LogLevel.ERROR, immediate = false) => {
  return trackSpecial(name, msg, level, immediate);
};
