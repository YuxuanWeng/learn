import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Logo } from '@fepkg/components/Logo';
import {
  IconAttentionFilled,
  IconCheckCircleFilled,
  IconClose,
  IconCloseCircleFilled,
  IconMinus
} from '@fepkg/icon-park-react';
import updateImg from '@/assets/image/download-update.svg';
import { AutoUpdateEventEnum } from 'app/types/IPCEvents';
import { CheckVersionResult } from 'app/utils/check-version';
import { UpdateCheckResult } from 'electron-updater';
import { HotkeyScope } from '@/common/utils/hotkey';
import hotkeys from '@/common/utils/hotkey/hotkeys-js';
import { isXintangUat } from '@/common/utils/login';
import { Progress } from '@/components/Progress';
import { checkVersion } from '@/components/VersionSettings/utils';
import styles from './style.module.less';

type DownloadProgress = {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
};

const UpdateDownload = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult>();

  const [updateState, setUpdateState] = useState<'confirm' | 'downloading' | 'error' | 'downloaded'>('confirm');

  const [downloadProgress, setDownloadProgress] = useState(0);

  const title = {
    confirm: '检测到新版本，是否更新？',
    downloading: '下载新版本',
    error: '版本下载失败',
    downloaded: '版本下载成功'
  }[updateState];

  const message = {
    confirm: '请更新后使用新版本',
    downloading: '新版本客户端下载中，请耐心等待...',
    error: '下载失败，请联系管理员处理',
    downloaded: '即将安装新版本'
  }[updateState];

  const progressText = {
    confirm: '',
    downloading: '下载中',
    error: '下载失败',
    downloaded: '下载成功'
  }[updateState];

  const [searchParams] = useSearchParams();

  const startTimerRef = useRef<NodeJS.Timeout>();

  const clearQuitAndInstallTimer = () => {
    clearTimeout(startTimerRef.current);

    startTimerRef.current = undefined;
  };

  const startQuitAndInstallTimer = () => {
    if (startTimerRef.current != null) {
      clearQuitAndInstallTimer();
    }

    startTimerRef.current = setTimeout(() => window.Main.sendMessage(AutoUpdateEventEnum.QuitAndInstall), 3000);
  };

  const tapQTime = useRef(0);

  const tapQTimerRef = useRef<NodeJS.Timeout>();

  const clearTapQTimer = () => {
    clearTimeout(tapQTimerRef.current);

    tapQTimerRef.current = undefined;
  };

  const setTapQTimer = () => {
    if (tapQTimerRef.current != null) {
      clearTapQTimer();
    }

    tapQTimerRef.current = setTimeout(() => {
      tapQTime.current = 0;
    }, 1000);
  };

  const onTapQ = () => {
    if (tapQTime.current === 4) {
      clearQuitAndInstallTimer();
      clearTapQTimer();
      window.Main.sendMessage(AutoUpdateEventEnum.AbortUpdate);
    } else {
      startQuitAndInstallTimer();
      setTapQTimer();
      tapQTime.current++;
    }
  };

  useEffect(() => {
    hotkeys('Q', HotkeyScope.main, onTapQ);

    return () => {
      hotkeys.unbind('Q', HotkeyScope.main, onTapQ);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const skipConfirm = searchParams.get('skipConfirm') === 'true';

      const updateInfoRes = await window.Main.invoke(AutoUpdateEventEnum.GetUpdateInfo);

      setUpdateInfo(updateInfoRes);

      if (updateInfoRes != null) {
        const checkRes = checkVersion(updateInfoRes.updateInfo);

        if ([CheckVersionResult.ForceUpdate, CheckVersionResult.Rollback].includes(checkRes) || skipConfirm) {
          window.Main.invoke(AutoUpdateEventEnum.DownloadUpdate);

          setUpdateState('downloading');
        }
      }
    };
    init();
    const offError = window.Main.on(AutoUpdateEventEnum.UpdateError, () => setUpdateState('error'));
    const offProgress = window.Main.on(AutoUpdateEventEnum.DownloadUpdateProgress, progress => {
      setDownloadProgress((progress as DownloadProgress).percent);
    });
    const offDownloaded = window.Main.on(AutoUpdateEventEnum.UpdateDownloaded, () => {
      setUpdateState('downloaded');

      startQuitAndInstallTimer();
    });
    return () => {
      offError();
      offProgress();
      offDownloaded();
    };
  }, []);

  return (
    <div className={cx('select-none h-full flex flex-col overflow-hidden', styles['container-bg'])}>
      <div className="h-7 flex items-center draggable px-4 pt-[14px]">
        <Logo
          uat={isXintangUat()}
          version={window.appConfig?.version}
        />

        <section className="ml-auto flex justify-center gap-2 undraggable">
          <Button.Icon
            text
            icon={<IconMinus />}
            onClick={() => window.Main.minimize()}
          />
          <Button.Icon
            text
            icon={<IconClose />}
            onClick={() => window.Main.close()}
          />
        </section>
      </div>
      {updateInfo && (
        <div className="mt-[44px] ml-6 flex">
          <img
            className="w-[100px]"
            src={updateImg}
            alt=""
          />
          <div className="ml-6 mt-[10px]">
            <div className="flex items-center">
              {updateState === 'confirm' && <IconAttentionFilled className="text-orange-100" />}
              {updateState === 'error' && <IconCloseCircleFilled className="text-danger-100" />}
              {updateState === 'downloaded' && <IconCheckCircleFilled className="text-green-100" />}
              <div className="text-sm text-white ml-1">{title}</div>
            </div>
            <div className="text-xs text-gray-300 mt-1">{message}</div>
            {updateState === 'confirm' && (
              <div className="flex mt-3">
                <Button
                  className="h-6"
                  type="gray"
                  ghost
                  onClick={() => {
                    window.Main.sendMessage(AutoUpdateEventEnum.AbortUpdate);
                  }}
                >
                  跳过
                </Button>
                <Button
                  className="h-6 ml-3"
                  type="primary"
                  onClick={() => {
                    window.Main.invoke(AutoUpdateEventEnum.DownloadUpdate);
                    setUpdateState('downloading');
                  }}
                >
                  更新
                </Button>
              </div>
            )}
            {updateState === 'error' && (
              <Button
                className="h-6 mt-3"
                type="primary"
                onClick={() => {
                  window.Main.invoke(AutoUpdateEventEnum.DownloadUpdate);
                  setUpdateState('downloading');
                }}
              >
                重试
              </Button>
            )}
          </div>
          <div className="mt-3.5 ml-4" />
        </div>
      )}
      <div className="flex-1 flex justify-end items-end">
        {['downloading', 'error', 'downloaded'].includes(updateState) && (
          <div className="flex items-center mb-3 mr-3">
            <div className="mr-1 text-xs text-gray-300">{progressText}，进度</div>
            <div className="text-base text-gray-200">{downloadProgress.toFixed(0)}%</div>
          </div>
        )}
      </div>
      <Progress
        hidden={updateState === 'confirm'}
        isError={updateState === 'error'}
        progress={downloadProgress}
      />
    </div>
  );
};

export default UpdateDownload;
