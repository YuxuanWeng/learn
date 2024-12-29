import { Outlet, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { AccessCode } from '@fepkg/services/access-code';
import { Acceptor } from '@fepkg/services/types/bds-enum';
import { useAuth } from '@/providers/AuthProvider';
import { useHomeLayout } from '@/providers/LayoutProvider';
import { useBondConfig } from '@/providers/OutBoundConfigProvider';
import { Layout } from '@/layouts/Layout';
import { TabEnum, TabOption, TabProps } from './type';

/** 页签配置 */
const tabOptions: TabOption[] = [
  {
    label: '行情推送记录',
    key: TabEnum.Record,
    accessCode: AccessCode.CodeOdmMsgLog,
    acceptors: new Set([Acceptor.AcceptorWind, Acceptor.AcceptorSor])
  },
  {
    label: '行情推送配置',
    key: TabEnum.Conf,
    accessCode: AccessCode.CodeOdmConfig,
    acceptors: new Set([Acceptor.AcceptorWind])
  }
];

const Tab = ({ activeKey, item, onClick }: TabProps) => {
  const containerCls = cx(
    'w-30 h-8 rounded-lg text-sm font-medium flex items-center justify-center',
    'border border-solid border-transparent',
    'gap-0.5 cursor-pointer hover:text-gray-000 active:text-gray-000',
    activeKey === item.key ? 'tab-active text-gray-000 bg-gray-600' : 'text-gray-100 hover:border-gray-500'
  );
  return (
    <div
      className={containerCls}
      onClick={() => onClick(item)}
      tabIndex={-1}
    >
      {item.label}
    </div>
  );
};

const Inner = () => {
  const navTo = useNavigate();
  const { activeTab, current, setActiveTab } = useHomeLayout();
  const { handleAction } = useBondConfig();
  const { access } = useAuth();

  const authTabs = tabOptions.filter(i => access?.has(i.accessCode) && i.acceptors.has(current));

  return (
    <div className="h-[calc(100%_-_56px)] w-full bg-gray-700 rounded-lg">
      <div className="flex flex-row h-[60px] items-center gap-0.5 py-3 px-4">
        {authTabs.map(i => (
          <Tab
            key={i.label}
            activeKey={activeTab}
            item={i}
            onClick={item =>
              handleAction(() => {
                setActiveTab(item.key);
                navTo({ pathname: item.key, search: `inst=${current}` });
              })
            }
          />
        ))}
      </div>
      <div className="component-dashed-x h-px" />
      <Outlet />
    </div>
  );
};

export const Home = () => {
  return (
    <Layout>
      <Inner />
    </Layout>
  );
};
