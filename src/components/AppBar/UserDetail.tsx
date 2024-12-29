import { useEffect, useState } from 'react';
import { Avatar } from '@fepkg/components/Avatar';
import { Button } from '@fepkg/components/Button';
import { ModalUtils } from '@fepkg/components/Modal';
import { Popover } from '@fepkg/components/Popover';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconPower, IconPowerFilled } from '@fepkg/icon-park-react';
import { logout } from '@fepkg/services/api/auth/logout';
import { User } from '@fepkg/services/types/common';
import IPCEventEnum, { LoginEventEnum } from 'app/types/IPCEvents';
import { useAtomValue } from 'jotai';
import localforage from 'localforage';
import { GLOBAL_SCOPE, isUserQueryError } from '@/common/atoms';
import { useUserQuery } from '@/common/hooks/useUserQuery';
import { afterLogout } from '@/common/utils/login';
import { UNDO } from '@/common/utils/undo';
import { getAvatarName } from './utils';

type ContentProps = { user?: User; onLogout?: () => void };

const exitText = '退出登录';

export const logoutApp = async (fromCrash = false, skipModal = true) => {
  if (skipModal) await window.Main.invoke(LoginEventEnum.UserLogout);
  await logout();
  await localforage.removeItem(UNDO);

  await afterLogout(skipModal);
  if (fromCrash) {
    window.Main.invoke(IPCEventEnum.afterLogoutFromAppRestart);
  }
};

const Content = ({ user, onLogout }: ContentProps) => {
  const infoList = [
    { label: '登录邮箱', value: user?.account },
    { label: '经纪人号码', value: user?.job_num },
    { label: '手机', value: user?.phone },
    { label: '座机', value: user?.telephone },
    { label: 'QQ', value: user?.QQ }
  ];

  return (
    <div className="relative w-72">
      <div className="absolute -top-14 -right-12 w-30 h-30 rounded-full bg-primary-100 opacity-50 blur-[100px]" />
      <div className="flex gap-3">
        <Avatar size="large">{getAvatarName(user?.name_cn)}</Avatar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <Tooltip
            truncate
            content={user?.name_cn}
          >
            <span className="text-lg truncate text-gray-000">{user?.name_cn}</span>
          </Tooltip>
          <Tooltip
            truncate
            content={user?.department?.name}
          >
            <span className="text-sm font-normal text-gray-200 truncate">{user?.department?.name}</span>
          </Tooltip>
        </div>
      </div>

      <div className="h-px mt-4 mb-3 component-dashed-x" />

      <div className="flex flex-col gap-6 text-sm">
        {infoList.map(i => (
          <div
            className="h-7.5 flex items-center"
            key={i.label}
          >
            <span className="w-24 text-gray-200">{i.label}</span>
            <Tooltip
              content={i.value}
              truncate
            >
              <span className="flex-1 truncate text-gray-000">{i.value || '-'}</span>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="h-px my-4 component-dashed-x" />

      <Button
        block
        type="danger"
        text
        icon={<IconPower />}
        onClick={() => {
          onLogout?.();

          ModalUtils.error({
            title: exitText,
            okText: exitText,
            content: '退出登录后，将注销所有系统的登录状态',
            icon: <IconPowerFilled className="text-danger-100" />,
            showIcon: true,
            onOk: async () => {
              await logoutApp();
            }
          });
        }}
      >
        {exitText}
      </Button>
    </div>
  );
};

export const UserDetail = () => {
  const { data: user, refetch } = useUserQuery();
  const [infoOpen, setInfoOpen] = useState(false);
  const hasError = useAtomValue(isUserQueryError, GLOBAL_SCOPE);

  useEffect(() => {
    if (hasError) {
      setInfoOpen(false);
    }
  }, [hasError]);

  return (
    <Popover
      offset={8}
      open={infoOpen}
      onOpenChange={val => {
        if (val) refetch();
        setInfoOpen(val);
      }}
      arrow={false}
      floatingProps={{ className: '!px-4 !pt-6 !pb-3 !gap-3 overflow-hidden !bg-gray-700 !border-gray-600' }}
      content={
        <Content
          user={user}
          onLogout={() => setInfoOpen(false)}
        />
      }
    >
      <Avatar onDoubleClick={e => e.stopPropagation()}>{getAvatarName(user?.name_cn)}</Avatar>
    </Popover>
  );
};
