import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { Dropdown } from 'antd';
import { OmsBusinessBroadcastChannelType, postBroadcastMessage } from '@fepkg/business/hooks/useOmsBusinessBroadcast';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { IconDown, IconEdit, IconPower, IconPowerFilled, IconUp } from '@fepkg/icon-park-react';
import { toSSOChangePassword } from '@fepkg/services/api/auth/to-sso-login';
import { useToken } from '@/hooks/useToken';
import { useAuth } from '@/providers/AuthProvider';
import { clearAuthInfo } from '@/utils/auth';
import { logout } from '@/common/services/api/auth/logout';
import { RouteUrl } from '@/router/constants';

type UserInfoOptionsProps = {
  onClick: () => void;
};

export const UserInfoOptions = ({ onClick }: UserInfoOptionsProps) => {
  const navigate = useNavigate();
  const { token } = useToken();
  const { user } = useAuth();

  const handleLogout = () => {
    onClick();
    ModalUtils.error({
      title: '退出登录',
      icon: <IconPowerFilled className="text-danger-100" />,
      content: '退出登录后，将注销所有系统的登录状态',
      okText: '退出登录',
      onOk: () => {
        logout()
          .then(() => {
            // 广播登出信息
            postBroadcastMessage(OmsBusinessBroadcastChannelType.Logout, token);
            clearAuthInfo();
            navigate(RouteUrl.Login);
          })
          .catch(() => {
            message.error('退登失败');
          });
      }
    });
  };

  const handleChangePwd = () => {
    onClick();
    toSSOChangePassword(token, user?.account);
  };

  return (
    <div className="select-none flex flex-col gap-y-2 bg-gray-600 p-2 rounded-lg border border-solid border-gray-500">
      <Button
        className="gap-2"
        icon={<IconEdit />}
        type="gray"
        plain
        onClick={handleChangePwd}
      >
        修改密码
      </Button>

      <Button
        className="gap-2"
        icon={<IconPower />}
        type="gray"
        plain
        onClick={handleLogout}
      >
        退出登录
      </Button>
    </div>
  );
};

export const UserInfo = () => {
  const { user } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { name_cn: username = '' } = user ?? {};

  const { token } = useToken();

  useEffect(() => {
    if (user?.is_password_reset) {
      ModalUtils.warning({
        title: '修改密码',
        content: '您的密码存在安全风险，请修改密码后使用！',
        okText: '前往修改',
        onOk: () => {
          toSSOChangePassword(token, user?.account);
        }
      });
    }
  }, []);

  return (
    <Dropdown
      trigger={['hover']}
      overlay={<UserInfoOptions onClick={() => setPopoverOpen(false)} />}
      onVisibleChange={setPopoverOpen}
    >
      <div
        tabIndex={-1}
        className={cx(
          'px-3 select-none bg-gray-700 h-8 rounded-lg cursor-pointer flex justify-between items-center text-gray-000 font-normal text-sm',
          popoverOpen && '!bg-gray-500'
        )}
      >
        <span className="truncate">{username}</span>
        {popoverOpen ? <IconUp /> : <IconDown />}
      </div>
    </Dropdown>
  );
};
