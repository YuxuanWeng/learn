import { Button } from '@fepkg/components/Button';
import { Combination } from '@fepkg/components/Combination';
import { Select } from '@fepkg/components/Select';
import { IconEdit } from '@fepkg/icon-park-react';
import { useSetAtom } from 'jotai';
import { settingMdlOpenAtom } from '@/pages/Quote/Collaborative/atoms/modal';
import { useGroupSetting } from '../../../SettingModal/providers';

export const GroupSelector = () => {
  const settingMdlOpen = useSetAtom(settingMdlOpenAtom);

  const { groups, panelBrokerGroupId, handleGroupSelected } = useGroupSetting();

  return (
    <Combination
      suffixButton
      prefixNode={
        <Select
          label="协同分组"
          labelWidth={72}
          className="w-[188px]"
          clearIcon={null}
          value={panelBrokerGroupId}
          onChange={handleGroupSelected}
          tabIndex={-1}
          options={groups.map(i => ({ value: i.id, label: i.name }))}
        />
      }
      suffixNode={
        <Button.Icon
          icon={<IconEdit />}
          tooltip={{ content: '协同分组配置' }}
          onClick={() => settingMdlOpen(true)}
        />
      }
    />
  );
};
