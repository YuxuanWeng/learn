import { useState } from 'react';
import { Spin } from 'antd';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { ModalUtils } from '@fepkg/components/Modal';
import { SystemEventEnum } from 'app/types/IPCEvents';

const FactoryReset = () => {
  const [showLoading, setShowLoading] = useState(false);

  const showFactoryResetConfirm = () => {
    ModalUtils.warning({
      title: '确认恢复出厂设置？',
      icon: null,
      // type: 'warn',
      content: <div className="text-sm text-gray-200">恢复出厂设置将会重置当前所有设置并清除系统缓存，请谨慎操作</div>,
      onOk: async () => {
        setShowLoading(true);
        const { invoke } = window.Main;
        await invoke(SystemEventEnum.FactoryReset);
        setShowLoading(false);
      },
      onCancel() {
        setShowLoading(false);
      }
    });
  };

  const showLocalDBResetConfirm = () => {
    ModalUtils.warning({
      title: '确认数据全量同步？',
      icon: null,
      // type: 'warn',
      content: <div className="text-sm text-gray-200">数据全量同步需重新登录，是否继续？</div>,
      onOk: async () => {
        setShowLoading(true);
        const { invoke } = window.Main;
        await invoke(SystemEventEnum.LocalDBReset);
        setShowLoading(false);
      },
      onCancel() {
        setShowLoading(false);
      }
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between my-6 text-sm">
        <div className="flex items-center gap-x-2">
          <Caption type="secondary">
            <span className="select-none text-sm font-bold">数据及设置恢复</span>
          </Caption>
        </div>
      </div>
      <Button
        className="ml-6 h-7"
        tabIndex={-1}
        type="primary"
        ghost
        onClick={showFactoryResetConfirm}
      >
        恢复出厂设置
      </Button>
      <Button
        className="ml-2.5 h-7"
        tabIndex={-1}
        type="primary"
        ghost
        onClick={showLocalDBResetConfirm}
      >
        数据全量同步
      </Button>
      {showLoading && (
        <Spin
          tip="正在重置应用，请耐心等待.."
          size="large"
          className="!fixed !inset-0 !z-[9999] !h-screen !w-screen !max-h-none bg-gray-300 bg-opacity-30 text-md"
        >
          <div className="content text-md" />
        </Spin>
      )}
    </div>
  );
};

export default FactoryReset;
