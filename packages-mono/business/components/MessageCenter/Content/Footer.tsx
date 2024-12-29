import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { Switch } from '@fepkg/components/Switch';
import { IconNotificationOpen } from '@fepkg/icon-park-react';
import { useMessageCenterData } from '../providers/MessageCenterDataProvider';
import { useMessageOpt } from '../providers/MessageOptProvider';
import { useToastConfig } from '../providers/ToastConfigProvider';

export const Footer = () => {
  const { readAllMessage } = useMessageOpt();
  const { isToast, toggleToastConfig } = useToastConfig();
  const { unReadMessageCount } = useMessageCenterData();

  return (
    <div className="flex justify-between items-center h-12 px-3">
      <Button.Icon
        className="w-20 px-0"
        text
        icon={<IconNotificationOpen />}
        onClick={readAllMessage}
        disabled={!unReadMessageCount} // 无未读消息则禁用
      >
        一键已读
      </Button.Icon>

      <Dialog.FooterItem
        label="弹窗提醒"
        className="h-6 bg-gray-600"
      >
        <Switch
          checked={isToast}
          onChange={toggleToastConfig}
        />
      </Dialog.FooterItem>
    </div>
  );
};
