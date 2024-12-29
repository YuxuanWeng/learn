import { APIs } from '@fepkg/services/apis';
import type { ConfigGetAllByNamespace } from '@fepkg/services/types/config/get-all-by-namespace';
import { ABRuleEventEnum } from 'app/types/IPCEvents';
import { trackSpecial } from '@/common/utils/logger/special';
import { miscStorage } from '@/localdb/miscStorage';
import request from '../request';
import { logger } from '../utils/logger';
import { ABRule, CompareType, NAME_SPACE } from './types';

export async function fetchABRules() {
  const param: ConfigGetAllByNamespace.Request = {
    namespace: NAME_SPACE
  };

  try {
    const { pair_list } = await request.post<ConfigGetAllByNamespace.Response>(APIs.config.getAllByNamespace, param);

    if (!pair_list) trackSpecial('ab-rules-fail', 'no response pair_list');

    const result = pair_list?.map(item => JSON.parse(item.val) as ABRule) ?? [];

    logger.i({ msg: result, remark: 'abRules/get' }, { immediate: true });

    return result;
  } catch (ex) {
    trackSpecial('ab-rules-fail', { error: ex });
  }
  return [];
}

export function getVersionCode(version: string) {
  return version
    .split('.')
    .reverse()
    .map(item => +item)
    .reduce((p, c, i) => p + c * 10 ** (i * 2));
}

export function isRuleAvailable(rule?: ABRule) {
  if (rule && rule.open) {
    const isWhite = (rule.white_list as string[])?.some(item => item === miscStorage.userInfo?.user_id);
    if (isWhite) return true;

    const isBlack = (rule.black_list as string[])?.some(item => item === miscStorage.userInfo?.user_id);
    if (isBlack) return false;

    let isVersion = false;

    if (rule.version) {
      const curVersion = getVersionCode(window.appConfig.staticVersion);
      const targetVersion = getVersionCode(rule.version);
      switch (rule.compare_type) {
        case CompareType.Equal: {
          isVersion = curVersion === targetVersion;
          break;
        }
        case CompareType.Greater: {
          isVersion = curVersion >= targetVersion;
          break;
        }
        case CompareType.Less: {
          isVersion = curVersion < targetVersion;
          break;
        }
        default:
          break;
      }
    } else {
      isVersion = true;
    }
    return !!rule.gray_scale && isVersion;
  }

  return false;
}

const getRuleValue = <T extends Required<ABRule>['exper_value']>(key: ABRule['exper_key'], defaultValue: T): T => {
  const rule = miscStorage?.abRules?.find(item => item?.exper_key === key);
  if (rule) {
    return ((isRuleAvailable(rule) ? rule?.exper_value : rule?.default_value) as T) ?? defaultValue;
  }
  return defaultValue;
};

/** 有兜底的接口是否使用数据本地化，默认为 true */
export const isDataLocalization = () => getRuleValue<boolean>('dataLocalization', true);

/** 是否使用乐观更新，默认开启 */
export const isOptimisticUpdateEnabled = () => getRuleValue<boolean>('isOptimisticUpdate', true);

/** 是否使用自动登出，默认开启 */
export const isAutoLogoutEnabled = () => getRuleValue<boolean>('isAutoLogout', true);

/** 设置Sentry采样比例，默认 1.0 */
export const getTracesSampleRate = () => getRuleValue<number>('tracesSampleRate', 1);

/** 是否使用服务端的时间，默认使用本地时间 */
export const isServerTimestamp = () => getRuleValue<boolean>('isServerTimestamp', false);

/** 是否允许在生产环境开启 devtools，默认关闭 */
export const isDevToolsInProd = () => getRuleValue<boolean>('isDevToolsInProd', false);

/** 是否阻止用户登录（仅允许黑名单登录） */
export const isLoginBlocked = () => getRuleValue<boolean>('isLoginBlocked', false);

/** 需要展示提示内容的最大失败次数，默认为 8 次 */
export const getMaxShowOfflineTipFailuresRule = () => getRuleValue<number>('maxShowOfflineTipFailures', 8);

/** 检测网络时 Ping 的超时时间，默认为 300 */
export const getNetworkPingTimeoutRule = () => getRuleValue<number>('networkPingTimeout', 300);

/** 重新检测网络时间间隔，默认为 800 */
export const getNetworkRecheckTimeoutRule = () => getRuleValue<number>('networkRecheckTimeout', 800);

/** 表格自动翻页过度滚动距离触发值 */
export const getAutoPagerOverWheel = () => getRuleValue<number>('autoPagerOverWheel', 2000);

/** 轮询接口每页数量大小，默认为 50 */
export const getPollingAPIPageCount = () => getRuleValue<number>('pollingAPIPageCount', 50);

/** 是否使用local_server */
export const isUseLocalServer = () => getRuleValue<boolean>('isUseLocalServer', true);

/** omsParentPollingAPIPageCount，默认为 30 */
export const getParentPollingAPIPageCount = () => getRuleValue<number>('omsParentPollingAPIPageCount', 30);

/** 协同报价图片识别超时时间 OCRTimeout，默认为 20*1000 */
export const getOCRTimeout = () => getRuleValue<number>('OCRTimeout', 20000);

/** 点价是否使用指定点价模式 */
export const isSpotAppointMode = () => getRuleValue<boolean>('isSpotAppointMode', false);

export const updateABRulesInMainProcess = () => {
  window.Main.invoke(ABRuleEventEnum.SetDevToolsRule, isDevToolsInProd());
  window.Main.invoke(ABRuleEventEnum.SetMaxShowOfflineTipFailuresRule, getMaxShowOfflineTipFailuresRule());
  window.Main.invoke(ABRuleEventEnum.SetNetworkPingTimeoutRule, getNetworkPingTimeoutRule());
  window.Main.invoke(ABRuleEventEnum.SetNetworkRecheckTimeoutRule, getNetworkRecheckTimeoutRule());
};
