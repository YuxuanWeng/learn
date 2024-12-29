import FactoryReset from '@/components/FactoryReset';
import SystemManage from '@/components/SystemManage';
import { VersionSettings } from '@/components/VersionSettings';

const Setting = () => {
  return (
    <>
      <header className="flex flex-col pt-6 mt-6 border-0 border-t border-gray-600 border-solid select-none">
        <span className="flex-shrink-0 font-bold text-md">系统管理</span>
      </header>
      <div>
        <VersionSettings />
        <SystemManage />
        <FactoryReset />
      </div>
    </>
  );
};

export default Setting;
