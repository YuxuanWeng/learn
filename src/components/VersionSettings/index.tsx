import { useMemo } from 'react';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Logo } from '@fepkg/components/Logo';
import { IconAttentionFilled, IconCheckCircleFilled } from '@fepkg/icon-park-react';
import { AutoUpdateEventEnum } from 'app/types/IPCEvents';
import { CheckVersionResult } from 'app/utils/check-version';
import { useAtomValue } from 'jotai';
import { isXintangUat } from '@/common/utils/login';
import { versionInfoAtom } from '@/components/VersionSettings/atoms';
import { checkVersion } from '@/components/VersionSettings/utils';

const needUpdateList = new Set([
  CheckVersionResult.CanUpdate,
  CheckVersionResult.Rollback,
  CheckVersionResult.ForceUpdate
]);

export const VersionSettings = () => {
  const versionInfo = useAtomValue(versionInfoAtom);

  const updateInfo = useMemo(() => {
    return versionInfo == null ? undefined : checkVersion(versionInfo);
  }, [versionInfo]);

  const isNeedUpdate = Boolean(updateInfo && needUpdateList.has(updateInfo));

  return (
    <div className="mt-6 select-none">
      <Caption>
        <div className="flex-shrink-0 text-sm font-bold">系统版本</div>
      </Caption>
      <div className="flex w-[280px] h-7 pl-3 mt-6 ml-6 border border-solid border-gray-600 rounded-lg items-center">
        <Logo
          uat={isXintangUat()}
          version={window.appConfig?.version}
        />
      </div>
      <div className="flex items-center mt-4 ml-6">
        {isNeedUpdate ? (
          <>
            <IconAttentionFilled className="w-4 h-4 mr-2 text-orange-100" />
            <div className="text-sm text-gray-300">非最新版本，请尽快更新使用!</div>
          </>
        ) : (
          <>
            <IconCheckCircleFilled className="w-4 h-4 mr-2 text-green-100" />
            <div className="text-sm text-gray-300">当前版本为最新版本</div>
          </>
        )}
      </div>
      {isNeedUpdate && (
        <Button
          className="mt-4 ml-6 h-7"
          type="primary"
          onClick={() => {
            window.Main.sendMessage(AutoUpdateEventEnum.OpenUpdateDownload, true);
          }}
        >
          立即更新
        </Button>
      )}
    </div>
  );
};

export default VersionSettings;
