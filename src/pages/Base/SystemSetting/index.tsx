import { FC, ReactNode, useEffect } from 'react';
import cx from 'classnames';
import { IconManage } from '@fepkg/icon-park-react';
import { ScrollMenu } from '@/components/ScrollMenu';
import { useUpdateVersionInfo, useVersionPolling } from '@/components/VersionSettings/atoms';
import { useSystemSettingDisplay } from '@/layouts/Home/atoms/page-initialed';
import { defaultOptions } from './constants';
import { SystemSettingPanelProvider, useSystemSettingPanel } from './providers/PanelProvider';

const baseLayoutCls = 'absolute top-10 left-20 w-[calc(100%-theme(space.20))] h-[calc(100%-theme(space.10))] z-50';

const ANCHOR_ID = 'system-con-wrap';

const AnchorContainer: FC<{ anchorName: string; children?: ReactNode }> = ({ anchorName, children }) => {
  return <div id={anchorName}>{children}</div>;
};

const Inner = () => {
  const {
    menuState: { options, activeKey }
  } = useSystemSettingPanel();

  const { isChecked, displayCls } = useSystemSettingDisplay();

  useVersionPolling();
  const { updateVersionInfo } = useUpdateVersionInfo();

  useEffect(() => {
    if (isChecked) updateVersionInfo();
  }, [isChecked]);

  return (
    <section className={cx('system-setting-panel rounded-lg flex select-none', baseLayoutCls, displayCls)}>
      <aside className="w-[176px] h-full flex bg-gray-700 border border-gray-600 border-solid rounded-tl-2xl">
        <ScrollMenu
          icon={<IconManage size={16} />}
          title="设置"
          anchorId={ANCHOR_ID}
          options={options}
          activeKey={activeKey}
        />
      </aside>

      <div className="flex flex-col flex-1 bg-gray-800 border-t border-0 border-gray-600 border-solid overflow-overlay">
        <div
          className="h-full min-w-[716px] px-6 overflow-overlay"
          id={ANCHOR_ID}
        >
          {options?.map(({ id: item_id, item }) => {
            return (
              <AnchorContainer
                key={item_id}
                anchorName={item_id}
              >
                {item}
              </AnchorContainer>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const SystemSetting = () => {
  return (
    <SystemSettingPanelProvider initialState={defaultOptions}>
      <Inner />
    </SystemSettingPanelProvider>
  );
};
