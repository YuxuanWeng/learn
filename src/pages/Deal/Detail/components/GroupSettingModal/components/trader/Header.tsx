import { ActionInput } from '@fepkg/business/components/ActionInput';
import { Button } from '@fepkg/components/Button';
import { SettingLayout } from '@fepkg/components/SettingLayout';
import { IconChange } from '@fepkg/icon-park-react';
import { SearchInstTrader } from '@/components/business/SearchInstTrader';
import { useProductParams } from '@/layouts/Home/hooks';
import { useGroupConfig } from '../../provider';

export const Header = () => {
  const {
    traders,
    selectedGroup,
    check,
    groupContainerRef,
    instTraderSearchModalVisible,
    addTraders,
    setInstTraderSearchModalVisible,
    updateGroupName
  } = useGroupConfig();

  const { productType } = useProductParams();

  if (!selectedGroup) return null;
  const handleValidate = async (targetValue: string) => {
    const res = check(targetValue);
    return res;
  };

  const handleRename = (targetValue: string) => {
    if (targetValue === selectedGroup.group_combination_name) return;
    updateGroupName(selectedGroup.group_combination_id, targetValue);
  };

  return (
    <>
      <SettingLayout.Header>
        <ActionInput
          key={selectedGroup.group_combination_id}
          defaultValue={selectedGroup.group_combination_name}
          showTrigger
          onValidate={handleValidate}
          onSubmit={handleRename}
          placeholder="分组名称修改中.."
        />

        <Button
          plain
          type="primary"
          icon={<IconChange />}
          className="h-6 w-6 !p-0"
          onClick={() => {
            setInstTraderSearchModalVisible(true);
          }}
        />
      </SettingLayout.Header>

      {instTraderSearchModalVisible && (
        <SearchInstTrader
          visible={instTraderSearchModalVisible}
          productType={productType}
          onCancel={() => {
            setInstTraderSearchModalVisible(false);
            groupContainerRef.current?.focus();
          }}
          defaultTraders={traders}
          onConfirm={data => {
            addTraders(data);
            groupContainerRef.current?.focus();
          }}
        />
      )}
    </>
  );
};
