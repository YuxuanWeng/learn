import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { IconAdd } from '@fepkg/icon-park-react';
import { usePanelGroupConfig } from './provider';

export const GroupHeader = () => {
  const { setAddGroupModalVisible, groups } = usePanelGroupConfig();
  const disabled = groups.length === 50;

  return (
    <div className="h-10 pr-3 min-h-[40px] flex items-center justify-between text-gray-000 text-sm">
      <Caption>分组列表</Caption>
      <Button
        icon={<IconAdd />}
        plain
        disabled={disabled}
        tooltip={{ content: disabled ? '分组数量已达上限' : '', visible: true }}
        className="w-6 h-6 px-0"
        onClick={() => {
          setAddGroupModalVisible(true);
        }}
      />
    </div>
  );
};
