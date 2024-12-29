import { Button } from '@fepkg/components/Button';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { IconAdd } from '@fepkg/icon-park-react';
import { useGroupConfig } from '../../provider';
import { Body } from './Body';
import { Header } from './Header';

export const GroupContainer = () => {
  const { setAddGroupModalVisible } = useGroupConfig();

  return (
    <SettingLayout.Aside
      className="h-full"
      label="分组列表"
      suffix={
        <Button
          icon={<IconAdd />}
          plain
          className="w-6 h-6 px-0"
          onClick={() => {
            setAddGroupModalVisible(true);
          }}
        />
      }
    >
      <Body />
    </SettingLayout.Aside>
  );

  return (
    <div className="w-40 border-solid border-0 border-r border-r-gray-600 px-3 flex flex-col">
      <Header />
      <div className="component-dashed-x-600" />
      <Body />
    </div>
  );
};
