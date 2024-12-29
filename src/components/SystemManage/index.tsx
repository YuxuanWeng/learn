import { useMemo } from 'react';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { message } from '@fepkg/components/Message';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconInfo } from '@fepkg/icon-park-react';
import { LogEventEnum } from 'app/types/IPCEvents';
import { debounce } from 'lodash-es';
import { miscStorage } from '@/localdb/miscStorage';

const sendLog = async () => {
  const { invoke } = window.Main;
  const status = await invoke(
    LogEventEnum.PutBusinessLog,
    miscStorage?.userInfo?.user_id ?? 'unknown',
    miscStorage?.apiEnv ?? 'dev'
  );
  if (status) {
    message.success('本地日志发送成功');
  } else {
    message.error('本地日志发送失败');
  }
};

const useLogUpload = () => {
  const handleClick = useMemo(() => debounce(sendLog, 500), []);
  return {
    sendLog,
    handleClick
  };
};

const SystemManage = () => {
  const { handleClick } = useLogUpload();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between my-6 text-sm">
        <div className="flex items-center gap-x-2">
          <Caption type="orange">
            <span className="select-none text-sm font-bold">本地日志</span>
          </Caption>

          <Tooltip
            content="如遇异常情况，可使用此按钮手动上传系统的本地日志，以便后台排查！"
            placement="right"
          >
            <IconInfo className="text-gray-100 hover:text-primary-100" />
          </Tooltip>
        </div>
      </div>
      <Button
        className="ml-6 h-7"
        tabIndex={-1}
        type="primary"
        ghost
        onClick={handleClick}
      >
        上传日志
      </Button>
    </div>
  );
};

export default SystemManage;
