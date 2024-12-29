import { MouseEventHandler, useRef } from 'react';
import { Button } from '@fepkg/components/Button';
import { ModalUtils } from '@fepkg/components/Modal';
import { API_BASE } from '@fepkg/request/constants';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { hostEnvMap } from '@/common/request/interceptors';
import { miscStorage } from '@/localdb/miscStorage';

/** 开发者模式-后门入口 */
export const useDeveloper = () => {
  const { openDialog } = useDialogWindow();
  const clickTime = useRef<number>(0);
  const clickTimes = useRef<number>(0);

  const showBackdoorModal = async () => {
    const apiEnv = miscStorage.apiEnv ?? 'dev';
    const requestBaseURL = `${hostEnvMap[apiEnv]}${API_BASE}`;
    const userDataPath = await window.Main.invoke(UtilEventEnum.GetAppPath, 'userData');
    ModalUtils.confirm({
      title: 'OMS信息：',
      content: (
        <div>
          <div>
            version: <span title="version"> {window.appConfig.staticVersion}</span>
          </div>
          <div>
            shortHash: <span title="shortHash">{window.appConfig.shortHash}</span>
            shortHash: <span title="shortHash">{__APP_SHORT_HASH__}</span>
          </div>
          <div>
            localServerVersion: <span title="shortHash">{window.appConfig.localServer.version}</span>
          </div>
          <div>
            localServerVersion: <span title="shortHash">{window.appConfig.localServer.version}</span>
          </div>
          <div>
            env: <span title="env">{window.appConfig.env}</span>
          </div>
          <div>
            apiEnv:<span title="apiEnv">{miscStorage.apiEnv}</span>
          </div>
          <div>
            baseURL:<span title="baseURL">{requestBaseURL}</span>
          </div>
          <div>
            userId: <span title="userId">{miscStorage.userInfo?.user_id}</span>
          </div>
          <div>
            token: <span title="token">{miscStorage.token}</span>
          </div>
          <div>
            softLifecycleId: <span title="softLifecycleId">{miscStorage.softLifecycleId}</span>
          </div>
          <div>
            deviceId: <span title="deviceId">{miscStorage.deviceId}</span>
          </div>
          <div>
            offset: <span title="offset">{miscStorage.offset}</span>
          </div>
          <div>
            userDataPath:
            <span title="userDataPath">{userDataPath}</span>
          </div>
          <div className="pt-1 pb-1 text-center">
            <Button
              className="w-[100px] h-6 text-xs pl-1 pr-1"
              onClick={() => {
                const config = {
                  name: WindowName.MainLogPage,
                  custom: {
                    route: CommonRoute.DebugDetailPage,
                    context: { name: 'text' }
                  },
                  options: {
                    width: 1400,
                    height: 900,
                    minWidth: 500,
                    minHeight: 300,
                    resizable: true
                  }
                };
                openDialog(config, { showOfflineMsg: false });
              }}
            >
              详细信息
            </Button>
          </div>
          {/* --- 模拟程序崩溃，高风险动作，只允许非正式环境开启 start --- */}
          {/* <div className="pt-1 pb-1 text-center">
            <Button
              className="w-[100px] h-6 text-xs pl-1 pr-1"
              onClick={() => {
                window.Main?.sendMessage(WindowCrashedEnum.TestSystemCrash);
              }}
            >
              模拟程序崩溃
            </Button>
          </div> */}
          {/* --- 模拟程序崩溃，高风险动作，只允许非正式环境开启 end --- */}
        </div>
      )
    });
  };

  const handleOpenSysInfo: MouseEventHandler<HTMLSpanElement> = evt => {
    evt.stopPropagation();
    const now = performance.now();
    const diff = now - clickTime.current;
    clickTime.current = now;
    if (diff > 1000) {
      clickTimes.current = 1;
      return;
    }
    if (clickTimes.current < 4) {
      clickTimes.current += 1;
    } else {
      clickTimes.current = 0;
      showBackdoorModal();
    }
  };

  return { handleOpenSysInfo };
};
