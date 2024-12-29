import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { IconAdd } from '@fepkg/icon-park-react';
import { useGroupConfig } from '../../provider';

export const Header = () => {
  const { setAddGroupModalVisible } = useGroupConfig();

  return (
    <div className="h-10 min-h-[40px] flex items-center justify-between text-gray-000 text-sm">
      <Caption>分组列表</Caption>
      <Button
        icon={<IconAdd />}
        plain
        className="w-6 h-6 px-0"
        onClick={() => {
          setAddGroupModalVisible(true);
        }}
      />
    </div>
  );
};
