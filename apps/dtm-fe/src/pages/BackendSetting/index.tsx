import { HTMLAttributes, ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import cx from 'classnames';
import { AccessCode } from '@fepkg/services/access-code';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useProductParams } from '@/hooks/useProductParams';
import { useAuth } from '@/providers/AuthProvider';
import { RouteUrl } from '@/router/constants';
import RoleSetting from './RoleSetting';
import RuleSetting from './RuleSetting';

type TabProps = HTMLAttributes<HTMLDivElement> & {
  /** Id */
  tabId: string;
  /** 文案内容 */
  label: string;
  /** 是否选中 */
  active?: boolean;
};

enum BackendSettingTab {
  Role = 'role',
  Rule = 'rule'
}

const getTabs = (access?: Set<AccessCode>, productType = ProductType.BNC) => {
  const tabs: { id: string; label: string; children: ReactNode }[] = [];

  if (access?.has(AccessCode.CodeDTMSettingRole)) {
    tabs.push({
      id: `${RouteUrl.BackendSetting}/${productType}/role`,
      label: '角色配置',
      children: <RoleSetting />
    });
  }

  if (access?.has(AccessCode.CodeDTMSettingRule)) {
    tabs.push({
      id: `${RouteUrl.BackendSetting}/${productType}/rule`,
      label: '规则配置',
      children: <RuleSetting />
    });
  }

  return tabs;
};

const Tab = ({ tabId, className, active, label, onClick, ...props }: TabProps) => {
  const containerCls = cx(
    'w-30 h-8 rounded-lg text-sm font-medium flex items-center justify-center',
    'gap-0.5 cursor-pointer hover:bg-gray-600 active:text-gray-000',
    active ? 'text-gray-000 bg-gray-600' : 'text-gray-100',
    className
  );

  return (
    <div
      {...props}
      className={containerCls}
      onClick={onClick}
      tabIndex={-1}
    >
      {label}
    </div>
  );
};

const BackendSetting = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { access } = useAuth();
  const { productType = ProductType.BNC } = useProductParams();
  const params = useParams();
  const tabType = params.tabType ?? BackendSettingTab.Role;

  const formatPathname = params.tabType ? pathname : `${pathname}/${tabType}`;

  const tabs = getTabs(access, productType);

  return (
    <div className="py-4 h-full mr-4">
      <div className="h-full bg-gray-700 rounded-lg flex flex-col">
        <div className="w-full py-3 flex gap-0.5 px-4 border-0 border-b border-dashed border-gray-500">
          {tabs.map(item => {
            const { id, ...rest } = item;
            const active = formatPathname === id;

            return (
              <Tab
                {...rest}
                active={active}
                tabId={id}
                key={id}
                onClick={() => {
                  if (active) return;

                  navigate(id);
                }}
              />
            );
          })}
        </div>

        {tabType === BackendSettingTab.Role ? <RoleSetting /> : <RuleSetting />}
        {/* <Outlet /> */}
      </div>
    </div>
  );
};

export default BackendSetting;
