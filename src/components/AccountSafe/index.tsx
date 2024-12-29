import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo } from '@fepkg/icon-park-react';
import { UtilEventEnum } from 'app/types/IPCEvents';
import CommonSwitch from '@/pages/Base/SystemSetting/components/CommonSwitch';
import EditPassword from './EditPassword';
import { useAutoLaunchSetting } from './useAutoLaunchSetting';

const AccountSafe = () => {
  const [showEdit, setShowEdit] = useState(false);
  const { autoLaunch, changeAutoLaunch } = useAutoLaunchSetting();

  return (
    <>
      <header className="flex items-baseline gap-2 py-6">
        <span className="flex-shrink-0 select-none text-md font-bold">账户与安全</span>
      </header>

      <CommonSwitch
        classNames="ml-6"
        label="开机时自动启动OMS"
        value={autoLaunch}
        onChange={value => {
          changeAutoLaunch(value);
          window.Main.sendMessage(UtilEventEnum.AutoLaunch, value);
        }}
      />

      <div className="mt-6 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Caption>
              <span className="select-none text-sm font-bold">修改密码</span>
            </Caption>
            <Tooltip
              placement="right"
              content="输入至少8位包含大写字母、小写字母、数字、特殊字符中的任意三类组合"
            >
              <IconInfo className="text-gray-100 hover:text-primary-100" />
            </Tooltip>
          </div>
        </div>

        {showEdit ? (
          <EditPassword
            onClose={() => {
              setShowEdit(false);
            }}
          />
        ) : (
          <div>
            <Button
              tabIndex={-1}
              type="primary"
              className="mt-6 ml-6 h-7"
              onClick={() => setShowEdit(true)}
            >
              修改密码
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountSafe;
