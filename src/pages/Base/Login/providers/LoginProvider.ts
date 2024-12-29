import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dealDateManager } from '@fepkg/business/utils/data-manager/deal-date-manager';
import { nextWeeklyWeekdayManager } from '@fepkg/business/utils/data-manager/next-weekly-weekday-manager';
import { AppEnv } from '@fepkg/common/types';
import { StatusCode } from '@fepkg/request/types';
import { handleRequestError } from '@fepkg/request/utils';
import { fetchUserAccessInfo } from '@fepkg/services/api/auth/access-user-info';
import { checkLogin } from '@fepkg/services/api/auth/check-login-get';
import { fetchCurrentTimestamp } from '@fepkg/services/api/base/current-timestamp';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useMemoizedFn } from 'ahooks';
import { AutoUpdateEventEnum, LoginEventEnum, NetworkEventEnum, UtilEventEnum } from 'app/types/IPCEvents';
import { LocalServerEvent } from 'app/types/local-server';
import { CheckVersionResult } from 'app/utils/check-version';
import sha1 from 'crypto-js/sha1';
import { UpdateCheckResult } from 'electron-updater';
import { createContainer } from 'unstated-next';
import { decryptPassword, encryptPassword } from '@packages/utils/crypto';
import {
  fetchABRules,
  isLoginBlocked,
  isServerTimestamp,
  isUseLocalServer,
  updateABRulesInMainProcess
} from '@/common/ab-rules';
import { AccessProductTypeList, ProductType2AccessCodeMap } from '@/common/constants/auth';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { useInitLocalizationData } from '@/common/hooks/data-localization/useInitLocalizationData';
import { LocalDataError } from '@/common/hooks/data-localization/utils';
import { usePreference } from '@/common/hooks/usePreference';
import { getLoginRequestParamsForMainProcess, login } from '@/common/services/api/auth/login';
import { getDefaultProductType } from '@/common/utils/access';
import { getDBInitConfig } from '@/common/utils/db';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { trackSpecial } from '@/common/utils/logger/special';
import { afterLogout } from '@/common/utils/login';
import { useAutoLaunchSetting } from '@/components/AccountSafe/useAutoLaunchSetting';
import { checkVersion } from '@/components/VersionSettings/utils';
import { getCurrentSavedLoginFormList, miscStorage, upsertSavedLoginFormList } from '@/localdb/miscStorage';
import { initUserSettingsDataToLocalStorage } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { PingUrlMap } from '../constants';
import { useLoginEnv } from './EnvProvider';
import { useLoginForm } from './FormProvider';

// apiEnv(xt/xt-uat) -> prod

/**
 * 启动网络检测轮询
 * 注意的：url必须以斜杠(/)结尾；
 */
const resetNavigatorBaseUrl = () => {
  const { sendMessage } = window.Main;
  const apiEnv = miscStorage.apiEnv ?? 'dev';
  sendMessage(NetworkEventEnum.StartCheckUrlIsReachable, PingUrlMap[apiEnv]);
};

const LoginContainer = createContainer(() => {
  const { env } = useLoginEnv();
  const { formState, updateFormState, loginDisabled } = useLoginForm();
  const { username, password, remember } = formState;
  const { getAutoLaunchByUser } = useAutoLaunchSetting();

  const { initDataLoading } = useInitLocalizationData({
    initSyncDataTypeList: [],
    isLogin: true,
    manual: true
  });

  const { initPreference } = usePreference();

  const serverTimestamp = async () => {
    const msg = '时间校准异常，请重新登录';
    let flag = true;
    let logData: any;
    try {
      const startTime = Date.now();
      const { current_timestamp } = await fetchCurrentTimestamp();
      const delay = Math.floor((Date.now() - startTime) / 2);
      const num = Number(current_timestamp);
      if (current_timestamp && Number.isInteger(num)) {
        const offset = num + delay - Date.now();
        miscStorage.offset = offset;
      } else {
        updateFormState(draft => {
          draft.errorMessage = msg;
        });

        flag = false;
        logData = {
          current_timestamp
        };
      }
    } catch (error) {
      updateFormState(draft => {
        draft.errorMessage = msg;
      });

      flag = false;
      logData = error;
    }

    if (!flag) trackSpecial('server-time', logData);

    return flag;
  };

  const handleLoginError = (error: any) => {
    updateFormState(draft => {
      draft.loading = false;
      draft.passwordEditable = true;
    });

    if (LocalDataError.isLocalDataError(error)) {
      updateFormState(draft => {
        draft.errorMessage = error.message;
      });
      return;
    }

    const code = error.data?.base_response?.code ?? error.data?.status_code;

    if (code === StatusCode.AdminUserNotFound || code === StatusCode.AdminUserPasswordIncorrect) {
      updateFormState(draft => {
        draft.password = '';
        draft.recovered = false;
        draft.errorMessage = '账户或密码错误，请修改后重试';
      });
      return;
    }

    if (
      [
        StatusCode.NoSystemAccess,
        StatusCode.UserAccountLocked,
        StatusCode.UserAccountQuit,
        StatusCode.UserAccountDisabled,
        StatusCode.UserTokenIsReplaced
      ].includes(code)
    ) {
      const content = {
        [StatusCode.NoSystemAccess]: '您还没有OMS系统权限，请联系管理员开通！',
        [StatusCode.UserAccountLocked]: '您的账号已冻结！请联系管理员处理！',
        [StatusCode.UserAccountQuit]: '您的帐号不可用！请联系管理员！',
        [StatusCode.UserAccountDisabled]: '您的帐号不可用！请联系管理员！',
        [StatusCode.UserTokenIsReplaced]: '当前账号已在其他设备登录，当前设备已退出！'
      }[code];
      updateFormState(draft => {
        draft.errorMessage = content;
      });
      return;
    }

    handleRequestError({
      error,
      onLogout: val => afterLogout(false, val),
      onMessage: msg =>
        updateFormState(draft => {
          draft.errorMessage = msg;
        }),
      defaultHandler: () =>
        updateFormState(draft => {
          draft.errorMessage = '当前网络异常，请检查你的网络设置！';
        })
    });
  };

  const initMiscStorage = async (token: string, apiEnv: AppEnv = 'dev', onError?: () => void) => {
    let status = false;

    try {
      miscStorage.token = token;
      miscStorage.apiEnv = apiEnv;
      // 将A/B平台配置存储到localStorage中
      miscStorage.abRules = await fetchABRules();

      // 如果需要使用服务端时间戳
      if (isServerTimestamp()) {
        const timestampInvalid = await serverTimestamp();
        if (!timestampInvalid) {
          updateFormState(draft => {
            draft.loading = false;
            draft.errorMessage = '服务端时间戳获取异常';
          });

          onError?.();
          return status;
        }
      }

      const res = await checkLogin({ ignoreFromProductType: true });
      const accessResp = await fetchUserAccessInfo({ ignoreFromProductType: true });
      // 判断产品权限
      const { product_list = [] } = res?.user ?? {};
      const { access_code_list = [] } = accessResp ?? {};

      const availableProductTypeList = product_list
        .map(p => p.product_type)
        .filter(p => AccessProductTypeList.includes(p) && access_code_list.includes(ProductType2AccessCodeMap[p]));

      if (!availableProductTypeList.length) {
        updateFormState(draft => {
          draft.loading = false;
          draft.errorMessage = '您还没有业务产品权限！请联系管理员！';
        });

        onError?.();
        return status;
      }

      // 特殊场合：某些情况仅允许特定用户登录
      if (isLoginBlocked()) {
        updateFormState(draft => {
          draft.loading = false;
          draft.errorMessage = '您暂无登录权限';
        });

        onError?.();
        return status;
      }

      miscStorage.userInfo = res.user;
      miscStorage.productType = getDefaultProductType(miscStorage.productType, availableProductTypeList);
      miscStorage.availableProductTypeList = availableProductTypeList;
      miscStorage.accessCodeList = access_code_list;
      status = true;
    } catch (err) {
      updateFormState(draft => {
        draft.loading = false;
      });

      if (onError) {
        onError();
        return status;
      }
      throw err;
    }

    return status;
  };

  /** 初始化系统所需信息 */
  const initSystem = useMemoizedFn(async (token: string, apiEnv: AppEnv = 'dev', onError?: () => void) => {
    updateFormState(draft => {
      draft.loading = true;
      draft.hintMessage = '全局数据开始增量更新...';
      draft.errorMessage = '';
      draft.passwordEditable = false;
    });

    const initSuccess = await initMiscStorage(token, apiEnv, onError);
    if (!initSuccess) return;

    // 将用户设置的数据初始化到localStorage中
    await initUserSettingsDataToLocalStorage();
    await userHotkeyManager.initUserHotkeySettings();

    updateFormState(draft => {
      draft.hintMessage = '初始化行情...';
    });
    await initPreference(getLSKey(LSKeys.TraderSelectedPreference, miscStorage.productType ?? ProductType.BNC));
    updateABRulesInMainProcess();
    resetNavigatorBaseUrl();

    // 工作日交易日信息初始化
    await dealDateManager.init();
    await nextWeeklyWeekdayManager.init();

    const requestParams = getLoginRequestParamsForMainProcess();

    const userInitConfig = { ...getDBInitConfig(), ...requestParams, productType: miscStorage.productType };

    window.Main.invoke(LoginEventEnum.OnLogin, userInitConfig);
    // autoLaunch setting
    const autoLaunch = getAutoLaunchByUser(miscStorage.userInfo?.user_id);
    window.Main.sendMessage(UtilEventEnum.AutoLaunch, autoLaunch);

    if (isUseLocalServer()) {
      /** 启动local-server进程 */
      await window.Main.invoke(LocalServerEvent.Start);
      miscStorage.localServerPort = await window.Main.invoke<number>(LocalServerEvent.GetPort);
    }

    await initDataLoading([]);

    window.Main.invoke(LoginEventEnum.AfterLogin, requestParams);
  });

  const handleLogin = async () => {
    if (loginDisabled) return;

    updateFormState(draft => {
      draft.loading = true;
      draft.hintMessage = '全局数据开始增量更新...';
      draft.errorMessage = '';
    });

    try {
      window.Main.invoke(LoginEventEnum.BeforeLogin);
      const res = await login(
        { user_name: username, password: sha1(password).toString() },
        { hideErrorMessage: true, ignoreFromProductType: true }
      );

      upsertSavedLoginFormList({
        userId: res?.user_id ?? '',
        password: remember ? encryptPassword(password, res?.user_id ?? '') : '',
        username,
        shouldRememberPassword: remember
      });

      await initSystem(res?.token ?? '', env);
    } catch (error) {
      handleLoginError(error);
    }
  };

  const recoverForm = () => {
    const form = getCurrentSavedLoginFormList()?.at(0);
    const tmpPassword = form?.userId && form?.password ? decryptPassword(form.password, form.userId) : '';
    updateFormState(draft => {
      draft.username = form?.username ?? '';
      draft.password = tmpPassword;
      draft.passwordEditable = true;

      if (draft.password) draft.recovered = true;
    });
  };

  const [searchParams] = useSearchParams();
  const needCheckUpdate = searchParams.get('needCheckUpdate');

  useEffect(() => {
    (async () => {
      try {
        if (miscStorage.token == null) {
          recoverForm();
        }

        if (needCheckUpdate === 'true') {
          const res: UpdateCheckResult | undefined = await window.Main.checkUpdate();

          if (res?.updateInfo?.version && checkVersion(res.updateInfo) !== CheckVersionResult.Latest) {
            window.Main.sendMessage(AutoUpdateEventEnum.OpenUpdateDownload);
            return;
          }
        }

        // 有账号记录并且存在token
        if (getCurrentSavedLoginFormList()?.at(0) && miscStorage.token != null) {
          await initSystem(miscStorage.token, miscStorage?.apiEnv, recoverForm);
        }
      } catch (error) {
        handleLoginError(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { handleLogin };
});

export const LoginProvider = LoginContainer.Provider;
export const useLogin = LoginContainer.useContainer;
